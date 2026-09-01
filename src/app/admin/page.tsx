import {
  getAllProducts,
  getAllCourses,
  getAllOrders,
  getAllUsers,
  getAllSubscriptions,
} from "@/lib/queries";
import { formatBRL } from "@/lib/types";

export const metadata = { title: "Admin — Pedro Barber" };

export default function AdminHome() {
  const products = getAllProducts();
  const courses = getAllCourses();
  const orders = getAllOrders();
  const users = getAllUsers();
  const subscriptions = getAllSubscriptions();

  const activeSubscribers = subscriptions.filter((s) => s.status === "active").length;
  const revenue = orders.reduce((sum, o) => sum + o.total_cents, 0);
  const clientCount = users.filter((u) => u.role === "CLIENTE").length;

  const stats = [
    { label: "Faturamento total", value: formatBRL(revenue) },
    { label: "Pedidos", value: orders.length },
    { label: "Clientes cadastrados", value: clientCount },
    { label: "Assinantes ativos", value: activeSubscribers },
    { label: "Produtos", value: products.length },
    { label: "Cursos", value: courses.length },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="card p-5">
          <p className="text-sm text-muted">{s.label}</p>
          <p className="mt-2 font-serif text-2xl font-semibold text-gold-strong">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
