import { Swords, Hourglass, Shield } from "lucide-react";
import type { PlayStyle } from "@/types/matchup";
import { useI18n, type TranslationKey } from "@/lib/i18n";

const styles: { value: PlayStyle; labelKey: TranslationKey; icon: typeof Swords }[] = [
  { value: "balanced", labelKey: "playstyle.balanced", icon: Shield },
  { value: "aggressive", labelKey: "playstyle.aggressive", icon: Swords },
  { value: "patient", labelKey: "playstyle.patient", icon: Hourglass },
  { value: "cautious", labelKey: "playstyle.cautious", icon: Shield },
];

interface PlaystyleSelectorProps {
  selected: PlayStyle;
  onSelect: (style: PlayStyle) => void;
}

const PlaystyleSelector = ({ selected, onSelect }: PlaystyleSelectorProps) => {
  const { t } = useI18n();

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold text-center">
        {t("playstyle.label")}
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

export default PlaystyleSelector;
