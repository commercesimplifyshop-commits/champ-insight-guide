import { useState, useRef, useEffect } from "react";
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
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimeoutRef = useRef<number | null>(null);
  const { locale, setLocale, t } = useI18n();

  useEffect(() => {
    return () => {
      if (noticeTimeoutRef.current) window.clearTimeout(noticeTimeoutRef.current);
    };
  }, []);

  const canAnalyze = role && ally && enemy;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setLoading(true);
    try {
      // Always call the un-prefixed backend proxy to avoid HTTP->HTTPS redirects
      // which may convert POST to GET. The backend exposes /api/openai and
      // also /api/{locale}/openai, but using the un-prefixed route avoids redirect issues.
      const openaiEndpoint = `/api/openai`;

      // Send minimal payload: only language and matchup (role + champion ids)
      const prompt = {
        metadata: { language: locale === 'pt' ? 'pt-BR' : 'en-US' },
        matchup: {
          role: role,
          yourChampion: { id: ally?.id || ally?.name || '' },
          enemyChampion: { id: enemy?.id || enemy?.name || '' }
        }
      };

      const res = await fetch(openaiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`OpenAI proxy error: ${res.status} ${txt}`);
      }

      const body = await res.json();

      const aiJson = body.json || (() => {
        try {
          const content = body.content || (body.raw && body.raw.choices?.[0]?.message?.content) || '';
          const m = (content || '').match(/(\{[\s\S]*\})/);
          return m ? JSON.parse(m[1]) : null;
        } catch (e) {
          return null;
        }
      })();

      // Validate AI JSON against minimal required contract to avoid runtime crashes
      const validateAiJson = (json: any, roleType: string) => {
        const errors: string[] = [];
        if (!json || typeof json !== 'object') {
          errors.push('Resposta não é um objeto JSON.');
          return errors;
        }

        const expectedType = roleType === 'jungle' ? 'jungle' : 'lane';
        if (json.type && json.type !== expectedType) {
          errors.push(`Campo 'type' inesperado: recebeu '${json.type}', esperado '${expectedType}'.`);
        }

        const earlyLevel = json.overview?.earlyAdvantage?.level;
        const allowedEarly = ['strong', 'slight', 'even', 'slight_disadvantage', 'hard'];
        if (!earlyLevel || !allowedEarly.includes(earlyLevel)) {
          errors.push("overview.earlyAdvantage.level inválido ou faltando. Deve ser um de: " + allowedEarly.join(', '));
        }

        const powerSpikes = Array.isArray(json.powerSpikes) ? json.powerSpikes : [];
        if (powerSpikes.length < 4 || powerSpikes.length > 6) {
          errors.push('powerSpikes deve ter entre 4 e 6 itens.');
        } else {
          const allowedAdv = ['ally', 'enemy', 'even'];
          powerSpikes.forEach((ps: any, i: number) => {
            if (!allowedAdv.includes(ps?.advantage)) errors.push(`powerSpikes[${i}].advantage inválido: ${ps?.advantage}`);
          });
        }

        const mistakes = Array.isArray(json.mistakes) ? json.mistakes : [];
        if (mistakes.length < 4 || mistakes.length > 6) {
          errors.push('mistakes deve ter entre 4 e 6 itens.');
        } else {
          const allowedSev = ['critical', 'warning', 'minor'];
          mistakes.forEach((m: any, i: number) => {
            if (!allowedSev.includes(m?.severity)) errors.push(`mistakes[${i}].severity inválido: ${m?.severity}`);
          });
        }

        if (expectedType === 'jungle') {
          const required = ['clearPath', 'gankingStrategy', 'objectiveControl', 'counterJungling'];
          required.forEach((k) => { if (!json[k]) errors.push(`Campo obrigatório para jungle faltando: ${k}`); });
          const counterRisk = json.counterJungling?.riskLevel;
          if (counterRisk && !['low', 'medium', 'high'].includes(counterRisk)) errors.push('counterJungling.riskLevel deve ser low | medium | high');
        } else {
          const required = ['earlyGame', 'jungleControl'];
          required.forEach((k) => { if (!json[k]) errors.push(`Campo obrigatório para lane faltando: ${k}`); });
        }

        return errors;
      };

      if (!aiJson) throw new Error('Resposta da IA não contém JSON válido. Conteúdo bruto: ' + JSON.stringify(body));

      // run validation and fail early with descriptive message so UI doesn't render broken data
      const validationErrors = validateAiJson(aiJson, role === 'jungle' ? 'jungle' : 'lane');
      if (validationErrors.length) {
        console.error('AI response failed validation', { validationErrors, body, aiJson });
        throw new Error('Resposta da IA não segue o contrato esperado: ' + validationErrors.join('; '));
      }

      // Map AI JSON to front-end MatchupPlan shape
      const mappedPlan: any = {
        type: role === 'jungle' ? 'jungle' : 'lane',
        meta: {
          allyChampion: ally?.name || ally?.id || '',
          allyImage: ally?.image || null,
          enemyChampion: enemy?.name || enemy?.id || '',
          enemyImage: enemy?.image || null,
          role: role,
          difficulty: aiJson.overview && aiJson.overview.earlyAdvantage && aiJson.overview.earlyAdvantage.level ? aiJson.overview.earlyAdvantage.level : undefined,
          winRate: null,
          patch: (aiJson.metadata && aiJson.metadata.patch) || null,
        },
      };

      // copy common sections (defensive)
      if (aiJson.overview) mappedPlan.overview = aiJson.overview;
      if (aiJson.earlyGame) mappedPlan.earlyGame = aiJson.earlyGame;
      if (aiJson.clearPath) mappedPlan.earlyGame = mappedPlan.earlyGame || { title: 'Early Game', objective: '', bullets: [] };
      if (aiJson.jungleControl) mappedPlan.jungleControl = aiJson.jungleControl;
      if (aiJson.powerSpikes) mappedPlan.powerSpikes = aiJson.powerSpikes;
      if (aiJson.midGame) mappedPlan.midGame = aiJson.midGame;
      if (aiJson.lateGame) mappedPlan.lateGame = aiJson.lateGame;
      if (aiJson.itemization) mappedPlan.itemization = aiJson.itemization;
      if (aiJson.itemizationPlan) mappedPlan.itemization = mappedPlan.itemization || aiJson.itemizationPlan;
      if (aiJson.mistakes) mappedPlan.mistakes = aiJson.mistakes;
      if (aiJson.mistakesThatLoseTheGame) mappedPlan.mistakes = mappedPlan.mistakes || aiJson.mistakesThatLoseTheGame;

      // fallback: if prompt returned top-level keys that differ, try to pick known names
      // ensure required keys exist for the UI components
      mappedPlan.overview = mappedPlan.overview || { earlyAdvantage: { level: 'even', summary: '' }, primaryPlan: '', biggestThreat: '', firstDecisionFocus: '' };
      mappedPlan.earlyGame = mappedPlan.earlyGame || { title: 'Early Game', objective: '', bullets: [] };
      mappedPlan.midGame = mappedPlan.midGame || { title: 'Mid Game', objective: '', bullets: [] };
      mappedPlan.lateGame = mappedPlan.lateGame || { title: 'Late Game', objective: '', bullets: [] };
      mappedPlan.itemization = mappedPlan.itemization || { coreBuild: [], situational: [], runeNote: '' };
      mappedPlan.powerSpikes = Array.isArray(mappedPlan.powerSpikes) ? mappedPlan.powerSpikes : [];
      mappedPlan.mistakes = Array.isArray(mappedPlan.mistakes) ? mappedPlan.mistakes : [];

      setPlan(mappedPlan as any);
    } catch (err: any) {
      console.error('Analysis failed', err);
      // show a temporary non-blocking notice below the banner instead of alert()
      const msg = err?.message || 'Erro ao gerar análise com IA';
      setNotice(msg);
      if (noticeTimeoutRef.current) window.clearTimeout(noticeTimeoutRef.current);
      noticeTimeoutRef.current = window.setTimeout(() => setNotice(null), 6000);
    } finally {
      setLoading(false);
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
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors ${locale === lang.value
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
              {notice && (
                <div className="max-w-3xl mx-auto px-4 mt-3">
                  <div role="status" className="rounded-md border border-yellow-200 bg-yellow-50 text-yellow-900 px-4 py-2 text-sm shadow-sm">
                    {notice}
                  </div>
                </div>
              )}
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
                className={`px-8 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${canAnalyze
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
