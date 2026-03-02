import { useState } from "react";
import { Swords, Loader2, Eye, Map, TrendingUp, Clock, Moon, Package, XOctagon } from "lucide-react";
import type { Role, Champion } from "@/types/matchup";
import { MOCK_PLAN } from "@/data/mock-matchup";

import RoleSelector from "@/components/matchup/RoleSelector";
import ChampionPicker from "@/components/matchup/ChampionPicker";
import MatchupHeader from "@/components/matchup/MatchupHeader";
import QuickOverview from "@/components/matchup/QuickOverview";
import CollapsibleSection from "@/components/matchup/CollapsibleSection";
import PhaseCard from "@/components/matchup/PhaseCard";
import JungleControlCard from "@/components/matchup/JungleControlCard";
import PowerSpikesList from "@/components/matchup/PowerSpikesList";
import ItemBuild from "@/components/matchup/ItemBuild";
import MistakesList from "@/components/matchup/MistakesList";

const Index = () => {
  const [role, setRole] = useState<Role | null>(null);
  const [ally, setAlly] = useState<Champion | null>(null);
  const [enemy, setEnemy] = useState<Champion | null>(null);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<typeof MOCK_PLAN | null>(null);

  const canAnalyze = role && ally && enemy;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setLoading(true);
    // Simulates API call to Laravel backend
    await new Promise((r) => setTimeout(r, 1200));
    setPlan(MOCK_PLAN);
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
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
                Matchup Analysis
              </h1>
              <p className="text-sm text-muted-foreground">
                Select your role and champions to generate a strategic plan
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
            {/* Header with champ vs champ */}
            <MatchupHeader meta={plan.meta} onReset={handleReset} />

            {/* DOMINANT SECTION: Quick Overview - always visible */}
            <QuickOverview overview={plan.overview} />

            {/* Collapsible sections for deep reading */}
            <CollapsibleSection
              title={plan.earlyGame.title}
              icon={<Eye className="w-4 h-4" />}
              iconColorClass="text-brand"
              defaultOpen={true}
            >
              <PhaseCard phase={plan.earlyGame} />
            </CollapsibleSection>

            <CollapsibleSection
              title="Vision & Jungle Control"
              icon={<Map className="w-4 h-4" />}
              iconColorClass="text-info-status"
            >
              <JungleControlCard data={plan.jungleControl} />
            </CollapsibleSection>

            <CollapsibleSection
              title="Power Spikes"
              icon={<TrendingUp className="w-4 h-4" />}
              iconColorClass="text-caution"
              defaultOpen={true}
            >
              <PowerSpikesList spikes={plan.powerSpikes} />
            </CollapsibleSection>

            <CollapsibleSection
              title={plan.midGame.title}
              icon={<Clock className="w-4 h-4" />}
              iconColorClass="text-brand"
            >
              <PhaseCard phase={plan.midGame} />
            </CollapsibleSection>

            <CollapsibleSection
              title={plan.lateGame.title}
              icon={<Moon className="w-4 h-4" />}
              iconColorClass="text-info-status"
            >
              <PhaseCard phase={plan.lateGame} />
            </CollapsibleSection>

            <CollapsibleSection
              title="Itemization & Runes"
              icon={<Package className="w-4 h-4" />}
              iconColorClass="text-brand"
            >
              <ItemBuild itemization={plan.itemization} />
            </CollapsibleSection>

            <CollapsibleSection
              title="Mistakes to Avoid"
              icon={<XOctagon className="w-4 h-4" />}
              iconColorClass="text-threat"
              defaultOpen={true}
            >
              <MistakesList mistakes={plan.mistakes} />
            </CollapsibleSection>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
