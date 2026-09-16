import { Link } from "react-router-dom";
import type { JungleMatchupPlan } from "@/types/matchup";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import ChampionAbilities from "./ChampionAbilities";
import ContentBlock from "./ContentBlock";
import ResultTabs, { type ResultTabDef } from "./ResultTabs";
import PowerSpikesList from "./PowerSpikesList";
import PremiumGate from "./PremiumGate";

interface JungleAnalysisViewProps {
  plan: JungleMatchupPlan;
}

const GOLD = "text-brand border-brand/30";
const NEUTRAL = "text-ink-70 border-white/10";
const DANGER = "text-threat border-threat/30";
const WARN = "text-[#FFC44D] border-[#FFC44D]/30";
const CRITICAL = "text-threat border-threat/30";
const WARNING = "text-[#FFC44D] border-[#FFC44D]/30";
const MINOR = "text-ink-40 border-white/10";

const riskLabelKeys: Record<string, TranslationKey> = {
  low: "jungle.riskLow",
  medium: "jungle.riskMedium",
  high: "jungle.riskHigh",
};

const JungleAnalysisView = ({ plan }: JungleAnalysisViewProps) => {
  const { t } = useI18n();
  const locked = plan.meta.locked ?? false;
  const hasFullData =
    !locked && plan.gankingStrategy && plan.objectiveControl && plan.counterJungling && plan.midGame && plan.lateGame && plan.itemization && plan.mistakes;

  const resumoTab = (
    <>
      {plan.styleFocus && (
        <ContentBlock tag={t("matchup.you")} tagColorClass="text-brand" tagBorderClass="border-brand/30">
          {plan.styleFocus.summary}
        </ContentBlock>
      )}
      <ContentBlock tag="01" tagColorClass={NEUTRAL.split(" ")[0]} tagBorderClass={NEUTRAL.split(" ")[1]}>
        {plan.overview.biggestThreat}
      </ContentBlock>
      <ContentBlock tag="02" tagColorClass={NEUTRAL.split(" ")[0]} tagBorderClass={NEUTRAL.split(" ")[1]}>
        {plan.overview.firstDecisionFocus}
      </ContentBlock>
      <ContentBlock tag="03" tagColorClass={NEUTRAL.split(" ")[0]} tagBorderClass={NEUTRAL.split(" ")[1]}>
        {plan.overview.earlyAdvantage.summary}
      </ContentBlock>
      {plan.styleFocus && plan.styleFocus.keyMoments.length > 0 && (
        <ContentBlock tag={t("styleFocus.keyMoments")} tagColorClass="text-[#FFC44D]" tagBorderClass="border-[#FFC44D]/30">
          <ul className="space-y-1.5">
            {plan.styleFocus.keyMoments.map((m, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-brand mt-0.5 shrink-0">▸</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </ContentBlock>
      )}
      {plan.powerSpikes.length > 0 && (
        <div className="pt-1">
          <p className="font-mono text-[10px] tracking-[.9px] text-ink-40 uppercase mb-2">{t("lane.powerSpikes")}</p>
          <PowerSpikesList spikes={plan.powerSpikes} />
        </div>
      )}
    </>
  );

  const fasesTab = (
    <>
      <ContentBlock tag="0-6" tagColorClass={DANGER.split(" ")[0]} tagBorderClass={DANGER.split(" ")[1]} heading={t("jungle.clearPath")}>
        <p className="mb-1">
          <b className="text-brand">{t("jungle.recommendedStart")}:</b> {plan.clearPath.recommendedStart}
        </p>
        <p className="mb-2">
          <b className="text-brand">{t("jungle.firstBack")}:</b> {plan.clearPath.firstBackTiming}
        </p>
        <ol className="space-y-1.5">
          {plan.clearPath.fullClearRoute.map((step, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-brand font-bold shrink-0">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </ContentBlock>

      {hasFullData ? (
        <>
          <ContentBlock tag="6-20" tagColorClass={WARN.split(" ")[0]} tagBorderClass={WARN.split(" ")[1]} heading={t("jungle.gankingStrategy")}>
            <p className="mb-2">
              <b className="text-brand">{t("jungle.priority")}:</b> {plan.gankingStrategy!.priority}
            </p>
            <ul className="space-y-1.5">
              {plan.gankingStrategy!.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand mt-0.5 shrink-0">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </ContentBlock>
          <ContentBlock tag="20+" tagColorClass={GOLD.split(" ")[0]} tagBorderClass={GOLD.split(" ")[1]} heading={t("jungle.objectiveControl")}>
            <p className="mb-1">
              <b className="text-brand">{t("jungle.dragon")}:</b> {plan.objectiveControl!.dragonPriority}
            </p>
            <p className="mb-2">
              <b className="text-brand">{t("jungle.herald")}:</b> {plan.objectiveControl!.heraldStrategy}
            </p>
            <ul className="space-y-1.5">
              {plan.objectiveControl!.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand mt-0.5 shrink-0">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </ContentBlock>
          <ContentBlock
            tag={t(riskLabelKeys[plan.counterJungling!.riskLevel])}
            tagColorClass={NEUTRAL.split(" ")[0]}
            tagBorderClass={NEUTRAL.split(" ")[1]}
            heading={t("jungle.counterJungling")}
          >
            <p className="mb-2">{plan.counterJungling!.strategy}</p>
            <ul className="space-y-1.5">
              {plan.counterJungling!.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand mt-0.5 shrink-0">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </ContentBlock>
        </>
      ) : (
        <PremiumGate sectionTitles={[t("jungle.gankingStrategy"), t("jungle.objectiveControl"), t("jungle.counterJungling")]} />
      )}
    </>
  );

  const buildTab = hasFullData ? (
    <>
      {plan.itemization!.coreBuild.map((item, i) => (
        <ContentBlock key={i} tag={`${t("items.coreBuild")} ${i + 1}`} tagColorClass={GOLD.split(" ")[0]} tagBorderClass={GOLD.split(" ")[1]} heading={item.name}>
          {item.reason}
        </ContentBlock>
      ))}
      {plan.itemization!.situational.length > 0 && (
        <ContentBlock tag={t("items.situational")} tagColorClass={WARN.split(" ")[0]} tagBorderClass={WARN.split(" ")[1]}>
          <ul className="space-y-1.5">
            {plan.itemization!.situational.map((item, i) => (
              <li key={i}>
                <b className="text-foreground">{item.name}</b> — {item.reason}
              </li>
            ))}
          </ul>
        </ContentBlock>
      )}
      <ContentBlock tag={t("items.runes")} tagColorClass={NEUTRAL.split(" ")[0]} tagBorderClass={NEUTRAL.split(" ")[1]}>
        {plan.itemization!.runeNote}
      </ContentBlock>
    </>
  ) : (
    <PremiumGate sectionTitles={[t("lane.itemization")]} />
  );

  const errosTab = hasFullData ? (
    <>
      {plan.mistakes!.map((m, i) => {
        const style = m.severity === "critical" ? CRITICAL : m.severity === "warning" ? WARNING : MINOR;
        return (
          <ContentBlock
            key={i}
            tag={t(`mistakes.${m.severity}`)}
            tagColorClass={style.split(" ")[0]}
            tagBorderClass={style.split(" ")[1]}
          >
            {m.text}
          </ContentBlock>
        );
      })}
    </>
  ) : (
    <PremiumGate sectionTitles={[t("jungle.mistakes")]} />
  );

  const tabs: ResultTabDef[] = [
    { key: "resumo", label: t("result.tab.summary"), content: resumoTab },
    { key: "fases", label: t("result.tab.phases"), content: fasesTab },
    { key: "build", label: t("result.tab.build"), content: buildTab },
    { key: "erros", label: t("result.tab.mistakes"), content: errosTab },
  ];

  return (
    <>
      <ChampionAbilities championId={plan.meta.allyChampionId} championName={plan.meta.allyChampion} side="ally" />
      <ChampionAbilities championId={plan.meta.enemyChampionId} championName={plan.meta.enemyChampion} side="enemy" />

      <ResultTabs tabs={tabs} />

      <Link
        to="/coach"
        className="flex items-center justify-between rounded-2xl border border-dashed px-4 py-[15px]"
        style={{ borderColor: "rgba(245,178,26,.35)" }}
      >
        <span className="text-brand text-[13.5px] font-medium">{t("result.askCoach")}</span>
        <span className="font-mono font-bold text-brand">→</span>
      </Link>
    </>
  );
};

export default JungleAnalysisView;
