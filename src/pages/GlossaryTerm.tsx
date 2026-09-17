import { Link, useParams } from "react-router-dom";
import { getGlossaryEntry, GLOSSARY } from "@/data/glossary";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/seo/Seo";

const GlossaryTerm = () => {
  const { slug } = useParams<{ slug: string }>();
  const entry = slug ? getGlossaryEntry(slug) : undefined;

  return (
    <div className="min-h-screen app-bg flex flex-col">
      <Seo
        title={entry ? entry.term : "Termo não encontrado"}
        description={entry ? entry.shortDef : "Termo do dicionário de League of Legends não encontrado."}
        path={`/glossario/${slug}`}
        noindex={!entry}
      />
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-6 space-y-4 w-full">
        <Link to="/glossario" className="text-xs text-ink-40 hover:text-ink-70 transition-colors w-fit block">
          ‹ Dicionário
        </Link>

        {!entry ? (
          <p className="text-sm text-ink-50 py-10 text-center">Termo não encontrado.</p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-xl font-extrabold text-foreground">{entry.term}</h1>
              <p className="text-sm text-brand">{entry.shortDef}</p>
            </div>

            <div className="glass rounded-2xl border border-white/[.07] p-4 space-y-3">
              {entry.body.map((paragraph, i) => (
                <p key={i} className="text-sm text-ink-70 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {entry.related.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-[10px] font-bold text-ink-40 uppercase tracking-wider">Conceitos relacionados</h2>
                <div className="flex flex-wrap gap-1.5">
                  {entry.related.map((relatedSlug) => {
                    const related = GLOSSARY.find((e) => e.slug === relatedSlug);
                    if (!related) return null;
                    return (
                      <Link
                        key={relatedSlug}
                        to={`/glossario/${relatedSlug}`}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/[.04] border border-white/[.08] text-ink-70 hover:text-foreground hover:bg-white/[.07] transition-colors"
                      >
                        {related.term}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default GlossaryTerm;
