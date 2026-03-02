import { useState } from "react";
import { Swords, Loader2 } from "lucide-react";
import type { Role, Champion, MatchupPlan } from "@/types/matchup";
import { MOCK_PLAN } from "@/data/mock-matchup";
import { MOCK_JUNGLE_PLAN } from "@/data/mock-jungle-matchup";

import HeroBanner from "@/components/matchup/HeroBanner";
import RoleSelector from "@/components/matchup/RoleSelector";
import ChampionPicker from "@/components/matchup/ChampionPicker";
import MatchupHeader from "@/components/matchup/MatchupHeader";
import LaneAnalysisView from "@/components/matchup/LaneAnalysisView";
import JungleAnalysisView from "@/components/matchup/JungleAnalysisView";

const Index = () => {
  const [role, setRole] = useState<Role | null>(null);
  const [ally, setAlly] = useState<Champion | null>(null);
  const [enemy, setEnemy] = useState<Champion | null>(null);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<MatchupPlan | null>(null);

  const canAnalyze = role && ally && enemy;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setPlan(role === "jungle" ? MOCK_JUNGLE_PLAN : MOCK_PLAN);
    setLoading(false);
    setLoading(false);
  };

  const handleReset = () => {
    setRole(null);
    setAlly(null);
    setEnemy(null);
    setPlan(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="surface-1 border-b border-border sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-brand" />
            <span className="font-bold text-sm tracking-wider text-foreground">
              MATCHUP<span className="text-brand">.GG</span>
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
            Strategic Coach
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {!plan ? (
          /* ─── SELECTION VIEW ─── */
          <div className="space-y-5">
            {/* Hero Banner */}
            <HeroBanner />

            <div className="text-center space-y-1">
              <h1 className="text-lg font-extrabold text-foreground tracking-tight">
                Análise de Matchup
              </h1>
              <p className="text-xs text-muted-foreground">
                Selecione sua role e campeões para gerar um plano estratégico
              </p>
            </div>

            {/* Role Selector */}
            <div className="flex justify-center">
              <RoleSelector selected={role} onSelect={setRole} />
            </div>

            {/* Champion Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ChampionPicker
                label="Your Champion"
                side="ally"
                selected={ally}
                onSelect={setAlly}
                onClear={() => setAlly(null)}
              />
              <ChampionPicker
                label="Enemy Champion"
                side="enemy"
                selected={enemy}
                onSelect={setEnemy}
                onClear={() => setEnemy(null)}
              />
            </div>

            {/* Analyze button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze || loading}
                className={`px-8 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                  canAnalyze
                    ? "bg-brand text-primary-foreground hover:brightness-110 shadow-brand"
                    : "surface-2 text-muted-foreground cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  "Generate Plan"
                )}
              </button>
            </div>
          </div>
        ) : (
          /* ─── ANALYSIS VIEW ─── */
          <div className="space-y-4">
            <MatchupHeader meta={plan.meta} onReset={handleReset} />

            {plan.type === "jungle" ? (
              <JungleAnalysisView plan={plan} />
            ) : (
              <LaneAnalysisView plan={plan} />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
