"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import type { Product } from "@/lib/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      id: product.id,
      name: product.name,
      price_cents: product.price_cents,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleAdd}
        disabled={product.stock <= 0}
        className="btn-gold rounded-full px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        {added ? "Adicionado ✓" : "Adicionar ao carrinho"}
      </button>
      <button
        onClick={() => {
          handleAdd();
          router.push("/carrinho");
        }}
        disabled={product.stock <= 0}
        className="btn-outline rounded-full px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        Comprar agora
      </button>
    </div>
  );
}
