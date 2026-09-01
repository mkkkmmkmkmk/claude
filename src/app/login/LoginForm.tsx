"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm text-muted">E-mail</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-gold"
          placeholder="voce@email.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-muted">Senha</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-gold"
          placeholder="••••••••"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-gold w-full rounded-lg py-2.5 text-sm disabled:opacity-60">
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-center text-sm text-muted">
        Não tem conta?{" "}
        <Link href="/registrar" className="text-gold-strong hover:underline">
          Criar conta
        </Link>
      </p>

      <div className="mt-4 rounded-lg border border-border bg-surface-2/60 p-3 text-xs text-muted">
        <p className="font-semibold text-foreground/80">Contas de demonstração</p>
        <p>Admin: admin@pedrobarber.com / admin123</p>
        <p>Cliente: cliente@teste.com / cliente123</p>
      </div>
    </form>
  );
}
