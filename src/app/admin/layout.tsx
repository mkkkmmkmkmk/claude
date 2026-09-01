import Link from "next/link";
import { requireAdmin } from "@/lib/authz";

const navItems = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/cursos", label: "Cursos" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/assinantes", label: "Assinantes" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <span className="pill inline-flex px-3 py-1 text-xs text-gold-strong">Painel administrativo</span>
        <h1 className="mt-3 font-serif text-2xl font-semibold">Olá, {user.name}</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <nav className="card h-fit space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-surface-2 hover:text-gold-strong"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}
