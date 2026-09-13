import type { Role } from "./matchup";

export interface CounterEntry {
  id: string;
  name: string;
  image: string | null;
  reason: string;
  threat: "high" | "medium" | "low";
}

export interface CounterFinderResult {
  champion: { id: string; name: string; image: string | null };
  role: Role;
  patch: string;
  counters: CounterEntry[];
}
