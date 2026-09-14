import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const STORAGE_KEY = "cookie_consent";

const CookieConsentBanner = () => {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable (private mode, blocked storage) — skip the
      // banner rather than risk showing it on every page load.
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // best-effort — nothing else to do if storage is blocked
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 surface-1 border-t border-border shadow-lg">
      <div className="max-w-3xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center gap-3">
        <Cookie className="w-5 h-5 text-brand shrink-0 hidden sm:block" />
        <p className="text-xs text-muted-foreground leading-relaxed flex-1 text-center sm:text-left">
          {t("cookies.bannerText")}{" "}
          <Link to="/privacy" className="underline hover:text-foreground transition-colors">
            {t("cookies.learnMore")}
          </Link>
        </p>
        <button
          onClick={accept}
          className="shrink-0 px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand text-primary-foreground hover:brightness-110 shadow-brand transition-all"
        >
          {t("cookies.accept")}
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
