import { Link } from "react-router-dom";
import { Flame } from "lucide-react";
import { usePromoCountdown } from "@/hooks/use-promo-countdown";
import { useAuth } from "@/lib/auth";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Attention-grabbing bar above the header, on every page — but only for
 * visitors who aren't subscribers yet (no point pressuring an existing
 * Premium user) and only while a real promo deadline is active (see
 * usePromoCountdown — it's honest: no deadline, no bar, no fake reset).
 */
const PromoBar = () => {
  const { isPremium, loading } = useAuth();
  const remaining = usePromoCountdown();

  if (loading || isPremium || !remaining) return null;

  return (
    <Link
      to="/pricing"
      className="block bg-brand text-primary-foreground hover:brightness-105 transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-center flex-wrap">
        <Flame className="w-4 h-4 shrink-0 animate-pulse" />
        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide">
          Oferta de R$19,90/mês termina em{" "}
          <span className="font-mono tabular-nums">
            {remaining.days > 0 && `${remaining.days}d `}
            {pad(remaining.hours)}:{pad(remaining.minutes)}:{pad(remaining.seconds)}
          </span>
        </span>
        <span className="text-[10px] sm:text-xs font-bold underline underline-offset-2 shrink-0">
          Assinar agora
        </span>
      </div>
    </Link>
  );
};

export default PromoBar;
