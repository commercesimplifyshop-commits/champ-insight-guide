import { createContext, useContext, useState, type ReactNode } from "react";

export type Locale = "pt" | "en";

const translations = {
  // Hero Banner
  "hero.badge": { pt: "Powered by AI", en: "Powered by AI" },
  "hero.title1": { pt: "Domine cada partida com", en: "Dominate every game with" },
  "hero.title2": { pt: "estratégias em tempo real", en: "real-time strategies" },
  "hero.description": {
    pt: "Planos táticos personalizados gerados por IA para cada matchup. Saiba exatamente o que fazer em cada fase do jogo.",
    en: "AI-generated tactical plans for every matchup. Know exactly what to do at each stage of the game.",
  },
  "hero.comingSoon": { pt: "Em breve", en: "Soon" },
  "hero.feature.1v1": { pt: "Matchup 1v1", en: "Matchup 1v1" },
  "hero.feature.5v5": { pt: "Análise 5v5", en: "5v5 Analysis" },
  "hero.feature.counter": { pt: "Counter Finder", en: "Counter Finder" },
  "hero.feature.coach": { pt: "IA Coach", en: "AI Coach" },

  // Selection View
  "selection.title": { pt: "Análise de Matchup", en: "Matchup Analysis" },
  "selection.subtitle": {
    pt: "Selecione sua role e campeões para gerar um plano estratégico",
    en: "Select your role and champions to generate a strategic plan",
  },
  "selection.yourChampion": { pt: "Seu Campeão", en: "Your Champion" },
  "selection.enemyChampion": { pt: "Campeão Inimigo", en: "Enemy Champion" },
  "selection.generatePlan": { pt: "Gerar Plano", en: "Generate Plan" },
  "selection.analyzing": { pt: "Analisando...", en: "Analyzing..." },
  "selection.searchChampion": { pt: "Buscar campeão...", en: "Search champion..." },
  "selection.noChampions": { pt: "Nenhum campeão encontrado", en: "No champions found" },
  "selection.recentChampions": { pt: "Buscados recentemente", en: "Recently searched" },
  "selection.startTyping": { pt: "Digite para buscar um campeão", en: "Start typing to search a champion" },

  // Champion picker sheet (design_handoff_matchupgg_mobile)
  "championSheet.close": { pt: "fechar", en: "close" },
  "championSheet.placeholder": { pt: "digite o nome do campeão", en: "type the champion's name" },
  "championSheet.tagPopular": { pt: "popular", en: "popular" },
  "championSheet.tagChosen": { pt: "escolhido", en: "chosen" },
  "championSheet.noMatch": {
    pt: "Nenhum campeão com esse nome. Confira a grafia — ex.: \"Kha'Zix\", \"Cho'Gath\".",
    en: "No champion with that name. Check the spelling — e.g. \"Kha'Zix\", \"Cho'Gath\".",
  },
  "confronto.stepLabel": { pt: "1 · CONFRONTO", en: "1 · MATCHUP" },
  "confronto.you": { pt: "VOCÊ", en: "YOU" },
  "confronto.enemy": { pt: "INIMIGO", en: "ENEMY" },
  "confronto.swap": { pt: "trocar ›", en: "change ›" },
  "confronto.pickPlaceholder": { pt: "Escolher campeão", en: "Choose champion" },
  "role.top": { pt: "Topo", en: "Top" },
  "role.jungle": { pt: "Selva", en: "Jungle" },
  "role.mid": { pt: "Meio", en: "Mid" },
  "role.adc": { pt: "Atirador", en: "ADC" },
  "role.support": { pt: "Suporte", en: "Support" },
  "form.step1Label": { pt: "1 · CONFRONTO", en: "1 · MATCHUP" },
  "form.step2Label": { pt: "2 · FUNÇÃO", en: "2 · ROLE" },
  "form.step3Label": { pt: "3 · SEU MODELO DE JOGO", en: "3 · YOUR PLAYSTYLE" },
  "form.step3Hint": { pt: "como você joga de verdade", en: "how you actually play" },
  "form.step4Label": { pt: "4 · MODELO DO CAMPEÃO", en: "4 · CHAMPION STYLE" },
  "form.step4HintPrefix": { pt: "o papel do", en: "the role of" },
  "form.step4HintSuffix": { pt: "no seu time", en: "on your team" },
  "nav.matchup": { pt: "Análise de matchup", en: "Matchup analysis" },
  "nav.draft": { pt: "Draft 5v5", en: "5v5 draft" },
  "nav.coach": { pt: "Coach IA", en: "AI Coach" },
  "nav.counters": { pt: "Counters por campeão", en: "Champion counters" },
  "nav.pricing": { pt: "Planos e preços", en: "Plans & pricing" },
  "nav.profile": { pt: "Perfil", en: "Profile" },
  "recents.title": { pt: "Recentes", en: "Recent" },
  "recents.seeAll": { pt: "Ver tudo", en: "See all" },
  "nav.subscribePro": { pt: "Assinar o Pro", en: "Subscribe to Pro" },
  "nav.signOut": { pt: "Sair da conta", en: "Sign out" },
  "nav.signIn": { pt: "Entrar", en: "Sign in" },
  "nav.subscribe": { pt: "Assinar", en: "Subscribe" },
  "nav.openMenu": { pt: "Abrir menu", en: "Open menu" },
  "coach.title": { pt: "Coach IA chegando em breve", en: "AI Coach coming soon" },
  "coach.comingSoon": {
    pt: "Estamos preparando um chat com IA pra tirar dúvidas sobre qualquer matchup. Volte em breve.",
    en: "We're building an AI chat to answer questions about any matchup. Check back soon.",
  },
  "selection.recaptchaPrefix": {
    pt: "Este site é protegido por reCAPTCHA e se aplicam a",
    en: "This site is protected by reCAPTCHA and the Google",
  },
  "selection.recaptchaMiddle": { pt: "e os", en: "and" },
  "selection.recaptchaSuffix": { pt: "do Google.", en: "apply." },
  "selection.privacyPolicy": { pt: "Política de Privacidade", en: "Privacy Policy" },
  "selection.termsOfService": { pt: "Termos de Serviço", en: "Terms of Service" },

  // Matchup Header
  "matchup.you": { pt: "Você", en: "You" },
  "matchup.enemy": { pt: "Inimigo", en: "Enemy" },
  "matchup.newAnalysis": { pt: "Nova Análise", en: "New Analysis" },
  "matchup.difficulty": { pt: "Dificuldade", en: "Difficulty" },

  // Difficulty labels
  "difficulty.strong": { pt: "FÁCIL", en: "EASY" },
  "difficulty.slight": { pt: "FAVORÁVEL", en: "FAVORABLE" },
  "difficulty.even": { pt: "SKILL MATCHUP", en: "SKILL MATCHUP" },
  "difficulty.slight_disadvantage": { pt: "DESFAVORÁVEL", en: "UNFAVORABLE" },
  "difficulty.hard": { pt: "HARD COUNTER", en: "HARD COUNTER" },

  // Advantage labels
  "advantage.strong": { pt: "VANTAGEM FORTE", en: "STRONG ADVANTAGE" },
  "advantage.slight": { pt: "LEVE VANTAGEM", en: "SLIGHT ADVANTAGE" },
  "advantage.even": { pt: "MATCHUP IGUAL", en: "EVEN MATCHUP" },
  "advantage.slight_disadvantage": { pt: "LEVE DESVANTAGEM", en: "SLIGHT DISADVANTAGE" },
  "advantage.hard": { pt: "GRANDE DESVANTAGEM", en: "HARD DISADVANTAGE" },

  // Quick Overview
  "overview.gamePlan": { pt: "Plano de Jogo", en: "Game Plan" },
  "overview.biggestThreat": { pt: "Maior Ameaça", en: "Biggest Threat" },
  "overview.firstFocus": { pt: "Primeiro Foco", en: "First Focus" },

  // Style Focus (concrete, matchup-specific execution of the chosen playstyle + macro style)
  "styleFocus.title": { pt: "Como Jogar no Seu Estilo", en: "How to Play Your Style" },
  "styleFocus.keyMoments": { pt: "Momentos-Chave", en: "Key Moments" },
  "styleFocus.adaptationTip": { pt: "Se Não Estiver Funcionando", en: "If It's Not Working" },

  // Lane sections
  "lane.visionJungle": { pt: "Visão & Controle de Jungle", en: "Vision & Jungle Control" },
  "lane.powerSpikes": { pt: "Power Spikes", en: "Power Spikes" },
  "lane.itemization": { pt: "Itemização & Runas", en: "Itemization & Runes" },
  "lane.mistakes": { pt: "Erros para Evitar", en: "Mistakes to Avoid" },
  "lane.objective": { pt: "Objetivo", en: "Objective" },
  "lane.wardingPriority": { pt: "Prioridade de Ward", en: "Warding Priority" },
  "lane.objectiveFocus": { pt: "Foco em Objetivos", en: "Objective Focus" },

  // Jungle sections
  "jungle.clearPath": { pt: "Clear Path & Rota", en: "Clear Path & Route" },
  "jungle.gankingStrategy": { pt: "Estratégia de Gank", en: "Ganking Strategy" },
  "jungle.objectiveControl": { pt: "Controle de Objetivos", en: "Objective Control" },
  "jungle.counterJungling": { pt: "Counter-Jungling", en: "Counter-Jungling" },
  "jungle.recommendedStart": { pt: "Start Recomendado", en: "Recommended Start" },
  "jungle.firstBack": { pt: "First Back", en: "First Back" },
  "jungle.fullRoute": { pt: "Rota Completa", en: "Full Route" },
  "jungle.priority": { pt: "Prioridade", en: "Priority" },
  "jungle.bestTimings": { pt: "Melhores Timings", en: "Best Timings" },
  "jungle.dragon": { pt: "Dragão", en: "Dragon" },
  "jungle.herald": { pt: "Herald", en: "Herald" },
  "jungle.risk": { pt: "Risco", en: "Risk" },
  "jungle.strategy": { pt: "Estratégia", en: "Strategy" },
  "jungle.riskLow": { pt: "Baixo", en: "Low" },
  "jungle.riskMedium": { pt: "Médio", en: "Medium" },
  "jungle.riskHigh": { pt: "Alto", en: "High" },
  "jungle.mistakes": { pt: "Erros para Evitar", en: "Mistakes to Avoid" },

  // Item Build
  "items.coreBuild": { pt: "Build Principal", en: "Core Build" },
  "items.situational": { pt: "Situacional", en: "Situational" },
  "items.runes": { pt: "Runas", en: "Runes" },

  // Power Spikes
  "spikes.ally": { pt: "Sua vantagem", en: "Your advantage" },
  "spikes.enemy": { pt: "Vantagem inimiga", en: "Enemy advantage" },
  "spikes.even": { pt: "Igual", en: "Even" },

  // Mistakes
  "mistakes.critical": { pt: "CRÍTICO", en: "CRITICAL" },
  "mistakes.warning": { pt: "ATENÇÃO", en: "WARNING" },
  "mistakes.minor": { pt: "MENOR", en: "MINOR" },

  // Counter Finder
  "counters.title": { pt: "Counter Finder", en: "Counter Finder" },
  "counters.subtitle": {
    pt: "Descubra os melhores counters sugeridos por IA para qualquer campeão e role",
    en: "Discover the best AI-suggested counters for any champion and role",
  },
  "counters.champion": { pt: "Campeão", en: "Champion" },
  "counters.search": { pt: "Buscar Counters", en: "Find Counters" },
  "counters.searching": { pt: "Buscando...", en: "Searching..." },
  "counters.showingFor": { pt: "Counters para", en: "Counters for" },
  "counters.newSearch": { pt: "Nova Busca", en: "New Search" },
  "counters.error": { pt: "Erro ao buscar counters", en: "Failed to find counters" },
  "counters.threat.high": { pt: "AMEAÇA ALTA", en: "HIGH THREAT" },
  "counters.threat.medium": { pt: "AMEAÇA MÉDIA", en: "MEDIUM THREAT" },
  "counters.threat.low": { pt: "AMEAÇA BAIXA", en: "LOW THREAT" },
  "counters.howToPlayAgainstIt": { pt: "Como jogar contra", en: "How to play against it" },
  "counters.disclaimer": {
    pt: "Sugestões geradas por IA com base em conhecimento geral do jogo, não em estatísticas de partidas reais.",
    en: "AI-generated suggestions based on general game knowledge, not real match statistics.",
  },

  // Premium gate (free vs. full analysis)
  "premium.description": {
    pt: "Fases de mid/late game, itemização completa e erros a evitar",
    en: "Mid/late game phases, full itemization and mistakes to avoid",
  },
  "premium.unlock": { pt: "Ver Análise Completa", en: "See Full Analysis" },
  "premium.subscribe": { pt: "Assinar Premium", en: "Subscribe" },
  "premium.loginToUnlock": { pt: "Entrar para Assinar", en: "Log In to Subscribe" },
  "premium.seeExample": { pt: "Veja um exemplo grátis vs. Premium →", en: "See a free vs. Premium example →" },
  "phase.midGame": { pt: "Mid Game", en: "Mid Game" },
  "phase.lateGame": { pt: "Late Game", en: "Late Game" },

  // Champion Abilities (free educational reference)
  "abilities.title": { pt: "Habilidades", en: "Abilities" },
  "abilities.error": { pt: "Não foi possível carregar as habilidades.", en: "Couldn't load abilities." },
  "abilities.howToPlay": { pt: "Como jogar", en: "How to play" },
  "abilities.howToPlayAgainst": { pt: "Como jogar contra", en: "How to play against" },

  // Rewarded ad gate (free users watch a short ad before generating a new analysis)
  "ads.loadingAd": { pt: "Carregando anúncio...", en: "Loading ad..." },
  "ads.rewardHint": {
    pt: "Usuários gratuitos assistem a um anúncio curto antes de gerar a análise. Assinantes PRO não veem anúncios.",
    en: "Free users watch a short ad before generating the analysis. PRO subscribers see no ads.",
  },
  "ads.rewardDismissed": {
    pt: "Assista o anúncio até o fim para gerar sua análise.",
    en: "Watch the ad to the end to generate your analysis.",
  },

  // Footer
  "footer.disclaimer": {
    pt: "MATCHUP.GG não é endossado pela Riot Games e não reflete as opiniões da Riot Games ou de qualquer pessoa oficialmente envolvida na produção ou gerenciamento das propriedades da Riot Games.",
    en: "MATCHUP.GG isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties.",
  },

  // Cookie consent banner
  "cookies.bannerText": {
    pt: "Usamos cookies essenciais, anti-spam e de publicidade.",
    en: "We use essential, anti-spam, and advertising cookies.",
  },
  "cookies.learnMore": { pt: "Saiba mais", en: "Learn more" },
  "cookies.accept": { pt: "Aceitar", en: "Accept" },

  // Playstyle selector
  "playstyle.label": { pt: "Seu estilo de jogo", en: "Your playstyle" },
  "playstyle.balanced": { pt: "Equilibrado", en: "Balanced" },
  "playstyle.aggressive": { pt: "Agressivo", en: "Aggressive" },
  "playstyle.patient": { pt: "Farm seguro", en: "Safe farm" },
  "playstyle.cautious": { pt: "Cauteloso", en: "Cautious" },

  // Macro style selector (LoL-specific strategic identity)
  "macrostyle.label": { pt: "Seu modo de jogo", en: "Your macro style" },
  "macrostyle.split_push": { pt: "Split push", en: "Split push" },
  "macrostyle.poke": { pt: "Poke", en: "Poke" },
  "macrostyle.pick": { pt: "Assassino", en: "Assassin" },
  "macrostyle.protect_carry": { pt: "Utilitário", en: "Utility" },
  "macrostyle.roamer": { pt: "Roaming", en: "Roaming" },
  "macrostyle.scaling": { pt: "Escala/Late", en: "Scaling/Late" },

  // Demo mode banner
  "demo.banner": {
    pt: "MATCHUP.GG está em construção e em modo de demonstração. Assinaturas criadas agora não serão processadas nem mantidas.",
    en: "MATCHUP.GG is under construction and in demo mode. Subscriptions created now won't be processed or kept.",
  },

  // Contact / Support
  "footer.contact": { pt: "Contato / Suporte", en: "Contact / Support" },
  "footer.privacy": { pt: "Privacidade e Cookies", en: "Privacy & Cookies" },
  "contact.title": { pt: "Fale Conosco", en: "Contact Us" },
  "contact.subtitle": {
    pt: "Dúvidas, problemas com sua assinatura ou sugestões — mande sua mensagem que respondemos por email.",
    en: "Questions, subscription issues, or suggestions — send us a message and we'll reply by email.",
  },
  "contact.name": { pt: "Nome", en: "Name" },
  "contact.email": { pt: "Email", en: "Email" },
  "contact.subject": { pt: "Assunto", en: "Subject" },
  "contact.subjectPlaceholder": { pt: "Ex: Problema com pagamento", en: "E.g: Billing issue" },
  "contact.message": { pt: "Mensagem", en: "Message" },
  "contact.send": { pt: "Enviar Mensagem", en: "Send Message" },
  "contact.success": { pt: "Mensagem enviada! Vamos responder no email informado.", en: "Message sent! We'll reply to the email you provided." },
  "contact.error": { pt: "Não foi possível enviar sua mensagem. Tente novamente em instantes.", en: "Couldn't send your message. Please try again shortly." },
} as const;

export type TranslationKey = keyof typeof translations;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>("pt");

  const t = (key: TranslationKey): string => {
    return translations[key]?.[locale] ?? key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
