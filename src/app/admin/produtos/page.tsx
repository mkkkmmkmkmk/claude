import { getAllProducts } from "@/lib/queries";
import { formatBRL } from "@/lib/types";
import NewProductForm from "./NewProductForm";
import DeleteProductButton from "./DeleteProductButton";

export const metadata = { title: "Produtos — Admin Pedro Barber" };

export default function AdminProdutosPage() {
  const products = getAllProducts();

  return (
    <div className="space-y-8">
      <NewProductForm />

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-2/60 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Estoque</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <span className="mr-2">{p.image}</span>
                  {p.name}
                </td>
                <td className="px-4 py-3 text-muted">{p.category}</td>
                <td className="px-4 py-3 text-gold-strong">{formatBRL(p.price_cents)}</td>
                <td className="px-4 py-3 text-muted">{p.stock}</td>
                <td className="px-4 py-3 text-right">
                  <DeleteProductButton id={p.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
