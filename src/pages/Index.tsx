import { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import type { Role, Champion, MatchupPlan, PlayStyle, MacroStyle } from "@/types/matchup";
import type { HistoryItem } from "@/types/history";
import { MOCK_PLAN } from "@/data/mock-matchup";
import { MOCK_JUNGLE_PLAN } from "@/data/mock-jungle-matchup";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { getRecaptchaToken } from "@/lib/recaptcha";
import { isAdsenseConfigured, requestRewardedAd } from "@/lib/adsense";
import { recommendStyles } from "@/lib/playstyleRecommendation";

import RoleSelector from "@/components/matchup/RoleSelector";
import PlaystyleSelector from "@/components/matchup/PlaystyleSelector";
import MacroStyleSelector from "@/components/matchup/MacroStyleSelector";
import ConfrontoPicker from "@/components/matchup/ConfrontoPicker";
import MatchupHeader from "@/components/matchup/MatchupHeader";
import LaneAnalysisView from "@/components/matchup/LaneAnalysisView";
import JungleAnalysisView from "@/components/matchup/JungleAnalysisView";
import AdBanner from "@/components/monetization/AdBanner";
import CounterFinder from "@/components/counterfinder/CounterFinder";
import TeamAnalysis from "@/components/teamanalysis/TeamAnalysis";
import PricingBanner from "@/components/monetization/PricingBanner";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import NavStrip, { type NavStripItem } from "@/components/layout/NavStrip";

export type AppMode = "matchup" | "counters" | "team";

const VALID_MODES: AppMode[] = ["matchup", "counters", "team"];

const Index = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode");
  const [mode, setMode] = useState<AppMode>(
    VALID_MODES.includes(initialMode as AppMode) ? (initialMode as AppMode) : "matchup",
  );
  const [role, setRole] = useState<Role | null>(null);
  const [ally, setAlly] = useState<Champion | null>(null);
  const [enemy, setEnemy] = useState<Champion | null>(null);
  const [playstyle, setPlaystyle] = useState<PlayStyle | null>(null);
  const [macroStyle, setMacroStyle] = useState<MacroStyle | null>(null);
  const [loading, setLoading] = useState(false);
  const [adGateLoading, setAdGateLoading] = useState(false);
  const [plan, setPlan] = useState<MatchupPlan | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimeoutRef = useRef<number | null>(null);
  const [rewardAdEnabled, setRewardAdEnabled] = useState(false);
  const [recents, setRecents] = useState<HistoryItem[] | null>(null);
  const { locale, t } = useI18n();
  const { user, getAccessToken, isPremium } = useAuth();

  useEffect(() => {
    return () => {
      if (noticeTimeoutRef.current) window.clearTimeout(noticeTimeoutRef.current);
    };
  }, []);

  // "RECENTES" on the home form — only real data: premium users' saved
  // analyses. No fabricated winrate (the API never computes one).
  useEffect(() => {
    if (!user || !isPremium) {
      setRecents(null);
      return;
    }
    const token = getAccessToken();
    if (!token) return;
    fetch("/api/history", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: HistoryItem[]) => setRecents(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => setRecents([]));
  }, [user, isPremium, getAccessToken]);

  useEffect(() => {
    fetch("/api/settings/reward-ad")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setRewardAdEnabled(Boolean(data?.enabled)))
      .catch(() => setRewardAdEnabled(false));
  }, []);

  const [debugJson, setDebugJson] = useState("");
  const isDebug = import.meta.env.VITE_APP_DEBUG === "true";

  const canAnalyze = role && ally && enemy && playstyle && macroStyle;

  const handleSelectAlly = (champion: Champion | null) => {
    setAlly(champion);
    if (champion) {
      const recommended = recommendStyles(role, champion.role);
      setPlaystyle(recommended.temperament);
      setMacroStyle(recommended.macroStyle);
    } else {
      setPlaystyle(null);
      setMacroStyle(null);
    }
  };

  const handleSelectRole = (newRole: Role) => {
    setRole(newRole);
    // Role affects the recommendation (e.g. jungle/support override champion
    // class) — recompute if a champion is already picked instead of leaving
    // a stale suggestion from the previous role.
    if (ally) {
      const recommended = recommendStyles(newRole, ally.role);
      setPlaystyle(recommended.temperament);
      setMacroStyle(recommended.macroStyle);
    }
  };

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
          enemyChampion: { id: enemy?.id || enemy?.name || '' },
          playstyle: playstyle,
          macroStyle: macroStyle
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

    if (isPremium || !isAdsenseConfigured() || !rewardAdEnabled) {
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
    setPlaystyle(null);
    setMacroStyle(null);
    setPlan(null);
  };

  const navItems: NavStripItem[] = [
    { key: "matchup", label: t("nav.matchup"), active: mode === "matchup", onClick: () => setMode("matchup") },
    { key: "draft", label: t("nav.draft"), active: mode === "team", onClick: () => setMode("team") },
    { key: "coach", label: t("nav.coach"), badge: "PRO", active: false, to: "/coach" },
    { key: "perfil", label: t("nav.profile"), active: false, to: "/account" },
  ];

  return (
    <div className="min-h-screen app-bg">
      <Header onLogoClick={handleReset} />
      {!plan && <NavStrip items={navItems} />}

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-5">
        {/* Left sidebar — Ad. Same width as the right sidebar so the main
            content column stays truly centered under the header. */}
        <aside className="hidden lg:flex flex-col items-center gap-4 w-[320px] shrink-0 sticky top-20 self-start">
          <AdBanner slot="left" />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-3xl mx-auto space-y-4">
        {!plan ? (
          <div className="space-y-5">
            <PricingBanner mode={mode} />

            {mode === "counters" ? (
              <CounterFinder />
            ) : mode === "team" ? (
              <TeamAnalysis />
            ) : (
              <>
                <div className="space-y-1">
                  <h1 className="font-semibold text-[25px] leading-[1.15] tracking-[-.7px]">
                    {t("selection.title")}
                  </h1>
                  <p className="text-[13px] text-ink-50">{t("selection.subtitle")}</p>
                  {notice && (
                    <div className="pt-3">
                      <div role="status" className="rounded-md border border-caution bg-caution/10 text-caution px-4 py-2 text-sm shadow-sm">
                        {notice}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3.5">
                  <p className="font-mono text-[9.5px] tracking-[.9px] text-ink-40 uppercase">
                    {t("form.step1Label")}
                  </p>
                  <ConfrontoPicker
                    ally={ally}
                    enemy={enemy}
                    onSelectAlly={handleSelectAlly}
                    onSelectEnemy={setEnemy}
                  />
                </div>

                <div className="space-y-3">
                  <p className="font-mono text-[9.5px] tracking-[.9px] text-ink-40 uppercase">
                    {t("form.step2Label")}
                  </p>
                  <RoleSelector selected={role} onSelect={handleSelectRole} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[9.5px] tracking-[.9px] text-ink-40 uppercase">
                      {t("form.step3Label")}
                    </span>
                    <span className="text-[10.5px] text-ink-40">{t("form.step3Hint")}</span>
                  </div>
                  <PlaystyleSelector selected={playstyle} onSelect={setPlaystyle} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-mono text-[9.5px] tracking-[.9px] text-ink-40 uppercase">
                      {t("form.step4Label")}
                    </span>
                    {ally && (
                      <span className="text-[10.5px] text-ink-40">
                        {t("form.step4HintPrefix")} {ally.name} {t("form.step4HintSuffix")}
                      </span>
                    )}
                  </div>
                  <MacroStyleSelector selected={macroStyle} onSelect={setMacroStyle} />
                </div>

                <div
                  className="sticky bottom-0 z-30 pt-3 pb-3.5"
                  style={{
                    background: "linear-gradient(180deg, rgba(10,11,14,0) 0%, rgba(10,11,14,.82) 38%, rgba(10,11,14,.96) 100%)",
                    backdropFilter: "blur(14px)",
                    paddingBottom: "calc(14px + env(safe-area-inset-bottom))",
                  }}
                >
                  <button
                    onClick={handleGenerateClick}
                    disabled={!canAnalyze || loading || adGateLoading}
                    className={`w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-bold text-base tracking-[-.2px] transition-transform active:scale-[.99] ${
                      canAnalyze ? "shadow-brand" : "bg-white/[.06] text-ink-40 cursor-not-allowed"
                    }`}
                    style={canAnalyze ? { background: "linear-gradient(180deg,#FFC94A,#F5B21A)", color: "var(--on-accent)" } : undefined}
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
                      <>
                        {t("selection.generatePlan")}
                        <span className="font-mono text-xs opacity-60">IA</span>
                      </>
                    )}
                  </button>

                  {!isPremium && isAdsenseConfigured() && rewardAdEnabled && (
                    <p className="text-[10px] text-ink-40 text-center mt-2">{t("ads.rewardHint")}</p>
                  )}

                  {(role || playstyle || macroStyle) && (
                    <div className="flex items-center justify-center gap-2 mt-2 font-mono text-[11px] flex-wrap">
                      {!isPremium && (
                        <Link to="/pricing#demo" className="text-ink-40 hover:text-ink-70 transition-colors underline">
                          {t("premium.seeExample")}
                        </Link>
                      )}
                      <span className="text-brand/75">
                        {[role, playstyle, macroStyle]
                          .filter(Boolean)
                          .map((v, i) => {
                            const key =
                              i === 0
                                ? (`role.${v}` as TranslationKey)
                                : i === 1
                                  ? (`playstyle.${v}` as TranslationKey)
                                  : (`macrostyle.${v}` as TranslationKey);
                            return `· ${t(key)}`;
                          })
                          .join(" ")}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-ink-40 text-center leading-relaxed px-6">
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

                {isPremium && recents && recents.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-[.9px] text-ink-40 uppercase">
                        {t("recents.title")}
                      </span>
                      <Link to="/account" className="text-[11.5px] text-brand">
                        {t("recents.seeAll")}
                      </Link>
                    </div>
                    <div className="flex flex-col gap-2">
                      {recents.map((r) => {
                        const meta = r.plan?.meta;
                        return (
                          <button
                            key={r.id}
                            onClick={() => setPlan(r.plan)}
                            className="glass w-full flex items-center gap-3 rounded-[14px] border border-white/[.06] px-3.5 py-3 text-left"
                          >
                            <div className="flex items-center shrink-0">
                              <div className="w-8 h-8 rounded-[9px] overflow-hidden border border-white/10">
                                {meta?.allyImage && <img src={meta.allyImage} alt={r.ally_champion_name} className="w-full h-full object-cover" />}
                              </div>
                              <div className="w-8 h-8 rounded-[9px] overflow-hidden -ml-2.5 border-2" style={{ borderColor: "#111316" }}>
                                {meta?.enemyImage && <img src={meta.enemyImage} alt={r.enemy_champion_name} className="w-full h-full object-cover" />}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm truncate">
                                {r.ally_champion_name} vs {r.enemy_champion_name}
                              </div>
                              <div className="font-mono text-[11px] text-ink-40 mt-0.5">{r.role}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

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

        {/* Right sidebar — Ad */}
        <aside className="hidden lg:flex flex-col items-center gap-4 w-[320px] shrink-0 sticky top-20 self-start">
          <AdBanner slot="right" />
        </aside>
      </div>

      <Footer patch={plan?.meta?.patch} />
    </div>
  );
};

export default Index;
