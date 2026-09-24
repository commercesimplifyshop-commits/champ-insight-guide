import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import type { MatchupPageListItem } from "@/types/matchup-page";
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

const ROLE_ORDER = ["top", "jungle", "mid", "adc", "support"];

/** Real internal links to every /matchups/:role/:champSlug page — a sitemap.xml entry alone is weaker for Google than an actual crawlable link path. */
const MatchupsHub = () => {
  const [items, setItems] = useState<MatchupPageListItem[] | null>(null);

  useEffect(() => {
    fetch("/api/matchup-pages", { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : []))
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  const byRole = new Map<string, MatchupPageListItem[]>();
  for (const item of items ?? []) {
    if (!byRole.has(item.role)) byRole.set(item.role, []);
    byRole.get(item.role)!.push(item);
  }

  return (
    <div className="min-h-screen app-bg flex flex-col">
      <Seo
        title="Matchups de League of Legends"
        description="Guias de matchup e counter para os campeões mais jogados de League of Legends, gerados por IA — top, selva, mid, atirador e suporte."
        path="/matchups"
        noindex={items !== null && items.length === 0}
      />
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-6 space-y-6 w-full">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-foreground">Matchups de League of Legends</h1>
          <p className="text-sm text-ink-50">
            Guias de matchup e counter gerados por IA. Escolha um campeão abaixo ou use a ferramenta na home pra
            gerar o seu.
          </p>
        </div>

        {!items ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-ink-40" />
          </div>
        ) : (
          ROLE_ORDER.filter((role) => byRole.has(role)).map((role) => (
            <div key={role} className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-brand">{ROLE_LABEL[role] ?? role}</h2>
              <div className="flex flex-wrap gap-2">
                {byRole.get(role)!.map((item) => {
                  const champSlug = item.slug.split("/")[1] ?? "";
                  const label = champSlug.replace("-vs-", " vs ");
                  return (
                    <Link
                      key={item.slug}
                      to={`/matchups/${item.slug}`}
                      className="px-3 py-2 rounded-lg border border-white/[.08] bg-white/[.03] text-xs font-medium text-ink-70 hover:text-foreground hover:bg-white/[.06] transition-colors capitalize"
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MatchupsHub;
