import { motion } from "framer-motion";
import { MatchupAnalysis } from "@/data/champions";
import { AlertTriangle, Shield, Zap, Swords, CheckCircle2, XCircle, Target, TrendingUp } from "lucide-react";

interface AnalysisDashboardProps {
  analysis: MatchupAnalysis;
  allyName: string;
  enemyName: string;
}

const threatColors = {
  low: { bg: "bg-success-subtle", text: "text-success", label: "BAIXA" },
  medium: { bg: "bg-warning-subtle", text: "text-warning", label: "MÉDIA" },
  high: { bg: "bg-danger-subtle", text: "text-danger", label: "ALTA" },
  extreme: { bg: "bg-danger-subtle", text: "text-danger", label: "EXTREMA" },
};

const advantageColors = {
  you: "text-success",
  enemy: "text-danger",
  even: "text-warning",
};

const advantageLabels = {
  you: "Vantagem Sua",
  enemy: "Vantagem Inimiga",
  even: "Equilibrado",
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const AnalysisDashboard = ({ analysis, allyName, enemyName }: AnalysisDashboardProps) => {
  const threat = threatColors[analysis.threatLevel];

  return (
    <div className="space-y-4">
      {/* Header - Threat Level */}
      <motion.div
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={`${threat.bg} border border-border rounded-lg p-4`}
      >
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className={`w-6 h-6 ${threat.text}`} />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-body font-semibold">
              Nível de Ameaça
            </p>
            <h2 className={`font-display text-3xl ${threat.text}`}>{threat.label}</h2>
          </div>
        </div>
        <p className="text-sm text-foreground/80 font-body leading-relaxed">
          {analysis.summary}
        </p>
      </motion.div>

      {/* Key Tips - Most important, highlighted */}
      <motion.div
        custom={1}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="gradient-card border border-primary/30 rounded-lg p-4 shadow-gold"
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-gold" />
          <h3 className="font-display text-xl text-gold">DICAS ESSENCIAIS</h3>
        </div>
        <ul className="space-y-2">
          {analysis.keyTips.map((tip, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-2"
            >
              <span className="text-gold font-bold text-sm mt-0.5">▸</span>
              <span className="text-sm text-foreground font-body font-medium">{tip}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Power Spikes */}
      <motion.div
        custom={2}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="gradient-card border border-border rounded-lg p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-info" />
          <h3 className="font-display text-xl text-info">POWER SPIKES</h3>
        </div>
        <div className="space-y-2">
          {analysis.powerSpikes.map((spike, i) => (
            <div key={i} className="flex items-center gap-3 bg-secondary/50 rounded-md px-3 py-2">
              <span className="text-xs font-body font-bold text-muted-foreground w-20 shrink-0">
                {spike.phase}
              </span>
              <span className={`text-xs font-body font-bold w-28 shrink-0 ${advantageColors[spike.advantage]}`}>
                {advantageLabels[spike.advantage]}
              </span>
              <span className="text-xs text-foreground/70 font-body">{spike.description}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Do / Don't columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          custom={3}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-success-subtle border border-border rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <h3 className="font-display text-lg text-success">FAÇA</h3>
          </div>
          <ul className="space-y-2">
            {analysis.doList.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-success text-sm">✓</span>
                <span className="text-sm text-foreground/80 font-body">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          custom={4}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-danger-subtle border border-border rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-5 h-5 text-danger" />
            <h3 className="font-display text-lg text-danger">NÃO FAÇA</h3>
          </div>
          <ul className="space-y-2">
            {analysis.dontList.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-danger text-sm">✗</span>
                <span className="text-sm text-foreground/80 font-body">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Items Build */}
      <motion.div
        custom={5}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="gradient-card border border-border rounded-lg p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-gold-light" />
          <h3 className="font-display text-xl text-gold-light">BUILD RECOMENDADA</h3>
        </div>
        <div className="space-y-2">
          {analysis.itemBuild.map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-secondary/50 rounded-md px-3 py-2">
              <Swords className="w-4 h-4 text-gold shrink-0" />
              <div>
                <span className="text-sm font-body font-semibold text-foreground">{item.name}</span>
                <span className="text-xs text-muted-foreground font-body ml-2">— {item.reason}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 bg-secondary/30 rounded-md px-3 py-2">
          <span className="text-xs text-muted-foreground font-body font-semibold">RUNAS:</span>
          <span className="text-xs text-foreground/70 font-body">{analysis.runes}</span>
        </div>
      </motion.div>

      {/* Win Condition */}
      <motion.div
        custom={6}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="gradient-card border border-primary/20 rounded-lg p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-gold" />
          <h3 className="font-display text-xl text-gold">CONDIÇÃO DE VITÓRIA</h3>
        </div>
        <p className="text-sm text-foreground/80 font-body leading-relaxed">
          {analysis.winCondition}
        </p>
      </motion.div>
    </div>
  );
};

export default AnalysisDashboard;
