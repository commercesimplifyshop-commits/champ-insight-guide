import { Link } from "react-router-dom";
import { Crown } from "lucide-react";
import { useAuth } from "@/lib/auth";

/**
 * Promotional banner shown to non-premium visitors. Hides itself once the
 * user is already subscribed — no point advertising to existing customers.
 */
const PricingBanner = () => {
  const { isPremium, loading } = useAuth();

  if (loading || isPremium) return null;

  return (
    <div className="rounded-lg border border-brand/40 bg-gradient-to-r from-brand/15 via-brand/5 to-transparent px-3 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-3">
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
        <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand" />
      </div>
      <p className="flex-1 min-w-0 truncate text-[11px] sm:text-xs text-foreground/90">
        <span className="font-bold text-brand">MATCHUP.GG Premium</span> — Conheça nossos planos
      </p>
      <Link
        to="/pricing"
        className="shrink-0 px-3 sm:px-4 py-1.5 rounded-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-brand text-primary-foreground hover:brightness-110 shadow-brand transition-all"
      >
        Assinar
      </Link>
    </div>
  );
};

export default PricingBanner;
