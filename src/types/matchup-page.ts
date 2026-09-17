import type { MatchupPlan } from "./matchup";

/** A pre-generated public SEO page — see matchupgg/src/matchup-pages. */
export interface MatchupPageData {
  slug: string;
  role: string;
  ally_champion_id: string;
  ally_champion_name: string;
  enemy_champion_id: string | null;
  enemy_champion_name: string | null;
  plan: MatchupPlan;
  patch: string;
  updated_at: string;
}

export interface MatchupPageListItem {
  slug: string;
  role: string;
  updatedAt: string;
}
