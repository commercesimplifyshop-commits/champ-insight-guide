import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { Role, Champion } from "@/types/matchup";
import type { TeamAnalysisPlan } from "@/types/team-analysis";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import FeatureGate from "@/components/shared/FeatureGate";
import ChampionSheet from "@/components/matchup/ChampionSheet";
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

const initials = (name: string) =>
  name
    .split(/[\s'’]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

/** Compact trigger row (portrait + role + name) that opens the shared
 * ChampionSheet bottom sheet — same pattern as ConfrontoPicker's 1v1 rows,
 * scaled to 10 slots (5 roles x 2 sides) instead of a dropdown-style
 * autocomplete per slot, which doesn't hold up well at that count on mobile. */
const TeamRosterRow = ({
  role,
  side,
  champion,
  onClick,
}: {
  role: { value: Role; label: string };
  side: "ally" | "enemy";
  champion: Champion | null;
  onClick: () => void;
}) => {
  const isAlly = side === "ally";
  const tint = isAlly ? "rgba(245,178,26,.2)" : "rgba(255,110,126,.2)";
  const portraitBg = isAlly
    ? "repeating-linear-gradient(135deg,rgba(255,255,255,.1) 0 5px,rgba(255,255,255,.04) 5px 10px)"
    : "repeating-linear-gradient(135deg,rgba(255,110,126,.14) 0 5px,rgba(255,110,126,.05) 5px 10px)";

  return (
    <button
      onClick={onClick}
      className="glass w-full flex items-center gap-2.5 rounded-[14px] px-3.5 py-2.5 text-left transition-transform active:scale-[.99] border"
      style={{ borderColor: tint }}
    >
      <div
        className="w-9 h-9 rounded-[11px] shrink-0 flex items-center justify-center border overflow-hidden"
        style={{ background: portraitBg, borderColor: tint }}
      >
        {champion?.image ? (
          <img src={champion.image} alt={champion.name} className="w-full h-full object-cover" />
        ) : (
          <span className={`font-mono font-bold text-xs ${isAlly ? "text-brand" : "text-threat"}`}>
            {champion ? initials(champion.name) : "?"}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-mono text-[9px] tracking-[.8px] mb-0.5 ${isAlly ? "text-brand" : "text-threat"}`}>
          {role.label.toUpperCase()}
        </div>
        <div className="font-semibold text-sm truncate">{champion ? champion.name : "Escolher campeão"}</div>
      </div>
      <span className="font-mono text-[10px] text-ink-40 shrink-0">trocar ›</span>
    </button>
  );
};

const TeamRoster = ({
  label,
  side,
  picks,
  onOpenPicker,
}: {
  label: string;
  side: "ally" | "enemy";
  picks: TeamPicks;
  onOpenPicker: (role: Role) => void;
}) => (
  <div className="space-y-2">
    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold text-center">{label}</p>
    {ROLES.map((r) => (
      <TeamRosterRow key={r.value} role={r} side={side} champion={picks[r.value]} onClick={() => onOpenPicker(r.value)} />
    ))}
  </div>
);

const TeamAnalysisForm = () => {
  const { t, locale } = useI18n();
  const { getAccessToken } = useAuth();
  const [allyPicks, setAllyPicks] = useState<TeamPicks>(emptyTeam());
  const [enemyPicks, setEnemyPicks] = useState<TeamPicks>(emptyTeam());
  const [pickerFor, setPickerFor] = useState<{ side: "ally" | "enemy"; role: Role } | null>(null);
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
        <TeamRoster label="Seu Time" side="ally" picks={allyPicks} onOpenPicker={(role) => setPickerFor({ side: "ally", role })} />
        <TeamRoster label="Time Inimigo" side="enemy" picks={enemyPicks} onOpenPicker={(role) => setPickerFor({ side: "enemy", role })} />
      </div>

      <ChampionSheet
        open={pickerFor !== null}
        label={pickerFor ? `${pickerFor.side === "ally" ? "Seu Time" : "Time Inimigo"} · ${ROLES.find((r) => r.value === pickerFor.role)?.label ?? ""}` : ""}
        selected={pickerFor ? (pickerFor.side === "ally" ? allyPicks : enemyPicks)[pickerFor.role] : null}
        onClose={() => setPickerFor(null)}
        onSelect={(c) => {
          if (!pickerFor) return;
          const setPicks = pickerFor.side === "ally" ? setAllyPicks : setEnemyPicks;
          setPicks((p) => ({ ...p, [pickerFor.role]: c }));
        }}
      />

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
