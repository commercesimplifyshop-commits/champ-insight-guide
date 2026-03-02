// Types that map directly from the API JSON response
// Each type corresponds to a UI component

export type Role = "top" | "jungle" | "mid" | "adc" | "support";

export type AdvantageLevel = "strong" | "slight" | "even" | "slight_disadvantage" | "hard";

export interface Champion {
  id: string;
  name: string;
  image: string;
  role: string;
}

/** The full strategic plan JSON from the API */
export interface MatchupPlan {
  meta: MatchupMeta;
  overview: MatchupOverview;
  earlyGame: GamePhase;
  jungleControl: JungleControl;
  powerSpikes: PowerSpike[];
  midGame: GamePhase;
  lateGame: GamePhase;
  itemization: Itemization;
  mistakes: MistakeItem[];
}

export interface MatchupMeta {
  allyChampion: string;
  allyImage: string;
  enemyChampion: string;
  enemyImage: string;
  role: Role;
  difficulty: AdvantageLevel;
  winRate: string;
  patch: string;
}

/** The DOMINANT first-glance section */
export interface MatchupOverview {
  earlyAdvantage: {
    level: AdvantageLevel;
    summary: string;
  };
  primaryPlan: string;
  biggestThreat: string;
  firstDecisionFocus: string;
}

export interface GamePhase {
  title: string;
  objective: string;
  bullets: string[];
}

export interface JungleControl {
  wardingPriority: string;
  objectiveFocus: string;
  bullets: string[];
}

export interface PowerSpike {
  timing: string;
  advantage: "ally" | "enemy" | "even";
  description: string;
}

export interface Itemization {
  coreBuild: ItemEntry[];
  situational: ItemEntry[];
  runeNote: string;
}

export interface ItemEntry {
  name: string;
  reason: string;
}

export interface MistakeItem {
  text: string;
  severity: "critical" | "warning" | "minor";
}
