import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Champion } from "@/types/matchup";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/seo/Seo";

/** Real internal links to every /campeoes/:id page, for crawl discovery beyond the sitemap. */
const ChampionsHub = () => {
  const { locale } = useI18n();
  const [champions, setChampions] = useState<Champion[] | null>(null);

  useEffect(() => {
    fetch(`/api/${locale}/champions?q=`, { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setChampions(Array.isArray(data) ? [...data].sort((a, b) => a.name.localeCompare(b.name)) : []))
      .catch(() => setChampions([]));
  }, [locale]);

  return (
    <div className="min-h-screen app-bg flex flex-col">
      <Seo
        title="Todos os Campeões de League of Legends"
        description="Guias de todos os campeões de League of Legends: habilidades, atributos, lore e dicas oficiais de como jogar com e contra cada um."
        path="/campeoes"
      />
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-6 space-y-4 w-full">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-foreground">Todos os Campeões</h1>
          <p className="text-sm text-ink-50">Habilidades, atributos e dicas oficiais de cada campeão de League of Legends.</p>
        </div>

        {!champions ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-ink-40" />
          </div>
        ) : (
          <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-2">
            {champions.map((c) => (
              <Link
                key={c.id}
                to={`/campeoes/${c.id.toLowerCase()}`}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-white/[.06] bg-white/[.03] hover:bg-white/[.06] transition-colors"
              >
                <img src={c.image} alt={c.name} className="w-12 h-12 rounded-[10px] object-cover" />
                <span className="text-[11px] font-medium text-ink-70 text-center truncate w-full">{c.name}</span>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ChampionsHub;
