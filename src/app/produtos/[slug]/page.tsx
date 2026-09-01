import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getAllProducts } from "@/lib/queries";
import { formatBRL } from "@/lib/types";
import AddToCartButton from "./AddToCartButton";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export default async function ProdutoPage({ params }: PageProps<"/produtos/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="container-page py-14">
      <Link href="/produtos" className="text-sm text-muted hover:text-gold-strong">
        ← Voltar aos produtos
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="card flex h-80 items-center justify-center text-[8rem]">{product.image}</div>

        <div>
          <span className="text-xs uppercase tracking-wide text-gold-strong">{product.category}</span>
          <h1 className="mt-2 font-serif text-3xl font-semibold">{product.name}</h1>
          <p className="mt-4 text-muted">{product.description}</p>
          <p className="mt-6 text-3xl font-semibold text-gold-strong">{formatBRL(product.price_cents)}</p>

          <div className="mt-2 text-sm text-muted">
            {product.stock > 0 ? `${product.stock} unidades em estoque` : "Fora de estoque"}
          </div>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
