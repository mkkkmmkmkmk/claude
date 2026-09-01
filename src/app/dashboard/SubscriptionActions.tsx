"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionActions({ active }: { active: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!active) return null;

  async function handleCancel() {
    if (!confirm("Tem certeza que deseja cancelar sua assinatura?")) return;
    setLoading(true);
    await fetch("/api/assinatura", { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="mt-3 w-full rounded-full border border-border py-2 text-xs text-muted hover:border-red-800 hover:text-red-400 disabled:opacity-60"
    >
      {loading ? "Cancelando..." : "Cancelar assinatura"}
    </button>
  );
}
