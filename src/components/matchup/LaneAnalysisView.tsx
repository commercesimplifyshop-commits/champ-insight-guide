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

interface LaneAnalysisViewProps {
  plan: LaneMatchupPlan;
}

const LaneAnalysisView = ({ plan }: LaneAnalysisViewProps) => {
  const { t } = useI18n();

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
        title={t("lane.visionJungle")}
        icon={<Map className="w-4 h-4" />}
        iconColorClass="text-info-status"
      >
        <JungleControlCard data={plan.jungleControl} />
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
        title={t("lane.mistakes")}
        icon={<XOctagon className="w-4 h-4" />}
        iconColorClass="text-threat"
        defaultOpen={true}
      >
        <MistakesList mistakes={plan.mistakes} />
      </CollapsibleSection>
    </>
  );
};

export default LaneAnalysisView;
