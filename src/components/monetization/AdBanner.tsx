import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { ADSENSE_CLIENT_ID, ADSENSE_SLOTS, isAdsenseConfigured, loadDisplayAd } from "@/lib/adsense";

interface AdBannerProps {
  slot: "left" | "right" | "bottom";
  className?: string;
}

const dimensions: Record<AdBannerProps["slot"], { w: string; h: string; label: string; format: string }> = {
  left: { w: "w-full", h: "min-h-[600px]", label: "160×600", format: "vertical" },
  right: { w: "w-full", h: "min-h-[250px]", label: "300×250", format: "rectangle" },
  bottom: { w: "w-full", h: "min-h-[90px]", label: "728×90", format: "horizontal" },
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
      <div
        className={`surface-1 border border-dashed border-border rounded-lg flex items-center justify-center ${dim.w} ${dim.h} ${className}`}
        data-ad-slot={slot}
      >
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
            Ad Space
          </span>
          <span className="text-[9px] font-mono text-muted-foreground/60">{dim.label}</span>
        </div>
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle block ${dim.w} ${dim.h} ${className}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slotId}
      data-ad-format={dim.format}
      data-full-width-responsive="true"
    />
  );
};

export default AdBanner;
