import { GamePhase } from "@/types/matchup";
import { useI18n } from "@/lib/i18n";

interface PhaseCardProps {
  phase: GamePhase;
}

const PhaseCard = ({ phase }: PhaseCardProps) => {
  const { t } = useI18n();

  return (
    <div className="space-y-3">
      <div className="surface-2 rounded-md px-3 py-2">
        <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">{t("lane.objective")}</p>
        <p className="text-sm text-foreground/90">{phase.objective}</p>
      </div>
      <ul className="space-y-2">
        {phase.bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="text-brand mt-0.5 shrink-0">▸</span>
            <span className="text-foreground/80">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PhaseCard;
