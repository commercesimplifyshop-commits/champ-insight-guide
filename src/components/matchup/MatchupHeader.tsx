import { MatchupMeta, AdvantageLevel } from "@/types/matchup";
import { useI18n } from "@/lib/i18n";

interface MatchupHeaderProps {
  meta: MatchupMeta;
  onReset?: () => void;
}

const MatchupHeader = ({ meta, onReset }: MatchupHeaderProps) => {
  const { t } = useI18n();

  const difficultyConfig: Record<AdvantageLevel, { labelKey: string; class: string; barWidth: string }> = {
    strong: { labelKey: "difficulty.strong", class: "text-advantage", barWidth: "w-1/5" },
    slight: { labelKey: "difficulty.slight", class: "text-advantage", barWidth: "w-2/5" },
    even: { labelKey: "difficulty.even", class: "text-caution", barWidth: "w-3/5" },
    slight_disadvantage: { labelKey: "difficulty.slight_disadvantage", class: "text-caution", barWidth: "w-4/5" },
    hard: { labelKey: "difficulty.hard", class: "text-threat", barWidth: "w-full" },
  };

  const diff = difficultyConfig[meta.difficulty];

  return (
    <div className="surface-1 border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img src={meta.allyImage} alt={meta.allyChampion} className="w-12 h-12 rounded-md border-2 border-info-status" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t("matchup.you")}</p>
              <p className="font-semibold text-foreground text-sm">{meta.allyChampion}</p>
            </div>
          </div>

          <span className="text-muted-foreground text-xs font-mono mx-2">VS</span>

          <div className="flex items-center gap-2">
            <img src={meta.enemyImage} alt={meta.enemyChampion} className="w-12 h-12 rounded-md border-2 border-threat" />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{t("matchup.enemy")}</p>
              <p className="font-semibold text-foreground text-sm">{meta.enemyChampion}</p>
            </div>
          </div>
        </div>

        {onReset && (
          <button onClick={onReset} className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
            {t("matchup.newAnalysis")}
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground uppercase tracking-wider">{t("matchup.difficulty")}:</span>
          <span className={`font-bold ${diff.class}`}>{t(diff.labelKey as any)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground uppercase tracking-wider">WR:</span>
          <span className="font-mono font-bold text-foreground">{meta.winRate}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground uppercase tracking-wider">Patch:</span>
          <span className="font-mono text-muted-foreground">{meta.patch}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchupHeader;
