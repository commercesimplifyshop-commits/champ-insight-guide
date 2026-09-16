import { MessageCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useI18n } from "@/lib/i18n";

/**
 * Placeholder — the design handoff's Coach IA chat screen needs a new
 * backend endpoint (OpenAI cost, streaming) that was deliberately deferred
 * to a follow-up pass. This keeps the nav strip/drawer link from 404ing.
 */
const Coach = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen app-bg flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-brand/15 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-brand" />
        </div>
        <h1 className="text-lg font-semibold">{t("coach.title")}</h1>
        <p className="text-sm text-ink-50 max-w-xs">{t("coach.comingSoon")}</p>
      </div>
      <Footer />
    </div>
  );
};

export default Coach;
