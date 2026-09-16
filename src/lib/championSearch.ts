/**
 * Normalizes text for champion search: strips diacritics (NFD + combining
 * marks) and apostrophes/curly quotes, lowercases. Lets "khazix" match
 * "Kha'Zix" and "chogath" match "Cho'Gath".
 */
export const normalizeForSearch = (s: string): string =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
    .toLowerCase();

/**
 * Filters+ranks a list by substring match on `getText`, prefix matches
 * first (then by earliest match position, then alphabetically).
 */
export const searchRanked = <T>(items: T[], query: string, getText: (item: T) => string): T[] => {
  const q = normalizeForSearch(query.trim());
  if (!q) return items;

  const scored = items
    .map((item) => {
      const idx = normalizeForSearch(getText(item)).indexOf(q);
      return idx === -1 ? null : { item, idx };
    })
    .filter((x): x is { item: T; idx: number } => x !== null);

  scored.sort((a, b) => a.idx - b.idx || getText(a.item).localeCompare(getText(b.item)));
  return scored.map((x) => x.item);
};
