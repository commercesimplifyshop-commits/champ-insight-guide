import { Itemization } from "@/types/matchup";
import { Package, Sparkles, BookOpen } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface ItemBuildProps {
  itemization: Itemization;
}

const ItemBuild = ({ itemization }: ItemBuildProps) => {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-3.5 h-3.5 text-brand" />
          <span className="text-xs font-bold text-brand uppercase tracking-wider">{t("items.coreBuild")}</span>
        </div>
        <div className="space-y-1.5">
          {itemization.coreBuild.map((item, i) => (
            <div key={i} className="flex items-center gap-3 surface-2 rounded-md px-3 py-2">
              <span className="font-mono text-xs font-bold text-foreground">{i + 1}.</span>
              <span className="text-sm font-semibold text-foreground">{item.name}</span>
              <span className="text-xs text-muted-foreground">— {item.reason}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-caution" />
          <span className="text-xs font-bold text-caution uppercase tracking-wider">{t("items.situational")}</span>
        </div>
        <div className="space-y-1.5">
          {itemization.situational.map((item, i) => (
            <div key={i} className="flex items-center gap-3 surface-2 rounded-md px-3 py-2">
              <span className="text-sm text-foreground/80">{item.name}</span>
              <span className="text-xs text-muted-foreground">— {item.reason}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="surface-2 rounded-md px-3 py-2.5 flex items-start gap-2">
        <BookOpen className="w-3.5 h-3.5 text-info-status shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-info-status uppercase tracking-wider">{t("items.runes")}: </span>
          <span className="text-xs text-foreground/70">{itemization.runeNote}</span>
        </div>
      </div>
    </div>
  );
};

export default ItemBuild;
