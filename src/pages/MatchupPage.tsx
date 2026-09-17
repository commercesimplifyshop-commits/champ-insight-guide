import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import type { MatchupPageData } from "@/types/matchup-page";
import LaneAnalysisView from "@/components/matchup/LaneAnalysisView";
import JungleAnalysisView from "@/components/matchup/JungleAnalysisView";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/seo/Seo";

const ROLE_LABEL: Record<string, string> = {
  top: "Top",
  jungle: "Selva",
  mid: "Mid",
  adc: "Atirador",
  support: "Suporte",
};

/**
 * Public, indexable page for one pre-generated pilot matchup (see
 * matchupgg/src/matchup-pages) — real crawlable text per matchup instead of
 * only the interactive tool on the home page. Content is cached server-side
 * (GET /api/matchup-pages/:role/:champSlug), so loading this page never
 * triggers an OpenAI call.
 */
const MatchupPage = () => {
  const { role, champSlug } = useParams<{ role: string; champSlug: string }>();
  const [data, setData] = useState<MatchupPageData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setData(null);
    setNotFound(false);
    fetch(`/api/matchup-pages/${role}/${champSlug}`, { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setNotFound(true));
  }, [role, champSlug]);

  const roleLabel = role ? ROLE_LABEL[role] ?? role : "";
  const title = data
    ? data.enemy_champion_name
      ? `${data.ally_champion_name} vs ${data.enemy_champion_name} ${roleLabel} — Matchup e Counter`
      : `Guia de ${data.ally_champion_name} ${roleLabel} — Plano Estratégico`
    : "Matchup";
  const description = data
    ? data.enemy_champion_name
      ? `Como jogar ${data.ally_champion_name} contra ${data.enemy_champion_name} na ${roleLabel}: power spikes, itemização e erros a evitar, gerado por IA com dados do patch ${data.patch}.`
      : `Plano estratégico completo pra ${data.ally_champion_name} na ${roleLabel}: power spikes, itemização e erros a evitar, gerado por IA com dados do patch ${data.patch}.`
    : "Análise de matchup gerada por IA.";

  const ctaHref = data
    ? `/?role=${data.role}&ally=${encodeURIComponent(data.ally_champion_id)}${
        data.enemy_champion_id ? `&enemy=${encodeURIComponent(data.enemy_champion_id)}` : ""
      }`
    : "/";

  return (
    <div className="min-h-screen app-bg flex flex-col">
      <Seo title={title} description={description} path={`/matchups/${role}/${champSlug}`} noindex={notFound} />
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-6 space-y-4 w-full">
        <Link to="/matchups" className="flex items-center gap-1.5 text-xs text-ink-40 hover:text-ink-70 transition-colors w-fit">
          <ArrowLeft className="w-3.5 h-3.5" /> Todos os matchups
        </Link>

        {notFound ? (
          <p className="text-sm text-ink-50 py-10 text-center">Matchup não encontrado.</p>
        ) : !data ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-ink-40" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-xl font-extrabold text-foreground">{title}</h1>
              <p className="text-sm text-ink-50">{description}</p>
            </div>

            {data.plan.type === "jungle" ? <JungleAnalysisView plan={data.plan} /> : <LaneAnalysisView plan={data.plan} />}

            <Link
              to={ctaHref}
              className="flex items-center justify-center h-12 rounded-[13px] font-bold text-[14.5px] shadow-brand"
              style={{ background: "linear-gradient(180deg,#FFC94A,#F5B21A)", color: "var(--on-accent)" }}
            >
              Gerar meu plano personalizado
            </Link>
          </div>
        )}
      </main>

      <Footer patch={data?.patch} />
    </div>
  );
};

export default MatchupPage;
