import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { ADSENSE_CLIENT_ID, ADSENSE_SLOTS, isAdsenseConfigured, loadDisplayAd } from "@/lib/adsense";

interface AdBannerProps {
  slot: "left" | "right" | "bottom";
  className?: string;
}

// Fixed-size ad units, matching exactly what was created in the AdSense
// dashboard (Ads > By ad unit > Display ads > Fixed size) — not responsive.
const dimensions: Record<AdBannerProps["slot"], { width: number; height: number; label: string }> = {
  left: { width: 160, height: 600, label: "160×600" },
  right: { width: 300, height: 250, label: "300×250" },
  bottom: { width: 728, height: 90, label: "728×90" },
};

const AdBanner = ({ slot, className = "" }: AdBannerProps) => {
  const { isPremium } = useAuth();
  const dim = dimensions[slot];
  const slotId = ADSENSE_SLOTS[slot];
  const configured = isAdsenseConfigured() && Boolean(slotId);
  const requested = useRef(false);

  useEffect(() => {
    if (isPremium || !configured || requested.current) return;
    requested.current = true;
    loadDisplayAd();
  }, [isPremium, configured]);

  // Premium subscribers get an ad-free experience — a perk of subscribing,
  // not just a paywall side-effect.
  if (isPremium) return null;

  // Not configured yet (missing this slot's ad unit, or not on the real
  // production domain) — keep the placeholder so layout/dev/preview
  // environments still look right.
  if (!configured) {
    return (
      <div className={`overflow-x-auto ${className}`}>
        <div
          className="surface-1 border border-dashed border-border rounded-lg flex items-center justify-center mx-auto"
          style={{ width: dim.width, height: dim.height }}
          data-ad-slot={slot}
        >
          <div className="text-center space-y-1">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
              Ad Space
            </span>
            <span className="text-[9px] font-mono text-muted-foreground/60">{dim.label}</span>
          </div>
        </div>
      </div>
    );
  }

  // Fixed-size units don't reflow. Some placements (the 300px unit in a
  // wider sidebar) have room to spare — mx-auto centers it there. Others
  // (the 728px bottom unit) can end up wider than their container once the
  // sidebars are visible; overflow-x-auto contains any overflow to just
  // this box instead of breaking the page layout.
  return (
    <div className={`overflow-x-auto ${className}`}>
      <ins
        className="adsbygoogle block mx-auto"
        style={{ display: "inline-block", width: dim.width, height: dim.height }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
      />
    </div>
  );
};

export default AdBanner;
