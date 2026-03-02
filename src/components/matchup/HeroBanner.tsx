import { Swords, Users, Shield, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-banner-mobile.jpg";
import { useI18n } from "@/lib/i18n";

const HeroBanner = () => {
  const { t } = useI18n();

  const features = [
    { icon: Swords, labelKey: "hero.feature.1v1" as const, available: true },
    { icon: Users, labelKey: "hero.feature.5v5" as const, available: false },
    { icon: Shield, labelKey: "hero.feature.counter" as const, available: false },
    { icon: Sparkles, labelKey: "hero.feature.coach" as const, available: false },
  ];

  return (
    <div className="relative rounded-xl overflow-hidden border border-border">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
      </div>

      <div className="relative z-10 px-5 pt-10 pb-5 space-y-4">
        <div className="space-y-1.5">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand">
            {t("hero.badge")}
          </p>
          <h2 className="text-lg font-extrabold text-foreground leading-tight">
            {t("hero.title1")}
            <br />
            <span className="text-brand">{t("hero.title2")}</span>
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
            {t("hero.description")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {features.map((f) => (
            <div
              key={f.labelKey}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                f.available
                  ? "surface-2 border border-brand/30 text-brand"
                  : "surface-2 border border-border text-muted-foreground"
              }`}
            >
              <f.icon className="w-3.5 h-3.5 shrink-0" />
              <span>{t(f.labelKey)}</span>
              {!f.available && (
                <span className="ml-auto text-[9px] font-mono uppercase tracking-wider opacity-60">
                  {t("hero.comingSoon")}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
