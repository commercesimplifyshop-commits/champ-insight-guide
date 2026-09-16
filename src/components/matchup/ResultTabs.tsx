import { useState, type ReactNode } from "react";

export interface ResultTabDef {
  key: string;
  label: string;
  content: ReactNode;
}

interface ResultTabsProps {
  tabs: ResultTabDef[];
}

/** Sticky tab bar + active tab content (design_handoff_matchupgg_mobile §6, Result). */
const ResultTabs = ({ tabs }: ResultTabsProps) => {
  const [active, setActive] = useState(tabs[0]?.key);
  const activeTab = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div>
      <div
        className="sticky top-14 z-[5] flex gap-1 px-1 py-3 border-b border-white/[.05]"
        style={{ background: "rgba(12,13,17,.92)", backdropFilter: "blur(20px)" }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`flex-1 text-center py-2.5 rounded-[10px] text-xs font-medium transition-colors ${
              t.key === activeTab?.key ? "bg-white/[.09] text-foreground" : "text-[rgba(244,245,243,.45)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="pt-4 flex flex-col gap-2.5">{activeTab?.content}</div>
    </div>
  );
};

export default ResultTabs;
