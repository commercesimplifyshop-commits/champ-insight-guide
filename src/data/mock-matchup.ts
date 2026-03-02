import { LaneMatchupPlan, Champion } from "@/types/matchup";

export const CHAMPIONS: Champion[] = [
  { id: "aatrox", name: "Aatrox", role: "Fighter", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Aatrox.png" },
  { id: "ahri", name: "Ahri", role: "Mage", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Ahri.png" },
  { id: "akali", name: "Akali", role: "Assassin", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Akali.png" },
  { id: "darius", name: "Darius", role: "Fighter", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Darius.png" },
  { id: "ezreal", name: "Ezreal", role: "Marksman", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Ezreal.png" },
  { id: "garen", name: "Garen", role: "Fighter", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Garen.png" },
  { id: "jinx", name: "Jinx", role: "Marksman", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Jinx.png" },
  { id: "kaisa", name: "Kai'Sa", role: "Marksman", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Kaisa.png" },
  { id: "lux", name: "Lux", role: "Mage", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Lux.png" },
  { id: "yasuo", name: "Yasuo", role: "Fighter", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Yasuo.png" },
  { id: "zed", name: "Zed", role: "Assassin", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Zed.png" },
  { id: "thresh", name: "Thresh", role: "Support", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Thresh.png" },
  { id: "lee-sin", name: "Lee Sin", role: "Fighter", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/LeeSin.png" },
  { id: "vayne", name: "Vayne", role: "Marksman", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Vayne.png" },
  { id: "morgana", name: "Morgana", role: "Mage", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Morgana.png" },
  { id: "katarina", name: "Katarina", role: "Assassin", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Katarina.png" },
];

export const MOCK_PLAN: LaneMatchupPlan = {
  type: "lane",
  meta: {
    allyChampion: "Garen",
    allyImage: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Garen.png",
    enemyChampion: "Darius",
    enemyImage: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Darius.png",
    role: "top",
    difficulty: "hard",
    winRate: "44.2%",
    patch: "14.1",
  },
  overview: {
    earlyAdvantage: {
      level: "hard",
      summary: "Darius wins extended trades at all stages of laning phase. His passive Hemorrhage stacks make prolonged fights lethal.",
    },
    primaryPlan: "Short trades with Q → back off. Farm safely until level 9+. Freeze near your tower and call for jungle assistance pre-6.",
    biggestThreat: "Getting pulled (E) into a 5-stack passive combo. At 5 stacks + R, Darius can 100-0 you from 50% HP.",
    firstDecisionFocus: "Level 1: Do NOT contest the wave. Let him push. Start Q, farm from max range. Take Second Wind.",
  },
  earlyGame: {
    title: "Early Game (Lv 1-6)",
    objective: "Survive without dying. Maintain CS within 10-15 deficit.",
    bullets: [
      "Start Doran's Shield + Second Wind for sustain",
      "Use Q to last-hit from range — never walk up for melee CS when his E is available",
      "If he pulls you, immediately W and walk away. Do NOT auto-attack back",
      "Freeze the wave just outside your tower range",
      "Ping for jungle help between levels 3-5 when his E is on cooldown",
      "Back at 1100g minimum for Plated Steelcaps",
    ],
  },
  jungleControl: {
    wardingPriority: "Tribush ward at 2:30. River bush ward when pushing past mid-lane.",
    objectiveFocus: "Rift Herald is critical — if your jungler takes it, you can break freeze and get plates safely.",
    bullets: [
      "Ward tribush at 2:30 to avoid early ganks that snowball Darius",
      "If Darius freezes, ask jungler to break it — don't walk up alone",
      "Track enemy jungler; Darius with jungle support is a kill lane",
      "Contest scuttle only if Darius is pushed under his tower",
    ],
  },
  powerSpikes: [
    { timing: "Level 1-3", advantage: "enemy", description: "Darius dominates with passive + W slow" },
    { timing: "Level 6", advantage: "enemy", description: "Noxian Guillotine resets on kills — lethal threshold" },
    { timing: "Level 9", advantage: "even", description: "Your Q max + Steelcaps reduce his trade power" },
    { timing: "Level 11+", advantage: "ally", description: "You outscale in teamfights with Villain passive" },
    { timing: "2 Items", advantage: "ally", description: "Stridebreaker + Dead Man's gives you engage and kite" },
  ],
  midGame: {
    title: "Mid Game (Lv 7-13)",
    objective: "Group for objectives. Avoid solo lanes against Darius unless ahead.",
    bullets: [
      "Join teamfights — your value is higher in 5v5 than his",
      "Use Decisive Strike to silence key targets in fights",
      "Split push only if Darius is visible on the map elsewhere",
      "Prioritize Dragon fights where your tankiness matters",
      "Build Mortal Reminder if he builds sustain items",
    ],
  },
  lateGame: {
    title: "Late Game (Lv 14+)",
    objective: "Front-line for your team. Zone Darius from reaching your carries.",
    bullets: [
      "You are the primary engage/peel — don't side-lane",
      "Your Villain passive executes are game-changing in teamfights",
      "Darius falls off if he can't stack passive — kite him in fights",
      "Prioritize Baron and Elder Drake fights",
    ],
  },
  itemization: {
    coreBuild: [
      { name: "Plated Steelcaps", reason: "Reduces auto-attack damage from passive stacking" },
      { name: "Stridebreaker", reason: "Slow + gap close for short trades" },
      { name: "Dead Man's Plate", reason: "Movespeed to avoid his pull range" },
    ],
    situational: [
      { name: "Bramble Vest", reason: "Rush if he builds lifesteal early" },
      { name: "Spirit Visage", reason: "Only if team has AP threats too" },
      { name: "Mortal Reminder", reason: "Late game anti-heal for extended fights" },
    ],
    runeNote: "Grasp of the Undying > Shield Bash > Second Wind > Unflinching. Secondary: Nimbus Cloak + Celerity for escape.",
  },
  mistakes: [
    { text: "Extended trading (3+ auto attacks) lets him stack passive to 5", severity: "critical" },
    { text: "Staying in lane below 50% HP — you are in Guillotine kill range", severity: "critical" },
    { text: "Chasing Darius when he walks away — he baits you into his E range", severity: "warning" },
    { text: "Not freezing the wave — pushing gives him kill pressure with ghost", severity: "warning" },
    { text: "Building damage items before defensive boots", severity: "minor" },
  ],
};
