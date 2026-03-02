import { PowerSpike } from "@/types/matchup";

const advantageStyles = {
  ally: { dot: "bg-advantage", text: "text-advantage", label: "Your advantage" },
  enemy: { dot: "bg-threat", text: "text-threat", label: "Enemy advantage" },
  even: { dot: "bg-caution", text: "text-caution", label: "Even" },
};

interface PowerSpikesListProps {
  spikes: PowerSpike[];
}

const PowerSpikesList = ({ spikes }: PowerSpikesListProps) => {
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
              {style.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PowerSpikesList;
