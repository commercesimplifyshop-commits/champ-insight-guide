import type { Role } from "@/types/matchup";
import topIcon from "@/assets/roles/top.png";
import jungleIcon from "@/assets/roles/jungle.png";
import midIcon from "@/assets/roles/mid.png";
import adcIcon from "@/assets/roles/adc.png";
import supportIcon from "@/assets/roles/support.png";

const roles: { value: Role; label: string; icon: string }[] = [
  { value: "top", label: "Top", icon: topIcon },
  { value: "jungle", label: "Jungle", icon: jungleIcon },
  { value: "mid", label: "Mid", icon: midIcon },
  { value: "adc", label: "ADC", icon: adcIcon },
  { value: "support", label: "Support", icon: supportIcon },
];

interface RoleSelectorProps {
  selected: Role | null;
  onSelect: (role: Role) => void;
}

const RoleSelector = ({ selected, onSelect }: RoleSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      {roles.map((r) => (
        <button
          key={r.value}
          onClick={() => onSelect(r.value)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
            selected === r.value
              ? "bg-brand text-primary-foreground"
              : "surface-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          <img
            src={r.icon}
            alt={r.label}
            className={`w-4 h-4 object-contain ${
              selected === r.value ? "brightness-0 invert" : "brightness-0 invert opacity-60"
            }`}
          />
          <span className="hidden sm:inline">{r.label}</span>
        </button>
      ))}
    </div>
  );
};

export default RoleSelector;
