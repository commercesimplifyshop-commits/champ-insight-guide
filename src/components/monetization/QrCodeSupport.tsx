import { Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const QrCodeSupport = () => {
  const { t } = useI18n();

  return (
    <div className="surface-1 border border-border rounded-xl p-4 text-center space-y-3">
      <div className="flex items-center justify-center gap-2 text-brand">
        <Heart className="w-4 h-4 fill-current" />
        <span className="text-xs font-bold uppercase tracking-wider">
          {t("support.title")}
        </span>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        {t("support.description")}
      </p>

      {/* QR Code placeholder — replace src with your actual QR code image */}
      <div className="mx-auto w-32 h-32 surface-2 border border-border rounded-lg flex items-center justify-center">
        <span className="text-[10px] text-muted-foreground font-mono">QR CODE</span>
      </div>

      <p className="text-[10px] text-muted-foreground italic">
        {t("support.scanMessage")}
      </p>
    </div>
  );
};

export default QrCodeSupport;
