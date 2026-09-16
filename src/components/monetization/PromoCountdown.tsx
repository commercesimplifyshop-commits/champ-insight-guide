import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

interface PromoCountdownProps {
  /** Extra classes for layout tweaks from the parent (e.g. margin). */
  className?: string;
}

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const getRemaining = (deadline: number): Remaining | null => {
  const diff = deadline - Date.now();
  if (diff <= 0) return null;
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Countdown to a real, admin-set deadline (GET /api/settings/promo) —
 * deliberately not an infinite/fake timer: once the deadline passes this
 * renders nothing instead of resetting, so the urgency stays honest.
 * Renders nothing while loading or when no promo is active.
 */
const PromoCountdown = ({ className = "" }: PromoCountdownProps) => {
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    fetch("/api/settings/promo")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { deadline: string | null }) => {
        if (!data.deadline) return;
        const ts = Date.parse(data.deadline);
        if (!Number.isNaN(ts)) setDeadline(ts);
      })
      .catch(() => {
        // No active promo (or settings unreachable) — countdown simply stays hidden.
      });
  }, []);

  useEffect(() => {
    if (deadline === null) return;
    setRemaining(getRemaining(deadline));
    const interval = setInterval(() => setRemaining(getRemaining(deadline)), 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (!remaining) return null;

  return (
    <div className={`flex items-center gap-1.5 text-[11px] font-bold ${className}`}>
      <Flame className="w-3.5 h-3.5 text-threat shrink-0" />
      <span className="text-threat uppercase tracking-wider">Oferta termina em</span>
      <span className="font-mono text-foreground tabular-nums">
        {remaining.days > 0 && `${remaining.days}d `}
        {pad(remaining.hours)}:{pad(remaining.minutes)}:{pad(remaining.seconds)}
      </span>
    </div>
  );
};

export default PromoCountdown;
