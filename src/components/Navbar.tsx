"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "./CartContext";

const links = [
  { href: "/produtos", label: "Produtos" },
  { href: "/cursos", label: "Cursos" },
  { href: "/assinatura", label: "Assinatura" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const { totalCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">💈</span>
          <span className="font-serif text-lg font-semibold tracking-wide text-gold-strong">
            Pedro Barber
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-foreground/80 transition hover:text-gold-strong"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/carrinho" className="relative text-sm text-foreground/80 hover:text-gold-strong">
            🛒 Carrinho
            {totalCount > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-[#1a1408]">
                {totalCount}
              </span>
            )}
          </Link>

          {status === "authenticated" ? (
            <div className="flex items-center gap-3">
              <Link
                href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
                className="rounded-full pill px-4 py-1.5 text-sm hover:border-gold hover:text-gold-strong"
              >
                Olá, {session.user.name?.split(" ")[0]}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-foreground/60 hover:text-gold-strong"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm hover:text-gold-strong">
                Entrar
              </Link>
              <Link href="/registrar" className="btn-gold rounded-full px-4 py-1.5 text-sm">
                Criar conta
              </Link>
            </div>
          )}
        </div>

        <button
          className="text-2xl md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container-page flex flex-col gap-4 py-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm">
                {l.label}
              </Link>
            ))}
            <Link href="/carrinho" onClick={() => setOpen(false)} className="text-sm">
              🛒 Carrinho ({totalCount})
            </Link>
            {status === "authenticated" ? (
              <>
                <Link
                  href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
                  onClick={() => setOpen(false)}
                  className="text-sm text-gold-strong"
                >
                  Minha área
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="text-left text-sm text-foreground/60"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="text-sm">
                  Entrar
                </Link>
                <Link href="/registrar" onClick={() => setOpen(false)} className="text-sm text-gold-strong">
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
