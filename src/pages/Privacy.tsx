import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Seo from "@/components/seo/Seo";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">{title}</h2>
    <div className="text-sm text-foreground/80 leading-relaxed space-y-2">{children}</div>
  </div>
);

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Política de Privacidade e Cookies"
        description="Como o MATCHUP.GG coleta, usa e protege seus dados, e nossa política de cookies."
        path="/privacy"
      />
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 space-y-6 w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-foreground">Política de Privacidade e Cookies</h1>
          <p className="text-xs text-muted-foreground">Última atualização: setembro de 2026</p>
        </div>

        <Section title="1. Quem somos">
          <p>
            O MATCHUP.GG (matchupgg.com) é uma ferramenta de análise estratégica para League of Legends. Dúvidas
            sobre esta política ou sobre seus dados podem ser enviadas pela nossa{" "}
            <a href="/contact" className="underline hover:text-foreground">
              página de contato
            </a>
            .
          </p>
        </Section>

        <Section title="2. Quais dados coletamos">
          <p>
            <strong>Conta:</strong> se você criar uma conta (e-mail/senha ou login com Google), armazenamos seu
            e-mail e identificador de usuário através do Supabase, nosso provedor de autenticação.
          </p>
          <p>
            <strong>Uso do site:</strong> os campeões e a role selecionados para gerar uma análise, e — apenas para
            assinantes Premium — o histórico dessas análises, para que você possa consultá-las depois.
          </p>
          <p>
            <strong>Pagamento:</strong> assinaturas são processadas inteiramente pelo Stripe. Nós não armazenamos
            número de cartão, CVV ou qualquer dado de pagamento — apenas o status da sua assinatura (ativa, cancelada
            etc).
          </p>
          <p>
            <strong>Mensagens de contato:</strong> nome, e-mail e a mensagem enviada pelo formulário de contato/suporte.
          </p>
        </Section>

        <Section title="3. Cookies e tecnologias semelhantes">
          <p>Usamos cookies e armazenamento local do navegador para:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Essenciais:</strong> manter sua sessão logada (Supabase Auth) e lembrar que você já viu este
              aviso de cookies.
            </li>
            <li>
              <strong>Proteção contra spam/bots:</strong> o Google reCAPTCHA, usado no formulário de análise e no de
              contato, para diferenciar humanos de robôs.
            </li>
            <li>
              <strong>Publicidade:</strong> o Google AdSense, que pode usar cookies para exibir e medir anúncios.
              Assinantes Premium não veem anúncios e, portanto, esses cookies não se aplicam a eles.
            </li>
          </ul>
          <p>
            Você pode bloquear cookies nas configurações do seu navegador, mas isso pode impedir o login e a
            proteção anti-spam de funcionarem corretamente.
          </p>
        </Section>

        <Section title="4. Com quem compartilhamos dados">
          <p>Usamos os seguintes serviços de terceiros para operar o site, cada um com sua própria política:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Supabase</strong> — autenticação e banco de dados.
            </li>
            <li>
              <strong>Stripe</strong> — processamento de pagamentos.
            </li>
            <li>
              <strong>OpenAI</strong> — geração das análises de matchup por IA. Apenas os campeões e a role
              selecionados são enviados; nenhum dado pessoal seu é incluído nessa chamada.
            </li>
            <li>
              <strong>Google</strong> — reCAPTCHA (anti-spam) e AdSense (publicidade).
            </li>
            <li>
              <strong>Resend</strong> — envio dos e-mails do formulário de contato.
            </li>
            <li>
              <strong>Vercel</strong> — hospedagem do site e métricas básicas de tráfego/performance.
            </li>
          </ul>
          <p>Não vendemos seus dados a terceiros.</p>
        </Section>

        <Section title="5. Riot Games">
          <p>
            Dados de campeões (nomes, imagens, habilidades) vêm da Data Dragon, CDN pública da Riot Games para uso
            por desenvolvedores terceiros. O MATCHUP.GG não é endossado pela Riot Games e não reflete as opiniões da
            Riot Games ou de qualquer pessoa oficialmente envolvida na produção ou gerenciamento das propriedades da
            Riot Games. Não coletamos dados da sua conta de jogo nem usamos a API autenticada da Riot.
          </p>
        </Section>

        <Section title="6. Seus direitos">
          <p>
            Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento pela nossa{" "}
            <a href="/contact" className="underline hover:text-foreground">
              página de contato
            </a>
            . Excluir sua conta remove seus dados de autenticação, histórico de análises e assinatura associados.
          </p>
        </Section>

        <Section title="7. Alterações desta política">
          <p>
            Podemos atualizar esta política conforme o site evolui. Mudanças relevantes serão refletidas na data no
            topo desta página.
          </p>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
