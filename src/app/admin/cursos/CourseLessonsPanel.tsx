"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Lesson } from "@/lib/types";

export default function CourseLessonsPanel({
  courseId,
  lessons,
}: {
  courseId: string;
  lessons: Lesson[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddLesson(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title"),
      description: form.get("description"),
      video_url: form.get("video_url") || "https://example.com/video-placeholder",
      duration_min: form.get("duration_min"),
      is_free: form.get("is_free") === "on",
    };

    const res = await fetch(`/api/admin/cursos/${courseId}/aulas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Erro ao adicionar aula.");
      return;
    }

    e.currentTarget.reset();
    router.refresh();
  }

  async function handleDeleteLesson(id: string) {
    if (!confirm("Remover esta aula?")) return;
    await fetch(`/api/admin/aulas/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="mt-4 border-t border-border pt-4">
      <button onClick={() => setOpen((o) => !o)} className="text-sm text-gold-strong hover:underline">
        {open ? "Ocultar aulas" : `Gerenciar aulas (${lessons.length})`}
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          <ul className="space-y-2">
            {lessons.map((l, idx) => (
              <li key={l.id} className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2 text-sm">
                <span>
                  {idx + 1}. {l.title} — {l.duration_min} min{" "}
                  {l.is_free === 1 && <span className="text-gold-strong">(grátis)</span>}
                </span>
                <button onClick={() => handleDeleteLesson(l.id)} className="text-xs text-muted hover:text-red-400">
                  Remover
                </button>
              </li>
            ))}
            {lessons.length === 0 && <p className="text-sm text-muted">Nenhuma aula cadastrada.</p>}
          </ul>

          <form onSubmit={handleAddLesson} className="grid gap-2 sm:grid-cols-2">
            {error && (
              <div className="sm:col-span-2 rounded-lg border border-red-800 bg-red-950/40 px-3 py-2 text-xs text-red-300">
                {error}
              </div>
            )}
            <input name="title" required placeholder="Título da aula" className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-gold" />
            <input name="duration_min" required type="number" min="1" placeholder="Duração (min)" className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-gold" />
            <input name="video_url" placeholder="URL do vídeo" className="sm:col-span-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-gold" />
            <input name="description" required placeholder="Descrição curta" className="sm:col-span-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-gold" />
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" name="is_free" className="accent-gold" />
              Aula gratuita (amostra)
            </label>
            <button type="submit" disabled={loading} className="btn-outline rounded-full py-2 text-sm disabled:opacity-60">
              {loading ? "Adicionando..." : "+ Adicionar aula"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
