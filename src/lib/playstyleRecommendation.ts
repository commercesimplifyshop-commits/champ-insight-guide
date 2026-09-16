import type { Role, PlayStyle, MacroStyle } from "@/types/matchup";

/**
 * Suggests a temperament + macro style based on the player's chosen role and
 * champion class (Data Dragon's primary tag — Fighter/Tank/Mage/Assassin/
 * Marksman/Support, already returned as `role` on Champion by the backend's
 * /api/champions search). Role takes priority for jungle/support, where the
 * macro identity is driven more by the role than the champion's class.
 */
export function recommendStyles(role: Role | null, championClass: string | undefined): {
  temperament: PlayStyle;
  macroStyle: MacroStyle;
} {
  const cls = (championClass || "").toLowerCase();

  if (role === "jungle") {
    const temperament: PlayStyle = cls === "tank" ? "cautious" : cls === "mage" || cls === "marksman" ? "patient" : "aggressive";
    return { temperament, macroStyle: "roamer" };
  }

  if (role === "support") {
    return { temperament: "cautious", macroStyle: "protect_carry" };
  }

  switch (cls) {
    case "fighter":
      return { temperament: "aggressive", macroStyle: "split_push" };
    case "tank":
      return { temperament: "cautious", macroStyle: "protect_carry" };
    case "mage":
      return { temperament: "patient", macroStyle: "poke" };
    case "assassin":
      return { temperament: "aggressive", macroStyle: "pick" };
    case "marksman":
      return { temperament: "patient", macroStyle: "scaling" };
    default:
      return { temperament: "balanced", macroStyle: "scaling" };
  }
}
