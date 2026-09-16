import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";
import { getRecaptchaToken } from "@/lib/recaptcha";
import Seo from "@/components/seo/Seo";

const Contact = () => {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const recaptchaToken = await getRecaptchaToken("contact_form");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, recaptchaToken }),
      });

      if (!res.ok) throw new Error("request failed");

      setStatus("sent");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Contato e Suporte"
        description="Fale com o suporte do MATCHUP.GG — dúvidas, problemas com sua assinatura ou sugestões."
        path="/contact"
      />
      <Header />

      <main className="flex-1 max-w-xl mx-auto px-4 py-10 space-y-6 w-full">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-brand">
            <Mail className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">{t("contact.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("contact.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="surface-1 border border-border rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact-name">{t("contact.name")}</Label>
              <Input
                id="contact-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact-email">{t("contact.email")}</Label>
              <Input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-subject">{t("contact.subject")}</Label>
            <Input
              id="contact-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("contact.subjectPlaceholder")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-message">{t("contact.message")}</Label>
            <Textarea
              id="contact-message"
              required
              rows={6}
              maxLength={5000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {status === "sent" && <p className="text-xs text-advantage">{t("contact.success")}</p>}
          {status === "error" && <p className="text-xs text-threat">{t("contact.error")}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider bg-brand text-primary-foreground hover:brightness-110 shadow-brand transition-all disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {t("contact.send")}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
