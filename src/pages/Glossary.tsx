import { Link } from "react-router-dom";
import { GLOSSARY } from "@/data/glossary";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/seo/Seo";

const Glossary = () => {
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "pt-BR"));

  return (
    <div className="min-h-screen app-bg flex flex-col">
      <Seo
        title="Dicionário de League of Legends"
        description="Glossário de conceitos de League of Legends: controle de wave, power spike, zoneamento, roaming, split push e outros termos explicados."
        path="/glossario"
      />
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-6 space-y-4 w-full">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-foreground">Dicionário de League of Legends</h1>
          <p className="text-sm text-ink-50">Conceitos estratégicos do jogo explicados de forma direta e prática.</p>
        </div>

        <div className="flex flex-col gap-2">
          {sorted.map((entry) => (
            <Link
              key={entry.slug}
              to={`/glossario/${entry.slug}`}
              className="rounded-[14px] border border-white/[.06] bg-white/[.03] px-3.5 py-3 hover:bg-white/[.05] transition-colors"
            >
              <div className="font-semibold text-sm text-foreground">{entry.term}</div>
              <p className="text-xs text-ink-50 mt-0.5">{entry.shortDef}</p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Glossary;
