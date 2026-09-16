import type { PlayStyle } from "@/types/matchup";
import { useI18n, type TranslationKey } from "@/lib/i18n";

const styles: { value: PlayStyle; labelKey: TranslationKey }[] = [
  { value: "aggressive", labelKey: "playstyle.aggressive" },
  { value: "patient", labelKey: "playstyle.patient" },
  { value: "cautious", labelKey: "playstyle.cautious" },
  { value: "balanced", labelKey: "playstyle.balanced" },
];

interface PlaystyleSelectorProps {
  selected: PlayStyle | null;
  onSelect: (style: PlayStyle) => void;
}

const PlaystyleSelector = ({ selected, onSelect }: PlaystyleSelectorProps) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap gap-[7px]">
      {styles.map((s) => {
        const active = selected === s.value;
        return (
          <button
            key={s.value}
            onClick={() => onSelect(s.value)}
            className={`flex items-center gap-[7px] px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors border ${
              active ? "bg-brand/[.12] text-brand border-brand/40" : "bg-white/[.04] text-ink-70 border-white/[.08]"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-brand" : "bg-white/[.18]"}`} />
            {t(s.labelKey)}
          </button>
        );
      })}
    </div>
  );
};

export default PlaystyleSelector;
