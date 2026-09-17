import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import CookieConsentBanner from "@/components/layout/CookieConsentBanner";
import Index from "./pages/Index";
import Coach from "./pages/Coach";
import Account from "./pages/Account";
import Pricing from "./pages/Pricing";
import Admin from "./pages/Admin";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import MatchupsHub from "./pages/MatchupsHub";
import MatchupPage from "./pages/MatchupPage";
import ChampionsHub from "./pages/ChampionsHub";
import ChampionWiki from "./pages/ChampionWiki";
import Glossary from "./pages/Glossary";
import GlossaryTerm from "./pages/GlossaryTerm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <CookieConsentBanner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/coach" element={<Coach />} />
                <Route path="/account" element={<Account />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/matchups" element={<MatchupsHub />} />
                <Route path="/matchups/:role/:champSlug" element={<MatchupPage />} />
                <Route path="/campeoes" element={<ChampionsHub />} />
                <Route path="/campeoes/:championId" element={<ChampionWiki />} />
                <Route path="/glossario" element={<Glossary />} />
                <Route path="/glossario/:slug" element={<GlossaryTerm />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
