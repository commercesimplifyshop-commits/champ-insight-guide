import { MatchupOverview as OverviewType, AdvantageLevel } from "@/types/matchup";
import { Zap, Target, AlertTriangle, Crosshair } from "lucide-react";

const advantageConfig: Record<AdvantageLevel, { label: string; borderClass: string; statusBg: string; statusText: string; textClass: string }> = {
  strong: { label: "STRONG ADVANTAGE", borderClass: "border-advantage", statusBg: "bg-advantage", statusText: "text-foreground", textClass: "text-advantage" },
  slight: { label: "SLIGHT ADVANTAGE", borderClass: "border-advantage", statusBg: "bg-advantage", statusText: "text-foreground", textClass: "text-advantage" },
  even: { label: "EVEN MATCHUP", borderClass: "border-caution", statusBg: "bg-caution", statusText: "text-foreground", textClass: "text-caution" },
  slight_disadvantage: { label: "SLIGHT DISADVANTAGE", borderClass: "border-caution", statusBg: "bg-caution", statusText: "text-foreground", textClass: "text-caution" },
  hard: { label: "HARD DISADVANTAGE", borderClass: "border-threat", statusBg: "bg-threat-bar", statusText: "text-foreground", textClass: "text-threat" },
};

interface QuickOverviewProps {
  overview: OverviewType;
}

/**
 * The DOMINANT first-visible section.
 * Must communicate the matchup state in 10-15 seconds.
 */
const QuickOverview = ({ overview }: QuickOverviewProps) => {
  const adv = advantageConfig[overview.earlyAdvantage.level];

  return (
    <div className={`rounded-lg border-2 ${adv.borderClass} overflow-hidden`}>
      {/* Status bar */}
      <div className={`${adv.statusBg} px-4 py-2 flex items-center gap-2`}>
        <Zap className={`w-4 h-4 ${adv.statusText}`} />
        <span className={`text-sm font-bold tracking-wider uppercase ${adv.statusText}`}>
          {adv.label}
        </span>
      </div>

      <div className="surface-1 p-4 space-y-4">
        {/* Advantage summary */}
        <p className="text-sm text-foreground/80 leading-relaxed">
          {overview.earlyAdvantage.summary}
        </p>

        {/* 3 key blocks in grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="surface-2 rounded-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-brand shrink-0" />
              <span className="text-xs font-bold text-brand uppercase tracking-wider">Game Plan</span>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">{overview.primaryPlan}</p>
          </div>

          <div className="surface-2 rounded-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-threat shrink-0" />
              <span className="text-xs font-bold text-threat uppercase tracking-wider">Biggest Threat</span>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">{overview.biggestThreat}</p>
          </div>

          <div className="surface-2 rounded-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <Crosshair className="w-4 h-4 text-info-status shrink-0" />
              <span className="text-xs font-bold text-info-status uppercase tracking-wider">First Focus</span>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">{overview.firstDecisionFocus}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickOverview;
