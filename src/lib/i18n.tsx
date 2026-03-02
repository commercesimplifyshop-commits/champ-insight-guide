import { createContext, useContext, useState, type ReactNode } from "react";

export type Locale = "pt" | "en";

const translations = {
  // Header
  "header.subtitle": { pt: "Estrategista Tático", en: "Strategic Coach" },

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
} as const;

type TranslationKey = keyof typeof translations;

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
