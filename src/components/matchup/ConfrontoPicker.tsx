import { useState } from "react";
import type { Champion } from "@/types/matchup";
import { useI18n } from "@/lib/i18n";
import ChampionSheet from "./ChampionSheet";

interface ConfrontoPickerProps {
  ally: Champion | null;
  enemy: Champion | null;
  onSelectAlly: (champion: Champion) => void;
  onSelectEnemy: (champion: Champion) => void;
}

const initials = (name: string) =>
  name
    .split(/[\s'’]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const ConfrontoRow = ({
  champion,
  side,
  onClick,
}: {
  champion: Champion | null;
  side: "ally" | "enemy";
  onClick: () => void;
}) => {
  const { t } = useI18n();
  const isAlly = side === "ally";
  const tint = isAlly ? "rgba(245,178,26,.2)" : "rgba(255,110,126,.2)";
  const portraitBg = isAlly
    ? "repeating-linear-gradient(135deg,rgba(255,255,255,.1) 0 5px,rgba(255,255,255,.04) 5px 10px)"
    : "repeating-linear-gradient(135deg,rgba(255,110,126,.14) 0 5px,rgba(255,110,126,.05) 5px 10px)";

  return (
    <button
      onClick={onClick}
      className="glass w-full flex items-center gap-2.5 rounded-[14px] px-3.5 py-2.5 text-left transition-transform active:scale-[.99] border"
      style={{ borderColor: tint }}
    >
      <div
        className="w-[38px] h-[38px] rounded-[11px] shrink-0 flex items-center justify-center border"
        style={{ background: portraitBg, borderColor: tint }}
      >
        {champion?.image ? (
          <img src={champion.image} alt={champion.name} className="w-full h-full object-cover rounded-[11px]" />
        ) : (
          <span className={`font-mono font-bold text-xs ${isAlly ? "text-brand" : "text-threat"}`}>
            {champion ? initials(champion.name) : "?"}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-mono text-[9px] tracking-[.8px] mb-0.5 ${isAlly ? "text-brand" : "text-threat"}`}>
          {isAlly ? t("confronto.you") : t("confronto.enemy")}
        </div>
        <div className="font-semibold text-[15.5px] truncate">
          {champion ? champion.name : t("confronto.pickPlaceholder")}
        </div>
      </div>
      <span className="font-mono text-[10px] text-ink-40 shrink-0">{t("confronto.swap")}</span>
    </button>
  );
};

const ConfrontoPicker = ({ ally, enemy, onSelectAlly, onSelectEnemy }: ConfrontoPickerProps) => {
  const { t } = useI18n();
  const [pickerFor, setPickerFor] = useState<"ally" | "enemy" | null>(null);

  return (
    <div className="flex flex-col gap-1.5">
      <ConfrontoRow champion={ally} side="ally" onClick={() => setPickerFor("ally")} />
      <div className="flex items-center gap-2 px-0.5">
        <span className="flex-1 h-px bg-hairline" />
        <span className="font-mono font-bold text-[9.5px] tracking-[1px] text-ink-40">VS</span>
        <span className="flex-1 h-px bg-hairline" />
      </div>
      <ConfrontoRow champion={enemy} side="enemy" onClick={() => setPickerFor("enemy")} />

      <ChampionSheet
        open={pickerFor === "ally"}
        label={t("confronto.you")}
        selected={ally}
        onClose={() => setPickerFor(null)}
        onSelect={onSelectAlly}
      />
      <ChampionSheet
        open={pickerFor === "enemy"}
        label={t("confronto.enemy")}
        selected={enemy}
        onClose={() => setPickerFor(null)}
        onSelect={onSelectEnemy}
      />
    </div>
  );
};

export default ConfrontoPicker;
