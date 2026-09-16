import { useState } from "react";
import { Crown, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import AuthDialog from "@/components/auth/AuthDialog";
import { redirectToStripeUrl } from "@/lib/stripeRedirect";
import type { AppMode } from "@/pages/Index";

const COPY: Record<AppMode, string> = {
  matchup: "Desbloqueie a análise completa do 1v1 (mid/late game, itemização e erros a evitar) com um modelo de IA mais avançado",
  counters: "Desbloqueie o Counter Finder ilimitado com um modelo de IA mais avançado",
  team: "Desbloqueie a Análise 5v5 completa — estratégia de time gerada por um modelo de IA mais avançado",
};

interface PricingBannerProps {
  mode: AppMode;
}

/**
 * Promotional banner shown to non-premium visitors. Hides itself once the
 * user is already subscribed — no point advertising to existing customers.
 * Copy adapts to whichever feature the visitor currently has open.
 */
const PricingBanner = ({ mode }: PricingBannerProps) => {
  const { user, isPremium, loading, getAccessToken } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (loading || isPremium) return null;

  const handleClick = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    const token = getAccessToken();
    if (!token) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      redirectToStripeUrl(data.url);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-brand/40 bg-gradient-to-r from-brand/15 via-brand/5 to-transparent px-3 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-3">
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
        <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand" />
      </div>
      <p className="flex-1 min-w-0 truncate text-[11px] sm:text-xs text-foreground/90">
        <span className="font-bold text-brand">MATCHUP.GG Premium</span> — {COPY[mode]} por{" "}
        <span className="font-bold text-foreground">R$19,90/mês</span>
      </p>
      <button
        onClick={handleClick}
        disabled={checkoutLoading}
        className="shrink-0 px-3 sm:px-4 py-1.5 rounded-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-brand text-primary-foreground hover:brightness-110 shadow-brand transition-all disabled:opacity-60 flex items-center gap-1.5"
      >
        {checkoutLoading && <Loader2 className="w-3 h-3 animate-spin" />}
        {user ? "Assinar" : "Entrar"}
      </button>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
};

export default PricingBanner;
