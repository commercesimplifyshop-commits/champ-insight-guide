import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface NavStripItem {
  key: string;
  label: string;
  badge?: string;
  active: boolean;
  to?: string;
  onClick?: () => void;
}

interface NavStripProps {
  items: NavStripItem[];
}

/**
 * Persistent pill strip between the header and the content — replaces a
 * native tab bar (design_handoff_matchupgg_mobile §10). Items mix in-page
 * mode switches (Matchup/Draft) and real route links (Coach IA/Perfil).
 */
const NavStrip = ({ items }: NavStripProps) => {
  return (
    <div
      className="border-b border-hairline"
      style={{ background: "rgba(12,13,17,.6)", backdropFilter: "blur(20px)" }}
    >
      <div className="max-w-3xl mx-auto flex gap-[5px] px-3 py-2.5 overflow-x-auto no-scrollbar">
      {items.map((item) => {
        const pillClass = `shrink-0 flex items-center gap-1.5 px-[11px] py-[9px] rounded-full border transition-colors ${
          item.active ? "bg-brand/[.13] border-brand/[.38] text-brand" : "bg-white/[.035] border-hairline text-[rgba(244,245,243,.62)]"
        }`;
        const content: ReactNode = (
          <>
            <span className={`w-1.5 h-1.5 rounded-full ${item.active ? "bg-brand" : "bg-white/30"}`} />
            <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
            {item.badge && <span className="font-mono font-bold text-[9px] text-brand">{item.badge}</span>}
          </>
        );
        return item.to ? (
          <Link key={item.key} to={item.to} className={pillClass}>
            {content}
          </Link>
        ) : (
          <button key={item.key} onClick={item.onClick} className={pillClass}>
            {content}
          </button>
        );
      })}
      </div>
    </div>
  );
};

export default NavStrip;
