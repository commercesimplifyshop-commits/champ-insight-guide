import type { Role } from "./matchup";

export interface CounterEntry {
  id: string;
  name: string;
  image: string | null;
  reason: string;
  /** Concrete guidance on how to still play well when facing this counter. */
  howToPlayAgainstIt: string;
  threat: "high" | "medium" | "low";
}

export interface CounterFinderResult {
  champion: { id: string; name: string; image: string | null };
  role: Role;
  patch: string;
  counters: CounterEntry[];
}
