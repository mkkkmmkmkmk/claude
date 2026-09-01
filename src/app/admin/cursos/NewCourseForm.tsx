"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function NewCourseForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title"),
      description: form.get("description"),
      price_cents: Math.round(Number(form.get("price")) * 100),
      image: form.get("image") || "✂️",
      level: form.get("level") || "Iniciante",
    };

    const res = await fetch("/api/admin/cursos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Erro ao criar curso.");
      return;
    }

    e.currentTarget.reset();
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold">Cursos</h2>
        <button onClick={() => setOpen((o) => !o)} className="btn-outline rounded-full px-4 py-1.5 text-sm">
          {open ? "Cancelar" : "+ Novo curso"}
        </button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="mt-5 grid gap-3 sm:grid-cols-2">
          {error && (
            <div className="sm:col-span-2 rounded-lg border border-red-800 bg-red-950/40 px-4 py-2 text-sm text-red-300">
              {error}
            </div>
          )}
          <input name="title" required placeholder="Título do curso" className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-gold" />
          <input name="level" placeholder="Nível (ex: Iniciante)" className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-gold" />
          <input name="price" required type="number" step="0.01" min="0" placeholder="Preço (R$)" className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-gold" />
          <input name="image" placeholder="Emoji (ex: ✂️)" className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-gold" />
          <textarea name="description" required placeholder="Descrição" rows={2} className="sm:col-span-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-gold" />
          <button type="submit" disabled={loading} className="btn-gold sm:col-span-2 rounded-full py-2.5 text-sm disabled:opacity-60">
            {loading ? "Salvando..." : "Criar curso"}
          </button>
        </form>
      )}
    </div>
  );
}
