import type { JungleMatchupPlan } from "@/types/matchup";

export const MOCK_JUNGLE_PLAN: JungleMatchupPlan = {
  type: "jungle",
  meta: {
    allyChampion: "Lee Sin",
    allyImage: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/LeeSin.png",
    enemyChampion: "Aatrox",
    enemyImage: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Aatrox.png",
    role: "jungle",
    difficulty: "slight",
    winRate: "52.1%",
    patch: "14.1",
  },
  overview: {
    earlyAdvantage: {
      level: "strong",
      summary: "Lee Sin tem clear saudável e pressão de gank superior nos primeiros níveis. Aproveite a janela de early game.",
    },
    primaryPlan: "Fazer 3 camps → gank cedo. Priorize ganks no lado que tem mais pressão de lane. Busque vantagem antes do nível 6.",
    biggestThreat: "Ser invadido por junglers com duelo forte nível 3 (ex: Xin Zhao, Warwick). Sempre warde sua jungle entrada.",
    firstDecisionFocus: "Nível 3: Avalie qual lane está mais empurrada para o primeiro gank. Priorize lanes com CC.",
  },
  clearPath: {
    recommendedStart: "Red Buff → Krugs → Raptors (lado bot para pedir leash)",
    fullClearRoute: [
      "Red Buff (leash do bot)",
      "Krugs (Smite)",
      "Raptors",
      "Gank Mid ou Top se houver oportunidade",
      "Wolves → Blue Buff → Gromp",
    ],
    firstBackTiming: "Volte com ~1100g para Whip ou Long Sword + Boots",
  },
  gankingStrategy: {
    priority: "Foque lanes com CC aliado e que estejam empurradas para o seu lado",
    bestTimings: [
      "Nível 3 após Red side clear — gank top/mid",
      "Pós nível 6 com ult — ganks de dive são possíveis",
      "Após segundo buff respawn (~5:15) — segundo ciclo de ganks",
    ],
    bullets: [
      "Use Q como engage apenas se tiver certeza do hit — errar Q = gank perdido",
      "Ward hop (W) para reposicionar atrás do inimigo antes de chutar (R)",
      "Priorize ganks bot para controle de Dragão",
      "Contra-gank é tão forte quanto gankar — tracked o jungler inimigo",
    ],
  },
  objectiveControl: {
    dragonPriority: "Dragão é prioridade após gank bot bem-sucedido. Sempre tenha controle de visão no rio.",
    heraldStrategy: "Herald no minuto 8-10 para dar vantagem de plates para o top/mid que está ganhando.",
    bullets: [
      "Warde o Dragão aos 4:30 para saber se o inimigo tenta early Drake",
      "Solo Drake é possível nível 5 com Smite — apenas se souber onde o jungler inimigo está",
      "Herald > Drake se seu top/mid está ahead — plates geram mais ouro",
      "Conteste objetivos apenas com número — não force 50/50",
    ],
  },
  counterJungling: {
    riskLevel: "medium",
    strategy: "Invada camps do lado oposto ao jungler inimigo. Roube Raptors/Krugs quando ele estiver no lado oposto do mapa.",
    bullets: [
      "Track o jungler inimigo pelo CS e spawns de Scuttle",
      "Invada apenas com visão — colocar ward na entrada da jungle inimiga",
      "Raptors e Krugs são os camps mais eficientes para roubar",
      "Se encontrar o jungler inimigo 1v1, avalie se tem vantagem de vida e nível antes de lutar",
    ],
  },
  powerSpikes: [
    { timing: "Nível 3", advantage: "ally", description: "Lee Sin tem um dos duelos mais fortes nível 3 da jungle" },
    { timing: "Nível 6", advantage: "ally", description: "Ult adiciona burst e utilidade — ganks de kick são mortais" },
    { timing: "Nível 9", advantage: "even", description: "Outros junglers começam a escalar — sua janela de early diminui" },
    { timing: "2 Items", advantage: "even", description: "Transição para bruiser/tank — Lee Sin cai em dano puro" },
    { timing: "Late Game", advantage: "enemy", description: "Lee Sin cai consideravelmente — foque em picks e kick em carries" },
  ],
  midGame: {
    title: "Mid Game (Lv 7-13)",
    objective: "Transicione de carry para facilitador. Foque em objetivos e peel para carries.",
    bullets: [
      "Priorize picks com Q → R → Q em carries isolados",
      "Use R para kickar bruisers/tanks para longe do seu ADC",
      "Warde agressivamente a jungle inimiga para controle de mapa",
      "Conteste todo Dragão e Herald — Lee Sin é forte em skirmishes",
      "Não force fights sozinho — seu valor é maior em 3v3 e 5v5",
    ],
  },
  lateGame: {
    title: "Late Game (Lv 14+)",
    objective: "Seu papel é único: encontrar kicks em carries inimigos ou peel para o seu time.",
    bullets: [
      "Fique na fog of war — picks com Q são game-changing",
      "Insec (ward hop + R) no ADC/Mid inimigo ganha teamfights",
      "Se atrás, foque em peeling — chutar divers para longe do seu ADC",
      "Controle de visão no Baron/Elder é sua prioridade #1",
    ],
  },
  itemization: {
    coreBuild: [
      { name: "Ionian Boots", reason: "CDR para mais Qs e wards — essencial para mobilidade" },
      { name: "Eclipse", reason: "Burst + sustain + shield para duelos e ganks" },
      { name: "Black Cleaver", reason: "Armor shred para o time + HP para sobreviver" },
    ],
    situational: [
      { name: "Maw of Malmortius", reason: "Contra comps com muito AP burst" },
      { name: "Guardian Angel", reason: "Se você é o engage principal — segunda vida é crucial" },
      { name: "Serpent's Fang", reason: "Contra shields (Lulu, Janna, Karma)" },
    ],
    runeNote: "Conqueror > Triumph > Legend: Haste > Last Stand. Secundário: Magical Footwear + Cosmic Insight para CDR de Smite.",
  },
  mistakes: [
    { text: "Forçar ganks quando lanes estão empurradas — você vai ser colapsado", severity: "critical" },
    { text: "Gastar Q sem visão — pode resultar em facecheck fatal", severity: "critical" },
    { text: "Ignorar farm por ganks que não resultam em kill — cai em XP e ouro", severity: "warning" },
    { text: "Não trackear o jungler inimigo — resulta em counter-ganks e objetivos perdidos", severity: "warning" },
    { text: "Insec forçado sem flash — alto risco e baixa chance de sucesso", severity: "minor" },
  ],
};
