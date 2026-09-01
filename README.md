# Pedro Barber

Loja e plataforma de cursos online da barbearia Pedro Barber, feita com Next.js (App Router), TypeScript, Tailwind CSS e SQLite (better-sqlite3).

## Funcionalidades

- **Loja de produtos**: catálogo, página de produto e carrinho de compras (checkout simulado).
- **Cursos online**: catálogo de cursos com as **duas primeiras aulas gratuitas** para qualquer visitante experimentar.
- **Assinatura de R$ 100/mês**: libera acesso completo a todos os cursos e concede um **brinde exclusivo** resgatável no painel do assinante.
- **Login separado por papel**: contas `CLIENTE` acessam `/dashboard` (cursos, pedidos, assinatura); contas `ADMIN` acessam `/admin` (produtos, cursos/aulas, pedidos, assinantes).

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). O banco SQLite é criado e populado automaticamente em `data/pedrobarber.db` na primeira execução.

### Contas de demonstração

| Papel   | E-mail                 | Senha       |
| ------- | ----------------------- | ----------- |
| Admin   | admin@pedrobarber.com   | admin123    |
| Cliente | cliente@teste.com       | cliente123  |

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e gere um `AUTH_SECRET` (por exemplo com `npx auth secret`).

## Stack

- Next.js 16 (App Router, Server Components)
- NextAuth v5 (Credentials, sessão JWT)
- better-sqlite3 (persistência local, sem servidor de banco externo)
- Tailwind CSS v4

## Observações

O checkout de produtos e a cobrança da assinatura são **simulados** nesta demonstração — nenhuma integração de pagamento real está conectada. Para produção, plugue um provedor (Stripe, Mercado Pago, etc.) nos endpoints `src/app/api/pedidos/checkout` e `src/app/api/assinatura`.
