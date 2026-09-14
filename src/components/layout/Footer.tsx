import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

interface FooterProps {
  patch?: string | null;
}

const Footer = ({ patch }: FooterProps) => {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-2">
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
