import { MistakeItem } from "@/types/matchup";
import { XCircle, AlertTriangle, Info } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface MistakesListProps {
  mistakes: MistakeItem[];
}

const MistakesList = ({ mistakes }: MistakesListProps) => {
  const { t } = useI18n();

  const severityConfig = {
    critical: { icon: XCircle, bgClass: "bg-threat", textClass: "text-threat", labelKey: "mistakes.critical" as const },
    warning: { icon: AlertTriangle, bgClass: "bg-caution", textClass: "text-caution", labelKey: "mistakes.warning" as const },
    minor: { icon: Info, bgClass: "bg-info-status", textClass: "text-info-status", labelKey: "mistakes.minor" as const },
  };

  return (
    <div className="space-y-2">
      {mistakes.map((mistake, i) => {
        const config = severityConfig[mistake.severity];
        const Icon = config.icon;
        return (
          <div key={i} className="flex items-start gap-3 surface-2 rounded-md px-3 py-2.5">
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${config.textClass}`} />
            <span className="text-sm text-foreground/80 flex-1">{mistake.text}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${config.textClass}`}>
              {t(config.labelKey)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default MistakesList;
