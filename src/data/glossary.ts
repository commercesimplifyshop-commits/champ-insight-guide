export interface GlossaryEntry {
  slug: string;
  term: string;
  shortDef: string;
  body: string[];
  related: string[];
}

/**
 * Evergreen League of Legends concept glossary — hand-written, not
 * AI-generated: this is the kind of stable reference content that's cheap
 * to keep accurate and valuable to search engines regardless of patch
 * changes, unlike the per-champion/per-matchup pages elsewhere on the site.
 */
export const GLOSSARY: GlossaryEntry[] = [
  {
    slug: "wave-management",
    term: "Controle de Wave (Wave Management)",
    shortDef:
      "Controle de wave é a habilidade de manipular onde os minions se encontram na lane para ganhar segurança, pressão de mapa ou preparar uma jogada.",
    body: [
      "Existem três estados principais de wave: freeze (congelar a wave perto da sua torre, deixando o adversário sem CS seguro pra farmar longe da defesa dele), slow push (deixar a sua wave crescer aos poucos até virar uma wave grande, geralmente pra abrir uma janela de roam) e fast push / crash (empurrar a wave rápido até a torre inimiga, geralmente antes de recuar pra base ou de trocar de lane).",
      "Uma freeze bem feita é uma das ferramentas de segurança mais fortes do jogo: o adversário precisa se aproximar da sua torre pra farmar, o que reduz o espaço dele pra errar contra um gank ou um all-in. Pra manter uma freeze, você deve last-hitar sem dar dano nos minions vivos, deixando a wave parada perto do meio-caminho entre as duas torres ou perto da sua própria torre.",
      "Empurrar a wave (crash) antes de recuar é o padrão certo antes de sair da lane pra recall ou roam: isso garante que a próxima wave chegue até você mais devagar (ou até a torre inimiga, ganhando ouro de plaqueamento), em vez de te deixar sem farm seguro quando voltar.",
    ],
    related: ["power-spike", "roaming", "zoning"],
  },
  {
    slug: "power-spike",
    term: "Power Spike",
    shortDef:
      "Power spike é um momento específico do jogo em que um campeão fica temporariamente mais forte em relação a um adversário específico — por nível, item ou combinação dos dois.",
    body: [
      "Os dois power spikes mais decisivos de qualquer partida são o nível 2 (quando o campeão ganha sua segunda habilidade, muitas vezes um combo de all-in que o adversário ainda não tem resposta) e o nível 6 (quando a ultimate fica disponível, geralmente o maior salto de dano/utilidade do jogo).",
      "Itens também geram spikes: um componente específico (ex: Espada do Rei Duelista, Machado de Cavaleiro Negro) ou um item completo pode virar uma janela curta em que vale a pena procurar uma luta antes que o adversário also complete o próprio item de resposta.",
      "Jogar em volta dos seus próprios power spikes — e evitar lutar durante os spikes do adversário — é uma das diferenças mais claras entre um jogador mecanicamente bom e um jogador que também entende o jogo estrategicamente.",
    ],
    related: ["trading", "scaling", "build-path"],
  },
  {
    slug: "trading",
    term: "Troca de Dano (Trading)",
    shortDef: "Trading é o processo de trocar dano com o adversário de lane de forma calculada, buscando sair da troca com vantagem.",
    body: [
      "Uma troca vantajosa normalmente explora algo específico: um cooldown que o adversário acabou de gastar, uma vantagem de alcance, uma wave em posição melhor para você (ex: você atacando de dentro da wave, o adversário exposto), ou um item/nível que você tem e ele não tem.",
      "Trades curtos (poke) desgastam sem comprometer muitos recursos; trades estendidos (sustained trade) trocam vários golpes seguidos e favorecem quem tiver mais sustain, mais dano por segundo ou vantagem de nível.",
      "Uma regra prática: se você não consegue identificar uma vantagem concreta antes de trocar (cooldown, wave, item, nível), a troca provavelmente é neutra ou desfavorável — e vale mais a pena esperar a próxima janela.",
    ],
    related: ["power-spike", "zoning", "poke"],
  },
  {
    slug: "zoning",
    term: "Zoneamento (Zoning)",
    shortDef:
      "Zoneamento é usar a ameaça de dano ou posicionamento para impedir o adversário de farmar, se posicionar ou jogar livremente na lane.",
    body: [
      "Zonear não significa necessariamente atacar o adversário — muitas vezes é só se posicionar de um jeito que ele não consiga chegar perto da wave sem tomar dano ou risco de all-in, forçando-o a perder CS ou ficar em desvantagem de experiência.",
      "Zoneamento é mais forte quando combinado com uma wave congelada (freeze) perto da sua torre: o adversário precisa escolher entre perder farm ou se arriscar dentro do seu alcance de zoneamento.",
    ],
    related: ["wave-management", "trading"],
  },
  {
    slug: "roaming",
    term: "Roaming",
    shortDef: "Roaming é sair da própria lane para impactar outra parte do mapa, geralmente para criar uma vantagem em outra lane ou no objetivo neutro.",
    body: [
      "As melhores janelas para roamar são: depois de empurrar sua wave até a torre inimiga (ela demora pra voltar, então você não perde muito farm), depois de vencer claramente sua própria lane, ou logo após atingir o nível 6, quando sua ultimate pode decidir uma luta em outro lugar do mapa.",
      "O custo do roam é real — CS e experiência perdidos na sua lane, e risco de o seu oponente também empurrar e pressionar sua torre. Vale a pena quando o ganho esperado (kill, objetivo, tempo de respawn do adversário) supera esse custo.",
    ],
    related: ["wave-management", "objective-priority", "snowball"],
  },
  {
    slug: "split-push",
    term: "Split Push",
    shortDef: "Split push é a estratégia de aplicar pressão sozinho em uma lane lateral, forçando o time adversário a reagir ou perder estrutura.",
    body: [
      "Funciona bem com campeões que ganham duelos 1x1 e têm mobilidade ou sustain pra sobreviver caso o adversário mande gente pra conter (ex: campeões de split push clássicos como Fiora, Tryndamere, Camille).",
      "A decisão chave é ler quando o seu time consegue vencer um 4x5 (ou até 5x5 com você chegando depois via teleporte) enquanto você continua pressionando — e quando é hora de abandonar o split e agrupar, porque o risco de perder um objetivo grande (Barão, Elder) supera o valor da torre lateral.",
    ],
    related: ["objective-priority", "scaling"],
  },
  {
    slug: "poke",
    term: "Poke",
    shortDef: "Poke é dano à distância aplicado repetidamente para desgastar o adversário antes de um confronto direto, sem se expor a uma troca completa.",
    body: [
      "Composições de poke buscam vencer lutas antes delas realmente começarem: ao chegar no confronto direto, o time de poke já tirou uma fatia grande da vida do adversário à distância, com segurança.",
      "O contraponto natural de poke é engage rápido — times com muito dash/gap-closer tentam fechar a distância antes de tomar dano demais, reduzindo a janela em que o poke é efetivo.",
    ],
    related: ["engage-disengage", "trading"],
  },
  {
    slug: "engage-disengage",
    term: "Engage e Disengage",
    shortDef: "Engage é iniciar um confronto em vantagem; disengage é evitar, atrasar ou cancelar um confronto que não favorece seu time.",
    body: [
      "Um bom engage isola um ou mais alvos prioritários do time adversário (geralmente o time de dano, atirador ou mago) antes que o resto do time consiga responder — usando displacement, silêncio ou controle de grupo (CC) em área.",
      "Disengage existe pra neutralizar isso: habilidades de knockback, muro, cura em área ou velocidade de movimento em massa que dão ao time atacado uma chance de recuar ou virar a luta antes que o dano isolado aconteça.",
    ],
    related: ["poke", "vision-control"],
  },
  {
    slug: "vision-control",
    term: "Controle de Visão (Wards)",
    shortDef: "Controle de visão é o uso de wards e itens de visão para prevenir ganks, revelar movimentação do adversário e permitir jogadas seguras.",
    body: [
      "Wards defensivos (perto da sua própria lane/jungle) previnem ganks e dão tempo de reação; wards ofensivos ou profundos (dentro do território do adversário) revelam rotas de jungle e timings de objetivo.",
      "Antes de dragão, arauto ou barão, colocar visão ampla ao redor do objetivo — e limpar a visão do adversário com um sweeper (lente de vidente) — é o que permite saber se é seguro lutar por ele ou se o time adversário está posicionado pra roubar/contestar.",
    ],
    related: ["objective-priority", "counter-jungle"],
  },
  {
    slug: "objective-priority",
    term: "Prioridade de Objetivos",
    shortDef: "Prioridade de objetivos é a decisão de quando vale a pena lutar por dragão, arauto ou barão com base em vantagem de composição, timing e recursos disponíveis.",
    body: [
      "Nem todo objetivo vale o mesmo em todo jogo: dragões de alma (4º dragão do mesmo tipo) e o barão costumam valer mais do que arautos isolados, mas isso muda conforme a composição — times que precisam de itens/nível pra funcionar priorizam farm sobre objetivo, enquanto times já fortes priorizam fechar o jogo rápido.",
      "A pergunta prática antes de lutar por um objetivo é sempre: 'se essa luta virar teamfight, meu time vence?' — se a resposta for não, geralmente vale mais a pena conceder o objetivo do que arriscar uma luta ruim por ele.",
    ],
    related: ["split-push", "vision-control", "snowball"],
  },
  {
    slug: "counter-jungle",
    term: "Counter-Jungle (Invasão de Selva)",
    shortDef: "Counter-jungle é invadir a selva do adversário para roubar recursos (campos ou até o objetivo dele) ou criar uma vantagem de recursos.",
    body: [
      "É uma jogada de alto risco/alto retorno: exige visão da selva adversária (pra não ser pego contra-atacando) e geralmente só compensa quando seu jungler já está em vantagem de nível/dano contra o jungler adversário.",
      "Counter-jungle malsucedido (ser pego invadindo) costuma custar caro — dá kill e prioridade de objetivo pro adversário exatamente na área que você tentou controlar.",
    ],
    related: ["vision-control", "snowball"],
  },
  {
    slug: "snowball",
    term: "Snowball",
    shortDef: "Snowball é o processo de transformar uma pequena vantagem inicial (kill, CS extra, objetivo) em uma vantagem cada vez maior ao longo da partida.",
    body: [
      "Uma vantagem inicial gera mais ouro e experiência, que viram itens e níveis mais cedo, que facilitam vencer a próxima troca ou luta, que gera mais vantagem — esse ciclo é o que os jogadores chamam de 'bola de neve'.",
      "Times que tomam a dianteira cedo devem jogar pra continuar esse ciclo (procurar próxima luta favorável, pressionar objetivo); times atrás de vantagem devem jogar pra quebrar o ciclo (evitar lutas ruins, priorizar farm seguro e esperar um erro do adversário ou um item/nível que equilibre o jogo).",
    ],
    related: ["power-spike", "objective-priority"],
  },
  {
    slug: "scaling",
    term: "Scaling",
    shortDef: "Scaling é o quanto um campeão fica mais forte conforme o jogo avança (por nível e itens), geralmente em contraste com sua força no early game.",
    body: [
      "Campeões de scaling forte (ex: atiradores clássicos, magos de dano em área tardio) costumam ser fracos nos primeiros minutos e precisam sobreviver ao early game pra se tornarem decisivos no late game — geralmente jogando de forma defensiva/passiva na lane.",
      "Campeões fortes no early game, mas com scaling fraco, precisam converter essa vantagem inicial em algo permanente (torres, kills, objetivo) antes que o adversário 'alcance' no late game — porque a vantagem de nível sozinha não dura pra sempre.",
    ],
    related: ["power-spike", "snowball", "build-path"],
  },
  {
    slug: "build-path",
    term: "Build Path / Itens Situacionais",
    shortDef:
      "Build path é a sequência de itens escolhida numa partida, combinando um núcleo (core build) com itens situacionais escolhidos de acordo com a composição adversária.",
    body: [
      "O core build costuma ser bem definido por campeão (os itens que quase sempre funcionam bem, independente do jogo), enquanto os itens situacionais respondem ao que o adversário está fazendo: resistência mágica contra times com muito dano mágico, cura reduzida contra composições de sustain, ou itens anti-tank contra composições com muita resistência.",
      "Errar o build situacional — por exemplo, não comprar resistência contra uma composição majoritariamente mágica — é uma das causas mais comuns (e mais evitáveis) de perder teamfights que pareciam equilibradas no papel.",
    ],
    related: ["scaling", "power-spike"],
  },
  {
    slug: "last-hitting",
    term: "Last Hit (CS)",
    shortDef: "Last hit é acertar o golpe que mata um minion, garantindo o ouro dele — a habilidade mais básica e mais importante de farm em League of Legends.",
    body: [
      "Cada minion dá ouro só pra quem der o golpe final nele (ou, no caso de magos/à distância, para quem estiver perto o suficiente quando ele morre) — por isso last hit consistente vale muito mais ouro ao longo do jogo do que apenas atacar minions aleatoriamente.",
      "Last-hitar bem também é a base de qualquer controle de wave: pra manter uma freeze, por exemplo, é preciso conseguir last-hitar sem acidentalmente dar dano nos minions que ainda estão vivos.",
    ],
    related: ["wave-management"],
  },
];

export function getGlossaryEntry(slug: string): GlossaryEntry | undefined {
  return GLOSSARY.find((e) => e.slug === slug);
}
