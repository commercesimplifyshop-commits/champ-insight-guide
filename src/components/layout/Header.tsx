import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import AuthDialog from "@/components/auth/AuthDialog";
import DemoModeBanner from "./DemoModeBanner";
import PromoBar from "./PromoBar";
import NavDrawer from "./NavDrawer";

interface HeaderProps {
  /**
   * Index.tsx renders its matchup result at the same "/" route as the
   * selection screen (no route change happens), so <Link to="/"> is a
   * no-op there and clicking the logo appeared to do nothing. Passing this
   * lets that page reset its own state when the logo is clicked while
   * already home.
   */
  onLogoClick?: () => void;
}

const Header = ({ onLogoClick }: HeaderProps) => {
  const { t } = useI18n();
  const { user, isPremium, isAdmin } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = (user?.email || "?").slice(0, 2).toUpperCase();

  return (
    <>
      <PromoBar />
      <DemoModeBanner />
      <header
        className="sticky top-0 z-40 flex items-center gap-2.5 px-3.5 py-[11px] border-b border-hairline"
        style={{ background: "rgba(12,13,17,.72)", backdropFilter: "blur(24px)" }}
      >
        <button
          onClick={() => setMenuOpen(true)}
          aria-label={t("nav.openMenu")}
          className="shrink-0 w-[34px] h-[34px] rounded-[10px] border border-white/10 flex flex-col items-center justify-center gap-1"
        >
          <span className="w-[15px] h-[1.5px] bg-[rgba(244,245,243,.85)]" />
          <span className="w-[15px] h-[1.5px] bg-[rgba(244,245,243,.85)]" />
          <span className="w-[9px] h-[1.5px] self-start ml-[9.5px]" style={{ background: "rgba(245,178,26,.9)" }} />
        </button>

        <Link to="/" onClick={onLogoClick} className="flex items-baseline gap-1 mr-auto">
          <span className="font-bold text-[17px] tracking-[-.4px]">MATCHUP</span>
          <span className="font-bold text-[17px] font-mono text-brand">.GG</span>
        </Link>

        {isAdmin && (
          <Link
            to="/admin"
            className="hidden sm:flex items-center text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[hsl(var(--status-info))] text-primary-foreground"
          >
            Admin
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-2">
            {isPremium && (
              <span className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-full border" style={{ borderColor: "rgba(245,178,26,.28)", background: "rgba(245,178,26,.07)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse-dot" />
                <span className="font-mono text-[10px] text-brand">PRO</span>
              </span>
            )}
            <Link
              to="/account"
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0"
              style={{ background: "repeating-linear-gradient(135deg,rgba(255,255,255,.1) 0 5px,rgba(255,255,255,.04) 5px 10px)" }}
            >
              <span className="font-mono font-bold text-[10px] text-ink-70">{initials}</span>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={() => setAuthDialogOpen(true)} className="text-[13px] font-medium text-ink-70 px-1">
              {t("nav.signIn")}
            </button>
            <Link
              to="/pricing"
              className="font-bold text-[13px] px-3.5 py-2 rounded-full shadow-brand"
              style={{ color: "var(--on-accent)", background: "linear-gradient(180deg,#FFC94A,#F5B21A)" }}
            >
              {t("nav.subscribe")}
            </Link>
          </div>
        )}
      </header>

      <NavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} onOpenAuth={() => setAuthDialogOpen(true)} />
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  );
};

export default Header;
