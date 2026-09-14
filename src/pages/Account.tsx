import { useEffect, useState } from "react";
import { Loader2, ArrowLeft, Crown, History as HistoryIcon, BarChart3 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { MatchupPlan } from "@/types/matchup";
import LaneAnalysisView from "@/components/matchup/LaneAnalysisView";
import JungleAnalysisView from "@/components/matchup/JungleAnalysisView";
import Header from "@/components/layout/Header";
import { redirectToStripeUrl } from "@/lib/stripeRedirect";

interface HistoryItem {
  id: string;
  role: string;
  ally_champion_id: string;
  ally_champion_name: string;
  enemy_champion_id: string;
  enemy_champion_name: string;
  plan: MatchupPlan;
  created_at: string;
}

interface UsageData {
  total: number;
  byRole: Record<string, number>;
  topChampions: { name: string; count: number }[];
}

const Account = () => {
  const { user, loading, isPremium, getAccessToken, refreshPremiumStatus } = useAuth();
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[] | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [selected, setSelected] = useState<HistoryItem | null>(null);

  useEffect(() => {
    if (!user) return;
    const token = getAccessToken();
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    fetch("/api/history", { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then(setHistory)
      .catch(() => setHistory([]));

    fetch("/api/usage", { headers })
      .then((r) => (r.ok ? r.json() : null))
      .then(setUsage)
      .catch(() => setUsage(null));
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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center gap-4 px-4 text-center py-20">
          <p className="text-sm text-muted-foreground">Você precisa entrar para ver sua conta.</p>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        <h1 className="text-lg font-extrabold text-foreground">Minha Conta</h1>
        <p className="text-xs text-muted-foreground -mt-3">{user.email}</p>

        <div className="surface-1 border border-border rounded-lg p-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Crown className={`w-5 h-5 ${isPremium ? "text-brand" : "text-muted-foreground"}`} />
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Plano</p>
              <p className="font-semibold text-sm text-foreground">{isPremium ? "Premium" : "Gratuito"}</p>
            </div>
          </div>
          <button
            onClick={isPremium ? handlePortal : handleCheckout}
            disabled={billingLoading}
            className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand text-primary-foreground hover:brightness-110 shadow-brand transition-all disabled:opacity-60 flex items-center gap-2"
          >
            {billingLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {isPremium ? "Gerenciar Assinatura" : "Assinar"}
          </button>
        </div>

        {billingError && (
          <p className="text-xs text-threat -mt-3">{billingError}</p>
        )}

        {usage && usage.total > 0 && (
          <div className="surface-1 border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-info-status" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Estatísticas de Uso</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
              <div className="surface-2 rounded-md p-2">
                <p className="text-lg font-bold text-brand">{usage.total}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Análises</p>
              </div>
              {Object.entries(usage.byRole).map(([role, count]) => (
                <div key={role} className="surface-2 rounded-md p-2">
                  <p className="text-lg font-bold text-foreground">{count}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{role}</p>
                </div>
              ))}
            </div>
            {usage.topChampions.length > 0 && (
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Campeões mais analisados</p>
                <div className="flex flex-wrap gap-1.5">
                  {usage.topChampions.map((c) => (
                    <span key={c.name} className="text-xs surface-2 rounded-full px-2.5 py-1">
                      {c.name} <span className="text-muted-foreground">×{c.count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="surface-1 border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-4 h-4 text-caution" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Histórico de Análises</h2>
          </div>
          {history === null ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : history.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              {isPremium
                ? "Nenhuma análise salva ainda. Gere um matchup completo pra ver aqui."
                : "Histórico disponível apenas para assinantes Premium."}
            </p>
          ) : (
            <div className="space-y-1.5">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md surface-2 hover:bg-secondary/50 transition-colors text-left"
                >
                  <span className="text-sm text-foreground">
                    {item.ally_champion_name} <span className="text-muted-foreground">vs</span> {item.enemy_champion_name}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase">{item.role}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
