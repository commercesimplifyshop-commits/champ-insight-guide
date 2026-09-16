import { useEffect, useState } from "react";
import { Loader2, ArrowLeft, Crown, History as HistoryIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { HistoryItem } from "@/types/history";
import LaneAnalysisView from "@/components/matchup/LaneAnalysisView";
import JungleAnalysisView from "@/components/matchup/JungleAnalysisView";
import Header from "@/components/layout/Header";
import { redirectToStripeUrl } from "@/lib/stripeRedirect";

const Account = () => {
  const { user, loading, isPremium, getAccessToken, refreshPremiumStatus } = useAuth();
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[] | null>(null);
  const [selected, setSelected] = useState<HistoryItem | null>(null);

  useEffect(() => {
    if (!user) return;
    const token = getAccessToken();
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    // Only ever has your single most recent analysis — saveAnalysis()
    // replaces the previous one instead of accumulating history, to keep
    // the database's size bounded (see history.service.ts).
    fetch("/api/history", { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then(setHistory)
      .catch(() => setHistory([]));
  }, [user, getAccessToken]);

  const handleCheckout = async () => {
    const token = getAccessToken();
    if (!token) return;
    setBillingLoading(true);
    setBillingError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha ao iniciar assinatura");
      redirectToStripeUrl(data.url);
    } catch (err) {
      setBillingError(err instanceof Error ? err.message : "Falha ao iniciar assinatura");
      setBillingLoading(false);
    }
  };

  const handlePortal = async () => {
    const token = getAccessToken();
    if (!token) return;
    setBillingLoading(true);
    setBillingError(null);
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        // The server may have just cleared a stale billing record (e.g. a
        // leftover Stripe test-mode customer) — refresh so the UI reflects
        // that this account is no longer marked Premium.
        await refreshPremiumStatus();
        throw new Error(data?.error || "Não foi possível abrir o gerenciamento de assinatura");
      }
      redirectToStripeUrl(data.url);
    } catch (err) {
      setBillingError(err instanceof Error ? err.message : "Não foi possível abrir o gerenciamento de assinatura");
      setBillingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen app-bg">
        <Header />
        <div className="flex flex-col items-center justify-center gap-4 px-4 text-center py-20">
          <p className="text-sm text-ink-50">Você precisa entrar para ver sua conta.</p>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="min-h-screen app-bg">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-1.5 text-xs text-ink-40 hover:text-ink-70 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao histórico
          </button>
          {selected.plan.type === "jungle" ? (
            <JungleAnalysisView plan={selected.plan} />
          ) : (
            <LaneAnalysisView plan={selected.plan} />
          )}
        </div>
      </div>
    );
  }

  const initials = (user.email || "?").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen app-bg">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-3">
        <div className="flex items-center gap-3.5 mb-2">
          <div
            className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center shrink-0"
            style={{ background: "repeating-linear-gradient(135deg,rgba(255,255,255,.1) 0 5px,rgba(255,255,255,.04) 5px 10px)" }}
          >
            <span className="font-mono font-bold text-[15px] text-ink-70">{initials}</span>
          </div>
          <div>
            <h1 className="font-semibold text-lg">{user.email}</h1>
          </div>
        </div>

        <div className="glass rounded-2xl border p-4 flex items-center justify-between gap-3 flex-wrap" style={{ borderColor: "rgba(245,178,26,.2)" }}>
          <div className="flex items-center gap-2">
            <Crown className={`w-5 h-5 ${isPremium ? "text-brand" : "text-ink-40"}`} />
            <div>
              <p className="text-xs text-ink-40 uppercase tracking-wider font-medium">Plano</p>
              <p className="font-semibold text-sm">{isPremium ? "Premium" : "Gratuito"}</p>
            </div>
          </div>
          <button
            onClick={isPremium ? handlePortal : handleCheckout}
            disabled={billingLoading}
            className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-brand disabled:opacity-60 flex items-center gap-2"
            style={{ background: "linear-gradient(180deg,#FFC94A,#F5B21A)", color: "var(--on-accent)" }}
          >
            {billingLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isPremium ? "Gerenciar Assinatura" : "Assinar"}
          </button>
        </div>

        {billingError && <p className="text-xs text-threat">{billingError}</p>}

        <div className="glass rounded-2xl border border-white/[.07] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-semibold uppercase tracking-wider">Última Análise</h2>
          </div>
          {history === null ? (
            <Loader2 className="w-4 h-4 animate-spin text-ink-40" />
          ) : history.length === 0 ? (
            <p className="text-xs text-ink-40">
              {isPremium
                ? "Nenhuma análise salva ainda. Gere um matchup completo pra ver aqui."
                : "Histórico disponível apenas para assinantes Premium."}
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {history.map((item) => {
                const meta = item.plan?.meta;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className="w-full flex items-center gap-3 rounded-[14px] border border-white/[.06] bg-white/[.03] px-3.5 py-3 text-left transition-colors hover:bg-white/[.05]"
                  >
                    <div className="flex items-center shrink-0">
                      <div className="w-8 h-8 rounded-[9px] overflow-hidden border border-white/10">
                        {meta?.allyImage && <img src={meta.allyImage} alt={item.ally_champion_name} className="w-full h-full object-cover" />}
                      </div>
                      {item.enemy_champion_name && (
                        <div className="w-8 h-8 rounded-[9px] overflow-hidden -ml-2.5 border-2" style={{ borderColor: "#111316" }}>
                          {meta?.enemyImage && <img src={meta.enemyImage} alt={item.enemy_champion_name} className="w-full h-full object-cover" />}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {item.enemy_champion_name ? `${item.ally_champion_name} vs ${item.enemy_champion_name}` : item.ally_champion_name}
                      </div>
                      <div className="font-mono text-[11px] text-ink-40 mt-0.5">{item.role}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
