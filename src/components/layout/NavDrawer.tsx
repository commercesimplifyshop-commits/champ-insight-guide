import { Link, useLocation } from "react-router-dom";
import { useI18n, type Locale } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

const langOptions: { value: Locale; flag: string; label: string }[] = [
  { value: "pt", flag: "🇧🇷", label: "PT" },
  { value: "en", flag: "🇺🇸", label: "EN" },
];

/** Drawer nav — the design handoff's routes that don't have a dedicated
 * page yet (Draft 5v5, Counter Finder) reuse Index.tsx's existing mode
 * switcher via a `?mode=` query param instead of separate routes. */
const NavDrawer = ({ open, onClose, onOpenAuth }: NavDrawerProps) => {
  const { t, locale, setLocale } = useI18n();
  const { user, signOut } = useAuth();
  const location = useLocation();

  if (!open) return null;

  const links: { to: string; label: string; badge?: string; active: boolean }[] = [
    { to: "/", label: t("nav.matchup"), active: location.pathname === "/" && location.search === "" },
    { to: "/?solo=1", label: t("nav.solo"), active: location.search === "?solo=1" },
    { to: "/?mode=team", label: t("nav.draft"), active: location.search === "?mode=team" },
    { to: "/coach", label: t("nav.coach"), badge: "PRO", active: location.pathname === "/coach" },
    { to: "/?mode=counters", label: t("nav.counters"), active: location.search === "?mode=counters" },
    { to: "/pricing", label: t("nav.pricing"), active: location.pathname === "/pricing" },
  ];

  return (
    <div className="fixed inset-0 z-[85] flex" style={{ background: "var(--scrim)" }}>
      <div className="w-[302px] sheet-surface border-r border-hairline pt-[66px] pb-[34px] px-5 flex flex-col gap-2 overflow-y-auto no-scrollbar">
        <div className="flex items-baseline gap-1 mb-3.5">
          <span className="font-bold text-lg tracking-[-.4px]">MATCHUP</span>
          <span className="font-bold text-lg font-mono text-brand">.GG</span>
        </div>

        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            onClick={onClose}
            className={`flex items-center justify-between py-3.5 border-b border-white/[.06] ${
              l.active ? "text-brand" : "text-foreground"
            }`}
          >
            <span className="text-[15px] font-medium">{l.label}</span>
            {l.badge && <span className="font-mono text-[9.5px] text-brand">{l.badge}</span>}
          </Link>
        ))}

        <div className="flex items-center gap-0.5 surface-2 rounded-md p-0.5 mt-3 w-fit">
          {langOptions.map((lang) => (
            <button
              key={lang.value}
              onClick={() => setLocale(lang.value)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors ${
                locale === lang.value ? "bg-brand text-primary-foreground" : "text-ink-50 hover:text-foreground"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-4">
          <Link
            to="/pricing"
            onClick={onClose}
            className="h-12 rounded-[13px] font-bold text-[14.5px] shadow-brand flex items-center justify-center"
            style={{ background: "linear-gradient(180deg,#FFC94A,#F5B21A)", color: "var(--on-accent)" }}
          >
            {t("nav.subscribePro")}
          </Link>
          {user ? (
            <button
              onClick={() => {
                onClose();
                signOut();
              }}
              className="h-[46px] rounded-[13px] border border-white/[.12] text-[14px] font-medium text-ink-70"
            >
              {t("nav.signOut")}
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="h-[46px] rounded-[13px] border border-white/[.12] text-[14px] font-medium text-ink-70"
            >
              {t("nav.signIn")}
            </button>
          )}
        </div>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};

export default NavDrawer;
