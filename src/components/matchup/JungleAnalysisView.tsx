import { Route, Swords, Target, Shield, TrendingUp, Clock, Moon, Package, XOctagon } from "lucide-react";
import type { JungleMatchupPlan } from "@/types/matchup";
import QuickOverview from "./QuickOverview";
import CollapsibleSection from "./CollapsibleSection";
import PhaseCard from "./PhaseCard";
import PowerSpikesList from "./PowerSpikesList";
import ItemBuild from "./ItemBuild";
import MistakesList from "./MistakesList";

interface JungleAnalysisViewProps {
  plan: JungleMatchupPlan;
}

/** Card for jungle clear pathing */
const ClearPathCard = ({ data }: { data: JungleMatchupPlan["clearPath"] }) => (
  <div className="space-y-3">
    <div className="surface-2 rounded-md px-3 py-2">
      <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">Start Recomendado</p>
      <p className="text-sm text-foreground/90">{data.recommendedStart}</p>
    </div>
    <div className="surface-2 rounded-md px-3 py-2">
      <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">First Back</p>
      <p className="text-sm text-foreground/90">{data.firstBackTiming}</p>
    </div>
    <div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Rota Completa</p>
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

/** Card for ganking strategy */
const GankingCard = ({ data }: { data: JungleMatchupPlan["gankingStrategy"] }) => (
  <div className="space-y-3">
    <div className="surface-2 rounded-md px-3 py-2">
      <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">Prioridade</p>
      <p className="text-sm text-foreground/90">{data.priority}</p>
    </div>
    <div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Melhores Timings</p>
      <ul className="space-y-1.5">
        {data.bestTimings.map((t, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="text-caution mt-0.5 shrink-0">⏱</span>
            <span className="text-foreground/80">{t}</span>
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

/** Card for objective control */
const ObjectiveCard = ({ data }: { data: JungleMatchupPlan["objectiveControl"] }) => (
  <div className="space-y-3">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="surface-2 rounded-md px-3 py-2">
        <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">Dragão</p>
        <p className="text-xs text-foreground/80">{data.dragonPriority}</p>
      </div>
      <div className="surface-2 rounded-md px-3 py-2">
        <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">Herald</p>
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

/** Card for counter-jungling */
const CounterJungleCard = ({ data }: { data: JungleMatchupPlan["counterJungling"] }) => {
  const riskColors = { low: "text-positive", medium: "text-caution", high: "text-threat" };
  const riskLabels = { low: "Baixo", medium: "Médio", high: "Alto" };
  return (
    <div className="space-y-3">
      <div className="surface-2 rounded-md px-3 py-2 flex items-center gap-2">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Risco:</p>
        <span className={`text-xs font-bold uppercase ${riskColors[data.riskLevel]}`}>
          {riskLabels[data.riskLevel]}
        </span>
      </div>
      <div className="surface-2 rounded-md px-3 py-2">
        <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">Estratégia</p>
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
  return (
    <>
      <QuickOverview overview={plan.overview} />

      <CollapsibleSection
        title="Clear Path & Rota"
        icon={<Route className="w-4 h-4" />}
        iconColorClass="text-brand"
        defaultOpen={true}
      >
        <ClearPathCard data={plan.clearPath} />
      </CollapsibleSection>

      <CollapsibleSection
        title="Ganking Strategy"
        icon={<Swords className="w-4 h-4" />}
        iconColorClass="text-caution"
        defaultOpen={true}
      >
        <GankingCard data={plan.gankingStrategy} />
      </CollapsibleSection>

      <CollapsibleSection
        title="Controle de Objetivos"
        icon={<Target className="w-4 h-4" />}
        iconColorClass="text-info-status"
      >
        <ObjectiveCard data={plan.objectiveControl} />
      </CollapsibleSection>

      <CollapsibleSection
        title="Counter-Jungling"
        icon={<Shield className="w-4 h-4" />}
        iconColorClass="text-threat"
      >
        <CounterJungleCard data={plan.counterJungling} />
      </CollapsibleSection>

      <CollapsibleSection
        title="Power Spikes"
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
        title="Itemization & Runes"
        icon={<Package className="w-4 h-4" />}
        iconColorClass="text-brand"
      >
        <ItemBuild itemization={plan.itemization} />
      </CollapsibleSection>

      <CollapsibleSection
        title="Erros para Evitar"
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
