import type { Role } from "@/types/matchup";

const roles: { value: Role; label: string; icon: string }[] = [
  { value: "top", label: "Top", icon: "⚔️" },
  { value: "jungle", label: "Jungle", icon: "🌿" },
  { value: "mid", label: "Mid", icon: "🔮" },
  { value: "adc", label: "ADC", icon: "🏹" },
  { value: "support", label: "Support", icon: "🛡️" },
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
          <span>{r.icon}</span>
          <span className="hidden sm:inline">{r.label}</span>
        </button>
      ))}
    </div>
  );
};

export default RoleSelector;
