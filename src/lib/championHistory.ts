import type { Champion } from "@/types/matchup";

const STORAGE_KEY = "mg_recent_champions";
const MAX_RECENTS = 8;

/**
 * Recently-picked champions, shared across every ChampionPicker instance
 * (matchup, counter finder, team roster) — per-browser convenience via
 * localStorage, not critical state, so failures (private browsing, blocked
 * storage) just mean an empty list rather than a crash.
 */
export const getRecentChampions = (): Champion[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const addRecentChampion = (champion: Champion): void => {
  try {
    const current = getRecentChampions().filter((c) => c.id !== champion.id);
    const next = [champion, ...current].slice(0, MAX_RECENTS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Best-effort only — losing recent-champion history isn't worth surfacing an error.
  }
};
