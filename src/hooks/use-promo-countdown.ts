import { useEffect, useState } from "react";

export interface PromoRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const getRemaining = (deadline: number): PromoRemaining | null => {
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

/**
 * Ticks down to the real, admin-set deadline from GET /api/settings/promo.
 * Deliberately not an infinite/fake timer: once the deadline passes this
 * returns null and stays null (no resetting), so the urgency shown to
 * visitors stays honest. Returns null while loading or when no promo is active.
 */
export const usePromoCountdown = (): PromoRemaining | null => {
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<PromoRemaining | null>(null);

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

  return remaining;
};
