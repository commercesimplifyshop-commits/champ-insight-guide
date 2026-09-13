import { useState, type ReactNode } from "react";
import { Loader2, Crown } from "lucide-react";
import { useAuth } from "@/lib/auth";
import AuthDialog from "@/components/auth/AuthDialog";

interface FeatureGateProps {
  title: string;
  description: string;
  children: ReactNode;
}

/**
 * Gates an entire feature (not just part of a result) behind login +
 * an active subscription — used for Premium-only tools like Counter Finder
 * and 5v5 Team Analysis, where there's no free preview to show.
 */
const FeatureGate = ({ title, description, children }: FeatureGateProps) => {
  const { user, isPremium, loading, getAccessToken } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user && isPremium) {
    return <>{children}</>;
  }

  const handleSubscribe = async () => {
    const token = getAccessToken();
    if (!token) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="surface-1 border border-dashed border-brand/40 rounded-lg p-8 flex flex-col items-center text-center gap-3">
      <div className="w-10 h-10 rounded-full bg-brand/15 flex items-center justify-center">
        <Crown className="w-5 h-5 text-brand" />
      </div>
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">{title}</h2>
      <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">{description}</p>
      <button
        onClick={user ? handleSubscribe : () => setAuthOpen(true)}
        disabled={checkoutLoading}
        className="mt-1 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand text-primary-foreground hover:brightness-110 shadow-brand transition-all disabled:opacity-60 flex items-center gap-2"
      >
        {checkoutLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {user ? "Assinar Premium" : "Entrar para Assinar"}
      </button>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
};

export default FeatureGate;
