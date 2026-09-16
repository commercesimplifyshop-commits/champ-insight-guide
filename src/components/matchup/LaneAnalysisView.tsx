import { Link } from "react-router-dom";
import type { LaneMatchupPlan } from "@/types/matchup";
import { useI18n } from "@/lib/i18n";
import ChampionAbilities from "./ChampionAbilities";
import ContentBlock from "./ContentBlock";
import ResultTabs, { type ResultTabDef } from "./ResultTabs";
import PowerSpikesList from "./PowerSpikesList";
import PremiumGate from "./PremiumGate";

interface LaneAnalysisViewProps {
  plan: LaneMatchupPlan;
}

const GOLD = "text-brand border-brand/30";
const NEUTRAL = "text-ink-70 border-white/10";
const DANGER = "text-threat border-threat/30";
const WARN = "text-[#FFC44D] border-[#FFC44D]/30";
const CRITICAL = "text-threat border-threat/30";
const WARNING = "text-[#FFC44D] border-[#FFC44D]/30";
const MINOR = "text-ink-40 border-white/10";

const LaneAnalysisView = ({ plan }: LaneAnalysisViewProps) => {
  const { t } = useI18n();
  const locked = plan.meta.locked ?? false;
  const hasFullData = !locked && plan.jungleControl && plan.midGame && plan.lateGame && plan.itemization && plan.mistakes;

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
      <ContentBlock tag="0-6" tagColorClass={DANGER.split(" ")[0]} tagBorderClass={DANGER.split(" ")[1]} heading={plan.earlyGame.title}>
        <p className="mb-2 text-foreground/90">{plan.earlyGame.objective}</p>
        <ul className="space-y-1.5">
          {plan.earlyGame.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-brand mt-0.5 shrink-0">▸</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </ContentBlock>

      {hasFullData ? (
        <>
          <ContentBlock tag={t("lane.visionJungle")} tagColorClass={NEUTRAL.split(" ")[0]} tagBorderClass={NEUTRAL.split(" ")[1]}>
            <p className="mb-1">
              <b className="text-brand">{t("lane.wardingPriority")}:</b> {plan.jungleControl!.wardingPriority}
            </p>
            <p className="mb-2">
              <b className="text-brand">{t("lane.objectiveFocus")}:</b> {plan.jungleControl!.objectiveFocus}
            </p>
            <ul className="space-y-1.5">
              {plan.jungleControl!.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand mt-0.5 shrink-0">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </ContentBlock>
          <ContentBlock tag="6-20" tagColorClass={WARN.split(" ")[0]} tagBorderClass={WARN.split(" ")[1]} heading={plan.midGame!.title}>
            <p className="mb-2 text-foreground/90">{plan.midGame!.objective}</p>
            <ul className="space-y-1.5">
              {plan.midGame!.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand mt-0.5 shrink-0">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </ContentBlock>
          <ContentBlock tag="20+" tagColorClass={GOLD.split(" ")[0]} tagBorderClass={GOLD.split(" ")[1]} heading={plan.lateGame!.title}>
            <p className="mb-2 text-foreground/90">{plan.lateGame!.objective}</p>
            <ul className="space-y-1.5">
              {plan.lateGame!.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand mt-0.5 shrink-0">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </ContentBlock>
        </>
      ) : (
        <PremiumGate sectionTitles={[t("lane.visionJungle"), t("phase.midGame"), t("phase.lateGame")]} />
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
    <PremiumGate sectionTitles={[t("lane.mistakes")]} />
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
      {plan.meta.enemyChampionId && plan.meta.enemyChampion && (
        <ChampionAbilities championId={plan.meta.enemyChampionId} championName={plan.meta.enemyChampion} side="enemy" />
      )}

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

export default LaneAnalysisView;
