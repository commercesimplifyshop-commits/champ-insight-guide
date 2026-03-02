import { Route, Swords, Target, Shield, TrendingUp, Clock, Moon, Package, XOctagon } from "lucide-react";
import type { JungleMatchupPlan } from "@/types/matchup";
import { useI18n } from "@/lib/i18n";
import QuickOverview from "./QuickOverview";
import CollapsibleSection from "./CollapsibleSection";
import PhaseCard from "./PhaseCard";
import PowerSpikesList from "./PowerSpikesList";
import ItemBuild from "./ItemBuild";
import MistakesList from "./MistakesList";

interface JungleAnalysisViewProps {
  plan: JungleMatchupPlan;
}

const ClearPathCard = ({ data }: { data: JungleMatchupPlan["clearPath"] }) => {
  const { t } = useI18n();
  return (
    <div className="space-y-3">
      <div className="surface-2 rounded-md px-3 py-2">
        <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">{t("jungle.recommendedStart")}</p>
        <p className="text-sm text-foreground/90">{data.recommendedStart}</p>
      </div>
      <div className="surface-2 rounded-md px-3 py-2">
        <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">{t("jungle.firstBack")}</p>
        <p className="text-sm text-foreground/90">{data.firstBackTiming}</p>
      </div>
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("jungle.fullRoute")}</p>
        <ol className="space-y-1.5">
          {data.fullClearRoute.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-brand font-bold text-xs mt-0.5 shrink-0 w-4 text-center">{i + 1}</span>
              <span className="text-foreground/80">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

const GankingCard = ({ data }: { data: JungleMatchupPlan["gankingStrategy"] }) => {
  const { t } = useI18n();
  return (
    <div className="space-y-3">
      <div className="surface-2 rounded-md px-3 py-2">
        <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">{t("jungle.priority")}</p>
        <p className="text-sm text-foreground/90">{data.priority}</p>
      </div>
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("jungle.bestTimings")}</p>
        <ul className="space-y-1.5">
          {data.bestTimings.map((ti, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-caution mt-0.5 shrink-0">⏱</span>
              <span className="text-foreground/80">{ti}</span>
            </li>
          ))}
        </ul>
      </div>
      <ul className="space-y-2">
        {data.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="text-brand mt-0.5 shrink-0">▸</span>
            <span className="text-foreground/80">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ObjectiveCard = ({ data }: { data: JungleMatchupPlan["objectiveControl"] }) => {
  const { t } = useI18n();
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="surface-2 rounded-md px-3 py-2">
          <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">{t("jungle.dragon")}</p>
          <p className="text-xs text-foreground/80">{data.dragonPriority}</p>
        </div>
        <div className="surface-2 rounded-md px-3 py-2">
          <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">{t("jungle.herald")}</p>
          <p className="text-xs text-foreground/80">{data.heraldStrategy}</p>
        </div>
      </div>
      <ul className="space-y-2">
        {data.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="text-brand mt-0.5 shrink-0">▸</span>
            <span className="text-foreground/80">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CounterJungleCard = ({ data }: { data: JungleMatchupPlan["counterJungling"] }) => {
  const { t } = useI18n();
  const riskColors = { low: "text-positive", medium: "text-caution", high: "text-threat" };
  const riskLabelKeys = { low: "jungle.riskLow" as const, medium: "jungle.riskMedium" as const, high: "jungle.riskHigh" as const };
  return (
    <div className="space-y-3">
      <div className="surface-2 rounded-md px-3 py-2 flex items-center gap-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("jungle.risk")}:</p>
        <span className={`text-xs font-bold uppercase ${riskColors[data.riskLevel]}`}>
          {t(riskLabelKeys[data.riskLevel])}
        </span>
      </div>
      <div className="surface-2 rounded-md px-3 py-2">
        <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">{t("jungle.strategy")}</p>
        <p className="text-sm text-foreground/90">{data.strategy}</p>
      </div>
      <ul className="space-y-2">
        {data.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="text-brand mt-0.5 shrink-0">▸</span>
            <span className="text-foreground/80">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const JungleAnalysisView = ({ plan }: JungleAnalysisViewProps) => {
  const { t } = useI18n();

  return (
    <>
      <QuickOverview overview={plan.overview} />

      <CollapsibleSection
        title={t("jungle.clearPath")}
        icon={<Route className="w-4 h-4" />}
        iconColorClass="text-brand"
        defaultOpen={true}
      >
        <ClearPathCard data={plan.clearPath} />
      </CollapsibleSection>

      <CollapsibleSection
        title={t("jungle.gankingStrategy")}
        icon={<Swords className="w-4 h-4" />}
        iconColorClass="text-caution"
        defaultOpen={true}
      >
        <GankingCard data={plan.gankingStrategy} />
      </CollapsibleSection>

      <CollapsibleSection
        title={t("jungle.objectiveControl")}
        icon={<Target className="w-4 h-4" />}
        iconColorClass="text-info-status"
      >
        <ObjectiveCard data={plan.objectiveControl} />
      </CollapsibleSection>

      <CollapsibleSection
        title={t("jungle.counterJungling")}
        icon={<Shield className="w-4 h-4" />}
        iconColorClass="text-threat"
      >
        <CounterJungleCard data={plan.counterJungling} />
      </CollapsibleSection>

      <CollapsibleSection
        title={t("lane.powerSpikes")}
        icon={<TrendingUp className="w-4 h-4" />}
        iconColorClass="text-caution"
        defaultOpen={true}
      >
        <PowerSpikesList spikes={plan.powerSpikes} />
      </CollapsibleSection>

      <CollapsibleSection
        title={plan.midGame.title}
        icon={<Clock className="w-4 h-4" />}
        iconColorClass="text-brand"
      >
        <PhaseCard phase={plan.midGame} />
      </CollapsibleSection>

      <CollapsibleSection
        title={plan.lateGame.title}
        icon={<Moon className="w-4 h-4" />}
        iconColorClass="text-info-status"
      >
        <PhaseCard phase={plan.lateGame} />
      </CollapsibleSection>

      <CollapsibleSection
        title={t("lane.itemization")}
        icon={<Package className="w-4 h-4" />}
        iconColorClass="text-brand"
      >
        <ItemBuild itemization={plan.itemization} />
      </CollapsibleSection>

      <CollapsibleSection
        title={t("jungle.mistakes")}
        icon={<XOctagon className="w-4 h-4" />}
        iconColorClass="text-threat"
        defaultOpen={true}
      >
        <MistakesList mistakes={plan.mistakes} />
      </CollapsibleSection>
    </>
  );
};

export default JungleAnalysisView;
