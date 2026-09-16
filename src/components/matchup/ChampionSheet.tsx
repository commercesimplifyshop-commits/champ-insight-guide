import { useEffect, useRef, useState } from "react";
import type { Champion } from "@/types/matchup";
import { useI18n } from "@/lib/i18n";
import { getRecentChampions, addRecentChampion } from "@/lib/championHistory";
import { searchRanked } from "@/lib/championSearch";

interface ChampionSheetProps {
  open: boolean;
  label: string;
  selected: Champion | null;
  onClose: () => void;
  onSelect: (champion: Champion) => void;
}

/** A handful of well-known champion ids used to pad the empty-query
 * suggestions when recent history alone has fewer than 8 entries — there's
 * no real popularity data source, so this is a static, honest fallback
 * rather than a fabricated "trending" stat. */
const POPULAR_FALLBACK_IDS = [
  "Ahri",
  "Yasuo",
  "LeeSin",
  "Jinx",
  "Thresh",
  "Zed",
  "Lux",
  "MissFortune",
];

const initials = (name: string) =>
  name
    .split(/[\s'’]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const ChampionSheet = ({ open, label, selected, onClose, onSelect }: ChampionSheetProps) => {
  const { locale, t } = useI18n();
  const [all, setAll] = useState<Champion[]>([]);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    fetch(`/api/${locale}/champions?q=`, { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setAll(Array.isArray(data) ? data : []))
      .catch(() => setAll([]));
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(focusTimer);
  }, [open, locale]);

  if (!open) return null;

  const recents = getRecentChampions();
  let results: (Champion & { tag?: "popular" | "escolhido" })[];

  if (!query.trim()) {
    const seen = new Set<string>();
    const suggestions: Champion[] = [];
    for (const c of recents) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        suggestions.push(c);
      }
    }
    for (const id of POPULAR_FALLBACK_IDS) {
      if (suggestions.length >= 8) break;
      const match = all.find((c) => c.id === id);
      if (match && !seen.has(match.id)) {
        seen.add(match.id);
        suggestions.push(match);
      }
    }
    results = suggestions
      .slice(0, 8)
      .map((c) => ({ ...c, tag: c.id === selected?.id ? "escolhido" : "popular" }));
  } else {
    results = searchRanked(all, query, (c) => `${c.name} ${c.id}`).map((c) => ({
      ...c,
      tag: c.id === selected?.id ? "escolhido" : undefined,
    }));
  }

  const handlePick = (c: Champion) => {
    addRecentChampion(c);
    onSelect(c);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex flex-col justify-end" style={{ background: "var(--scrim)" }}>
      <div className="flex-1" onClick={onClose} />
      <div
        className="sheet-surface border-t border-hairline rounded-t-[26px] px-5 pt-[18px] pb-[34px] flex flex-col gap-3.5 max-h-[80vh] sm:max-w-[440px] sm:mx-auto sm:w-full"
        style={{ maxHeight: "620px" }}
      >
        <div className="w-11 h-1 rounded-full bg-white/[.18] self-center" />

        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[9.5px] tracking-[.9px] text-ink-40 uppercase">{label}</span>
          <button onClick={onClose} className="font-mono text-xs text-ink-40 hover:text-ink-70 transition-colors">
            {t("championSheet.close")}
          </button>
        </div>

        <div className="flex items-center gap-2.5 pb-3 border-b" style={{ borderColor: "rgba(245,178,26,.35)" }}>
          <span className="font-mono font-bold text-xl text-brand shrink-0">/</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("championSheet.placeholder")}
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-foreground font-sans font-semibold text-[21px] tracking-[-.4px] placeholder:text-ink-40"
          />
          <span className="font-mono text-[10px] text-ink-40 shrink-0">{results.length}</span>
        </div>

        <div className="flex flex-col gap-[5px] overflow-y-auto no-scrollbar pb-1">
          {results.map((c) => (
            <button
              key={c.id}
              onClick={() => handlePick(c)}
              className={`flex items-center gap-2.5 rounded-[13px] px-3 py-2.5 text-left transition-transform active:scale-[.99] border ${
                c.tag === "escolhido" ? "bg-brand/10 border-brand/40" : "bg-white/[.035] border-hairline"
              }`}
            >
              <div className="w-[34px] h-[34px] rounded-[10px] shrink-0 flex items-center justify-center overflow-hidden bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.1)_0_5px,rgba(255,255,255,.04)_5px_10px)]">
                {c.image ? (
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-mono font-bold text-[11px] text-ink-70">{initials(c.name)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[14.5px] truncate">{c.name}</div>
                {c.role && <div className="font-mono text-[10px] text-ink-40 mt-0.5">{c.role.toLowerCase()}</div>}
              </div>
              {c.tag && (
                <span className={`font-mono text-[10px] shrink-0 ${c.tag === "escolhido" ? "text-brand" : "text-ink-40"}`}>
                  {t(c.tag === "escolhido" ? "championSheet.tagChosen" : "championSheet.tagPopular")}
                </span>
              )}
            </button>
          ))}
          {results.length === 0 && (
            <p className="py-5 px-1 text-[13px] leading-relaxed text-ink-40">{t("championSheet.noMatch")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChampionSheet;
