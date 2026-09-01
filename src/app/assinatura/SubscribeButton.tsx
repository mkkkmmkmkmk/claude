"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscribeButton({ loggedIn }: { loggedIn: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe() {
    if (!loggedIn) {
      router.push("/login?callbackUrl=/assinatura");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/assinatura", { method: "POST" });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Não foi possível ativar a assinatura.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div>
      <button onClick={handleSubscribe} disabled={loading} className="btn-gold block w-full rounded-full py-3 text-sm disabled:opacity-60">
        {loading ? "Ativando..." : "Assinar agora — R$ 100/mês"}
      </button>
      {error && <p className="mt-2 text-center text-xs text-red-400">{error}</p>}
    </div>
  );
}
