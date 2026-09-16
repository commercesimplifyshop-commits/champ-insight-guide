import { useState } from "react";
import { Link } from "react-router-dom";
import { Swords, UserCircle2, Crown, ShieldCheck } from "lucide-react";
import { useI18n, type Locale } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import AuthDialog from "@/components/auth/AuthDialog";
import DemoModeBanner from "./DemoModeBanner";
import PromoBar from "./PromoBar";

const langOptions: { value: Locale; flag: string; label: string }[] = [
  { value: "pt", flag: "🇧🇷", label: "PT" },
  { value: "en", flag: "🇺🇸", label: "EN" },
];

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
  const { locale, setLocale } = useI18n();
  const { user, isPremium, isAdmin, signOut } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  return (
    <>
      <PromoBar />
      <DemoModeBanner />
      <header className="surface-1 border-b border-border sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo + status badges — brand color for the wordmark/Premium, a
              single reserved color (info-status) for the Admin badge, which
              doubles as the only entry point to /admin. */}
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/" onClick={onLogoClick} className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-brand" />
              <span className="font-bold text-sm tracking-wider text-foreground">
                MATCHUP<span className="text-brand">.GG</span>
              </span>
            </Link>

            {isPremium && (
              <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand text-primary-foreground">
                <Crown className="w-2.5 h-2.5" />
                Premium
              </span>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[hsl(var(--status-info))] text-primary-foreground hover:brightness-110 transition-all"
              >
                <ShieldCheck className="w-2.5 h-2.5" />
                Admin
              </Link>
            )}
          </div>

          {/* Right side — neutral text links, one accent color reserved for
              the primary CTA / selected state only. */}
          <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
            <Link to="/pricing" className="hover:text-foreground transition-colors hidden sm:inline">
              Planos
            </Link>

            <div className="flex items-center gap-0.5 surface-2 rounded-md p-0.5">
              {langOptions.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setLocale(lang.value)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors ${
                    locale === lang.value ? "bg-brand text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/account" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  <UserCircle2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Minha Conta</span>
                </Link>
                <button onClick={signOut} className="hover:text-foreground transition-colors">
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthDialogOpen(true)}
                className="uppercase tracking-wider px-3 py-1.5 rounded-md bg-brand text-primary-foreground hover:brightness-110 transition-all"
              >
                Entrar
              </button>
            )}
          </div>
        </div>

        <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      </header>
    </>
  );
};

export default Header;
