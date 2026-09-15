import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const DemoModeBanner = () => {
  const { t } = useI18n();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    fetch("/api/settings/demo-banner")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setEnabled(Boolean(data?.enabled)))
      .catch(() => setEnabled(false));
  }, []);

  if (!enabled) return null;

  return (
    <div className="bg-caution/15 border-b border-caution/40 text-caution">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-center">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        <p className="text-[11px] sm:text-xs font-medium leading-snug">{t("demo.banner")}</p>
      </div>
    </div>
  );
};

export default DemoModeBanner;
