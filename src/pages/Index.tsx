import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Loader2 } from "lucide-react";
import ChampionSelector from "@/components/ChampionSelector";
import AnalysisDashboard from "@/components/AnalysisDashboard";
import { Champion, MOCK_ANALYSIS } from "@/data/champions";

const Index = () => {
  const [ally, setAlly] = useState<Champion | null>(null);
  const [enemy, setEnemy] = useState<Champion | null>(null);
  const [analysis, setAnalysis] = useState<typeof MOCK_ANALYSIS | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!ally || !enemy) return;
    setLoading(true);
    // Simulate API call + AI analysis
    await new Promise((r) => setTimeout(r, 1500));
    setAnalysis(MOCK_ANALYSIS);
    setLoading(false);
  };

  const handleReset = () => {
    setAlly(null);
    setEnemy(null);
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface-1">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-6 h-6 text-gold" />
            <h1 className="font-display text-2xl text-gold tracking-wider">
              LOL MATCHUP GUIDE
            </h1>
          </div>
          {analysis && (
            <button
              onClick={handleReset}
              className="text-xs font-body font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
            >
              Nova Análise
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {!analysis ? (
            <motion.div
              key="selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Champion Selection */}
              <div className="text-center mb-8">
                <h2 className="font-display text-4xl text-foreground mb-2">SELECIONE OS CAMPEÕES</h2>
                <p className="text-sm text-muted-foreground font-body">
                  Escolha seu campeão e o campeão inimigo para receber uma análise completa do matchup
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChampionSelector
                  label="Seu Campeão"
                  side="ally"
                  selected={ally}
                  onSelect={setAlly}
                  onClear={() => setAlly(null)}
                />
                <ChampionSelector
                  label="Campeão Inimigo"
                  side="enemy"
                  selected={enemy}
                  onSelect={setEnemy}
                  onClear={() => setEnemy(null)}
                />
              </div>

              {/* Analyze Button */}
              <div className="flex justify-center pt-4">
                <motion.button
                  whileHover={ally && enemy ? { scale: 1.03 } : {}}
                  whileTap={ally && enemy ? { scale: 0.97 } : {}}
                  onClick={handleAnalyze}
                  disabled={!ally || !enemy || loading}
                  className={`font-display text-xl tracking-wider px-10 py-3 rounded-lg transition-all ${
                    ally && enemy
                      ? "gradient-gold text-primary-foreground shadow-gold cursor-pointer"
                      : "bg-secondary text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      ANALISANDO...
                    </span>
                  ) : (
                    "ANALISAR MATCHUP"
                  )}
                </motion.button>
              </div>

              {/* VS Preview */}
              {ally && enemy && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-6 pt-4"
                >
                  <div className="flex items-center gap-3">
                    <img src={ally.image} alt={ally.name} className="w-14 h-14 rounded-lg border-2 border-info" />
                    <span className="font-display text-xl text-foreground">{ally.name}</span>
                  </div>
                  <span className="font-display text-3xl text-gold">VS</span>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-xl text-foreground">{enemy.name}</span>
                    <img src={enemy.image} alt={enemy.name} className="w-14 h-14 rounded-lg border-2 border-danger" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Matchup Header */}
              <div className="flex items-center justify-center gap-4 mb-6 py-2">
                <div className="flex items-center gap-2">
                  <img src={ally!.image} alt={ally!.name} className="w-12 h-12 rounded-lg border-2 border-info" />
                  <span className="font-display text-2xl text-foreground">{ally!.name}</span>
                </div>
                <span className="font-display text-2xl text-gold">VS</span>
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl text-foreground">{enemy!.name}</span>
                  <img src={enemy!.image} alt={enemy!.name} className="w-12 h-12 rounded-lg border-2 border-danger" />
                </div>
              </div>

              <AnalysisDashboard
                analysis={analysis}
                allyName={ally!.name}
                enemyName={enemy!.name}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
