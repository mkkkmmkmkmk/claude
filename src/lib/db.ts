import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "pedrobarber.db");

declare global {
  var __pedroBarberDb: Database.Database | undefined;
}

const db = global.__pedroBarberDb ?? new Database(dbPath);
if (process.env.NODE_ENV !== "production") global.__pedroBarberDb = db;

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('ADMIN','CLIENTE')) DEFAULT 'CLIENTE',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  image TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Iniciante',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT NOT NULL,
  duration_min INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  is_free INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS enrollments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK(source IN ('purchase','subscription')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'mensal_100',
  status TEXT NOT NULL CHECK(status IN ('active','canceled')) DEFAULT 'active',
  gift_code TEXT NOT NULL,
  gift_redeemed INTEGER NOT NULL DEFAULT 0,
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  canceled_at TEXT
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pago',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price_cents INTEGER NOT NULL
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS seed_meta (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  seeded_at TEXT NOT NULL
);
`);

function seed() {
  // Atomic claim: only the first process/worker to insert this marker row runs the
  // seed logic below, avoiding UNIQUE constraint races when multiple Next.js build
  // workers import this module concurrently against the same SQLite file.
  const claimed = db
    .prepare("INSERT OR IGNORE INTO seed_meta (id, seeded_at) VALUES (1, datetime('now'))")
    .run();
  if (claimed.changes === 0) return;

  const insertUser = db.prepare(
    `INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)`
  );
  const adminId = randomUUID();
  const clienteId = randomUUID();
  insertUser.run(adminId, "Pedro Barber", "admin@pedrobarber.com", bcrypt.hashSync("admin123", 10), "ADMIN");
  insertUser.run(clienteId, "Cliente Teste", "cliente@teste.com", bcrypt.hashSync("cliente123", 10), "CLIENTE");

  const insertProduct = db.prepare(
    `INSERT INTO products (id, slug, name, description, price_cents, image, category, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const products = [
    {
      slug: "pomada-modeladora-matte",
      name: "Pomada Modeladora Matte",
      description:
        "Fixação forte com efeito matte, sem brilho. Ideal para cortes modernos e texturizados. 120g.",
      price: 4990,
      image: "🧴",
      category: "Pomadas",
      stock: 50,
    },
    {
      slug: "oleo-para-barba-premium",
      name: "Óleo para Barba Premium",
      description:
        "Hidrata, amacia e dá brilho saudável à barba. Fragrância amadeirada exclusiva Pedro Barber. 30ml.",
      price: 5990,
      image: "🛢️",
      category: "Barba",
      stock: 40,
    },
    {
      slug: "kit-navalha-profissional",
      name: "Kit Navalha Profissional",
      description:
        "Navalha em aço inoxidável com cabo emborrachado antiderrapante + 10 lâminas de reposição.",
      price: 12990,
      image: "🪒",
      category: "Ferramentas",
      stock: 25,
    },
    {
      slug: "shampoo-antiqueda-carvao",
      name: "Shampoo Anti-Queda com Carvão Ativado",
      description:
        "Limpeza profunda, fortalece os fios e reduz a queda. Livre de sulfatos. 250ml.",
      price: 3990,
      image: "🧴",
      category: "Cabelo",
      stock: 60,
    },
    {
      slug: "maquina-de-corte-pro-x",
      name: "Máquina de Corte Pro X",
      description:
        "Motor de alta rotação, lâminas de titânio autoafiáveis e bateria com 4h de autonomia.",
      price: 34990,
      image: "🔌",
      category: "Ferramentas",
      stock: 15,
    },
    {
      slug: "balm-pos-barba",
      name: "Balm Pós-Barba Calmante",
      description:
        "Alivia irritações, fecha os poros e refresca a pele após o corte. Com aloe vera. 100ml.",
      price: 4490,
      image: "🧴",
      category: "Barba",
      stock: 35,
    },
  ];
  for (const p of products) {
    insertProduct.run(randomUUID(), p.slug, p.name, p.description, p.price, p.image, p.category, p.stock);
  }

  const insertCourse = db.prepare(
    `INSERT INTO courses (id, slug, title, description, price_cents, image, level) VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  const insertLesson = db.prepare(
    `INSERT INTO lessons (id, course_id, title, description, video_url, duration_min, order_index, is_free) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const courses = [
    {
      slug: "fundamentos-do-corte-masculino",
      title: "Fundamentos do Corte Masculino",
      description:
        "Aprenda as técnicas essenciais de corte masculino, do zero à execução de cortes clássicos e modernos com segurança e precisão.",
      price: 19900,
      image: "✂️",
      level: "Iniciante",
      lessons: [
        ["Boas-vindas e ferramentas essenciais", "Conheça os equipamentos que todo barbeiro profissional precisa ter.", 8],
        ["Anatomia da cabeça e leitura do formato de rosto", "Como identificar o formato ideal de corte para cada cliente.", 14],
        ["Técnica de máquina zero a três", "Passo a passo da execução de degradê com máquina.", 22],
        ["Acabamento com navalha", "Como finalizar o corte com contornos precisos na navalha.", 18],
        ["Cortes clássicos: social e undercut", "Execução completa de dois cortes muito pedidos em barbearia.", 25],
      ],
    },
    {
      slug: "barboterapia-e-design-de-barba",
      title: "Barboterapia e Design de Barba",
      description:
        "Domine a arte de modelar, alinhar e cuidar da barba, incluindo o ritual completo de barboterapia que fideliza clientes.",
      price: 17900,
      image: "🧔",
      level: "Intermediário",
      lessons: [
        ["Introdução à barboterapia", "O que é, benefícios e como oferecer esse serviço na barbearia.", 10],
        ["Formatos de barba por tipo de rosto", "Como escolher o design ideal para cada cliente.", 16],
        ["Alinhamento e simetria com navalha", "Técnica profissional de alinhamento de contornos.", 20],
        ["Ritual completo de barboterapia", "Toalha quente, esfoliação, óleo e massagem: o passo a passo.", 28],
        ["Precificação e fidelização de clientes", "Como cobrar corretamente e transformar o serviço em recorrência.", 15],
      ],
    },
  ];

  for (const c of courses) {
    const courseId = randomUUID();
    insertCourse.run(courseId, c.slug, c.title, c.description, c.price, c.image, c.level);
    c.lessons.forEach((l, idx) => {
      insertLesson.run(
        randomUUID(),
        courseId,
        l[0] as string,
        l[1] as string,
        "https://example.com/video-placeholder",
        l[2] as number,
        idx + 1,
        idx < 2 ? 1 : 0
      );
    });
  }
}

seed();

export default db;
