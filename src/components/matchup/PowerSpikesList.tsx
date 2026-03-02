import { PowerSpike } from "@/types/matchup";
import { useI18n } from "@/lib/i18n";

interface PowerSpikesListProps {
  spikes: PowerSpike[];
}

const PowerSpikesList = ({ spikes }: PowerSpikesListProps) => {
  const { t } = useI18n();

  const advantageStyles = {
    ally: { dot: "bg-advantage", text: "text-advantage", labelKey: "spikes.ally" as const },
    enemy: { dot: "bg-threat", text: "text-threat", labelKey: "spikes.enemy" as const },
    even: { dot: "bg-caution", text: "text-caution", labelKey: "spikes.even" as const },
  };

  return (
    <div className="space-y-2">
      {spikes.map((spike, i) => {
        const style = advantageStyles[spike.advantage];
        return (
          <div key={i} className="flex items-center gap-3 surface-2 rounded-md px-3 py-2.5">
            <div className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
            <span className="font-mono text-xs font-bold text-muted-foreground w-20 shrink-0">
              {spike.timing}
            </span>
            <span className="text-xs text-foreground/80 flex-1">{spike.description}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${style.text}`}>
              {t(style.labelKey)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PowerSpikesList;
