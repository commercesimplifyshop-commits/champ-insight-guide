import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { Role, Champion, MatchupPlan } from "@/types/matchup";
import { MOCK_PLAN } from "@/data/mock-matchup";
import { MOCK_JUNGLE_PLAN } from "@/data/mock-jungle-matchup";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { getRecaptchaToken } from "@/lib/recaptcha";
import { isAdsenseConfigured, requestRewardedAd } from "@/lib/adsense";

import HeroBanner from "@/components/matchup/HeroBanner";
import RoleSelector from "@/components/matchup/RoleSelector";
import ChampionPicker from "@/components/matchup/ChampionPicker";
import MatchupHeader from "@/components/matchup/MatchupHeader";
import LaneAnalysisView from "@/components/matchup/LaneAnalysisView";
import JungleAnalysisView from "@/components/matchup/JungleAnalysisView";
import QrCodeSupport from "@/components/monetization/QrCodeSupport";
import AdBanner from "@/components/monetization/AdBanner";
import CounterFinder from "@/components/counterfinder/CounterFinder";
import TeamAnalysis from "@/components/teamanalysis/TeamAnalysis";
import PricingBanner from "@/components/monetization/PricingBanner";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export type AppMode = "matchup" | "counters" | "team";

const Index = () => {
  const [mode, setMode] = useState<AppMode>("matchup");
  const [role, setRole] = useState<Role | null>(null);
  const [ally, setAlly] = useState<Champion | null>(null);
  const [enemy, setEnemy] = useState<Champion | null>(null);
  const [loading, setLoading] = useState(false);
  const [adGateLoading, setAdGateLoading] = useState(false);
  const [plan, setPlan] = useState<MatchupPlan | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimeoutRef = useRef<number | null>(null);
  const { locale, t } = useI18n();
  const { getAccessToken, isPremium } = useAuth();

  useEffect(() => {
    return () => {
      if (noticeTimeoutRef.current) window.clearTimeout(noticeTimeoutRef.current);
    };
  }, []);

  const [debugJson, setDebugJson] = useState("");
  const isDebug = import.meta.env.VITE_APP_DEBUG === "true";

  const canAnalyze = role && ally && enemy;

  const showNotice = (msg: string) => {
    setNotice(msg);
    if (noticeTimeoutRef.current) window.clearTimeout(noticeTimeoutRef.current);
    noticeTimeoutRef.current = window.setTimeout(() => setNotice(null), 12000);
  };

  const runAnalysis = async () => {
    setLoading(true);
    let rawText = '';
    try {
      // Always call the un-prefixed backend proxy to avoid HTTP->HTTPS redirects
      // which may convert POST to GET. The backend exposes /api/openai and
      // also /api/{locale}/openai, but using the un-prefixed route avoids redirect issues.
      const openaiEndpoint = `/api/analyze`;

      // Invisible reCAPTCHA v3 check. Returns null if no site key is configured
      // yet (see src/lib/recaptcha.ts) so this never blocks the flow locally.
      const recaptchaToken = await getRecaptchaToken('analyze_matchup');

      // Send minimal payload: only language and matchup (role + champion ids)
      const prompt = {
        metadata: { language: locale === 'pt' ? 'pt-BR' : 'en-US' },
        matchup: {
          role: role,
          yourChampion: { id: ally?.id || ally?.name || '' },
          enemyChampion: { id: enemy?.id || enemy?.name || '' }
        }
      };

      const accessToken = getAccessToken();
      const res = await fetch(openaiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ prompt, recaptchaToken })
      });

      // Read raw text first to handle cases where the backend returns
      // plain text, an OpenAI-style completion object, or a JSON body.
      rawText = await res.text();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend response shape is intentionally unvalidated here, see extractJsonFromText below
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
        try { return JSON.parse(text); } catch (e) { /* not direct JSON, try next strategy */ }

        // Try to find triple-backtick blocks (``` or ```json)
        const fence = text.match(/```(?:json)?\n?([\s\S]*?)```/i);
        if (fence && fence[1]) {
          const inside = fence[1].trim();
          try { return JSON.parse(inside); } catch (e) { /* fenced block wasn't valid JSON either */ }
        }

        // Try to extract a JSON object or array substring
        const objMatch = text.match(/(\{[\s\S]*\})/);
        if (objMatch) {
          try { return JSON.parse(objMatch[1]); } catch (e) {
            // maybe the JSON contains escaped newlines - try to unescape
            const unescaped = objMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
            try { return JSON.parse(unescaped); } catch (e) { /* give up on object-shaped match */ }
          }
        }

        const arrMatch = text.match(/(\[[\s\S]*\])/);
        if (arrMatch) {
          try { return JSON.parse(arrMatch[1]); } catch (e) { /* give up on array-shaped match */ }
        }

        return null;
      };

      // Try multiple strategies to locate the embedded plan JSON.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- shape depends on which extraction strategy matched above
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- filled in field-by-field with fallback defaults below before being treated as MatchupPlan
      const mappedPlan: any = { ...aiJson };

      mappedPlan.type = mappedPlan.type || (role === 'jungle' ? 'jungle' : 'lane');

      mappedPlan.meta = mappedPlan.meta || {
        allyChampion: ally?.name || ally?.id || '',
        allyChampionId: ally?.id || ally?.name || '',
        allyImage: ally?.image || null,
        enemyChampion: enemy?.name || enemy?.id || '',
        enemyChampionId: enemy?.id || enemy?.name || '',
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- defaults applied above make this a valid MatchupPlan at runtime
      setPlan(mappedPlan as any);
    } catch (err) {
      console.error('Analysis failed', err);
      const errMessage = err instanceof Error ? err.message : undefined;
      // If parsing failed because no JSON found, populate the debug textarea
      // with the raw response so the user can inspect and load it with
      // the existing "Carregar JSON" button.
      const isNoJsonError = typeof errMessage === 'string' && errMessage.includes('Resposta da IA não contém JSON válido');
      if (isNoJsonError && rawText) {
        try { setDebugJson(rawText); } catch (e) { /* debug textarea is best-effort */ }
        console.debug('Raw response loaded into debug textarea:', rawText.slice(0, 1000));
      }

      // show a temporary non-blocking notice below the banner instead of alert()
      showNotice(errMessage || 'Erro ao gerar análise com IA');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Free (non-premium) users watch a short rewarded ad before spending our
   * OpenAI budget on a new analysis — premium users and environments where
   * AdSense isn't configured (local/preview) skip straight to generating.
   */
  const handleGenerateClick = async () => {
    if (!canAnalyze) return;

    if (isPremium || !isAdsenseConfigured()) {
      await runAnalysis();
      return;
    }

    setAdGateLoading(true);
    const outcome = await requestRewardedAd('generate_analysis');
    setAdGateLoading(false);

    if (outcome === 'viewed') {
      await runAnalysis();
    } else {
      showNotice(t('ads.rewardDismissed'));
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
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-5">
        {/* Left sidebar — Ad */}
        <aside className="hidden lg:flex flex-col gap-4 w-[180px] shrink-0 sticky top-20 self-start">
          <AdBanner slot="left" />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-3xl mx-auto space-y-4">
        {!plan ? (
          <div className="space-y-5">
            <PricingBanner mode={mode} />
            <HeroBanner mode={mode} onSelectMode={setMode} />

            {mode === "counters" ? (
              <CounterFinder />
            ) : mode === "team" ? (
              <TeamAnalysis />
            ) : (
              <>
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
                    onClick={handleGenerateClick}
                    disabled={!canAnalyze || loading || adGateLoading}
                    className={`px-8 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${canAnalyze
                      ? "bg-brand text-primary-foreground hover:brightness-110 shadow-brand"
                      : "surface-2 text-muted-foreground cursor-not-allowed"
                      }`}
                  >
                    {adGateLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t("ads.loadingAd")}
                      </span>
                    ) : loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t("selection.analyzing")}
                      </span>
                    ) : (
                      t("selection.generatePlan")
                    )}
                  </button>
                </div>

                {!isPremium && isAdsenseConfigured() && (
                  <p className="text-[10px] text-muted-foreground/70 text-center">
                    {t("ads.rewardHint")}
                  </p>
                )}

                <p className="text-[10px] text-muted-foreground text-center leading-relaxed px-6">
                  {t("selection.recaptchaPrefix")}{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground transition-colors"
                  >
                    {t("selection.privacyPolicy")}
                  </a>{" "}
                  {t("selection.recaptchaMiddle")}{" "}
                  <a
                    href="https://policies.google.com/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-foreground transition-colors"
                  >
                    {t("selection.termsOfService")}
                  </a>{" "}
                  {t("selection.recaptchaSuffix")}
                </p>

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
              </>
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

      <Footer patch={plan?.meta?.patch} />
    </div>
  );
};

export default Index;
