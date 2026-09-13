import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Mode = "signin" | "signup";

const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const { signInWithPassword, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const reset = () => {
    setEmail("");
    setPassword("");
    setError(null);
    setInfo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    const result = mode === "signin" ? await signInWithPassword(email, password) : await signUp(email, password);

    if (result.error) {
      setError(result.error);
    } else if (mode === "signup") {
      setInfo("Conta criada! Verifique seu email para confirmar antes de entrar.");
    } else {
      onOpenChange(false);
      reset();
    }
    setLoading(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{mode === "signin" ? "Entrar" : "Criar Conta"}</DialogTitle>
        </DialogHeader>

        <div className="flex surface-2 rounded-md p-0.5 gap-0.5">
          <button
            type="button"
            onClick={() => { setMode("signin"); reset(); }}
            className={`flex-1 text-xs font-semibold py-1.5 rounded transition-colors ${mode === "signin" ? "bg-brand text-primary-foreground" : "text-muted-foreground"}`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); reset(); }}
            className={`flex-1 text-xs font-semibold py-1.5 rounded transition-colors ${mode === "signup" ? "bg-brand text-primary-foreground" : "text-muted-foreground"}`}
          >
            Criar Conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="auth-password">Senha</Label>
            <Input
              id="auth-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </div>

          {error && <p className="text-xs text-threat">{error}</p>}
          {info && <p className="text-xs text-advantage">{info}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider bg-brand text-primary-foreground hover:brightness-110 shadow-brand transition-all disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "signin" ? "Entrar" : "Criar Conta"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-background px-2 text-muted-foreground">ou</span>
          </div>
        </div>

        <button
          type="button"
          onClick={signInWithGoogle}
          className="w-full px-4 py-2 rounded-lg text-sm font-semibold surface-2 border border-border hover:bg-secondary/50 transition-colors"
        >
          Continuar com Google
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
