import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import Paywall from "@/components/shared/Paywall";

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
  const [paywallOpen, setPaywallOpen] = useState(false);

  return (
    <div className="relative rounded-2xl border border-dashed border-brand/40 glass overflow-hidden">
      <div className="p-4 space-y-1.5 blur-[3px] opacity-50 pointer-events-none select-none" aria-hidden="true">
        {sectionTitles.map((title) => (
          <div key={title} className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/[.05] text-sm text-ink-70">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            {title}
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-transparent via-background/70 to-background/95 px-6 text-center">
        <Lock className="w-5 h-5 text-brand" />
        <p className="text-xs text-ink-50 max-w-[260px] leading-relaxed">{t("premium.description")}</p>
        <button
          onClick={() => setPaywallOpen(true)}
          className="mt-1 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-brand transition-all flex items-center gap-2"
          style={{ background: "linear-gradient(180deg,#FFC94A,#F5B21A)", color: "var(--on-accent)" }}
        >
          {t("premium.unlock")}
        </button>
        <Link to="/pricing#demo" className="text-[10px] text-ink-40 hover:text-ink-70 underline transition-colors">
          {t("premium.seeExample")}
        </Link>
      </div>

      <Paywall
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        title={t("premium.description")}
        description={t("paywall.description")}
      />
    </div>
  );
};

export default PremiumGate;
