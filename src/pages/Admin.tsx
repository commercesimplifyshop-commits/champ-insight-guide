import { Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import Header from "@/components/layout/Header";

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center py-20">
          <p className="text-sm text-muted-foreground">
            {user ? "Sua conta não tem acesso administrativo." : "Você precisa entrar com uma conta administradora."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-info-status" />
          <h1 className="text-lg font-extrabold text-foreground">Painel Administrativo</h1>
        </div>

        <div className="surface-1 border border-dashed border-border rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhuma configuração administrativa disponível ainda — esta página existe como base para o que vier a
            seguir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
