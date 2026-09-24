import { Link } from "react-router-dom";
import { GUIDES } from "@/data/guides";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/seo/Seo";

const Guides = () => {
  const categories = [...new Set(GUIDES.map((g) => g.category))];

  return (
    <div className="min-h-screen app-bg flex flex-col">
      <Seo
        title="Guias de League of Legends"
        description="Guias de estratégia de League of Legends: como subir de elo, controle de wave, fase de rotas, jungle, visão, teamfights, macro game e draft."
        path="/guias"
      />
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-6 space-y-6 w-full">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-foreground">Guias de League of Legends</h1>
          <p className="text-sm text-ink-50">
            Artigos de estratégia para evoluir no jogo: fundamentos, fase de rotas, selva, macro game e draft.
          </p>
        </div>

        {categories.map((category) => (
          <section key={category} className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-brand">{category}</h2>
            <div className="flex flex-col gap-2">
              {GUIDES.filter((g) => g.category === category).map((guide) => (
                <Link
                  key={guide.slug}
                  to={`/guias/${guide.slug}`}
                  className="rounded-[14px] border border-white/[.06] bg-white/[.03] px-3.5 py-3 hover:bg-white/[.05] transition-colors"
                >
                  <div className="font-semibold text-sm text-foreground">{guide.title}</div>
                  <p className="text-xs text-ink-50 mt-0.5">{guide.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default Guides;
