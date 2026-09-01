import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface/40">
      <div className="container-page grid gap-8 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💈</span>
            <span className="font-serif text-lg font-semibold text-gold-strong">Pedro Barber</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Produtos profissionais de barbearia e cursos online para quem quer viver da tesoura e da navalha.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Navegação</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/produtos" className="hover:text-gold-strong">Produtos</Link></li>
            <li><Link href="/cursos" className="hover:text-gold-strong">Cursos</Link></li>
            <li><Link href="/assinatura" className="hover:text-gold-strong">Assinatura</Link></li>
            <li><Link href="/login" className="hover:text-gold-strong">Entrar</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Contato</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>contato@pedrobarber.com</li>
            <li>(11) 99999-0000</li>
            <li>Seg a Sáb, 9h às 20h</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Pedro Barber. Todos os direitos reservados.
      </div>
    </footer>
  );
}
