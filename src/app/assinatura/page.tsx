import { auth } from "@/auth";
import { getSubscriptionByUser } from "@/lib/queries";
import SubscribeButton from "./SubscribeButton";

export const metadata = { title: "Assinatura — Pedro Barber" };

const beneficios = [
  "Acesso ilimitado a todos os cursos da Pedro Barber Academy",
  "Brinde exclusivo Pedro Barber na sua primeira assinatura",
  "Novas aulas e cursos liberados todo mês",
  "Certificado digital de conclusão em cada curso",
  "Suporte prioritário com a equipe Pedro Barber",
  "Cancele quando quiser, sem fidelidade ou multa",
];

export default async function AssinaturaPage() {
  const session = await auth();
  const subscription = session?.user ? getSubscriptionByUser(session.user.id) : undefined;
  const isActive = subscription?.status === "active";

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="pill inline-flex w-fit items-center gap-2 px-3 py-1 text-xs text-gold-strong">
          🎁 Plano Pedro Barber
        </span>
        <h1 className="mt-4 font-serif text-3xl font-semibold md:text-4xl">
          Assine por <span className="text-gold-strong">R$ 100/mês</span> e ganhe um brinde
        </h1>
        <p className="mt-4 text-muted">
          Tenha acesso completo à Pedro Barber Academy e receba um kit de produtos de brinde
          assim que sua assinatura for confirmada.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-lg">
        <div className="card overflow-hidden">
          <div className="border-b border-border bg-surface-2/60 p-6 text-center">
            <p className="text-sm text-muted">Plano mensal</p>
            <p className="mt-1 font-serif text-4xl font-bold text-gold-strong">
              R$ 100<span className="text-base font-normal text-muted">/mês</span>
            </p>
          </div>

          <div className="p-6">
            <ul className="space-y-3 text-sm">
              {beneficios.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-gold-strong">✔</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-lg border border-gold/40 bg-surface-2 p-4 text-sm">
              <p className="font-semibold text-gold-strong">🎁 Seu brinde</p>
              <p className="mt-1 text-muted">
                Kit de boas-vindas Pedro Barber (pomada modeladora + óleo para barba) para quem
                assinar o plano de R$ 100.
              </p>
            </div>

            <div className="mt-6">
              {isActive ? (
                <div className="rounded-lg border border-gold/50 bg-surface-2 px-4 py-3 text-center text-sm text-gold-strong">
                  ✔ Sua assinatura está ativa. Acesse{" "}
                  <a href="/dashboard" className="underline">
                    seu painel
                  </a>{" "}
                  para resgatar o brinde.
                </div>
              ) : (
                <SubscribeButton loggedIn={!!session?.user} />
              )}
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          Pagamento simulado nesta demonstração — nenhuma cobrança real é feita.
        </p>
      </div>
    </div>
  );
}
