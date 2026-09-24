import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface FooterProps {
  patch?: string | null;
}

const Footer = ({ patch }: FooterProps) => {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-2">
        <p className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-brand/90">
          <Sparkles className="w-3 h-3" />
          {t("footer.poweredByAi")}
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 py-1">
          {[
            { to: "/", label: t("nav.matchup") },
            { to: "/modo-solo", label: t("nav.soloShort") },
            { to: "/guias", label: t("nav.guides") },
            { to: "/campeoes", label: t("nav.champions") },
            { to: "/glossario", label: t("nav.glossary") },
            { to: "/pricing", label: t("nav.pricing") },
          ].map((l) => (
            <Link key={l.to} to={l.to} className="text-xs font-medium text-ink-70 hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="text-[11px] text-muted-foreground leading-relaxed max-w-2xl mx-auto text-center">
          {t("footer.disclaimer")}
        </p>
        <p className="text-center flex items-center justify-center gap-3">
          <Link to="/contact" className="text-[11px] text-muted-foreground hover:text-foreground underline transition-colors">
            {t("footer.contact")}
          </Link>
          <Link to="/privacy" className="text-[11px] text-muted-foreground hover:text-foreground underline transition-colors">
            {t("footer.privacy")}
          </Link>
        </p>
        {patch && (
          <p className="text-[10px] text-muted-foreground/70 text-center font-mono">
            Data Dragon {patch}
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;
