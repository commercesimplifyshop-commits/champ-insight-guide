import { Swords, Users, Shield, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-banner-mobile.jpg";

const features = [
  { icon: Swords, label: "Matchup 1v1", available: true },
  { icon: Users, label: "Análise 5v5", available: false },
  { icon: Shield, label: "Counter Finder", available: false },
  { icon: Sparkles, label: "IA Coach", available: false },
];

const HeroBanner = () => {
  return (
    <div className="relative rounded-xl overflow-hidden border border-border">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-5 pt-10 pb-5 space-y-4">
        <div className="space-y-1.5">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand">
            Powered by AI
          </p>
          <h2 className="text-lg font-extrabold text-foreground leading-tight">
            Domine cada partida com
            <br />
            <span className="text-brand">estratégias em tempo real</span>
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
            Planos táticos personalizados gerados por IA para cada matchup. Saiba exatamente o que fazer em cada fase do jogo.
          </p>
        </div>

        {/* Feature pills */}
        <div className="grid grid-cols-2 gap-2">
          {features.map((f) => (
            <div
              key={f.label}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                f.available
                  ? "surface-2 border border-brand/30 text-brand"
                  : "surface-2 border border-border text-muted-foreground"
              }`}
            >
              <f.icon className="w-3.5 h-3.5 shrink-0" />
              <span>{f.label}</span>
              {!f.available && (
                <span className="ml-auto text-[9px] font-mono uppercase tracking-wider opacity-60">
                  Em breve
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
