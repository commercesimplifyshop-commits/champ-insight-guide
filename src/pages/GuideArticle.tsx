import { Link, useParams } from "react-router-dom";
import { getGuide, GUIDES } from "@/data/guides";
import { GLOSSARY } from "@/data/glossary";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/seo/Seo";

const GuideArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? getGuide(slug) : undefined;
  const otherGuides = GUIDES.filter((g) => g.slug !== slug).slice(0, 4);

  return (
    <div className="min-h-screen app-bg flex flex-col">
      <Seo
        title={guide ? guide.title : "Guia não encontrado"}
        description={guide ? guide.description : "Guia de League of Legends não encontrado."}
        path={`/guias/${slug}`}
        noindex={!guide}
      />
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-6 space-y-5 w-full">
        <Link to="/guias" className="text-xs text-ink-40 hover:text-ink-70 transition-colors w-fit block">
          ‹ Todos os guias
        </Link>

        {!guide ? (
          <p className="text-sm text-ink-50 py-10 text-center">Guia não encontrado.</p>
        ) : (
          <article className="space-y-5">
            <header className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand">{guide.category}</p>
              <h1 className="text-2xl font-extrabold text-foreground leading-tight">{guide.title}</h1>
              <p className="text-sm text-ink-50">{guide.description}</p>
            </header>

            {guide.sections.map((section) => (
              <section key={section.heading} className="space-y-2">
                <h2 className="text-base font-bold text-foreground">{section.heading}</h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="text-sm text-ink-70 leading-relaxed">
                    {p}
                  </p>
                ))}
              </section>
            ))}

            {guide.relatedTerms.length > 0 && (
              <section className="space-y-2 pt-2">
                <h2 className="text-[10px] font-bold text-ink-40 uppercase tracking-wider">Conceitos do dicionário</h2>
                <div className="flex flex-wrap gap-1.5">
                  {guide.relatedTerms.map((termSlug) => {
                    const term = GLOSSARY.find((e) => e.slug === termSlug);
                    if (!term) return null;
                    return (
                      <Link
                        key={termSlug}
                        to={`/glossario/${termSlug}`}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/[.04] border border-white/[.08] text-ink-70 hover:text-foreground hover:bg-white/[.07] transition-colors"
                      >
                        {term.term}
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            <Link
              to="/"
              className="flex items-center justify-center h-12 rounded-[13px] font-bold text-[14.5px] shadow-brand"
              style={{ background: "linear-gradient(180deg,#FFC94A,#F5B21A)", color: "var(--on-accent)" }}
            >
              Gerar um plano estratégico para o seu campeão
            </Link>

            <section className="space-y-2 pt-2">
              <h2 className="text-[10px] font-bold text-ink-40 uppercase tracking-wider">Outros guias</h2>
              <div className="flex flex-col gap-1.5">
                {otherGuides.map((g) => (
                  <Link key={g.slug} to={`/guias/${g.slug}`} className="text-sm text-ink-70 hover:text-foreground transition-colors">
                    {g.title}
                  </Link>
                ))}
              </div>
            </section>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default GuideArticle;
