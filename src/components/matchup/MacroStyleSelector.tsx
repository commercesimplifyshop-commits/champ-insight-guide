import type { MacroStyle } from "@/types/matchup";
import { useI18n, type TranslationKey } from "@/lib/i18n";

const styles: { value: MacroStyle; labelKey: TranslationKey }[] = [
  { value: "split_push", labelKey: "macrostyle.split_push" },
  { value: "scaling", labelKey: "macrostyle.scaling" },
  { value: "poke", labelKey: "macrostyle.poke" },
  { value: "pick", labelKey: "macrostyle.pick" },
  { value: "protect_carry", labelKey: "macrostyle.protect_carry" },
  { value: "roamer", labelKey: "macrostyle.roamer" },
];

interface MacroStyleSelectorProps {
  selected: MacroStyle | null;
  onSelect: (style: MacroStyle) => void;
}

const MacroStyleSelector = ({ selected, onSelect }: MacroStyleSelectorProps) => {
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

export default MacroStyleSelector;
