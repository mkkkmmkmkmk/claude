"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GiftClaim({ redeemed, giftCode }: { redeemed: boolean; giftCode: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [localRedeemed, setLocalRedeemed] = useState(redeemed);

  async function handleClaim() {
    setLoading(true);
    const res = await fetch("/api/assinatura/resgatar-brinde", { method: "POST" });
    setLoading(false);
    if (res.ok) {
      setLocalRedeemed(true);
      router.refresh();
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-gold/40 bg-surface-2 p-4 text-sm">
      <p className="font-semibold text-gold-strong">🎁 Brinde de assinante</p>
      {localRedeemed ? (
        <>
          <p className="mt-1 text-muted">Brinde resgatado! Apresente o código na barbearia:</p>
          <p className="mt-2 rounded-md bg-background px-3 py-2 text-center font-mono text-gold-strong">
            {giftCode}
          </p>
        </>
      ) : (
        <>
          <p className="mt-1 text-muted">
            Kit de boas-vindas Pedro Barber (pomada + óleo para barba) disponível para resgate.
          </p>
          <button
            onClick={handleClaim}
            disabled={loading}
            className="btn-gold mt-3 w-full rounded-full py-2 text-sm disabled:opacity-60"
          >
            {loading ? "Resgatando..." : "Resgatar brinde"}
          </button>
        </>
      )}
    </div>
  );
}
