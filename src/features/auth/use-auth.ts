import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) {
        toast("Erro ao carregar sessão", {
          description: sessionError.message,
          style: { background: "#7f1d1d", color: "white" },
        });
      } else {
        setSession(data.session);
      }
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);

    try {
      const { data, error: authError } = isSignUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
      } else if (isSignUp && !data.session) {
        setNotice(
          "Conta criada. Verifique seu e-mail para confirmar o cadastro.",
        );
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível concluir a autenticação.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp((current) => !current);
    setError(null);
    setNotice(null);
  };

  const signOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      toast("Erro ao sair", {
        description: signOutError.message,
        style: { background: "#7f1d1d", color: "white" },
      });
    }
  };

  return {
    session,
    loading,
    isSignUp,
    email,
    setEmail,
    password,
    setPassword,
    error,
    notice,
    submitting,
    submit,
    toggleSignUp,
    signOut,
  };
}

export type AuthState = ReturnType<typeof useAuth>;
