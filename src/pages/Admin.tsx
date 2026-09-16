import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, CreditCard, AlertTriangle, Gift, Cpu } from "lucide-react";
import { useAuth } from "@/lib/auth";
import Header from "@/components/layout/Header";

type StripeMode = "test" | "live";

const MODEL_PRESETS = ["gpt-4o-mini", "gpt-4o", "gpt-4.1-mini", "gpt-4.1"];

const Admin = () => {
  const { user, isAdmin, loading, getAccessToken } = useAuth();

  const [stripeMode, setStripeMode] = useState<StripeMode | null>(null);
  const [stripeModeLoading, setStripeModeLoading] = useState(true);
  const [savingStripeMode, setSavingStripeMode] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);

  const [demoBanner, setDemoBanner] = useState<boolean | null>(null);
  const [demoBannerLoading, setDemoBannerLoading] = useState(true);
  const [savingDemoBanner, setSavingDemoBanner] = useState(false);
  const [demoBannerError, setDemoBannerError] = useState<string | null>(null);

  const [rewardAd, setRewardAd] = useState<boolean | null>(null);
  const [rewardAdLoading, setRewardAdLoading] = useState(true);
  const [savingRewardAd, setSavingRewardAd] = useState(false);
  const [rewardAdError, setRewardAdError] = useState<string | null>(null);

  const [freeModel, setFreeModel] = useState("");
  const [premiumModel, setPremiumModel] = useState("");
  const [llmModelsLoading, setLlmModelsLoading] = useState(true);
  const [savingModelTier, setSavingModelTier] = useState<"free" | "premium" | null>(null);
  const [llmModelsError, setLlmModelsError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    const token = getAccessToken();
    if (!token) return;

    fetch("/api/billing/stripe-mode", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setStripeMode(data.mode))
      .catch(() => setStripeError("Não foi possível carregar o modo do Stripe."))
      .finally(() => setStripeModeLoading(false));

    fetch("/api/settings/demo-banner", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setDemoBanner(data.enabled))
      .catch(() => setDemoBannerError("Não foi possível carregar o status do banner."))
      .finally(() => setDemoBannerLoading(false));

    fetch("/api/settings/reward-ad", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setRewardAd(data.enabled))
      .catch(() => setRewardAdError("Não foi possível carregar o status do anúncio recompensado."))
      .finally(() => setRewardAdLoading(false));

    fetch("/api/settings/llm-models", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        setFreeModel(data.free ?? "");
        setPremiumModel(data.premium ?? "");
      })
      .catch(() => setLlmModelsError("Não foi possível carregar os modelos de IA."))
      .finally(() => setLlmModelsLoading(false));
  }, [isAdmin, getAccessToken]);

  const handleStripeModeChange = async (mode: StripeMode) => {
    const token = getAccessToken();
    if (!token || mode === stripeMode) return;
    setSavingStripeMode(true);
    setStripeError(null);
    try {
      const res = await fetch("/api/billing/stripe-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha ao salvar");
      setStripeMode(data.mode);
    } catch (err) {
      setStripeError(err instanceof Error ? err.message : "Falha ao salvar o modo do Stripe.");
    } finally {
      setSavingStripeMode(false);
    }
  };

  const handleDemoBannerChange = async (enabled: boolean) => {
    const token = getAccessToken();
    if (!token || enabled === demoBanner) return;
    setSavingDemoBanner(true);
    setDemoBannerError(null);
    try {
      const res = await fetch("/api/settings/demo-banner", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ enabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha ao salvar");
      setDemoBanner(data.enabled);
    } catch (err) {
      setDemoBannerError(err instanceof Error ? err.message : "Falha ao salvar o banner de demonstração.");
    } finally {
      setSavingDemoBanner(false);
    }
  };

  const handleRewardAdChange = async (enabled: boolean) => {
    const token = getAccessToken();
    if (!token || enabled === rewardAd) return;
    setSavingRewardAd(true);
    setRewardAdError(null);
    try {
      const res = await fetch("/api/settings/reward-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ enabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha ao salvar");
      setRewardAd(data.enabled);
    } catch (err) {
      setRewardAdError(err instanceof Error ? err.message : "Falha ao salvar o anúncio recompensado.");
    } finally {
      setSavingRewardAd(false);
    }
  };

  const handleModelChange = async (tier: "free" | "premium", model: string) => {
    const token = getAccessToken();
    const trimmed = model.trim();
    if (!token || !trimmed) return;
    setSavingModelTier(tier);
    setLlmModelsError(null);
    try {
      const res = await fetch("/api/settings/llm-models", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ [tier]: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha ao salvar");
      setFreeModel(data.free ?? "");
      setPremiumModel(data.premium ?? "");
    } catch (err) {
      setLlmModelsError(err instanceof Error ? err.message : "Falha ao salvar o modelo de IA.");
    } finally {
      setSavingModelTier(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center py-20">
          <p className="text-sm text-muted-foreground">
            {user ? "Sua conta não tem acesso administrativo." : "Você precisa entrar com uma conta administradora."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-info-status" />
          <h1 className="text-lg font-extrabold text-foreground">Painel Administrativo</h1>
        </div>

        <div className="surface-1 border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Modo do Stripe</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Controla se checkouts e o portal de assinatura usam o Stripe de teste (nenhum pagamento real) ou de
            produção (cobra de verdade). Afeta o site inteiro imediatamente, sem precisar de novo deploy.
          </p>

          {stripeModeLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            <div className="flex gap-2">
              {(["test", "live"] as StripeMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleStripeModeChange(mode)}
                  disabled={savingStripeMode || stripeMode === mode}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:cursor-not-allowed ${
                    stripeMode === mode
                      ? mode === "live"
                        ? "bg-threat text-primary-foreground shadow-sm"
                        : "bg-brand text-primary-foreground shadow-brand"
                      : "surface-2 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {savingStripeMode && stripeMode !== mode && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {mode === "test" ? "Teste" : "Produção"}
                  {stripeMode === mode && " (ativo)"}
                </button>
              ))}
            </div>
          )}

          {stripeError && <p className="text-xs text-threat">{stripeError}</p>}
        </div>

        <div className="surface-1 border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-caution" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Banner de Demonstração
            </h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Controla se o aviso "site em construção / modo de demonstração" aparece acima do cabeçalho em todas as
            páginas. Desative quando o site estiver pronto para uso oficial.
          </p>

          {demoBannerLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            <div className="flex gap-2">
              {[
                { value: true, label: "Ativado" },
                { value: false, label: "Desativado" },
              ].map(({ value, label }) => (
                <button
                  key={label}
                  onClick={() => handleDemoBannerChange(value)}
                  disabled={savingDemoBanner || demoBanner === value}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:cursor-not-allowed ${
                    demoBanner === value
                      ? "bg-brand text-primary-foreground shadow-brand"
                      : "surface-2 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {savingDemoBanner && demoBanner !== value && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {label}
                  {demoBanner === value && " (ativo)"}
                </button>
              ))}
            </div>
          )}

          {demoBannerError && <p className="text-xs text-threat">{demoBannerError}</p>}
        </div>

        <div className="surface-1 border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Anúncio Recompensado</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Controla se "Gerar Plano" exige que usuários gratuitos assistam a um anúncio antes de gerar a análise.
            Mantenha desativado enquanto o recurso de anúncio recompensado do AdSense não estiver aprovado — sem
            aprovação, o anúncio nunca carrega e o botão trava (agora com um timeout de 8s como segurança extra,
            mas o ideal é manter desativado até aprovar).
          </p>

          {rewardAdLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            <div className="flex gap-2">
              {[
                { value: true, label: "Ativado" },
                { value: false, label: "Desativado" },
              ].map(({ value, label }) => (
                <button
                  key={label}
                  onClick={() => handleRewardAdChange(value)}
                  disabled={savingRewardAd || rewardAd === value}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:cursor-not-allowed ${
                    rewardAd === value
                      ? "bg-brand text-primary-foreground shadow-brand"
                      : "surface-2 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {savingRewardAd && rewardAd !== value && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {label}
                  {rewardAd === value && " (ativo)"}
                </button>
              ))}
            </div>
          )}

          {rewardAdError && <p className="text-xs text-threat">{rewardAdError}</p>}
        </div>

        <div className="surface-1 border border-border rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Modelo de IA por Plano</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Controla qual modelo da OpenAI gera as análises para usuários gratuitos e para assinantes Premium.
            Permite dar ao Premium um modelo mais forte (e mais caro) sem precisar de novo deploy. Modelos com nomes
            inválidos vão falhar na próxima análise daquele plano — confira o nome exato antes de salvar.
          </p>

          {llmModelsLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            <div className="space-y-4">
              {(
                [
                  { tier: "free" as const, label: "Plano Gratuito", value: freeModel, setValue: setFreeModel },
                  { tier: "premium" as const, label: "Plano Premium", value: premiumModel, setValue: setPremiumModel },
                ]
              ).map(({ tier, label, value, setValue }) => (
                <div key={tier} className="space-y-2">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wider">{label}</p>
                  <div className="flex flex-wrap gap-2">
                    {MODEL_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => handleModelChange(tier, preset)}
                        disabled={savingModelTier !== null || value === preset}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all disabled:cursor-not-allowed ${
                          value === preset
                            ? "bg-brand text-primary-foreground shadow-brand"
                            : "surface-2 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {savingModelTier === tier && value !== preset && (
                          <Loader2 className="inline w-3 h-3 animate-spin mr-1" />
                        )}
                        {preset}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="nome customizado do modelo"
                      className="flex-1 surface-2 border border-border rounded-md px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                    <button
                      onClick={() => handleModelChange(tier, value)}
                      disabled={savingModelTier !== null || !value.trim()}
                      className="px-3 py-1.5 rounded-md text-xs font-bold bg-brand text-primary-foreground shadow-brand disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {llmModelsError && <p className="text-xs text-threat">{llmModelsError}</p>}
        </div>
      </div>
    </div>
  );
};

export default Admin;
