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
