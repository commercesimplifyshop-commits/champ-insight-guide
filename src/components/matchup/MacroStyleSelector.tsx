import { Route, Zap, Crosshair, Shield, Compass, TrendingUp } from "lucide-react";
import type { MacroStyle } from "@/types/matchup";
import { useI18n, type TranslationKey } from "@/lib/i18n";

const styles: { value: MacroStyle; labelKey: TranslationKey; icon: typeof Route }[] = [
  { value: "split_push", labelKey: "macrostyle.split_push", icon: Route },
  { value: "poke", labelKey: "macrostyle.poke", icon: Zap },
  { value: "pick", labelKey: "macrostyle.pick", icon: Crosshair },
  { value: "protect_carry", labelKey: "macrostyle.protect_carry", icon: Shield },
  { value: "roamer", labelKey: "macrostyle.roamer", icon: Compass },
  { value: "scaling", labelKey: "macrostyle.scaling", icon: TrendingUp },
];

interface MacroStyleSelectorProps {
  selected: MacroStyle | null;
  onSelect: (style: MacroStyle) => void;
}

const MacroStyleSelector = ({ selected, onSelect }: MacroStyleSelectorProps) => {
  const { t } = useI18n();

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold text-center">
        {t("macrostyle.label")}
      </p>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {styles.map((s) => (
          <button
            key={s.value}
            onClick={() => onSelect(s.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              selected === s.value
                ? "bg-brand text-primary-foreground"
                : "surface-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <s.icon className="w-3.5 h-3.5" />
            {t(s.labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MacroStyleSelector;
