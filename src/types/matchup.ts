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

/** Lane strategic plan (top, mid, adc, support) */
export interface LaneMatchupPlan {
  type: "lane";
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

/** Jungle-specific strategic plan */
export interface JungleMatchupPlan {
  type: "jungle";
  meta: MatchupMeta;
  overview: MatchupOverview;
  clearPath: JungleClearPath;
  gankingStrategy: GankingStrategy;
  objectiveControl: ObjectiveControl;
  counterJungling: CounterJungling;
  powerSpikes: PowerSpike[];
  midGame: GamePhase;
  lateGame: GamePhase;
  itemization: Itemization;
  mistakes: MistakeItem[];
}

export type MatchupPlan = LaneMatchupPlan | JungleMatchupPlan;

export interface JungleClearPath {
  recommendedStart: string;
  fullClearRoute: string[];
  firstBackTiming: string;
}

export interface GankingStrategy {
  priority: string;
  bestTimings: string[];
  bullets: string[];
}

export interface ObjectiveControl {
  dragonPriority: string;
  heraldStrategy: string;
  bullets: string[];
}

export interface CounterJungling {
  riskLevel: "low" | "medium" | "high";
  strategy: string;
  bullets: string[];
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
