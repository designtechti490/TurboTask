import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AuthState } from "@/features/auth/use-auth";

interface AuthPageProps {
  auth: AuthState;
}

export function AuthPage({ auth }: AuthPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-r from-blue-500 to-purple-500 p-4 text-white">
      <form
        onSubmit={auth.submit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-blue-950/60 p-6 shadow-2xl"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold italic tracking-tight">
            ✅ TurboTask
          </h1>
          <p className="mt-2 text-sm text-white/70">
            {auth.isSignUp ? "Crie sua conta" : "Entre para acessar suas tarefas"}
          </p>
        </div>

        <Input
          type="email"
          autoComplete="email"
          placeholder="Seu e-mail"
          aria-label="Seu e-mail"
          value={auth.email}
          onChange={(event) => auth.setEmail(event.target.value)}
          required
        />
        <Input
          type="password"
          autoComplete={auth.isSignUp ? "new-password" : "current-password"}
          placeholder="Sua senha (mín. 6 caracteres)"
          aria-label="Sua senha"
          value={auth.password}
          onChange={(event) => auth.setPassword(event.target.value)}
          minLength={6}
          required
        />

        {auth.error && (
          <p role="alert" className="text-sm text-red-300">
            {auth.error}
          </p>
        )}
        {auth.notice && (
          <p role="status" className="text-sm text-green-200">
            {auth.notice}
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-white font-bold text-black hover:bg-blue-100"
          disabled={auth.submitting}
        >
          {auth.submitting
            ? "Aguarde..."
            : auth.isSignUp
              ? "Cadastrar"
              : "Entrar"}
        </Button>

        <button
          type="button"
          onClick={auth.toggleSignUp}
          className="w-full text-xs text-white/70 underline hover:text-white"
        >
          {auth.isSignUp
            ? "Já tem conta? Fazer login"
            : "Não tem conta? Cadastre-se"}
        </button>
      </form>
    </main>
  );
}
