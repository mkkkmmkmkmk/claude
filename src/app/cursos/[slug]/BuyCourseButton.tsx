"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Course } from "@/lib/types";

export default function BuyCourseButton({ course }: { course: Course }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/cursos/${course.slug}`);
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/cursos/comprar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: course.id }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Não foi possível concluir a compra.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div>
      <button onClick={handleBuy} disabled={loading} className="btn-gold block w-full rounded-full py-2.5 text-sm disabled:opacity-60">
        {loading ? "Processando..." : session ? "Comprar este curso" : "Entrar para comprar"}
      </button>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
