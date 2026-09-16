import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { Role, Champion } from "@/types/matchup";
import type { TeamAnalysisPlan } from "@/types/team-analysis";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import FeatureGate from "@/components/shared/FeatureGate";
import ChampionPicker from "@/components/matchup/ChampionPicker";
import ContentBlock from "@/components/matchup/ContentBlock";

const GOLD = "text-brand border-brand/30";
const NEUTRAL = "text-ink-70 border-white/10";
const DANGER = "text-threat border-threat/30";
const WARN = "text-[#FFC44D] border-[#FFC44D]/30";

const ROLES: { value: Role; label: string }[] = [
  { value: "top", label: "Top" },
  { value: "jungle", label: "Jungle" },
  { value: "mid", label: "Mid" },
  { value: "adc", label: "ADC" },
  { value: "support", label: "Support" },
];

type TeamPicks = Record<Role, Champion | null>;
const emptyTeam = (): TeamPicks => ({ top: null, jungle: null, mid: null, adc: null, support: null });

const TeamRoster = ({
  label,
  side,
  picks,
  onSelect,
}: {
  label: string;
  side: "ally" | "enemy";
  picks: TeamPicks;
  onSelect: (role: Role, champion: Champion | null) => void;
}) => (
  <div className="space-y-2">
    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold text-center">{label}</p>
    {ROLES.map((r) => (
      <ChampionPicker
        key={r.value}
        label={r.label}
        side={side}
        selected={picks[r.value]}
        onSelect={(c) => onSelect(r.value, c)}
        onClear={() => onSelect(r.value, null)}
      />
    ))}
  </div>
);

const TeamAnalysisForm = () => {
  const { t, locale } = useI18n();
  const { getAccessToken } = useAuth();
  const [allyPicks, setAllyPicks] = useState<TeamPicks>(emptyTeam());
  const [enemyPicks, setEnemyPicks] = useState<TeamPicks>(emptyTeam());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TeamAnalysisPlan | null>(null);

  const isComplete = (t: TeamPicks) => ROLES.every((r) => t[r.value] !== null);
  const canAnalyze = isComplete(allyPicks) && isComplete(enemyPicks);

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const res = await fetch("/api/team-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          language: locale === "pt" ? "pt-BR" : "en-US",
          allyTeam: ROLES.map((r) => ({ role: r.value, championId: allyPicks[r.value]!.id })),
          enemyTeam: ROLES.map((r) => ({ role: r.value, championId: enemyPicks[r.value]!.id })),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Erro ao gerar análise (HTTP ${res.status})`);
      }
      setResult(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar análise 5v5");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAllyPicks(emptyTeam());
    setEnemyPicks(emptyTeam());
    setResult(null);
    setError(null);
  };

  if (result) {
    return (
      <div className="space-y-2.5">
        <div className="glass rounded-2xl border border-white/[.07] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-ink-40 font-mono">Patch {result.patch}</p>
            <button onClick={handleReset} className="text-xs text-ink-40 hover:text-ink-70 transition-colors font-medium">
              Nova Análise
            </button>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {result.allyTeam.map((s) => (
              <div key={s.role} className="flex flex-col items-center gap-1">
                {s.championImage && <img src={s.championImage} alt={s.championName} className="w-9 h-9 rounded-[9px] border border-brand/30" />}
                <span className="text-[9px] text-ink-40 uppercase">{s.role}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs font-mono text-ink-40">VS</p>
          <div className="grid grid-cols-5 gap-1.5">
            {result.enemyTeam.map((s) => (
              <div key={s.role} className="flex flex-col items-center gap-1">
                {s.championImage && <img src={s.championImage} alt={s.championName} className="w-9 h-9 rounded-[9px] border border-threat/30" />}
                <span className="text-[9px] text-ink-40 uppercase">{s.role}</span>
              </div>
            ))}
          </div>
        </div>

        <ContentBlock tag={t("team.identity")} tagColorClass={GOLD.split(" ")[0]} tagBorderClass={GOLD.split(" ")[1]} heading={result.identity.compType}>
          <p className="mb-2">{result.identity.summary}</p>
          <p>
            <b className="text-brand">{t("team.winCondition")}:</b> {result.identity.winCondition}
          </p>
        </ContentBlock>

        {result.keyThreats.map((k, i) => (
          <ContentBlock key={i} tag={t("team.threat")} tagColorClass={DANGER.split(" ")[0]} tagBorderClass={DANGER.split(" ")[1]} heading={k.championName}>
            {k.reason}
          </ContentBlock>
        ))}

        <ContentBlock tag="0-6" tagColorClass={DANGER.split(" ")[0]} tagBorderClass={DANGER.split(" ")[1]} heading={result.earlyGame.title}>
          <p className="mb-2">{result.earlyGame.objective}</p>
          <ul className="space-y-1.5">
            {result.earlyGame.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-brand mt-0.5 shrink-0">▸</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </ContentBlock>
        <ContentBlock tag="6-20" tagColorClass={WARN.split(" ")[0]} tagBorderClass={WARN.split(" ")[1]} heading={result.midGame.title}>
          <p className="mb-2">{result.midGame.objective}</p>
          <ul className="space-y-1.5">
            {result.midGame.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-brand mt-0.5 shrink-0">▸</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </ContentBlock>
        <ContentBlock tag="20+" tagColorClass={GOLD.split(" ")[0]} tagBorderClass={GOLD.split(" ")[1]} heading={result.lateGame.title}>
          <p className="mb-2">{result.lateGame.objective}</p>
          <ul className="space-y-1.5">
            {result.lateGame.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-brand mt-0.5 shrink-0">▸</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </ContentBlock>

        <ContentBlock tag={t("team.objectives")} tagColorClass={NEUTRAL.split(" ")[0]} tagBorderClass={NEUTRAL.split(" ")[1]}>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="surface-2 rounded-md p-2">
              <p className="text-[10px] text-ink-40 uppercase mb-1">{t("jungle.dragon")}</p>
              <p className="text-xs font-semibold text-foreground">{result.objectivePriority.dragon}</p>
            </div>
            <div className="surface-2 rounded-md p-2">
              <p className="text-[10px] text-ink-40 uppercase mb-1">{t("team.baron")}</p>
              <p className="text-xs font-semibold text-foreground">{result.objectivePriority.baron}</p>
            </div>
            <div className="surface-2 rounded-md p-2">
              <p className="text-[10px] text-ink-40 uppercase mb-1">{t("jungle.herald")}</p>
              <p className="text-xs font-semibold text-foreground">{result.objectivePriority.herald}</p>
            </div>
          </div>
        </ContentBlock>

        {result.teammateCallouts.map((c, i) => (
          <ContentBlock key={i} tag={c.role.toUpperCase()} tagColorClass={NEUTRAL.split(" ")[0]} tagBorderClass={NEUTRAL.split(" ")[1]} heading={c.championName}>
            {c.advice}
          </ContentBlock>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <h1 className="text-lg font-extrabold text-foreground tracking-tight">Análise 5v5</h1>
        <p className="text-xs text-muted-foreground">Monte os dois times completos e receba uma estratégia de equipe gerada por IA</p>
        {error && (
          <div className="max-w-3xl mx-auto px-4 mt-3">
            <div role="status" className="rounded-md border border-caution bg-caution/10 text-caution px-4 py-2 text-sm shadow-sm">
              {error}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TeamRoster label="Seu Time" side="ally" picks={allyPicks} onSelect={(role, c) => setAllyPicks((p) => ({ ...p, [role]: c }))} />
        <TeamRoster label="Time Inimigo" side="enemy" picks={enemyPicks} onSelect={(role, c) => setEnemyPicks((p) => ({ ...p, [role]: c }))} />
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze || loading}
          className={`px-8 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            canAnalyze ? "bg-brand text-primary-foreground hover:brightness-110 shadow-brand" : "surface-2 text-muted-foreground cursor-not-allowed"
          }`}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Analisando..." : "Analisar Time"}
        </button>
      </div>
    </div>
  );
};

const TeamAnalysis = () => (
  <FeatureGate
    title="Análise 5v5 — Premium"
    description="Monte os dois times completos e receba uma estratégia de equipe gerada por IA: identidade da composição, ameaças, plano por fase e foco individual de cada jogador."
  >
    <TeamAnalysisForm />
  </FeatureGate>
);

export default TeamAnalysis;
