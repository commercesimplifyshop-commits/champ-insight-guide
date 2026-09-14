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
    <div className="fixed bottom-0 inset-x-0 z-50 surface-2 border-t-2 border-brand/50 shadow-lg">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2.5 flex items-center gap-2.5">
        <Cookie className="w-4 h-4 text-brand shrink-0" />
        <p className="text-[10.5px] sm:text-xs text-foreground/80 leading-snug flex-1">
          {t("cookies.bannerText")}{" "}
          <Link to="/privacy" className="underline hover:text-foreground transition-colors whitespace-nowrap">
            {t("cookies.learnMore")}
          </Link>
        </p>
        <button
          onClick={accept}
          className="shrink-0 px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-brand text-primary-foreground hover:brightness-110 shadow-brand transition-all"
        >
          {t("cookies.accept")}
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
