import { MatchupMeta, AdvantageLevel } from "@/types/matchup";
import { useI18n, type TranslationKey } from "@/lib/i18n";

interface MatchupHeaderProps {
  meta: MatchupMeta;
  onReset?: () => void;
  /** Only available right after generating (not for historical/saved views —
   * playstyle/macroStyle aren't stored on the saved plan itself). */
  playstyleLabel?: string;
  macroStyleLabel?: string;
  /** Timing of the first ally-favorable power spike, if any real one exists. */
  peakTiming?: string | null;
}

const initials = (name: string) =>
  name
    .split(/[\s'’]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const MatchupHeader = ({ meta, onReset, playstyleLabel, macroStyleLabel, peakTiming }: MatchupHeaderProps) => {
  const { t } = useI18n();

  if (!meta) return null;

  const difficultyConfig: Record<AdvantageLevel, { labelKey: TranslationKey; color: string }> = {
    strong: { labelKey: "difficulty.strong", color: "text-brand" },
    slight: { labelKey: "difficulty.slight", color: "text-brand" },
    even: { labelKey: "difficulty.even", color: "text-[#FFC44D]" },
    slight_disadvantage: { labelKey: "difficulty.slight_disadvantage", color: "text-[#FFC44D]" },
    hard: { labelKey: "difficulty.hard", color: "text-threat" },
  };
  const diff = difficultyConfig[meta.difficulty];

  return (
    <div className="border-b border-hairline pb-[18px] px-1">
      {onReset && (
        <button onClick={onReset} className="font-mono text-xs text-ink-40 hover:text-ink-70 transition-colors mb-3.5">
          {t("matchup.back")}
        </button>
      )}

      <div className="flex items-center gap-3.5">
        <div className="flex items-center shrink-0">
          <div className="w-[52px] h-[52px] rounded-[14px] overflow-hidden border" style={{ borderColor: "rgba(245,178,26,.3)" }}>
            {meta.allyImage ? (
              <img src={meta.allyImage} alt={meta.allyChampion} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.1)_0_5px,rgba(255,255,255,.04)_5px_10px)]">
                <span className="font-mono font-bold text-[15px] text-brand">{initials(meta.allyChampion)}</span>
              </div>
            )}
          </div>
          <div
            className="w-[52px] h-[52px] rounded-[14px] overflow-hidden border -ml-2.5"
            style={{ borderColor: "rgba(255,110,126,.3)" }}
          >
            {meta.enemyImage ? (
              <img src={meta.enemyImage} alt={meta.enemyChampion} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[repeating-linear-gradient(135deg,rgba(255,110,126,.14)_0_5px,rgba(255,110,126,.05)_5px_10px)]">
                <span className="font-mono font-bold text-[15px] text-threat">{initials(meta.enemyChampion)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[19px] leading-[1.2] tracking-[-.3px] truncate">
            {meta.allyChampion} vs {meta.enemyChampion}
          </div>
          <div className="font-mono text-[11.5px] text-ink-40 mt-0.5">
            {meta.role.toUpperCase()}
            {meta.patch ? ` · PATCH ${meta.patch}` : ""}
          </div>
          {(playstyleLabel || macroStyleLabel) && (
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {playstyleLabel && (
                <span
                  className="font-mono text-[10px] rounded-md px-2 py-1 border"
                  style={{ color: "#F5B21A", background: "rgba(245,178,26,.1)", borderColor: "rgba(245,178,26,.24)" }}
                >
                  {t("matchup.you")}: {playstyleLabel}
                </span>
              )}
              {macroStyleLabel && (
                <span className="font-mono text-[10px] rounded-md px-2 py-1 border bg-white/[.05] border-white/10 text-ink-70">
                  {meta.allyChampion}: {macroStyleLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <div className="flex-1 glass rounded-[13px] border border-white/[.06] px-3 py-2.5">
          <div className="font-mono text-[9px] tracking-[.7px] text-ink-40">{t("matchup.difficulty").toUpperCase()}</div>
          <div className={`font-mono font-bold text-xl mt-1 ${diff.color}`}>{t(diff.labelKey)}</div>
        </div>
        {peakTiming && (
          <div className="flex-1 glass rounded-[13px] border border-white/[.06] px-3 py-2.5">
            <div className="font-mono text-[9px] tracking-[.7px] text-ink-40">{t("matchup.peak").toUpperCase()}</div>
            <div className="font-mono font-bold text-xl mt-1">{peakTiming}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchupHeader;
