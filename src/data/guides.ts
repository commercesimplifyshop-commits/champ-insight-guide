export interface GuideSection {
  heading: string;
  paragraphs: string[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: string;
  sections: GuideSection[];
  /** Slugs from src/data/glossary.ts. */
  relatedTerms: string[];
}

/**
 * Hand-written, evergreen strategy articles — the site's main original
 * editorial content. Deliberately avoids patch-specific numbers and item
 * names so it doesn't go stale every two weeks.
 */
export const GUIDES: Guide[] = [
  {
    slug: "como-subir-de-elo",
    title: "Como subir de elo no League of Legends: os fundamentos que mais pesam",
    description:
      "Os hábitos que realmente fazem diferença na ranqueada: farm, mortes evitáveis, leitura de mapa e consistência de campeões.",
    category: "Fundamentos",
    relatedTerms: ["last-hitting", "wave-management", "vision-control", "snowball"],
    sections: [
      {
        heading: "Por que a maioria dos jogadores fica parada no mesmo elo",
        paragraphs: [
          "Quem fica preso num elo raramente está perdendo por falta de mecânica. O que separa jogadores de elos diferentes, na maior parte das partidas, são decisões repetidas dezenas de vezes por jogo: quando farmar, quando lutar, quando recuar e para onde ir depois de uma luta.",
          "A boa notícia é que essas decisões são treináveis. Mecânica fina exige milhares de horas; parar de cometer os três ou quatro erros mais caros do seu jogo pode render resultados em poucas semanas.",
        ],
      },
      {
        heading: "Farm é a fonte de ouro mais confiável que existe",
        paragraphs: [
          "Duas ou três waves de minions bem farmadas valem mais ou menos o mesmo ouro que um abate, e uma wave nova aparece a cada meio minuto, sem risco de morrer. Jogadores que perdem CS para caçar lutas incertas estão trocando uma renda garantida por uma aposta.",
          "Uma meta prática: acompanhe o seu CS aos 10 minutos nas suas últimas partidas. Se ele está abaixo de 60 a 70 como laner, treinar last hit numa partida personalizada rende mais do que qualquer ajuste de runa ou build.",
        ],
      },
      {
        heading: "Mortes evitáveis custam mais do que parecem",
        paragraphs: [
          "Cada morte entrega ouro e experiência ao adversário, mas o custo real é o tempo fora do mapa: waves que batem na sua torre sem ninguém para farmar, objetivos que o time inimigo pega enquanto você renasce.",
          "Antes de avançar na lane, pergunte: onde está o caçador inimigo? Se você não sabe, trate o lado mais perigoso do mapa como se ele estivesse lá. Essa única pergunta elimina boa parte das mortes por gank.",
        ],
      },
      {
        heading: "Olhe o minimapa com frequência",
        paragraphs: [
          "Jogadores experientes olham o minimapa a cada poucos segundos, quase por reflexo. Isso permite antecipar ganks, perceber quando um aliado está sendo invadido e notar oportunidades de objetivo antes do adversário.",
          "Um exercício simples: toda vez que um minion seu morre sob seu último golpe, olhe o minimapa. Em pouco tempo o hábito fica automático.",
        ],
      },
      {
        heading: "Jogue poucos campeões",
        paragraphs: [
          "Cada campeão tem power spikes, alcances e matchups próprios. Alternar entre muitos personagens significa reaprender esse conhecimento o tempo todo, em vez de aprofundar.",
          "Um pool de dois ou três campeões por função permite que você pare de pensar no próprio kit e passe a pensar no adversário, no mapa e no tempo de jogo, que é onde as partidas são decididas.",
        ],
      },
      {
        heading: "Revise suas derrotas, não só suas vitórias",
        paragraphs: [
          "Assistir ao replay de uma derrota e pausar a cada morte, perguntando o que você sabia naquele momento e o que deveria ter feito, é um dos exercícios mais eficientes para evoluir.",
          "Não é preciso revisar a partida inteira: as mortes e os objetivos perdidos concentram quase todos os erros que valem a pena corrigir.",
        ],
      },
    ],
  },
  {
    slug: "controle-de-wave-na-pratica",
    title: "Controle de wave na prática: freeze, slow push e crash",
    description:
      "Como manipular a posição dos minions para ganhar segurança, abrir janelas de roam e punir o adversário na lane.",
    category: "Rotas",
    relatedTerms: ["wave-management", "last-hitting", "roaming", "zoning"],
    sections: [
      {
        heading: "O que você está controlando de verdade",
        paragraphs: [
          "Controlar a wave é decidir onde os minions dos dois lados vão se encontrar. A posição desse encontro define quem está seguro, quem está exposto a ganks e quem consegue sair da lane sem perder farm.",
          "Uma wave perto da sua torre favorece você: o adversário precisa andar mais para farmar e fica longe da própria proteção. Uma wave perto da torre inimiga favorece o adversário pelo mesmo motivo.",
        ],
      },
      {
        heading: "Freeze: congelar a wave perto da sua torre",
        paragraphs: [
          "Para congelar, a wave inimiga precisa ser um pouco maior que a sua (três ou quatro minions a mais costuma bastar) e você só dá o último golpe, sem causar dano extra. Assim a wave fica parada logo à frente da sua torre.",
          "O freeze é ideal quando você está à frente e quer negar farm ao adversário, ou quando está atrás e precisa farmar com segurança. Ele fica fraco quando o caçador inimigo está por perto, porque o adversário pode forçar uma luta dois contra um no ponto em que você está parado.",
        ],
      },
      {
        heading: "Slow push: montar uma wave grande",
        paragraphs: [
          "No slow push você mata só os minions de longa distância da wave inimiga e deixa os seus acumularem. Após duas ou três waves, forma-se um grupo grande que avança sozinho até a torre adversária.",
          "Essa técnica prepara o roam e o recall: enquanto a wave grande bate na torre inimiga, o adversário precisa escolher entre perder minions e placas ou ficar na lane enquanto você age em outro lugar.",
        ],
      },
      {
        heading: "Crash: empurrar rápido até a torre",
        paragraphs: [
          "Empurrar a wave rapidamente até a torre inimiga faz com que ela seja destruída sob a torre e a próxima wave se encontre mais perto de você. É o movimento padrão antes de voltar à base.",
          "Voltar sem dar crash é um dos erros mais comuns: a wave passa a empurrar contra a sua torre enquanto você está fora, e você perde minions para a torre ou é obrigado a voltar às pressas.",
        ],
      },
      {
        heading: "Como escolher entre as três no momento",
        paragraphs: [
          "Pergunte-se o que você quer fazer nos próximos 30 segundos. Quer voltar à base? Crash. Quer ajudar outra rota ou um objetivo? Slow push e depois saia. Quer ficar na lane farmando com segurança ou punindo o adversário? Freeze.",
          "Com o tempo, essa pergunta vira automática, e a wave passa a trabalhar a seu favor em vez de ditar o seu ritmo.",
        ],
      },
    ],
  },
  {
    slug: "como-vencer-a-fase-de-rotas",
    title: "Fase de rotas: como vencer os primeiros minutos",
    description:
      "Nível 1 a 3, trocas de dano, gerenciamento de mana e vida, e como transformar uma vantagem de lane em vantagem de mapa.",
    category: "Rotas",
    relatedTerms: ["trading", "power-spike", "zoning", "wave-management"],
    sections: [
      {
        heading: "Os primeiros níveis decidem mais do que parecem",
        paragraphs: [
          "Quem chega primeiro ao nível 2 ganha uma habilidade a mais que o adversário, e muitas vezes isso basta para uma troca decisiva. O nível 2 costuma vir depois da primeira wave completa mais três minions da segunda.",
          "Se você sabe que vai chegar antes, esteja posicionado para usar a vantagem assim que o nível subir. Se sabe que vai chegar depois, recue até igualar.",
        ],
      },
      {
        heading: "Troque dano quando o adversário não puder responder",
        paragraphs: [
          "O melhor momento para trocar dano é logo depois que o adversário usa uma habilidade importante, quando ele avança para dar o último golpe num minion ou quando está atrás em nível.",
          "Evite trocar dentro da wave inimiga no início do jogo: os minions atacam quem causa dano a campeões aliados deles, e esse dano extra muda o resultado da troca.",
        ],
      },
      {
        heading: "Gerencie vida e mana como recurso",
        paragraphs: [
          "Vida e mana são o que permite ficar na lane. Gastar mana em habilidades que não acertam nada, ou levar dano de graça em troca de um minion, obriga você a voltar cedo e perder waves.",
          "Uma regra útil: se uma troca não deixa o adversário em situação pior que a sua, ela não valeu a pena, mesmo que tenha parecido agressiva.",
        ],
      },
      {
        heading: "Respeite o caçador inimigo",
        paragraphs: [
          "Grande parte das mortes na fase de rotas vem de ganks. Acompanhe onde o caçador inimigo apareceu por último e calcule para onde ele provavelmente está indo.",
          "Um sentinela no rio ou no arbusto lateral na hora certa, geralmente perto dos três minutos, evita a maioria dos ganks.",
        ],
      },
      {
        heading: "Transforme vantagem de lane em vantagem de mapa",
        paragraphs: [
          "Estar à frente na lane só importa se isso virar algo maior: placas de torre, ajuda num objetivo, pressão em outra rota. Ficar farmando enquanto o time perde lutas desperdiça a vantagem.",
          "Depois de um abate ou de um recall do adversário, use a janela: empurre a wave, pegue placas e decida se é hora de rodar pelo mapa.",
        ],
      },
    ],
  },
  {
    slug: "jungle-para-iniciantes",
    title: "Jungle para iniciantes: limpeza, ganks e objetivos",
    description:
      "Como planejar a rota de limpeza, escolher o momento de gankar e priorizar objetivos na selva.",
    category: "Selva",
    relatedTerms: ["counter-jungle", "objective-priority", "vision-control"],
    sections: [
      {
        heading: "O papel do caçador",
        paragraphs: [
          "O caçador é quem mais influencia o mapa nos primeiros minutos. Enquanto os laners estão presos às próprias rotas, você decide onde o seu time vai ter vantagem numérica.",
          "Isso significa que o seu trabalho é tanto farmar a selva quanto ler as lanes: quem está forte, quem está vulnerável e onde um gank tem mais chance de funcionar.",
        ],
      },
      {
        heading: "Planeje a limpeza antes da partida começar",
        paragraphs: [
          "Decida de que lado você começa pensando em onde quer estar por volta dos três minutos. Terminar a primeira limpeza perto de uma rota com potencial de gank é mais valioso que uma rota de limpeza teoricamente perfeita.",
          "Uma limpeza completa costuma ser mais segura para iniciantes: você chega mais forte ao primeiro confronto e não depende de o gank dar certo para manter o ritmo de ouro.",
        ],
      },
      {
        heading: "Quando um gank vale a pena",
        paragraphs: [
          "Os melhores ganks acontecem em lanes onde a wave está perto da torre aliada, onde o adversário está sem feitiço de invocador de fuga e onde o seu aliado tem controle de grupo para prender o alvo.",
          "Ganks em lanes com a wave empurrada contra a torre inimiga costumam falhar: o adversário está perto da proteção e tem tempo de recuar.",
        ],
      },
      {
        heading: "Objetivos: nem todo vale o risco",
        paragraphs: [
          "Dragões e arauto dão vantagem ao time, mas só valem a pena se você consegue fazê-los sem perder uma luta ou quando o adversário não pode contestar. Olhe onde estão os laners e o caçador inimigos antes de começar.",
          "Uma prática comum é gankar a rota mais próxima do objetivo antes de fazê-lo: com um adversário morto ou forçado a voltar, o objetivo fica muito mais seguro.",
        ],
      },
      {
        heading: "Acompanhe o caçador inimigo",
        paragraphs: [
          "Saber onde o caçador inimigo começou permite prever onde ele vai estar. Com essa informação, você pode avisar os aliados, contra-gankar ou invadir a selva dele do lado oposto.",
          "Mesmo sem visão, o tempo de renascimento dos campos inimigos e a presença dele em alguma lane dão pistas suficientes para uma estimativa razoável.",
        ],
      },
    ],
  },
  {
    slug: "como-ler-power-spikes",
    title: "Power spikes: como saber quando lutar e quando recuar",
    description:
      "Como identificar os picos de poder do seu campeão e do adversário para escolher os momentos certos de luta.",
    category: "Estratégia",
    relatedTerms: ["power-spike", "scaling", "build-path", "trading"],
    sections: [
      {
        heading: "Força é sempre relativa",
        paragraphs: [
          "Um power spike não é só o momento em que você fica mais forte, mas o momento em que fica mais forte do que o seu adversário. Um campeão pode ter um pico no nível 6 e mesmo assim perder a luta se o adversário tiver um pico maior no mesmo nível.",
          "Por isso a pergunta certa não é se você está forte, e sim se está mais forte do que ele agora.",
        ],
      },
      {
        heading: "Picos por nível",
        paragraphs: [
          "Os níveis 2, 3 e 6 são os mais importantes para quase todos os campeões: o 2 e o 3 trazem o kit básico completo, e o 6 traz a ultimate. Alguns campeões ganham muito com o nível 11 e o 16, quando a ultimate melhora.",
          "Saber em que nível o adversário atinge o pico permite evitar a luta um minuto antes e procurá-la assim que você chega ao seu.",
        ],
      },
      {
        heading: "Picos por item",
        paragraphs: [
          "Completar o primeiro item principal costuma mudar a força do campeão mais do que qualquer nível isolado. Itens de componente mais baratos também podem gerar pequenas janelas de vantagem.",
          "Quando você volta à base com ouro suficiente para um item importante e o adversário não, a luta seguinte tende a favorecer você. O contrário também vale.",
        ],
      },
      {
        heading: "Campeões de early e de late game",
        paragraphs: [
          "Campeões fortes no início precisam converter a vantagem cedo, porque tendem a perder relevância conforme a partida avança. Campeões de escalonamento precisam sobreviver ao início e chegar ao final com farm.",
          "Entender em qual dos dois grupos você está, e em qual está o adversário, dita o ritmo que você deve impor à lane.",
        ],
      },
    ],
  },
  {
    slug: "visao-e-wards",
    title: "Visão e wards: onde colocar e quando limpar",
    description:
      "Como usar sentinelas para evitar ganks, preparar objetivos e negar informação ao adversário.",
    category: "Estratégia",
    relatedTerms: ["vision-control", "objective-priority", "counter-jungle"],
    sections: [
      {
        heading: "Visão é informação",
        paragraphs: [
          "Cada sentinela responde a uma pergunta: o caçador inimigo está vindo? O adversário está fazendo o dragão? Tem alguém esperando no arbusto? Quanto mais perguntas o seu time consegue responder, melhores são as decisões.",
          "Colocar sentinela sem objetivo, só porque ela está disponível, desperdiça informação. Pense no que você precisa saber nos próximos minutos.",
        ],
      },
      {
        heading: "Wards defensivos na fase de rotas",
        paragraphs: [
          "No início do jogo, o objetivo principal da visão é evitar ganks. Sentinelas no rio e nos arbustos laterais da lane cobrem a maioria dos caminhos que o caçador inimigo usa.",
          "Reponha a sentinela antes que ela expire, especialmente se você está com a wave empurrada e longe da sua torre.",
        ],
      },
      {
        heading: "Preparando objetivos",
        paragraphs: [
          "Antes de dragão ou barão, a visão precisa ser montada com antecedência, geralmente um minuto antes do objetivo nascer. Tentar montar visão enquanto o time inimigo já está lá é arriscado.",
          "Limpar a visão do adversário na área do objetivo é tão importante quanto colocar a sua: sem visão, ele não sabe se é seguro contestar.",
        ],
      },
      {
        heading: "Visão profunda",
        paragraphs: [
          "Sentinelas dentro da selva inimiga mostram onde o caçador adversário está limpando campos e permitem prever ganks e invasões. São mais arriscadas de colocar, então costumam ser trabalho do suporte e do caçador.",
          "Uma única sentinela bem posicionada na selva inimiga pode dar ao seu time a informação que decide uma luta por objetivo.",
        ],
      },
    ],
  },
  {
    slug: "como-jogar-teamfights",
    title: "Teamfights: posicionamento e prioridade de alvos por função",
    description:
      "O que cada função deve fazer numa luta em grupo, como se posicionar e em quem focar o dano.",
    category: "Estratégia",
    relatedTerms: ["engage-disengage", "poke", "split-push"],
    sections: [
      {
        heading: "Antes da luta começar",
        paragraphs: [
          "A maioria das teamfights é decidida antes do primeiro golpe: quem tem mais vida, quem tem habilidades importantes disponíveis, quem está em melhor posição. Entrar numa luta com a ultimate em recarga ou com metade da vida muda o resultado.",
          "Se o seu time está em desvantagem nesses pontos, recuar e esperar a próxima janela geralmente é a decisão certa.",
        ],
      },
      {
        heading: "Linhas de frente e de trás",
        paragraphs: [
          "Tanques e lutadores ficam na frente, absorvendo dano e iniciando. Atiradores e magos ficam atrás, causando dano de longe. Quando um atirador anda para a frente da linha de frente, ele vira o alvo mais fácil da luta.",
          "Posicionamento não é ficar longe da luta: é ficar na distância máxima em que você ainda consegue causar dano.",
        ],
      },
      {
        heading: "Em quem focar",
        paragraphs: [
          "A regra geral é atacar o alvo mais perigoso que você consegue alcançar com segurança. Isso costuma ser o atirador ou o mago inimigo, mas não vale morrer tentando chegar até eles passando por três tanques.",
          "Se o alvo prioritário está inalcançável, bater na linha de frente mais próxima é melhor do que ficar parado.",
        ],
      },
      {
        heading: "O papel de cada função",
        paragraphs: [
          "O suporte e o tanque decidem quando a luta começa e protegem os aliados de dano. O atirador causa dano contínuo e precisa sobreviver até o fim. O mago procura habilidades de área em inimigos agrupados. O assassino espera o momento em que um alvo importante fica isolado.",
          "Conhecer o próprio papel evita o erro mais comum: todo mundo tentando iniciar ao mesmo tempo, ou ninguém iniciando.",
        ],
      },
    ],
  },
  {
    slug: "macro-game-rotacoes",
    title: "Macro game: rotações, objetivos e o que fazer depois de uma luta",
    description:
      "Como transformar abates em torres e objetivos, e como decidir para onde ir em cada momento da partida.",
    category: "Estratégia",
    relatedTerms: ["objective-priority", "split-push", "roaming", "snowball"],
    sections: [
      {
        heading: "Abates não ganham partidas sozinhos",
        paragraphs: [
          "Muitas partidas são perdidas por times que venceram mais lutas. Isso acontece quando os abates não viram nada: o time vence a luta, fica no meio do rio e o adversário renasce sem ter perdido nada além de ouro.",
          "Depois de vencer uma luta, a pergunta é qual objetivo dá para pegar antes de os inimigos renascerem: uma torre, um dragão, o barão.",
        ],
      },
      {
        heading: "Pense em trocas pelo mapa",
        paragraphs: [
          "Nem sempre dá para contestar tudo. Se o adversário está fazendo o dragão e você não consegue chegar a tempo, pegar uma torre ou o arauto do outro lado do mapa é uma troca que minimiza a perda.",
          "Times que só reagem ao que o adversário faz sempre chegam atrasados. Times que fazem trocas ditam o ritmo.",
        ],
      },
      {
        heading: "Waves laterais depois da fase de rotas",
        paragraphs: [
          "No meio de jogo, alguém precisa manter as waves laterais empurradas. Quando uma lane lateral fica sem ninguém por muito tempo, os minions inimigos chegam às suas torres e prendem jogadores em defesa na hora de um objetivo.",
          "O ideal é que as waves laterais estejam empurradas contra o lado inimigo sempre que o seu time for fazer um objetivo, obrigando o adversário a escolher entre defender e contestar.",
        ],
      },
      {
        heading: "Quando agrupar e quando dividir",
        paragraphs: [
          "Times com composição de luta em grupo querem agrupar e forçar lutas perto de objetivos. Times com um bom duelista preferem dividir o mapa com um split push, forçando o adversário a mandar alguém para conter.",
          "Saber qual é o plano do seu time evita metade das decisões ruins de meio de jogo.",
        ],
      },
    ],
  },
  {
    slug: "como-escolher-campeao-no-draft",
    title: "Draft: como escolher campeão pensando na composição",
    description:
      "Como avaliar a composição do seu time e do adversário na hora de escolher e banir campeões.",
    category: "Draft",
    relatedTerms: ["engage-disengage", "poke", "scaling", "split-push"],
    sections: [
      {
        heading: "Uma composição precisa cobrir o básico",
        paragraphs: [
          "Uma composição funcional costuma ter linha de frente para absorver dano, alguma forma de iniciar lutas, dano contínuo para as lutas longas e uma mistura de dano físico e mágico.",
          "Quando todos os campeões causam o mesmo tipo de dano, o adversário compra um tipo de resistência e neutraliza metade do seu time.",
        ],
      },
      {
        heading: "Identidade do time",
        paragraphs: [
          "Composições costumam se encaixar num estilo: iniciar lutas em grupo, poke à distância, pick para isolar alvos, split push ou proteger um carregador. Escolher campeões que reforçam o mesmo estilo deixa o plano de jogo claro para todos.",
          "Misturar estilos incompatíveis, por exemplo três campeões de poke com um atirador que precisa de lutas longas, gera um time que não sabe como quer lutar.",
        ],
      },
      {
        heading: "Counter-pick e ordem de escolha",
        paragraphs: [
          "Escolher depois do adversário da sua rota permite pegar um campeão com vantagem no confronto direto. Por isso, quem escolhe primeiro costuma optar por campeões flexíveis ou seguros.",
          "Escolher um counter para uma lane não compensa se o campeão não se encaixa no resto do time, nem se você não sabe jogar com ele.",
        ],
      },
      {
        heading: "Banimentos",
        paragraphs: [
          "Banir o campeão que você mais odeia enfrentar é uma escolha legítima. Uma alternativa é banir o que mais atrapalha a estratégia do seu time, como um campeão que desfaz iniciações se a sua composição depende de iniciar.",
          "Na dúvida, banir campeões muito fortes no patch atual reduz a variância da partida.",
        ],
      },
    ],
  },
  {
    slug: "mentalidade-e-tilt",
    title: "Mentalidade: como lidar com tilt e jogar de forma consistente",
    description:
      "Como evitar que frustração, derrotas seguidas e chat tóxico prejudiquem as suas decisões dentro da partida.",
    category: "Fundamentos",
    relatedTerms: ["snowball"],
    sections: [
      {
        heading: "O que é tilt",
        paragraphs: [
          "Tilt é o estado em que a frustração passa a tomar as decisões por você: forçar lutas ruins para compensar uma morte, discutir no chat em vez de olhar o mapa, jogar a próxima partida só para recuperar os pontos perdidos.",
          "O problema não é sentir frustração, que é normal, mas deixar que ela mude a forma como você joga.",
        ],
      },
      {
        heading: "Pare depois de duas derrotas seguidas",
        paragraphs: [
          "Uma regra simples e muito eficiente é encerrar a sessão de ranqueadas depois de duas derrotas seguidas. A chance de a terceira partida ser jogada com a cabeça quente é alta.",
          "Uma pausa curta, levantando da cadeira, já ajuda a separar uma partida da outra.",
        ],
      },
      {
        heading: "Silencie o chat quando necessário",
        paragraphs: [
          "Discutir no chat nunca melhora o desempenho de ninguém, nem o seu nem o do aliado. Silenciar jogadores tóxicos logo no início elimina uma fonte constante de distração.",
          "Comunicação útil, com pings e informações objetivas, continua sendo importante. O que vale cortar é a discussão.",
        ],
      },
      {
        heading: "Foque no que você controla",
        paragraphs: [
          "Em toda partida existe algo que você poderia ter feito melhor, mesmo quando o time perdeu por outros motivos. Focar nisso transforma cada derrota em aprendizado.",
          "Jogadores que culpam sempre os outros param de evoluir, porque nunca identificam os próprios erros.",
        ],
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
