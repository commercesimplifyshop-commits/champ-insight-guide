import type { AbilityInfo } from "./abilities";

/** Mirrors matchupgg's ChampionProfile (GET /api/champions/:id/profile). */
export interface ChampionProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  tags: string[];
  resource: string;
  stats: { attack: number; defense: number; magic: number; difficulty: number };
  image: string;
  splash: string;
  patch: string;
  abilities: AbilityInfo[];
  allyTips: string[];
  enemyTips: string[];
}
