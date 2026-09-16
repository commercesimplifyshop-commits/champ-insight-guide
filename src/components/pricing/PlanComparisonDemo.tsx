import { useEffect, useState } from "react";
import MatchupHeader from "@/components/matchup/MatchupHeader";
import LaneAnalysisView from "@/components/matchup/LaneAnalysisView";
import { demoFreePlan, demoPremiumPlan } from "@/data/plan-comparison-demo";

const AUTO_CYCLE_MS = 4500;
const FADE_MS = 200;

/**
 * Illustrates the free vs Premium difference using the REAL result
 * components (LaneAnalysisView, PremiumGate, etc.) with a fixed Fiora x Jax
 * example — not a static image, so it can never visually drift from the
 * actual product the way a hand-made mockup/GIF would.
 */
const PlanComparisonDemo = () => {
  const [showPremium, setShowPremium] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;
    const id = setTimeout(() => goTo(!showPremium), AUTO_CYCLE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, showPremium]);

  const goTo = (target: boolean, manual = false) => {
    if (manual) setAutoPlay(false);
    if (target === showPremium) return;
    setFading(true);
    setTimeout(() => {
      setShowPremium(target);
      setFading(false);
    }, FADE_MS);
  };

  const plan = showPremium ? demoPremiumPlan : demoFreePlan;

  const pillClass = (active: boolean) =>
    `px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
      active ? "bg-brand text-primary-foreground" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div id="demo" className="rounded-xl border border-border surface-0 p-3 sm:p-4 scroll-mt-20">
      <div className="flex justify-center mb-3">
        <div className="flex gap-0.5 surface-2 border border-border rounded-full p-1">
          <button onClick={() => goTo(false, true)} className={pillClass(!showPremium)}>
            GRÁTIS
          </button>
          <button onClick={() => goTo(true, true)} className={pillClass(showPremium)}>
            PREMIUM
          </button>
        </div>
      </div>

      <div
        className={`space-y-4 transition-all duration-300 ${
          fading ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"
        }`}
      >
        <MatchupHeader meta={plan.meta} />
        <LaneAnalysisView plan={plan} />
      </div>
    </div>
  );
};

export default PlanComparisonDemo;
