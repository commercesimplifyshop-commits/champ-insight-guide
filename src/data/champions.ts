// Mock champion data for template purposes
export interface Champion {
  id: string;
  name: string;
  title: string;
  role: string;
  image: string;
}

export interface MatchupAnalysis {
  threatLevel: "low" | "medium" | "high" | "extreme";
  summary: string;
  keyTips: string[];
  powerSpikes: {
    phase: string;
    advantage: "you" | "enemy" | "even";
    description: string;
  }[];
  itemBuild: { name: string; reason: string }[];
  runes: string;
  doList: string[];
  dontList: string[];
  winCondition: string;
}

export const CHAMPIONS: Champion[] = [
  { id: "aatrox", name: "Aatrox", title: "the Darkin Blade", role: "Fighter", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Aatrox.png" },
  { id: "ahri", name: "Ahri", title: "the Nine-Tailed Fox", role: "Mage", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Ahri.png" },
  { id: "akali", name: "Akali", title: "the Rogue Assassin", role: "Assassin", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Akali.png" },
  { id: "darius", name: "Darius", title: "the Hand of Noxus", role: "Fighter", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Darius.png" },
  { id: "ezreal", name: "Ezreal", title: "the Prodigal Explorer", role: "Marksman", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Ezreal.png" },
  { id: "garen", name: "Garen", title: "the Might of Demacia", role: "Fighter", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Garen.png" },
  { id: "jinx", name: "Jinx", title: "the Loose Cannon", role: "Marksman", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Jinx.png" },
  { id: "kaisa", name: "Kai'Sa", title: "Daughter of the Void", role: "Marksman", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Kaisa.png" },
  { id: "lux", name: "Lux", title: "the Lady of Luminosity", role: "Mage", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Lux.png" },
  { id: "yasuo", name: "Yasuo", title: "the Unforgiven", role: "Fighter", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Yasuo.png" },
  { id: "zed", name: "Zed", title: "the Master of Shadows", role: "Assassin", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Zed.png" },
  { id: "thresh", name: "Thresh", title: "the Chain Warden", role: "Support", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Thresh.png" },
  { id: "lee-sin", name: "Lee Sin", title: "the Blind Monk", role: "Fighter", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/LeeSin.png" },
  { id: "vayne", name: "Vayne", title: "the Night Hunter", role: "Marksman", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Vayne.png" },
  { id: "morgana", name: "Morgana", title: "the Fallen", role: "Mage", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Morgana.png" },
  { id: "katarina", name: "Katarina", title: "the Sinister Blade", role: "Assassin", image: "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Katarina.png" },
];

export const MOCK_ANALYSIS: MatchupAnalysis = {
  threatLevel: "high",
  summary: "Darius possui vantagem significativa em trades curtos e longos no early game. Sua passiva Hemorrhage e ultimate True Damage são extremamente perigosos. Evite trades prolongados e respeite o alcance do Apprehend (E).",
  keyTips: [
    "Nunca lute com 5 stacks de Hemorrhage",
    "Respeite o pull range do E (Apprehend) - 535 unidades",
    "Após nível 6, evite ficar abaixo de 40% HP",
    "Congele a wave próximo à sua torre",
    "Peça ganks do jungler antes do nível 6 dele",
  ],
  powerSpikes: [
    { phase: "Nível 1-3", advantage: "enemy", description: "Darius domina trades curtos com passiva + W" },
    { phase: "Nível 6", advantage: "enemy", description: "Ultimate com dano verdadeiro é letal com stacks" },
    { phase: "Nível 9+", advantage: "even", description: "Você escala melhor com itens completos" },
    { phase: "Late Game", advantage: "you", description: "Em teamfights, seu valor é superior se não for pego" },
  ],
  itemBuild: [
    { name: "Plated Steelcaps", reason: "Reduz dano dos auto-attacks dele" },
    { name: "Bramble Vest", reason: "Anti-heal contra sustain da Q" },
    { name: "Phage", reason: "Movespeed para kitar os trades" },
  ],
  runes: "Grasp of the Undying com Second Wind e Unflinching",
  doList: [
    "Farme com habilidades à distância",
    "Trade apenas quando as skills dele estiverem em cooldown",
    "Mantenha vision no river",
    "Peça assistência do jungler pré-6",
  ],
  dontList: [
    "Nunca faça trades longos (3+ autos)",
    "Não fique na lane com menos de 50% HP",
    "Não dê chase quando ele recuar",
    "Evite lutar dentro da wave inimiga",
  ],
  winCondition: "Sobreviva a fase de lanes sem morrer. Após 2 itens, você terá mais impacto em teamfights. Foque em farm seguro e roams inteligentes quando ele recuar.",
};
