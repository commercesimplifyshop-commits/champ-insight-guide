import type { Role, GamePhase } from "./matchup";

export interface TeamSlotInput {
  role: Role;
  championId: string;
}

export interface TeamSlot {
  role: Role;
  championId: string;
  championName: string;
  championImage: string | null;
}

export interface KeyThreat {
  championName: string;
  reason: string;
}

export interface TeammateCallout {
  role: Role;
  championName: string;
  advice: string;
}

export interface TeamAnalysisPlan {
  allyTeam: TeamSlot[];
  enemyTeam: TeamSlot[];
  patch: string;
  identity: {
    compType: string;
    winCondition: string;
    summary: string;
  };
  keyThreats: KeyThreat[];
  earlyGame: GamePhase;
  midGame: GamePhase;
  lateGame: GamePhase;
  objectivePriority: {
    dragon: string;
    baron: string;
    herald: string;
  };
  teammateCallouts: TeammateCallout[];
}
