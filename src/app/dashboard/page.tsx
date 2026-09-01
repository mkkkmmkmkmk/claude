import Link from "next/link";
import { requireUser } from "@/lib/authz";
import {
  getSubscriptionByUser,
  getEnrollmentsByUser,
  getCourseById,
  getOrdersByUser,
  getOrderItems,
} from "@/lib/queries";
import { formatBRL } from "@/lib/types";
import GiftClaim from "./GiftClaim";
import SubscriptionActions from "./SubscriptionActions";

export const metadata = { title: "Minha área — Pedro Barber" };

export default async function DashboardPage() {
  const user = await requireUser();

  const subscription = getSubscriptionByUser(user.id);
  const enrollments = getEnrollmentsByUser(user.id);
  const courses = enrollments
    .map((e) => getCourseById(e.course_id))
    .filter((c): c is NonNullable<typeof c> => !!c);
  const orders = getOrdersByUser(user.id);

  return (
    <div className="container-page py-14">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-semibold">Olá, {user.name?.split(" ")[0]} 👋</h1>
        <p className="mt-1 text-sm text-muted">Bem-vindo à sua área de cliente Pedro Barber.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="mb-4 font-serif text-xl font-semibold">Meus cursos</h2>
            {courses.length === 0 ? (
              <div className="card p-6 text-sm text-muted">
                Você ainda não tem cursos.{" "}
                <Link href="/cursos" className="text-gold-strong hover:underline">
                  Explore a Pedro Barber Academy
                </Link>
                .
              </div>
            ) : (
              <ul className="space-y-3">
                {courses.map((c) => (
                  <li key={c.id} className="card flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-2 text-2xl">
                        {c.image}
                      </span>
                      <div>
                        <p className="font-medium">{c.title}</p>
                        <p className="text-sm text-muted">{c.level}</p>
                      </div>
                    </div>
                    <Link href={`/cursos/${c.slug}`} className="btn-outline rounded-full px-4 py-2 text-sm">
                      Assistir
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="mb-4 font-serif text-xl font-semibold">Meus pedidos</h2>
            {orders.length === 0 ? (
              <div className="card p-6 text-sm text-muted">Nenhum pedido realizado ainda.</div>
            ) : (
              <ul className="space-y-3">
                {orders.map((o) => {
                  const orderItems = getOrderItems(o.id);
                  return (
                    <li key={o.id} className="card p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted">
                          Pedido de {new Date(o.created_at).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="pill px-3 py-1 text-xs capitalize text-gold-strong">
                          {o.status}
                        </span>
                      </div>
                      <ul className="mt-3 space-y-1 text-sm">
                        {orderItems.map((i) => (
                          <li key={i.id} className="flex justify-between">
                            <span>
                              {i.quantity}x {i.product_name}
                            </span>
                            <span className="text-muted">{formatBRL(i.price_cents * i.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 flex justify-between border-t border-border pt-2 text-sm font-semibold">
                        <span>Total</span>
                        <span className="text-gold-strong">{formatBRL(o.total_cents)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <div className="card p-6">
            <h3 className="font-serif text-lg font-semibold">Assinatura</h3>
            {subscription?.status === "active" ? (
              <>
                <p className="mt-2 text-sm text-muted">
                  Plano mensal <strong className="text-foreground">R$ 100/mês</strong> — ativo desde{" "}
                  {new Date(subscription.started_at).toLocaleDateString("pt-BR")}.
                </p>
                <GiftClaim redeemed={subscription.gift_redeemed === 1} giftCode={subscription.gift_code} />
                <SubscriptionActions active />
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-muted">
                  {subscription?.status === "canceled"
                    ? "Sua assinatura foi cancelada."
                    : "Você ainda não tem uma assinatura ativa."}
                </p>
                <Link href="/assinatura" className="btn-gold mt-4 block rounded-full py-2.5 text-center text-sm">
                  Assinar por R$ 100/mês
                </Link>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
