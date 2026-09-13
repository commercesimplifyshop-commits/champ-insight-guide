import { useState, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface PremiumGateProps {
  sectionTitles: string[];
  children: ReactNode;
}

/**
 * Progressive-disclosure wrapper for the "deeper" part of the analysis.
 * No real paywall exists yet — unlocking is a plain client-side reveal — but
 * the interaction is already shaped so a future subscription check can swap
 * in for the unlock action without touching the surrounding layout.
 */
const PremiumGate = ({ sectionTitles, children }: PremiumGateProps) => {
  const { t } = useI18n();
  const [unlocked, setUnlocked] = useState(false);

  if (unlocked) return <>{children}</>;

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
          onClick={() => setUnlocked(true)}
          className="mt-1 px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand text-primary-foreground hover:brightness-110 shadow-brand transition-all"
        >
          {t("premium.unlock")}
        </button>
      </div>
    </div>
  );
};

export default PremiumGate;
