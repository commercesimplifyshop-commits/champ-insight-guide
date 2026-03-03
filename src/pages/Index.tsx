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
import QrCodeSupport from "@/components/monetization/QrCodeSupport";
import AdBanner from "@/components/monetization/AdBanner";

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

  const [debugJson, setDebugJson] = useState("");
  const isDebug = import.meta.env.VITE_APP_DEBUG === "true";

  const canAnalyze = role && ally && enemy;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setLoading(true);
    let rawText = '';
    try {
      // Always call the un-prefixed backend proxy to avoid HTTP->HTTPS redirects
      // which may convert POST to GET. The backend exposes /api/openai and
      // also /api/{locale}/openai, but using the un-prefixed route avoids redirect issues.
      const openaiEndpoint = `/api/analyze`;

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

      // Read raw text first to handle cases where the backend returns
      // plain text, an OpenAI-style completion object, or a JSON body.
      rawText = await res.text();
      let body: any = null;
      try {
        body = JSON.parse(rawText);
      } catch (e) {
        // not valid JSON — treat the whole response as plain content
        body = rawText;
      }

      // Utility: try to extract JSON from a text string. Handles:
      // - direct JSON
      // - JSON inside markdown code fences (```json ... ```)
      // - first {...} or [...] substring
      // - unescaped JSON inside text
      const extractJsonFromText = (text: string) => {
        if (!text) return null;
        // Try direct parse
        try { return JSON.parse(text); } catch (e) { }

        // Try to find triple-backtick blocks (``` or ```json)
        const fence = text.match(/```(?:json)?\n?([\s\S]*?)```/i);
        if (fence && fence[1]) {
          const inside = fence[1].trim();
          try { return JSON.parse(inside); } catch (e) { }
        }

        // Try to extract a JSON object or array substring
        const objMatch = text.match(/(\{[\s\S]*\})/);
        if (objMatch) {
          try { return JSON.parse(objMatch[1]); } catch (e) {
            // maybe the JSON contains escaped newlines - try to unescape
            const unescaped = objMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
            try { return JSON.parse(unescaped); } catch (e) { }
          }
        }

        const arrMatch = text.match(/(\[[\s\S]*\])/);
        if (arrMatch) {
          try { return JSON.parse(arrMatch[1]); } catch (e) { }
        }

        return null;
      };

      // Try multiple strategies to locate the embedded plan JSON.
      let aiJson: any = null;

      if (Array.isArray(body)) {
        // Backend returned a top-level array — try to find a plan-like object
        for (const el of body) {
          if (el && typeof el === 'object') {
            if (el.json && typeof el.json === 'object') {
              aiJson = el.json;
              break;
            }
            if (el.type && (el.type === 'jungle' || el.type === 'lane' || typeof el.type === 'string')) {
              aiJson = el;
              break;
            }
          }
        }
        // If still not found, try extracting JSON from the stringified array
        if (!aiJson) aiJson = extractJsonFromText(JSON.stringify(body));
      } else if (body && typeof body === 'object' && !Array.isArray(body)) {
        if (body.json && typeof body.json === 'object') {
          aiJson = body.json;
        } else if (body.type && (body.type === 'jungle' || body.type === 'lane' || typeof body.type === 'string')) {
          // Backend returned the plan directly
          aiJson = body;
        } else {
          const contentCandidates = [
            body.content,
            body.raw && body.raw.choices?.[0]?.message?.content,
            body.choices?.[0]?.message?.content,
            body.choices?.[0]?.text,
            JSON.stringify(body),
          ];

          for (const c of contentCandidates) {
            const found = extractJsonFromText(c || '');
            if (found) { aiJson = found; break; }
          }
        }
      } else if (typeof body === 'string') {
        aiJson = extractJsonFromText(body);
      }

      if (!aiJson) {
        const preview = typeof body === 'string' ? body.slice(0, 200) : JSON.stringify(body, null, 2).slice(0, 200);
        throw new Error('Resposta da IA não contém JSON válido. Conteúdo bruto: ' + preview);
      }

      // Map the API JSON to the front-end MatchupPlan shape, but do not enforce
      // rigid array lengths or enum checks. Use defensive defaults similar to the
      // manual JSON loader so the UI can render whatever reasonable content the
      // AI returned.
      const mappedPlan: any = { ...aiJson };

      mappedPlan.type = mappedPlan.type || (role === 'jungle' ? 'jungle' : 'lane');

      mappedPlan.meta = mappedPlan.meta || {
        allyChampion: ally?.name || ally?.id || '',
        allyImage: ally?.image || null,
        enemyChampion: enemy?.name || enemy?.id || '',
        enemyImage: enemy?.image || null,
        role: role,
        difficulty: mappedPlan.overview?.earlyAdvantage?.level || undefined,
        winRate: null,
        patch: (mappedPlan.metadata && mappedPlan.metadata.patch) || null,
      };

      // Ensure common sections exist so UI components won't crash; keep arrays as-is
      // if provided by the API, otherwise provide simple empty defaults.
      mappedPlan.overview = mappedPlan.overview || { earlyAdvantage: { level: 'even', summary: '' }, primaryPlan: '', biggestThreat: '', firstDecisionFocus: '' };
      mappedPlan.earlyGame = mappedPlan.earlyGame || mappedPlan.clearPath || { title: 'Early Game', objective: '', bullets: [] };
      if (mappedPlan.clearPath && !mappedPlan.earlyGame) mappedPlan.earlyGame = mappedPlan.clearPath;
      mappedPlan.jungleControl = mappedPlan.jungleControl || mappedPlan.objectiveControl || null;
      mappedPlan.midGame = mappedPlan.midGame || { title: 'Mid Game', objective: '', bullets: [] };
      mappedPlan.lateGame = mappedPlan.lateGame || { title: 'Late Game', objective: '', bullets: [] };
      mappedPlan.itemization = mappedPlan.itemization || mappedPlan.itemizationPlan || { coreBuild: [], situational: [], runeNote: '' };
      mappedPlan.powerSpikes = Array.isArray(mappedPlan.powerSpikes) ? mappedPlan.powerSpikes : [];
      mappedPlan.mistakes = Array.isArray(mappedPlan.mistakes) ? mappedPlan.mistakes : [];

      setPlan(mappedPlan as any);
    } catch (err: any) {
      console.error('Analysis failed', err);
      // If parsing failed because no JSON found, populate the debug textarea
      // with the raw response so the user can inspect and load it with
      // the existing "Carregar JSON" button.
      const isNoJsonError = typeof err?.message === 'string' && err.message.includes('Resposta da IA não contém JSON válido');
      if (isNoJsonError && rawText) {
        try { setDebugJson(rawText); } catch (_) { }
        console.debug('Raw response loaded into debug textarea:', rawText.slice(0, 1000));
      }

      // show a temporary non-blocking notice below the banner instead of alert()
      const msg = err?.message || 'Erro ao gerar análise com IA';
      setNotice(msg);
      if (noticeTimeoutRef.current) window.clearTimeout(noticeTimeoutRef.current);
      noticeTimeoutRef.current = window.setTimeout(() => setNotice(null), 12000);
    } finally {
      setLoading(false);
    }
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

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-5">
        {/* Left sidebar — Ad */}
        <aside className="hidden lg:flex flex-col gap-4 w-[180px] shrink-0 sticky top-20 self-start">
          <AdBanner slot="left" />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-3xl mx-auto space-y-4">
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
                  <div role="status" className="rounded-md border border-caution bg-caution/10 text-caution px-4 py-2 text-sm shadow-sm">
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
                  className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${debugJson.trim()
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

            {/* Bottom ad — below analysis */}
            <AdBanner slot="bottom" />
          </div>
        )}
      </main>

        {/* Right sidebar — QR Code + Ad */}
        <aside className="hidden lg:flex flex-col gap-4 w-[200px] shrink-0 sticky top-20 self-start">
          <QrCodeSupport />
          <AdBanner slot="right" />
        </aside>
      </div>
    </div>
  );
};

export default Index;
