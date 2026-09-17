import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { ChampionProfile } from "@/types/champion-profile";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/seo/Seo";

const STAT_LABEL: Record<string, string> = {
  attack: "Ataque",
  defense: "Defesa",
  magic: "Magia",
  difficulty: "Dificuldade",
};

const StatBar = ({ label, value }: { label: string; value: number }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-[10px] text-ink-40 uppercase tracking-wider">
      <span>{label}</span>
      <span className="font-mono">{value}/10</span>
    </div>
    <div className="h-1.5 rounded-full bg-white/[.06] overflow-hidden">
      <div className="h-full rounded-full bg-brand" style={{ width: `${Math.max(0, Math.min(10, value)) * 10}%` }} />
    </div>
  </div>
);

/**
 * Public wiki page for any League of Legends champion — real Data Dragon
 * content (lore, stats, full kit, official tips), not AI-generated, so it's
 * cheap to cover the entire roster (unlike the curated /matchups pilot) and
 * gives search engines a lot of real, evergreen text per champion.
 */
const ChampionWiki = () => {
  const { championId } = useParams<{ championId: string }>();
  const { locale } = useI18n();
  const [data, setData] = useState<ChampionProfile | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setData(null);
    setNotFound(false);
    const language = locale === "pt" ? "pt-BR" : "en-US";
    fetch(`/api/champions/${encodeURIComponent(championId ?? "")}/profile?language=${language}`, {
      headers: { Accept: "application/json" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setNotFound(true));
  }, [championId, locale]);

  const title = data ? `${data.name}, ${data.title} — Guia e Habilidades` : "Guia de Campeão";
  const description = data
    ? `Guia completo de ${data.name} em League of Legends: habilidades, atributos, dicas oficiais e como jogar com e contra, patch ${data.patch}.`
    : "Guia de campeão de League of Legends.";

  return (
    <div className="min-h-screen app-bg flex flex-col">
      <Seo title={title} description={description} path={`/campeoes/${championId}`} noindex={notFound} />
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-6 space-y-4 w-full">
        <Link to="/campeoes" className="text-xs text-ink-40 hover:text-ink-70 transition-colors w-fit block">
          ‹ Todos os campeões
        </Link>

        {notFound ? (
          <p className="text-sm text-ink-50 py-10 text-center">Campeão não encontrado.</p>
        ) : !data ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-ink-40" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-white/[.08] h-48">
              <img src={data.splash} alt={data.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(12,13,17,.1),rgba(12,13,17,.92))" }} />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h1 className="text-2xl font-extrabold text-foreground">{data.name}</h1>
                <p className="text-sm text-brand font-medium">{data.title}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {data.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-white/[.05] border border-white/[.08] text-ink-70">
                  {tag}
                </span>
              ))}
              {data.resource && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-white/[.05] border border-white/[.08] text-ink-70">
                  Recurso: {data.resource}
                </span>
              )}
            </div>

            {data.bio && <p className="text-sm text-ink-70 leading-relaxed">{data.bio}</p>}

            <div className="glass rounded-2xl border border-white/[.07] p-4 grid grid-cols-2 gap-3">
              {(Object.entries(data.stats) as [keyof typeof data.stats, number][]).map(([key, value]) => (
                <StatBar key={key} label={STAT_LABEL[key] ?? key} value={value} />
              ))}
            </div>

            <div className="glass rounded-2xl border border-white/[.07] p-4 space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-brand">Habilidades</h2>
              {data.abilities.map((a) => (
                <div key={a.key} className="flex items-start gap-3">
                  {a.image && <img src={a.image} alt={a.name} className="w-10 h-10 rounded-md shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground">
                      <span className="text-brand">{a.key}</span> — {a.name}
                    </p>
                    <p className="text-xs text-ink-50 leading-relaxed">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {(data.allyTips.length > 0 || data.enemyTips.length > 0) && (
              <div className="glass rounded-2xl border border-white/[.07] p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.allyTips.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-advantage uppercase tracking-wider mb-1.5">Como jogar com {data.name}</p>
                    <ul className="space-y-1">
                      {data.allyTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-ink-70">
                          <span className="text-advantage shrink-0">▸</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.enemyTips.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-threat uppercase tracking-wider mb-1.5">Como jogar contra {data.name}</p>
                    <ul className="space-y-1">
                      {data.enemyTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-ink-70">
                          <span className="text-threat shrink-0">▸</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <Link
              to={`/?ally=${encodeURIComponent(data.id)}`}
              className="flex items-center justify-center h-12 rounded-[13px] font-bold text-[14.5px] shadow-brand"
              style={{ background: "linear-gradient(180deg,#FFC94A,#F5B21A)", color: "var(--on-accent)" }}
            >
              Gerar plano estratégico com {data.name}
            </Link>
          </div>
        )}
      </main>

      <Footer patch={data?.patch} />
    </div>
  );
};

export default ChampionWiki;
