"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/CartContext";
import { formatBRL } from "@/lib/types";

export default function CartView() {
  const { items, removeItem, setQuantity, clear, totalCents } = useCart();
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleCheckout() {
    if (status !== "authenticated") {
      router.push("/login?callbackUrl=/carrinho");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/pedidos/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Não foi possível finalizar o pedido.");
      return;
    }

    clear();
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="card p-8 text-center">
        <p className="text-4xl">✅</p>
        <h2 className="mt-4 font-serif text-xl font-semibold">Pedido confirmado!</h2>
        <p className="mt-2 text-sm text-muted">Você pode acompanhar seus pedidos no seu painel.</p>
        <Link href="/dashboard" className="btn-gold mt-6 inline-block rounded-full px-6 py-2.5 text-sm">
          Ir para meu painel
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-4xl">🛒</p>
        <h2 className="mt-4 font-serif text-xl font-semibold">Seu carrinho está vazio</h2>
        <Link href="/produtos" className="btn-gold mt-6 inline-block rounded-full px-6 py-2.5 text-sm">
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_320px]">
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="card flex items-center gap-4 p-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-3xl">
              {item.image}
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gold-strong">{formatBRL(item.price_cents)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(item.id, item.quantity - 1)}
                className="pill h-8 w-8 text-sm hover:border-gold"
              >
                -
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => setQuantity(item.id, item.quantity + 1)}
                className="pill h-8 w-8 text-sm hover:border-gold"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="text-sm text-muted hover:text-red-400"
              aria-label="Remover"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <aside className="card h-fit p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Total</span>
          <span className="text-xl font-semibold text-gold-strong">{formatBRL(totalCents)}</span>
        </div>
        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="btn-gold mt-4 w-full rounded-full py-2.5 text-sm disabled:opacity-60"
        >
          {loading ? "Processando..." : "Finalizar pedido"}
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          Pagamento simulado nesta demonstração.
        </p>
      </aside>
    </div>
  );
}
