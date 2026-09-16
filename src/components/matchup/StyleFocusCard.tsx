import { Compass, Clock, Repeat } from "lucide-react";
import type { StyleFocus } from "@/types/matchup";
import { useI18n } from "@/lib/i18n";

interface StyleFocusCardProps {
  styleFocus: StyleFocus;
}

/**
 * Renders the plan's concrete, matchup-specific translation of the player's
 * chosen playstyle + macro style — the direct answer to "does this actually
 * play the way I said I wanted?". Shown right after the overview so it's the
 * first thing a returning player checks.
 */
const StyleFocusCard = ({ styleFocus }: StyleFocusCardProps) => {
  const { t } = useI18n();

  return (
    <div className="rounded-lg border-2 border-brand overflow-hidden">
      <div className="bg-brand px-4 py-2 flex items-center gap-2">
        <Compass className="w-4 h-4 text-primary-foreground" />
        <span className="text-sm font-bold tracking-wider uppercase text-primary-foreground">
          {t("styleFocus.title")}
        </span>
      </div>

      <div className="surface-1 p-4 space-y-4">
        <p className="text-sm text-foreground/90 leading-relaxed font-medium">{styleFocus.summary}</p>

        {styleFocus.keyMoments.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-caution shrink-0" />
              <span className="text-xs font-bold text-caution uppercase tracking-wider">
                {t("styleFocus.keyMoments")}
              </span>
            </div>
            <ul className="space-y-1.5">
              {styleFocus.keyMoments.map((moment, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-brand mt-0.5 shrink-0">▸</span>
                  <span className="text-foreground/80">{moment}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {styleFocus.adaptationTip && (
          <div className="surface-2 rounded-md p-3">
            <div className="flex items-center gap-2 mb-2">
              <Repeat className="w-4 h-4 text-info-status shrink-0" />
              <span className="text-xs font-bold text-info-status uppercase tracking-wider">
                {t("styleFocus.adaptationTip")}
              </span>
            </div>
            <p className="text-xs text-foreground/80 leading-relaxed">{styleFocus.adaptationTip}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleFocusCard;
