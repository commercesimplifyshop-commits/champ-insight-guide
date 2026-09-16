import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { redirectToStripeUrl } from "@/lib/stripeRedirect";
import AuthDialog from "@/components/auth/AuthDialog";

interface PaywallProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

/**
 * Bottom-sheet paywall (design_handoff_matchupgg_mobile §11). The prototype's
 * copy claims a "3 analyses/day" quota that doesn't exist in this product —
 * title/description are passed in by the caller instead, using real,
 * already-shipped Premium features as perks rather than a fabricated quota.
 */
const Paywall = ({ open, onClose, title, description }: PaywallProps) => {
  const { t } = useI18n();
  const { user, getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  if (!open) return null;

  const perks = [t("paywall.perk1"), t("paywall.perk2"), t("paywall.perk3")];

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
    <div className="fixed inset-0 z-[90] flex flex-col justify-end" style={{ background: "rgba(5,6,8,.78)" }}>
      <div className="flex-1" onClick={onClose} />
      <div
        className="sheet-surface border-t rounded-t-[26px] px-[22px] pt-6 pb-[34px] flex flex-col gap-4 sm:max-w-[440px] sm:mx-auto sm:w-full"
        style={{ borderColor: "rgba(245,178,26,.25)" }}
      >
        <div className="w-11 h-1 rounded-full bg-white/[.18] self-center" />
        <h2 className="font-semibold text-2xl leading-[1.2] tracking-[-.5px]">{title}</h2>
        <p className="text-[13.5px] leading-[1.55] text-ink-70">{description}</p>
        <div className="flex flex-col gap-2.5">
          {perks.map((perk) => (
            <div key={perk} className="flex items-center gap-2.5">
              <span className="w-[5px] h-[5px] rounded-full bg-brand shrink-0" />
              <span className="text-[13px] text-ink-70">{perk}</span>
            </div>
          ))}
        </div>
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="h-[54px] rounded-[15px] font-bold text-[15.5px] shadow-brand flex items-center justify-center gap-2 disabled:opacity-70"
          style={{ background: "linear-gradient(180deg,#FFC94A,#F5B21A)", color: "var(--on-accent)" }}
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {user ? t("paywall.cta") : t("premium.loginToUnlock")}
        </button>
        <button onClick={onClose} className="text-center text-[13px] font-medium text-ink-40">
          {t("paywall.continueFree")}
        </button>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
};

export default Paywall;
