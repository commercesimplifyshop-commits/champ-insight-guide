import type { MatchupPlan } from "./matchup";

export interface HistoryItem {
  id: string;
  role: string;
  ally_champion_id: string;
  ally_champion_name: string;
  enemy_champion_id: string;
  enemy_champion_name: string;
  plan: MatchupPlan;
  created_at: string;
}
