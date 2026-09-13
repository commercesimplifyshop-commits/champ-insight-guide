export interface AbilityInfo {
  key: "P" | "Q" | "W" | "E" | "R";
  name: string;
  description: string;
  image: string | null;
}

export interface ChampionAbilities {
  championId: string;
  championName: string;
  patch: string;
  abilities: AbilityInfo[];
  allyTips: string[];
  enemyTips: string[];
}
