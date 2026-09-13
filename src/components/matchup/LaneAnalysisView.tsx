import { Eye, Map, TrendingUp, Clock, Moon, Package, XOctagon } from "lucide-react";
import type { LaneMatchupPlan } from "@/types/matchup";
import { useI18n } from "@/lib/i18n";
import QuickOverview from "./QuickOverview";
import CollapsibleSection from "./CollapsibleSection";
import PhaseCard from "./PhaseCard";
import JungleControlCard from "./JungleControlCard";
import PowerSpikesList from "./PowerSpikesList";
import ItemBuild from "./ItemBuild";
import MistakesList from "./MistakesList";
import PremiumGate from "./PremiumGate";

interface LaneAnalysisViewProps {
  plan: LaneMatchupPlan;
}

const LaneAnalysisView = ({ plan }: LaneAnalysisViewProps) => {
  const { t } = useI18n();
  const locked = plan.meta.locked ?? false;

  return (
    <>
      <QuickOverview overview={plan.overview} />

      <CollapsibleSection
        title={plan.earlyGame.title}
        icon={<Eye className="w-4 h-4" />}
        iconColorClass="text-brand"
        defaultOpen={true}
      >
        <PhaseCard phase={plan.earlyGame} />
      </CollapsibleSection>

      <CollapsibleSection
        title={t("lane.powerSpikes")}
        icon={<TrendingUp className="w-4 h-4" />}
        iconColorClass="text-caution"
        defaultOpen={true}
      >
        <PowerSpikesList spikes={plan.powerSpikes} />
      </CollapsibleSection>

      {locked || !plan.jungleControl || !plan.midGame || !plan.lateGame || !plan.itemization || !plan.mistakes ? (
        <PremiumGate
          sectionTitles={[
            t("lane.visionJungle"),
            t("phase.midGame"),
            t("phase.lateGame"),
            t("lane.itemization"),
            t("lane.mistakes"),
          ]}
        />
      ) : (
        <>
          <CollapsibleSection
            title={t("lane.visionJungle")}
            icon={<Map className="w-4 h-4" />}
            iconColorClass="text-info-status"
            defaultOpen={true}
          >
            <JungleControlCard data={plan.jungleControl} />
          </CollapsibleSection>

          <CollapsibleSection
            title={plan.midGame.title}
            icon={<Clock className="w-4 h-4" />}
            iconColorClass="text-brand"
            defaultOpen={true}
          >
            <PhaseCard phase={plan.midGame} />
          </CollapsibleSection>

          <CollapsibleSection
            title={plan.lateGame.title}
            icon={<Moon className="w-4 h-4" />}
            iconColorClass="text-info-status"
            defaultOpen={true}
          >
            <PhaseCard phase={plan.lateGame} />
          </CollapsibleSection>

          <CollapsibleSection
            title={t("lane.itemization")}
            icon={<Package className="w-4 h-4" />}
            iconColorClass="text-brand"
            defaultOpen={true}
          >
            <ItemBuild itemization={plan.itemization} />
          </CollapsibleSection>

          <CollapsibleSection
            title={t("lane.mistakes")}
            icon={<XOctagon className="w-4 h-4" />}
            iconColorClass="text-threat"
            defaultOpen={true}
          >
            <MistakesList mistakes={plan.mistakes} />
          </CollapsibleSection>
        </>
      )}
    </>
  );
};

export default LaneAnalysisView;
