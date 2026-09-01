import { getAllOrders, getOrderItems } from "@/lib/queries";
import { formatBRL } from "@/lib/types";

export const metadata = { title: "Pedidos — Admin Pedro Barber" };

export default function AdminPedidosPage() {
  const orders = getAllOrders();

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-lg font-semibold">Pedidos ({orders.length})</h2>
      {orders.length === 0 ? (
        <div className="card p-6 text-sm text-muted">Nenhum pedido registrado ainda.</div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => {
            const items = getOrderItems(o.id);
            return (
              <li key={o.id} className="card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div>
                    <span className="font-medium">{o.user_name}</span>{" "}
                    <span className="text-muted">({o.user_email})</span>
                  </div>
                  <span className="text-muted">{new Date(o.created_at).toLocaleString("pt-BR")}</span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  {items.map((i) => (
                    <li key={i.id}>
                      {i.quantity}x {i.product_name}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 border-t border-border pt-2 text-right text-sm font-semibold text-gold-strong">
                  {formatBRL(o.total_cents)}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
