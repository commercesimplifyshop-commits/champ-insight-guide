// Google AdSense integration: fixed display ad units (left/right/bottom
// banners) plus a "reward" placement (Ad Placement API) that gates
// generating a new AI matchup analysis for non-premium users behind
// watching a short ad — the same mechanism games use for "watch an ad for
// an extra life", applied here to offset the OpenAI cost of free usage.
//
// The base <script> tag lives statically in index.html (NOT injected here
// via JS) — AdSense's site-verification crawler and Auto ads both expect
// to find it in the page source. The client ID is public by design.
//
// Create ad units at https://www.google.com/adsense (Ads > By ad unit).

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
    adBreak?: (options: Record<string, unknown>) => void;
    adConfig?: (options: Record<string, unknown>) => void;
  }
}

export const ADSENSE_CLIENT_ID = "ca-pub-1359453830211693";

export const ADSENSE_SLOTS = {
  left: import.meta.env.VITE_ADSENSE_SLOT_LEFT as string | undefined,
  right: import.meta.env.VITE_ADSENSE_SLOT_RIGHT as string | undefined,
  bottom: import.meta.env.VITE_ADSENSE_SLOT_BOTTOM as string | undefined,
} as const;

/**
 * Real ad requests (display slots and the reward placement) only ever fire
 * on the live production domain — never on Vercel previews or localhost,
 * which Google's invalid-traffic policy treats as testing environments.
 */
const isProductionDomain = (): boolean =>
  typeof window !== "undefined" && /(^|\.)matchupgg\.com$/.test(window.location.hostname);

export const isAdsenseConfigured = (): boolean => isProductionDomain();

let initialized = false;

/** Ensures the adsbygoogle queue + adBreak/adConfig wrappers exist. Safe to call before the script tag finishes loading — it's a queue. */
const ensureQueue = () => {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  window.adsbygoogle = window.adsbygoogle || [];
  window.adBreak = window.adConfig = (options) => {
    window.adsbygoogle.push(options);
  };
};

/** Requests a fixed display ad unit (left/right/bottom banners). No-ops off the production domain. */
export const loadDisplayAd = (): void => {
  if (!isProductionDomain()) return;
  ensureQueue();
  window.adsbygoogle.push({});
};

export type RewardOutcome = "viewed" | "skipped";

/** Hard ceiling so a rewarded-ad request can never hang the UI forever — if
 * the account/feature isn't approved yet (or Google's script just never
 * calls back for any reason), none of adBreak's callbacks fire at all, and
 * without this the caller's await would wait indefinitely. */
const REWARD_AD_TIMEOUT_MS = 8000;

/**
 * Gates an action behind a rewarded ad view (Ad Placement API). Resolves
 * with "viewed" only when the user actually watched the ad to completion —
 * every other outcome (dismissed, no ad available, error, timeout, or off
 * the production domain) resolves "skipped" so callers can fall back to
 * their own policy (e.g. block the action, or let it through).
 */
export const requestRewardedAd = async (name: string): Promise<RewardOutcome> => {
  if (!isProductionDomain()) return "skipped";
  ensureQueue();

  return new Promise<RewardOutcome>((resolve) => {
    let settled = false;
    const settle = (outcome: RewardOutcome) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(outcome);
    };

    const timer = setTimeout(() => settle("skipped"), REWARD_AD_TIMEOUT_MS);

    try {
      window.adBreak?.({
        type: "reward",
        name,
        beforeReward: (showAdFn: () => void) => showAdFn(),
        adViewed: () => settle("viewed"),
        adDismissed: () => settle("skipped"),
        // Fallback for any other terminal status (no ad available, error,
        // timeout, etc.) — adBreakDone always fires exactly once.
        adBreakDone: (placementInfo?: { breakStatus?: string }) => {
          if (placementInfo?.breakStatus !== "viewed") settle("skipped");
        },
      });
    } catch (err) {
      console.error("[adsense] adBreak threw", err);
      settle("skipped");
    }
  });
};
