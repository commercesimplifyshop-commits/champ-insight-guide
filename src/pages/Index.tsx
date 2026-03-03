import { useState } from "react";
import { Swords, Loader2 } from "lucide-react";
import type { Role, Champion, MatchupPlan } from "@/types/matchup";
import { MOCK_PLAN } from "@/data/mock-matchup";
import { MOCK_JUNGLE_PLAN } from "@/data/mock-jungle-matchup";
import { useI18n, type Locale } from "@/lib/i18n";

import HeroBanner from "@/components/matchup/HeroBanner";
import RoleSelector from "@/components/matchup/RoleSelector";
import ChampionPicker from "@/components/matchup/ChampionPicker";
import MatchupHeader from "@/components/matchup/MatchupHeader";
import LaneAnalysisView from "@/components/matchup/LaneAnalysisView";
import JungleAnalysisView from "@/components/matchup/JungleAnalysisView";

const langOptions: { value: Locale; flag: string; label: string }[] = [
  { value: "pt", flag: "🇧🇷", label: "PT" },
  { value: "en", flag: "🇺🇸", label: "EN" },
];

const Index = () => {
  const [role, setRole] = useState<Role | null>(null);
  const [ally, setAlly] = useState<Champion | null>(null);
  const [enemy, setEnemy] = useState<Champion | null>(null);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<MatchupPlan | null>(null);
  const { locale, setLocale, t } = useI18n();

  const [debugJson, setDebugJson] = useState("");
  const isDebug = import.meta.env.VITE_APP_DEBUG === "true";

  const canAnalyze = role && ally && enemy;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setPlan(role === "jungle" ? MOCK_JUNGLE_PLAN : MOCK_PLAN);
    setLoading(false);
  };

  const handleDebugLoad = () => {
    try {
      const parsed = JSON.parse(debugJson) as MatchupPlan;
      setPlan(parsed);
    } catch {
      alert("JSON inválido");
    }
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

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-0.5 surface-2 rounded-md p-0.5">
              {langOptions.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setLocale(lang.value)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors ${
                    locale === lang.value
                      ? "bg-brand text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>

            <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider hidden sm:inline">
              {t("header.subtitle")}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {!plan ? (
          <div className="space-y-5">
            <HeroBanner />

            <div className="text-center space-y-1">
              <h1 className="text-lg font-extrabold text-foreground tracking-tight">
                {t("selection.title")}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t("selection.subtitle")}
              </p>
            </div>

            <div className="flex justify-center">
              <RoleSelector selected={role} onSelect={setRole} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ChampionPicker
                label={t("selection.yourChampion")}
                side="ally"
                selected={ally}
                onSelect={setAlly}
                onClear={() => setAlly(null)}
              />
              <ChampionPicker
                label={t("selection.enemyChampion")}
                side="enemy"
                selected={enemy}
                onSelect={setEnemy}
                onClear={() => setEnemy(null)}
              />
            </div>

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
                    {t("selection.analyzing")}
                  </span>
                ) : (
                  t("selection.generatePlan")
                )}
              </button>
            </div>

            {isDebug && (
              <div className="space-y-2 border border-dashed border-muted-foreground/30 rounded-lg p-4">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Debug: Cole o JSON da API
                </label>
                <textarea
                  value={debugJson}
                  onChange={(e) => setDebugJson(e.target.value)}
                  placeholder='{"type": "jungle", ...}'
                  className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  onClick={handleDebugLoad}
                  disabled={!debugJson.trim()}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                    debugJson.trim()
                      ? "bg-caution text-background hover:brightness-110"
                      : "surface-2 text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  Carregar JSON
                </button>
              </div>
            )}
          </div>
        ) : (
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
