import { JungleControl as JungleControlType } from "@/types/matchup";

interface JungleControlCardProps {
  data: JungleControlType;
}

const JungleControlCard = ({ data }: JungleControlCardProps) => {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="surface-2 rounded-md px-3 py-2">
          <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">Warding Priority</p>
          <p className="text-xs text-foreground/80">{data.wardingPriority}</p>
        </div>
        <div className="surface-2 rounded-md px-3 py-2">
          <p className="text-xs font-bold text-brand uppercase tracking-wider mb-1">Objective Focus</p>
          <p className="text-xs text-foreground/80">{data.objectiveFocus}</p>
        </div>
      </div>
      <ul className="space-y-2">
        {data.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="text-brand mt-0.5 shrink-0">▸</span>
            <span className="text-foreground/80">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JungleControlCard;
