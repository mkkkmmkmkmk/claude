import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatBRL } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/produtos/${product.slug}`} className="card group flex flex-col overflow-hidden p-5 transition hover:border-gold">
      <div className="flex h-32 items-center justify-center rounded-lg bg-surface-2 text-6xl">
        {product.image}
      </div>
      <span className="mt-4 text-xs uppercase tracking-wide text-gold-strong">{product.category}</span>
      <h3 className="mt-1 font-serif text-lg font-semibold text-foreground group-hover:text-gold-strong">
        {product.name}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{product.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-gold-strong">{formatBRL(product.price_cents)}</span>
        <span className="text-xs text-muted">Ver produto →</span>
      </div>
    </Link>
  );
}
