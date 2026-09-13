import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import AuthDialog from "@/components/auth/AuthDialog";
import { redirectToStripeUrl } from "@/lib/stripeRedirect";

interface PremiumGateProps {
  sectionTitles: string[];
}

/**
 * Rendered only when the backend actually omitted the deeper sections
 * (plan.meta.locked === true) — there's no local data to reveal here, so
 * unlocking means logging in and/or subscribing, not a client-side toggle.
 */
const PremiumGate = ({ sectionTitles }: PremiumGateProps) => {
  const { t } = useI18n();
  const { user, getAccessToken } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    const token = getAccessToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      redirectToStripeUrl(data.url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-lg border border-dashed border-brand/40 surface-1 overflow-hidden">
      <div className="p-4 space-y-1.5 blur-[3px] opacity-50 pointer-events-none select-none" aria-hidden="true">
        {sectionTitles.map((title) => (
          <div key={title} className="flex items-center gap-2 px-3 py-2 rounded-md surface-2 text-sm text-foreground/70">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            {title}
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-transparent via-background/70 to-background/95 px-6 text-center">
        <Lock className="w-5 h-5 text-brand" />
        <p className="text-xs text-muted-foreground max-w-[260px] leading-relaxed">
          {t("premium.description")}
        </p>
        <button
          onClick={handleClick}
          disabled={loading}
          className="mt-1 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand text-primary-foreground hover:brightness-110 shadow-brand transition-all disabled:opacity-60 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {user ? t("premium.subscribe") : t("premium.loginToUnlock")}
        </button>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
};

export default PremiumGate;
