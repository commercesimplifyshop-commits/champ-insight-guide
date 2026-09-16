import { Flame } from "lucide-react";
import { usePromoCountdown } from "@/hooks/use-promo-countdown";

interface PromoCountdownProps {
  /** Extra classes for layout tweaks from the parent (e.g. margin). */
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Inline countdown text — used inside cards/banners. See PromoBar for the site-wide attention bar. */
const PromoCountdown = ({ className = "" }: PromoCountdownProps) => {
  const remaining = usePromoCountdown();

  if (!remaining) return null;

  return (
    <div className={`flex items-center gap-1.5 text-[11px] font-bold ${className}`}>
      <Flame className="w-3.5 h-3.5 text-threat shrink-0" />
      <span className="text-threat uppercase tracking-wider">Oferta termina em</span>
      <span className="font-mono text-foreground tabular-nums">
        {remaining.days > 0 && `${remaining.days}d `}
        {pad(remaining.hours)}:{pad(remaining.minutes)}:{pad(remaining.seconds)}
      </span>
    </div>
  );
};

export default PromoCountdown;
