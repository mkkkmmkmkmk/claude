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

## Deploy no Netlify

O repositório já inclui `netlify.toml` com o plugin oficial `@netlify/plugin-nextjs`. Para publicar:

1. No painel do Netlify, "Add new site" → "Import an existing project" e conecte este repositório (ou rode `netlify deploy` pela CLI).
2. Em **Site settings → Environment variables**, adicione:
   - `AUTH_SECRET` — gere com `npx auth secret`
   - `AUTH_TRUST_HOST` = `true`
3. Deploy. O Netlify detecta o `netlify.toml` e usa `npm run build` automaticamente.

⚠️ **Importante — banco de dados**: este projeto usa SQLite em arquivo (`better-sqlite3`) gravado no disco local, o que funciona bem em um servidor tradicional (Node sempre ligado) mas **não é confiável em funções serverless do Netlify**: cada função pode rodar em uma instância efêmera e isolada, então cadastros de clientes, pedidos, produtos/cursos criados pelo admin e assinaturas **podem não persistir** entre requisições em produção. Para um deploy real no Netlify, é necessário trocar o banco por um serviço externo persistente (ex.: Netlify DB/Neon Postgres, Turso, Supabase). Posso fazer essa migração — é só pedir.

## Observações

O checkout de produtos e a cobrança da assinatura são **simulados** nesta demonstração — nenhuma integração de pagamento real está conectada. Para produção, plugue um provedor (Stripe, Mercado Pago, etc.) nos endpoints `src/app/api/pedidos/checkout` e `src/app/api/assinatura`.
