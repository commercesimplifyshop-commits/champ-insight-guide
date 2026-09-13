import { useState } from "react";
import { Loader2, Swords } from "lucide-react";
import type { Role, Champion } from "@/types/matchup";
import type { CounterFinderResult } from "@/types/counters";
import { useI18n } from "@/lib/i18n";
import RoleSelector from "@/components/matchup/RoleSelector";
import ChampionPicker from "@/components/matchup/ChampionPicker";

const threatStyles: Record<CounterFinderResult["counters"][number]["threat"], string> = {
  high: "bg-threat/15 text-threat border-threat/40",
  medium: "bg-caution/15 text-caution border-caution/40",
  low: "bg-advantage/15 text-advantage border-advantage/40",
};

const CounterFinder = () => {
  const { t } = useI18n();
  const [role, setRole] = useState<Role | null>(null);
  const [champion, setChampion] = useState<Champion | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CounterFinderResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSearch = role && champion;

  const handleSearch = async () => {
    if (!canSearch) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        championId: champion!.id || champion!.name,
        role: role!,
        language: "pt-BR",
      });
      const res = await fetch(`/api/counters?${params.toString()}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Erro ao buscar counters (HTTP ${res.status})`);
      }
      const data = (await res.json()) as CounterFinderResult;
      setResult(data);
    } catch (err: any) {
      setError(err?.message || t("counters.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setRole(null);
    setChampion(null);
    setError(null);
  };

  if (result) {
    return (
      <div className="space-y-4">
        <div className="surface-1 border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              {result.champion.image && (
                <img
                  src={result.champion.image}
                  alt={result.champion.name}
                  className="w-12 h-12 rounded-md border-2 border-brand"
                />
              )}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                  {t("counters.showingFor")}
                </p>
                <p className="font-semibold text-foreground text-sm">
                  {result.champion.name} · {result.role.toUpperCase()}
                </p>
              </div>
            </div>
            <button onClick={handleReset} className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
              {t("counters.newSearch")}
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground font-mono">Patch {result.patch}</p>
        </div>

        <div className="space-y-2">
          {result.counters.map((c, i) => (
            <div key={`${c.id}-${i}`} className="surface-1 border border-border rounded-lg p-3 flex items-start gap-3">
              <span className="text-xs font-mono text-muted-foreground w-4 pt-1 shrink-0">{i + 1}</span>
              {c.image && <img src={c.image} alt={c.name} className="w-10 h-10 rounded-md shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm text-foreground">{c.name}</p>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${threatStyles[c.threat]}`}>
                    {t(`counters.threat.${c.threat}` as any)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{c.reason}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground/70 text-center leading-relaxed px-6">
          {t("counters.disclaimer")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <h1 className="text-lg font-extrabold text-foreground tracking-tight">{t("counters.title")}</h1>
        <p className="text-xs text-muted-foreground">{t("counters.subtitle")}</p>
        {error && (
          <div className="max-w-3xl mx-auto px-4 mt-3">
            <div role="status" className="rounded-md border border-caution bg-caution/10 text-caution px-4 py-2 text-sm shadow-sm">
              {error}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <RoleSelector selected={role} onSelect={setRole} />
      </div>

      <div className="max-w-sm mx-auto">
        <ChampionPicker
          label={t("counters.champion")}
          side="neutral"
          selected={champion}
          onSelect={setChampion}
          onClear={() => setChampion(null)}
        />
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={handleSearch}
          disabled={!canSearch || loading}
          className={`px-8 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            canSearch
              ? "bg-brand text-primary-foreground hover:brightness-110 shadow-brand"
              : "surface-2 text-muted-foreground cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("counters.searching")}
            </>
          ) : (
            <>
              <Swords className="w-4 h-4" />
              {t("counters.search")}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CounterFinder;
