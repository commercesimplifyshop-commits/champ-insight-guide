import { useI18n } from "@/lib/i18n";

/**
 * Real static copy for the homepage — search engines and JS-less LLM
 * crawlers otherwise only see the interactive champion/role picker, with no
 * text describing what the product does or matching how players actually
 * search ("yasuo vs zed matchup", "counter para camille top").
 */
const AboutSection = () => {
  const { t } = useI18n();

  const steps = [
    { title: t("about.step1Title"), body: t("about.step1Body") },
    { title: t("about.step2Title"), body: t("about.step2Body") },
    { title: t("about.step3Title"), body: t("about.step3Body") },
  ];

  return (
    <section className="glass rounded-2xl border border-white/[.07] p-4 space-y-4 mt-6">
      <div className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-brand">{t("about.title")}</h2>
        <p className="text-sm text-ink-70 leading-relaxed">{t("about.intro")}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className="rounded-[14px] border border-white/[.06] bg-white/[.03] p-3.5">
            <h3 className="text-xs font-semibold text-foreground mb-1">{step.title}</h3>
            <p className="text-xs text-ink-50 leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
