import type { MatchupPlan } from "./matchup";

export interface HistoryItem {
  id: string;
  role: string;
  ally_champion_id: string;
  ally_champion_name: string;
  /** Null for solo plans (no opponent). */
  enemy_champion_id: string | null;
  enemy_champion_name: string | null;
  plan: MatchupPlan;
  created_at: string;
}
