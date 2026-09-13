// Google AdSense integration: fixed display ad units (left/right/bottom
// banners) plus a "reward" placement (Ad Placement API) that gates
// generating a new AI matchup analysis for non-premium users behind
// watching a short ad — the same mechanism games use for "watch an ad for
// an extra life", applied here to offset the OpenAI cost of free usage.
//
// Client ID is public by design (it's meant to be embedded in page source
// on every AdSense publisher's site) but is still env-var driven, matching
// the reCAPTCHA pattern: unset locally/on preview deployments, so ads only
// ever load on the real production domain — loading AdSense on a
// non-live preview URL risks being flagged as invalid traffic.
//
// Create ad units at https://www.google.com/adsense (Ads > By ad unit).

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
    adBreak?: (options: Record<string, unknown>) => void;
    adConfig?: (options: Record<string, unknown>) => void;
  }
}

export const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined;

export const ADSENSE_SLOTS = {
  left: import.meta.env.VITE_ADSENSE_SLOT_LEFT as string | undefined,
  right: import.meta.env.VITE_ADSENSE_SLOT_RIGHT as string | undefined,
  bottom: import.meta.env.VITE_ADSENSE_SLOT_BOTTOM as string | undefined,
} as const;

export const isAdsenseConfigured = (): boolean => Boolean(ADSENSE_CLIENT_ID);

let scriptPromise: Promise<void> | null = null;

/**
 * Loads the adsbygoogle.js script once (idempotent) and wires up the
 * adBreak/adConfig helpers used by the Ad Placement API for the reward ad.
 * Uses Google's official test mode outside production builds so local/
 * preview testing never sends real ad requests (`data-adbreak-test="on"`).
 */
const loadScript = (): Promise<void> => {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !ADSENSE_CLIENT_ID) {
      resolve();
      return;
    }

    window.adsbygoogle = window.adsbygoogle || [];
    window.adBreak = window.adConfig = (options) => {
      window.adsbygoogle.push(options);
    };

    const existing = document.querySelector<HTMLScriptElement>('script[data-adsense-client]');
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.adsenseClient = ADSENSE_CLIENT_ID;
    if (import.meta.env.DEV) {
      script.dataset.adbreakTest = "on";
    }
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Falha ao carregar o script do AdSense"));
    document.head.appendChild(script);
  });

  return scriptPromise;
};

/** Requests a fixed display ad unit (left/right/bottom banners). No-ops if unconfigured. */
export const loadDisplayAd = async (): Promise<void> => {
  if (!ADSENSE_CLIENT_ID) return;
  try {
    await loadScript();
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  } catch (err) {
    console.error("[adsense] Falha ao carregar bloco de anúncio", err);
  }
};

export type RewardOutcome = "viewed" | "skipped";

/**
 * Gates an action behind a rewarded ad view (Ad Placement API). Resolves
 * with "viewed" only when the user actually watched the ad to completion —
 * every other outcome (dismissed, no ad available, error, or AdSense not
 * configured) resolves "skipped" so callers can fall back to their own
 * policy (e.g. block the action, or let it through if ads aren't set up).
 */
export const requestRewardedAd = async (name: string): Promise<RewardOutcome> => {
  if (!ADSENSE_CLIENT_ID) return "skipped";

  try {
    await loadScript();
  } catch (err) {
    console.error("[adsense] Falha ao carregar anúncio recompensado", err);
    return "skipped";
  }

  return new Promise<RewardOutcome>((resolve) => {
    let settled = false;
    const settle = (outcome: RewardOutcome) => {
      if (settled) return;
      settled = true;
      resolve(outcome);
    };

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
  });
};
