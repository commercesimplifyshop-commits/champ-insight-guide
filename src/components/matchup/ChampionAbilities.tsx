import { useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import type { ChampionAbilities as ChampionAbilitiesData } from "@/types/abilities";
import { useI18n } from "@/lib/i18n";
import CollapsibleSection from "./CollapsibleSection";

interface ChampionAbilitiesProps {
  championId: string;
  championName: string;
  side: "ally" | "enemy";
}

/**
 * Free educational content (passive + Q/W/E/R + Riot's own tips) for players
 * who don't know a champion's kit — always fetched regardless of the
 * section's collapsed state since the data is tiny and server-cached.
 */
const ChampionAbilities = ({ championId, championName, side }: ChampionAbilitiesProps) => {
  const { locale, t } = useI18n();
  const [data, setData] = useState<ChampionAbilitiesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const language = locale === "pt" ? "pt-BR" : "en-US";
    fetch(`/api/champions/${encodeURIComponent(championId)}/abilities?language=${language}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [championId, locale]);

  return (
    <CollapsibleSection
      title={`${t("abilities.title")} — ${championName}`}
      icon={<Sparkles className="w-4 h-4" />}
      iconColorClass={side === "ally" ? "text-info-status" : "text-threat"}
    >
      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      ) : !data ? (
        <p className="text-xs text-muted-foreground">{t("abilities.error")}</p>
      ) : (
        <div className="space-y-3">
          {data.abilities.map((a) => (
            <div key={a.key} className="flex items-start gap-3">
              {a.image && <img src={a.image} alt={a.name} className="w-10 h-10 rounded-md shrink-0" />}
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground">
                  <span className="text-brand">{a.key}</span> — {a.name}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.description}</p>
              </div>
            </div>
          ))}

          {(data.allyTips.length > 0 || data.enemyTips.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border">
              {data.allyTips.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-advantage uppercase tracking-wider mb-1.5">
                    {t("abilities.howToPlay")}
                  </p>
                  <ul className="space-y-1">
                    {data.allyTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-foreground/80">
                        <span className="text-advantage shrink-0">▸</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {data.enemyTips.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-threat uppercase tracking-wider mb-1.5">
                    {t("abilities.howToPlayAgainst")}
                  </p>
                  <ul className="space-y-1">
                    {data.enemyTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-foreground/80">
                        <span className="text-threat shrink-0">▸</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </CollapsibleSection>
  );
};

export default ChampionAbilities;
