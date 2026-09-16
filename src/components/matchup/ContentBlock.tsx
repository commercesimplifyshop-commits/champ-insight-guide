import type { ReactNode } from "react";

interface ContentBlockProps {
  tag: string;
  tagColorClass: string;
  tagBorderClass: string;
  heading?: string;
  children: ReactNode;
}

/** Result screen's content card: tag pill + heading + body (design_handoff_matchupgg_mobile §6, Result tabs). */
const ContentBlock = ({ tag, tagColorClass, tagBorderClass, heading, children }: ContentBlockProps) => (
  <div className="glass rounded-2xl border border-white/[.07] px-4 py-[15px]">
    <div className="flex items-center gap-2 mb-2 flex-wrap">
      <span className={`font-mono font-bold text-[10px] rounded-md px-[7px] py-[3px] border ${tagColorClass} ${tagBorderClass}`}>
        {tag}
      </span>
      {heading && <span className="font-semibold text-sm">{heading}</span>}
    </div>
    <div className="text-[13.5px] leading-[1.55] text-ink-70">{children}</div>
  </div>
);

export default ContentBlock;
