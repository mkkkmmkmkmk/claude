import { getAllSubscriptions } from "@/lib/queries";

export const metadata = { title: "Assinantes — Admin Pedro Barber" };

export default function AdminAssinantesPage() {
  const subscriptions = getAllSubscriptions();

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-lg font-semibold">Assinantes ({subscriptions.length})</h2>
      {subscriptions.length === 0 ? (
        <div className="card p-6 text-sm text-muted">Nenhum assinante ainda.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-2/60 text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Início</th>
                <th className="px-4 py-3">Brinde</th>
                <th className="px-4 py-3">Código</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    {s.user_name}
                    <span className="block text-xs text-muted">{s.user_email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`pill px-3 py-1 text-xs ${
                        s.status === "active" ? "text-gold-strong" : "text-muted"
                      }`}
                    >
                      {s.status === "active" ? "Ativa" : "Cancelada"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{new Date(s.started_at).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3 text-muted">{s.gift_redeemed ? "Resgatado" : "Pendente"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gold-strong">{s.gift_code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
