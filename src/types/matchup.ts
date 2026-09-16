// Types that map directly from the API JSON response
// Each type corresponds to a UI component

export type Role = "top" | "jungle" | "mid" | "adc" | "support";

/** How the player likes to play — tailors the generated plan's advice. */
export type PlayStyle = "aggressive" | "patient" | "cautious" | "balanced";

/** LoL-specific macro strategy identity — complements PlayStyle. */
export type MacroStyle = "split_push" | "poke" | "pick" | "protect_carry" | "roamer" | "scaling";

export type AdvantageLevel = "strong" | "slight" | "even" | "slight_disadvantage" | "hard";

export interface Champion {
  id: string;
  name: string;
  image: string;
  role: string;
}

/** Concrete, matchup-specific translation of the player's chosen playstyle + macro style. */
export interface StyleFocus {
  summary: string;
  keyMoments: string[];
  adaptationTip: string;
}

/** Lane strategic plan (top, mid, adc, support) */
export interface LaneMatchupPlan {
  type: "lane";
  meta: MatchupMeta;
  overview: MatchupOverview;
  // Optional for backward-compat with plans saved before this field existed.
  styleFocus?: StyleFocus;
  earlyGame: GamePhase;
  powerSpikes: PowerSpike[];
  // Omitted by the backend for non-premium responses (see meta.locked).
  jungleControl?: JungleControl;
  midGame?: GamePhase;
  lateGame?: GamePhase;
  itemization?: Itemization;
  mistakes?: MistakeItem[];
}

/** Jungle-specific strategic plan */
export interface JungleMatchupPlan {
  type: "jungle";
  meta: MatchupMeta;
  overview: MatchupOverview;
  styleFocus?: StyleFocus;
  clearPath: JungleClearPath;
  powerSpikes: PowerSpike[];
  // Omitted by the backend for non-premium responses (see meta.locked).
  gankingStrategy?: GankingStrategy;
  objectiveControl?: ObjectiveControl;
  counterJungling?: CounterJungling;
  midGame?: GamePhase;
  lateGame?: GamePhase;
  itemization?: Itemization;
  mistakes?: MistakeItem[];
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
  allyChampionId: string;
  allyImage: string;
  enemyChampion: string;
  enemyChampionId: string;
  enemyImage: string;
  role: Role;
  difficulty: AdvantageLevel;
  winRate: string;
  patch: string;
  /** true when the deeper sections below were omitted by the backend (free preview). */
  locked?: boolean;
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
