interface AdBannerProps {
  slot: "left" | "right" | "bottom";
  className?: string;
}

const dimensions: Record<AdBannerProps["slot"], { w: string; h: string; label: string }> = {
  left: { w: "w-full", h: "min-h-[600px]", label: "160×600" },
  right: { w: "w-full", h: "min-h-[250px]", label: "300×250" },
  bottom: { w: "w-full", h: "min-h-[90px]", label: "728×90" },
};

const AdBanner = ({ slot, className = "" }: AdBannerProps) => {
  const dim = dimensions[slot];

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
};

export default AdBanner;
