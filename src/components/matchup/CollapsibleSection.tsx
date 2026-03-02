import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

interface CollapsibleSectionProps {
  title: string;
  icon: ReactNode;
  iconColorClass?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * Accordion-style section wrapper.
 * On mobile: collapsed by default (except first sections).
 * On desktop: always expanded.
 */
const CollapsibleSection = ({
  title,
  icon,
  iconColorClass = "text-brand",
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="surface-1 border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className={iconColorClass}>{icon}</span>
          <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">{title}</h3>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && <div className="px-4 pb-4 border-t border-border pt-3">{children}</div>}
    </div>
  );
};

export default CollapsibleSection;
