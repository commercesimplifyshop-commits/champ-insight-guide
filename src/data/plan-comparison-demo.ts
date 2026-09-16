import type { LaneMatchupPlan } from "@/types/matchup";

// Illustrative Fiora x Jax (top) matchup used only to demo the free vs
// Premium difference on the pricing page — not a live API response.
// Kept in sync by hand with the shape LaneAnalysisView actually renders, so
// reusing the real component here can never visually drift from production.

const SHARED_META = {
  allyChampion: "Fiora",
  allyChampionId: "Fiora",
  allyImage: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Fiora.png",
  enemyChampion: "Jax",
  enemyChampionId: "Jax",
  enemyImage: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Jax.png",
  role: "top" as const,
  winRate: "—",
  patch: "16.18.1",
};

const STYLE_FOCUS = {
  summary:
    "Para vencer este confronto, use a mobilidade de Fiora para engajar em trocas rápidas e sair antes que Jax possa retaliar. Foque em punir Jax quando seu E não estiver disponível e utilize Teleport para se juntar a lutas em outras partes do mapa.",
  keyMoments: [
    "Nível 2: Inicie uma troca rápida assim que conseguir o W, punindo Jax se ele errar o E.",
    "Nível 6: Use o R para forçar um all-in em Jax se ele estiver com pouca vida, garantindo um abate e recuperando vida.",
    "Minuto 10: Teleporte para uma luta no bot se houver uma vantagem clara, ou se o Dragão estiver prestes a ser contestado.",
  ],
  adaptationTip:
    "Se Jax começar a ganhar vantagem, foque em evitar trocas diretas e concentre-se em split push, utilizando sua vantagem de wave e Teleport para se juntar a lutas em outras lanes.",
};

const POWER_SPIKES: LaneMatchupPlan["powerSpikes"] = [
  { timing: "Nível 6", advantage: "ally", description: "Fiora ganha acesso ao R, permitindo que ela inicie trocas decisivas contra Jax." },
  { timing: "Itens", advantage: "ally", description: "Fiora se torna muito mais forte em trocas e split push." },
  { timing: "Nível 11", advantage: "ally", description: "Aumenta o dano do R, permitindo que Fiora derrote Jax rapidamente." },
];

const EARLY_BULLETS = [
  "No nível 1, evite trocas diretas e foque em farmar até o nível 2, onde você pode usar o W para bloquear o E de Jax.",
  "Tente forçar um all-in no nível 3, quando você tiver acesso a todas as habilidades.",
  "Use a habilidade de Fiora de atacar Vitals para curar e sair de trocas desfavoráveis.",
];

export const demoFreePlan: LaneMatchupPlan = {
  type: "lane",
  meta: { ...SHARED_META, difficulty: "slight", locked: true },
  overview: {
    earlyAdvantage: {
      level: "slight",
      summary:
        "Fiora tem uma leve vantagem no início devido ao seu potencial de trocas rápidas e capacidade de punir erros de posicionamento de Jax.",
    },
    primaryPlan:
      "Utilizar a vantagem de trocas de Fiora para forçar Jax a recuar, focando em abates e pressão de mapa através de split push. Sempre que possível, tente pegar Jax fora de posição para garantir eliminações rápidas.",
    biggestThreat:
      "O maior perigo é o E de Jax, que pode anular suas trocas e causar um stun, especialmente se você não tiver o W disponível.",
    firstDecisionFocus: "Decidir entre forçar trocas no nível 2 ou 3, ou focar em farmar e preparar um gank do jungler.",
  },
  styleFocus: STYLE_FOCUS,
  earlyGame: {
    title: "Controle da Lane Inicial",
    objective: "Dominar as trocas e garantir visão.",
    bullets: EARLY_BULLETS,
  },
  powerSpikes: POWER_SPIKES,
};

export const demoPremiumPlan: LaneMatchupPlan = {
  type: "lane",
  meta: { ...SHARED_META, difficulty: "slight", locked: false },
  overview: {
    earlyAdvantage: {
      level: "slight",
      summary:
        "Fiora tem vantagem nos primeiros níveis se conseguir abusar dos Vitals e evitar o E (Counter Strike) do Jax, mas Jax escala bem e se torna perigoso após nível 6.",
    },
    primaryPlan:
      "Procure trocas curtas e agressivas nos níveis 1-3, abusando da mobilidade do Q para acertar Vitals e sair antes do E do Jax. Pressione a lane para criar slow push, force o Jax a farmar sob torre e prepare-se para all-ins quando o E dele estiver em cooldown.",
    biggestThreat:
      "O E (Counter Strike) do Jax pode negar seu dano e virar trocas se você errar o timing do W (Ripostar). Após nível 6, o all-in do Jax fica mais forte.",
    firstDecisionFocus:
      "Identifique o tempo de recarga do E do Jax — só engaje agressivamente quando ele estiver em cooldown. Preste atenção ao jungler inimigo antes de avançar demais.",
  },
  styleFocus: STYLE_FOCUS,
  earlyGame: {
    title: "Pressão Inicial e Trocas Curtas",
    objective: "Garantir vantagem de vida e pressão de wave nos níveis 1-3, preparando terreno para split push.",
    bullets: EARLY_BULLETS,
  },
  powerSpikes: POWER_SPIKES,
  jungleControl: {
    wardingPriority: "Ward profunda no tribush/topo do rio após o primeiro slow push.",
    objectiveFocus: "Aproveitar a pressão de lane para garantir visão e preparar dive ou contestar o Herald.",
    bullets: [
      "Coloque uma ward avançada no rio/top tribush após empurrar a wave.",
      "Se o jungler aliado vier, force troca agressiva para tentar divear o Jax se ele estiver com pouca vida.",
      "Se o jungler inimigo aparecer, use Q para recuar rapidamente e evite overextend.",
      "Prepare slow push para coincidir com o spawn do Herald, facilitando a rotação do seu time.",
    ],
  },
  midGame: {
    title: "Split Push e Pressão Lateral",
    objective: "Dominar o side lane, forçando Jax a responder e criando vantagem numérica para o time.",
    bullets: [
      "Foque em slow push top ou bot, dependendo da posição do próximo objetivo global (Herald ou Dragão).",
      "Mantenha visão profunda e pressione a torre enquanto o Jax estiver preso defendendo.",
      "Se o Jax rotacionar para lutar, use TP apenas se a luta for decisiva para o objetivo.",
      "Se o jungler inimigo vier, tente 1v2 se estiver forte, usando o W para negar CC e buscar reset com R.",
    ],
  },
  lateGame: {
    title: "1-3-1 e Pressão Máxima",
    objective: "Manter pressão constante em side lane, forçando múltiplos inimigos a responderem e abrindo espaço para o time.",
    bullets: [
      "Escolha o side lane oposto ao Barão/Dragão para puxar, forçando o time inimigo a dividir recursos.",
      "Se o Jax vier sozinho, busque o 1v1 abusando do W no E dele.",
      "Se vierem 2 ou mais, tente ganhar tempo com Q+W e, se possível, levar a torre ou eliminar um alvo isolado.",
      "Só use TP para fights que realmente definam o jogo — priorize sempre a pressão lateral.",
    ],
  },
  itemization: {
    coreBuild: [
      { name: "Ruptor Divino", reason: "excelente para trocas curtas e sustain, além de ajudar a lidar com a resistência do Jax." },
      { name: "Hidra Raivosa", reason: "aumenta o clear de wave e o potencial de split push." },
      { name: "Botas de Armadura", reason: "reduz dano físico do Jax e facilita duelos prolongados." },
      { name: "Quebracascos", reason: "potencializa o split push e aumenta sua resistência em 1v1/1v2." },
    ],
    situational: [
      { name: "Dança da Morte", reason: "ótima para sustain em trocas longas e reduzir burst do Jax." },
      { name: "Coração Congelado", reason: "se o Jax estiver muito forte, reduz o DPS dele drasticamente." },
      { name: "Anjo Guardião", reason: "para dives agressivos e split push profundo, dá uma segunda chance em 1v2/1v3." },
    ],
    runeNote:
      "Conquistador é obrigatório para trocas prolongadas; secundárias com Inabalável e Ventos Revigorantes ajudam contra o poke e all-in do Jax.",
  },
  mistakes: [
    { text: "Iniciar all-in enquanto o E do Jax está disponível, permitindo que ele negue seu dano e stun você.", severity: "critical" },
    { text: "Usar o W cedo demais ou fora do timing do E do Jax, perdendo a chance de negar o stun e virar a troca.", severity: "critical" },
    { text: "Avançar sem visão profunda, facilitando ganks 1v2 e morrendo em split push.", severity: "warning" },
    { text: "Gastar o TP apenas para voltar para lane, perdendo pressão global em objetivos importantes.", severity: "warning" },
    { text: "Forçar trocas longas depois que o Jax fecha dois itens defensivos, onde ele escala melhor.", severity: "minor" },
  ],
};
