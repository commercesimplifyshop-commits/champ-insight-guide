import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, CreditCard } from "lucide-react";
import { useAuth } from "@/lib/auth";
import Header from "@/components/layout/Header";

type StripeMode = "test" | "live";

const Admin = () => {
  const { user, isAdmin, loading, getAccessToken } = useAuth();
  const [stripeMode, setStripeMode] = useState<StripeMode | null>(null);
  const [modeLoading, setModeLoading] = useState(true);
  const [savingMode, setSavingMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    const token = getAccessToken();
    if (!token) return;

    fetch("/api/billing/stripe-mode", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setStripeMode(data.mode))
      .catch(() => setError("Não foi possível carregar o modo do Stripe."))
      .finally(() => setModeLoading(false));
  }, [isAdmin, getAccessToken]);

  const handleModeChange = async (mode: StripeMode) => {
    const token = getAccessToken();
    if (!token || mode === stripeMode) return;
    setSavingMode(true);
    setError(null);
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
      setError(err instanceof Error ? err.message : "Falha ao salvar o modo do Stripe.");
    } finally {
      setSavingMode(false);
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

          {modeLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            <div className="flex gap-2">
              {(["test", "live"] as StripeMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleModeChange(mode)}
                  disabled={savingMode || stripeMode === mode}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:cursor-not-allowed ${
                    stripeMode === mode
                      ? mode === "live"
                        ? "bg-threat text-primary-foreground shadow-sm"
                        : "bg-brand text-primary-foreground shadow-brand"
                      : "surface-2 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {savingMode && stripeMode !== mode && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {mode === "test" ? "Teste" : "Produção"}
                  {stripeMode === mode && " (ativo)"}
                </button>
              ))}
            </div>
          )}

          {error && <p className="text-xs text-threat">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Admin;
