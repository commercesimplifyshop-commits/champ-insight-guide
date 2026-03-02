import { MatchupOverview as OverviewType, AdvantageLevel } from "@/types/matchup";
import { Zap, Target, AlertTriangle, Crosshair } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface QuickOverviewProps {
  overview: OverviewType;
}

const QuickOverview = ({ overview }: QuickOverviewProps) => {
  const { t } = useI18n();

  const advantageConfig: Record<AdvantageLevel, { labelKey: string; borderClass: string; statusBg: string; statusText: string; textClass: string }> = {
    strong: { labelKey: "advantage.strong", borderClass: "border-advantage", statusBg: "bg-advantage", statusText: "text-foreground", textClass: "text-advantage" },
    slight: { labelKey: "advantage.slight", borderClass: "border-advantage", statusBg: "bg-advantage", statusText: "text-foreground", textClass: "text-advantage" },
    even: { labelKey: "advantage.even", borderClass: "border-caution", statusBg: "bg-caution", statusText: "text-foreground", textClass: "text-caution" },
    slight_disadvantage: { labelKey: "advantage.slight_disadvantage", borderClass: "border-caution", statusBg: "bg-caution", statusText: "text-foreground", textClass: "text-caution" },
    hard: { labelKey: "advantage.hard", borderClass: "border-threat", statusBg: "bg-threat-bar", statusText: "text-foreground", textClass: "text-threat" },
  };

  const adv = advantageConfig[overview.earlyAdvantage.level];

  return (
    <div className={`rounded-lg border-2 ${adv.borderClass} overflow-hidden`}>
      <div className={`${adv.statusBg} px-4 py-2 flex items-center gap-2`}>
        <Zap className={`w-4 h-4 ${adv.statusText}`} />
        <span className={`text-sm font-bold tracking-wider uppercase ${adv.statusText}`}>
          {t(adv.labelKey as any)}
        </span>
      </div>

      <div className="surface-1 p-4 space-y-4">
        <p className="text-sm text-foreground/80 leading-relaxed">
          {overview.earlyAdvantage.summary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="surface-2 rounded-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-brand shrink-0" />
              <span className="text-xs font-bold text-brand uppercase tracking-wider">{t("overview.gamePlan")}</span>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">{overview.primaryPlan}</p>
          </div>

          <div className="surface-2 rounded-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-threat shrink-0" />
              <span className="text-xs font-bold text-threat uppercase tracking-wider">{t("overview.biggestThreat")}</span>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">{overview.biggestThreat}</p>
          </div>

          <div className="surface-2 rounded-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <Crosshair className="w-4 h-4 text-info-status shrink-0" />
              <span className="text-xs font-bold text-info-status uppercase tracking-wider">{t("overview.firstFocus")}</span>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">{overview.firstDecisionFocus}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickOverview;
