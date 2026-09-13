import { useState } from "react";
import { Crown, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import AuthDialog from "@/components/auth/AuthDialog";
import type { AppMode } from "@/pages/Index";

const COPY: Record<AppMode, string> = {
  matchup: "Desbloqueie a análise completa do 1v1 — mid/late game, itemização e erros a evitar",
  counters: "Desbloqueie o Counter Finder ilimitado",
  team: "Desbloqueie a Análise 5v5 completa — estratégia de time gerada por IA",
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
      if (data.url) window.location.href = data.url;
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-brand/40 bg-gradient-to-r from-brand/15 via-brand/5 to-transparent px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
          <Crown className="w-4 h-4 text-brand" />
        </div>
        <p className="text-xs text-foreground/90 leading-snug">
          <span className="font-bold text-brand">MATCHUP.GG Premium</span> — {COPY[mode]} por{" "}
          <span className="font-bold text-foreground">R$19,90/mês</span>
        </p>
      </div>
      <button
        onClick={handleClick}
        disabled={checkoutLoading}
        className="shrink-0 px-4 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-brand text-primary-foreground hover:brightness-110 shadow-brand transition-all disabled:opacity-60 flex items-center gap-1.5"
      >
        {checkoutLoading && <Loader2 className="w-3 h-3 animate-spin" />}
        {user ? "Assinar Agora" : "Entrar para Assinar"}
      </button>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
};

export default PricingBanner;
