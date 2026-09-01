import { getAllProducts } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";

export const metadata = { title: "Produtos — Pedro Barber" };

export default function ProdutosPage() {
  const products = getAllProducts();
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="container-page py-14">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-semibold">Produtos</h1>
        <p className="mt-2 text-sm text-muted">
          Linha profissional Pedro Barber para cabelo, barba e ferramentas de corte.
        </p>
      </div>

      {categories.map((cat) => (
        <div key={cat} className="mb-12">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold-strong">{cat}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.filter((p) => p.category === cat).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
