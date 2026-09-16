import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Loader2, Crown } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import Paywall from "@/components/shared/Paywall";

interface FeatureGateProps {
  title: string;
  description: string;
  children: ReactNode;
}

/**
 * Gates an entire feature (not just part of a result) behind login +
 * an active subscription — used for Premium-only tools like Counter Finder
 * and 5v5 Team Analysis, where there's no free preview to show.
 */
const FeatureGate = ({ title, description, children }: FeatureGateProps) => {
  const { isPremium, loading } = useAuth();
  const { t } = useI18n();
  const [paywallOpen, setPaywallOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="glass border border-dashed border-brand/40 rounded-2xl p-8 flex flex-col items-center text-center gap-3">
      <div className="w-10 h-10 rounded-full bg-brand/15 flex items-center justify-center">
        <Crown className="w-5 h-5 text-brand" />
      </div>
      <h2 className="text-sm font-bold uppercase tracking-wider">{title}</h2>
      <p className="text-xs text-ink-50 max-w-xs leading-relaxed">{description}</p>
      <button
        onClick={() => setPaywallOpen(true)}
        className="mt-1 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-brand transition-all flex items-center gap-2"
        style={{ background: "linear-gradient(180deg,#FFC94A,#F5B21A)", color: "var(--on-accent)" }}
      >
        {t("premium.unlock")}
      </button>
      <Link to="/pricing#demo" className="text-[10px] text-ink-40 hover:text-ink-70 underline transition-colors">
        {t("premium.seeExample")}
      </Link>

      <Paywall open={paywallOpen} onClose={() => setPaywallOpen(false)} title={title} description={description} />
    </div>
  );
};

export default FeatureGate;
