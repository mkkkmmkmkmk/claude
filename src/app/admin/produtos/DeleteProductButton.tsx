"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Excluir este produto?")) return;
    setLoading(true);
    await fetch(`/api/admin/produtos/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="text-sm text-muted hover:text-red-400 disabled:opacity-60">
      Excluir
    </button>
  );
}
