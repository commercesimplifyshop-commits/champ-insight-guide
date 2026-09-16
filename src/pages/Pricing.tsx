import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Check, X, Crown, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthDialog from "@/components/auth/AuthDialog";
import { redirectToStripeUrl } from "@/lib/stripeRedirect";
import PromoCountdown from "@/components/monetization/PromoCountdown";
import PlanComparisonDemo from "@/components/pricing/PlanComparisonDemo";

interface FeatureRow {
  label: string;
  free: boolean | string;
  pro: boolean | string;
}

const FEATURES: FeatureRow[] = [
  { label: "Resultado mais avançado", free: false, pro: true },
  { label: "Matchup 1v1 — overview, early game e power spikes", free: true, pro: true },
  { label: "Matchup 1v1 — mid/late game, itemização e erros a evitar", free: false, pro: true },
  { label: "Counter Finder (sugestões de IA)", free: false, pro: true },
  { label: "Análise 5v5 (composição de time completa)", free: false, pro: true },
  { label: "Histórico de análises salvo", free: false, pro: true },
  { label: "Estatísticas de uso pessoais", free: false, pro: true },
];

const Cell = ({ value }: { value: boolean | string }) => {
  if (typeof value === "string") return <span className="text-xs text-foreground/80">{value}</span>;
  return value ? (
    <Check className="w-4 h-4 text-advantage mx-auto" />
  ) : (
    <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />
  );
};

const Pricing = () => {
  const { user, isPremium, getAccessToken } = useAuth();
  const location = useLocation();
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // React Router doesn't scroll to hash fragments on client-side navigation
  // (only the browser's native full-page-load behavior does) — links like
  // <Link to="/pricing#demo"> from other pages would otherwise land at the
  // top of the page instead of the comparison demo.
  useEffect(() => {
    if (location.hash !== "#demo") return;
    const id = requestAnimationFrame(() => {
      document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [location.hash]);

  const handleSubscribe = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    const token = getAccessToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      redirectToStripeUrl(data.url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 space-y-8 w-full">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-foreground">Escolha seu plano</h1>
          <p className="text-sm text-muted-foreground">
            Comece grátis com o essencial do 1v1, ou desbloqueie tudo com o Premium.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="surface-1 border border-border rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Gratuito</h2>
              <p className="text-2xl font-extrabold text-foreground mt-1">R$0</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Prévia da análise de matchup 1v1 — overview, primeira fase e power spikes.
            </p>
            <div className="text-xs text-muted-foreground/70">Sem cartão, sem cadastro obrigatório.</div>
          </div>

          <div className="surface-1 border-2 border-brand rounded-xl p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-brand text-primary-foreground text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-bl-md">
              Recomendado
            </div>
            <div>
              <h2 className="text-sm font-bold text-brand uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-4 h-4" /> Premium
              </h2>
              <p className="text-2xl font-extrabold text-foreground mt-1">
                R$19,90<span className="text-sm font-medium text-muted-foreground">/mês</span>
              </p>
              <PromoCountdown className="mt-1.5" />
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">
              Análise completa (1v1, 5v5, Counter Finder) com um modelo de IA mais avançado — respostas mais
              detalhadas e aprofundadas —, histórico salvo e estatísticas de uso.
            </p>
            <button
              onClick={handleSubscribe}
              disabled={loading || isPremium}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand text-primary-foreground hover:brightness-110 shadow-brand transition-all disabled:opacity-60"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isPremium ? "Você já é Premium" : user ? "Assinar Agora" : "Entrar para Assinar"}
            </button>
          </div>
        </div>

        <div className="surface-1 border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-semibold">Recurso</th>
                <th className="px-3 py-3 text-xs text-muted-foreground uppercase tracking-wider font-semibold">Gratuito</th>
                <th className="px-3 py-3 text-xs text-brand uppercase tracking-wider font-semibold">Premium</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f) => (
                <tr key={f.label} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-xs text-foreground/80">{f.label}</td>
                  <td className="px-3 py-3 text-center">
                    <Cell value={f.free} />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Cell value={f.pro} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-extrabold text-foreground">Veja a diferença na prática</h2>
            <p className="text-xs text-muted-foreground">
              Mesmo confronto, resultado gratuito vs. Premium — alterna automaticamente a cada 8s ou clique para comparar.
            </p>
          </div>
          <PlanComparisonDemo />
        </div>

        <p className="text-[10px] text-muted-foreground/70 text-center leading-relaxed px-6">
          Cancele quando quiser, direto pela sua conta — sem burocracia. O pagamento é processado com segurança pelo Stripe.
        </p>
      </main>

      <Footer />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
};

export default Pricing;
