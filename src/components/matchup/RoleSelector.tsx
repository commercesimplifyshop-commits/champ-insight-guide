import type { Role } from "@/types/matchup";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import topIcon from "@/assets/roles/top.png";
import jungleIcon from "@/assets/roles/jungle.png";
import midIcon from "@/assets/roles/mid.png";
import adcIcon from "@/assets/roles/adc.png";
import supportIcon from "@/assets/roles/support.png";

const roles: { value: Role; labelKey: TranslationKey; icon: string }[] = [
  { value: "top", labelKey: "role.top", icon: topIcon },
  { value: "jungle", labelKey: "role.jungle", icon: jungleIcon },
  { value: "mid", labelKey: "role.mid", icon: midIcon },
  { value: "adc", labelKey: "role.adc", icon: adcIcon },
  { value: "support", labelKey: "role.support", icon: supportIcon },
];

interface RoleSelectorProps {
  selected: Role | null;
  onSelect: (role: Role) => void;
}

const RoleSelector = ({ selected, onSelect }: RoleSelectorProps) => {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-[7px] overflow-x-auto no-scrollbar pb-0.5">
      {roles.map((r) => {
        const active = selected === r.value;
        return (
          <button
            key={r.value}
            onClick={() => onSelect(r.value)}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-colors border ${
              active ? "bg-brand/[.14] text-brand border-brand/[.35]" : "glass text-ink-50 border-hairline"
            }`}
          >
            <img
              src={r.icon}
              alt={t(r.labelKey)}
              className={`w-4 h-4 object-contain ${active ? "" : "opacity-60"}`}
              style={active ? { filter: "sepia(1) saturate(6) hue-rotate(-10deg) brightness(1.15)" } : undefined}
            />
            {t(r.labelKey)}
          </button>
        );
      })}
    </div>
  );
};

export default RoleSelector;
