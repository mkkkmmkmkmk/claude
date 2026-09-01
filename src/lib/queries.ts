import { randomUUID } from "crypto";
import db from "./db";
import type {
  User,
  Product,
  Course,
  Lesson,
  Enrollment,
  Subscription,
  Order,
  OrderItem,
} from "./types";

// --- Users ---
export function getUserByEmail(email: string): User | undefined {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as User | undefined;
}

export function getUserById(id: string): User | undefined {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined;
}

export function createUser(name: string, email: string, passwordHash: string): User {
  const id = randomUUID();
  db.prepare(
    "INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, 'CLIENTE')"
  ).run(id, name, email, passwordHash);
  return getUserById(id)!;
}

// --- Products ---
export function getAllProducts(): Product[] {
  return db.prepare("SELECT * FROM products ORDER BY created_at DESC").all() as Product[];
}

export function getProductBySlug(slug: string): Product | undefined {
  return db.prepare("SELECT * FROM products WHERE slug = ?").get(slug) as Product | undefined;
}

export function getProductById(id: string): Product | undefined {
  return db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Product | undefined;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function createProduct(input: {
  name: string;
  description: string;
  price_cents: number;
  image: string;
  category: string;
  stock: number;
}): Product {
  const id = randomUUID();
  let slug = slugify(input.name);
  if (getProductBySlug(slug)) slug = `${slug}-${id.slice(0, 6)}`;
  db.prepare(
    `INSERT INTO products (id, slug, name, description, price_cents, image, category, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, slug, input.name, input.description, input.price_cents, input.image, input.category, input.stock);
  return getProductById(id)!;
}

export function deleteProduct(id: string) {
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
}

// --- Courses ---
export function getAllCourses(): Course[] {
  return db.prepare("SELECT * FROM courses ORDER BY created_at DESC").all() as Course[];
}

export function getCourseBySlug(slug: string): Course | undefined {
  return db.prepare("SELECT * FROM courses WHERE slug = ?").get(slug) as Course | undefined;
}

export function getCourseById(id: string): Course | undefined {
  return db.prepare("SELECT * FROM courses WHERE id = ?").get(id) as Course | undefined;
}

export function createCourse(input: {
  title: string;
  description: string;
  price_cents: number;
  image: string;
  level: string;
}): Course {
  const id = randomUUID();
  let slug = slugify(input.title);
  if (getCourseBySlug(slug)) slug = `${slug}-${id.slice(0, 6)}`;
  db.prepare(
    `INSERT INTO courses (id, slug, title, description, price_cents, image, level) VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, slug, input.title, input.description, input.price_cents, input.image, input.level);
  return getCourseById(id)!;
}

export function deleteCourse(id: string) {
  db.prepare("DELETE FROM courses WHERE id = ?").run(id);
}

export function addLesson(input: {
  course_id: string;
  title: string;
  description: string;
  video_url: string;
  duration_min: number;
  is_free: boolean;
}): Lesson {
  const id = randomUUID();
  const maxOrder = db
    .prepare("SELECT COALESCE(MAX(order_index), 0) as m FROM lessons WHERE course_id = ?")
    .get(input.course_id) as { m: number };
  db.prepare(
    `INSERT INTO lessons (id, course_id, title, description, video_url, duration_min, order_index, is_free) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.course_id,
    input.title,
    input.description,
    input.video_url,
    input.duration_min,
    maxOrder.m + 1,
    input.is_free ? 1 : 0
  );
  return db.prepare("SELECT * FROM lessons WHERE id = ?").get(id) as Lesson;
}

export function deleteLesson(id: string) {
  db.prepare("DELETE FROM lessons WHERE id = ?").run(id);
}

export function getLessonsByCourseId(courseId: string): Lesson[] {
  return db
    .prepare("SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index ASC")
    .all(courseId) as Lesson[];
}

// --- Enrollments ---
export function getEnrollment(userId: string, courseId: string): Enrollment | undefined {
  return db
    .prepare("SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?")
    .get(userId, courseId) as Enrollment | undefined;
}

export function getEnrollmentsByUser(userId: string): Enrollment[] {
  return db.prepare("SELECT * FROM enrollments WHERE user_id = ?").all(userId) as Enrollment[];
}

export function enrollUser(userId: string, courseId: string, source: "purchase" | "subscription") {
  const existing = getEnrollment(userId, courseId);
  if (existing) return existing;
  const id = randomUUID();
  db.prepare(
    "INSERT INTO enrollments (id, user_id, course_id, source) VALUES (?, ?, ?, ?)"
  ).run(id, userId, courseId, source);
  return getEnrollment(userId, courseId);
}

export function enrollUserInAllCourses(userId: string, source: "purchase" | "subscription") {
  const courses = getAllCourses();
  for (const c of courses) enrollUser(userId, c.id, source);
}

// --- Subscriptions ---
export function getSubscriptionByUser(userId: string): Subscription | undefined {
  return db
    .prepare("SELECT * FROM subscriptions WHERE user_id = ?")
    .get(userId) as Subscription | undefined;
}

function generateGiftCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "PB-";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function createOrReactivateSubscription(userId: string): Subscription {
  const existing = getSubscriptionByUser(userId);
  if (existing) {
    db.prepare(
      "UPDATE subscriptions SET status = 'active', started_at = datetime('now'), canceled_at = NULL WHERE user_id = ?"
    ).run(userId);
  } else {
    const id = randomUUID();
    db.prepare(
      "INSERT INTO subscriptions (id, user_id, plan, status, gift_code) VALUES (?, ?, 'mensal_100', 'active', ?)"
    ).run(id, userId, generateGiftCode());
  }
  enrollUserInAllCourses(userId, "subscription");
  return getSubscriptionByUser(userId)!;
}

export function cancelSubscription(userId: string) {
  db.prepare(
    "UPDATE subscriptions SET status = 'canceled', canceled_at = datetime('now') WHERE user_id = ?"
  ).run(userId);
}

export function redeemGift(userId: string) {
  db.prepare("UPDATE subscriptions SET gift_redeemed = 1 WHERE user_id = ?").run(userId);
}

// --- Orders ---
export function createOrder(
  userId: string,
  items: { product_id: string; product_name: string; quantity: number; price_cents: number }[]
): Order {
  const orderId = randomUUID();
  const total = items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);
  const insertOrder = db.prepare(
    "INSERT INTO orders (id, user_id, total_cents, status) VALUES (?, ?, ?, 'pago')"
  );
  const insertItem = db.prepare(
    "INSERT INTO order_items (id, order_id, product_id, product_name, quantity, price_cents) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const tx = db.transaction(() => {
    insertOrder.run(orderId, userId, total);
    for (const item of items) {
      insertItem.run(randomUUID(), orderId, item.product_id, item.product_name, item.quantity, item.price_cents);
    }
  });
  tx();
  return db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId) as Order;
}

export function getOrdersByUser(userId: string): Order[] {
  return db
    .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as Order[];
}

export function getAllOrders(): (Order & { user_name: string; user_email: string })[] {
  return db
    .prepare(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`
    )
    .all() as (Order & { user_name: string; user_email: string })[];
}

export function getOrderItems(orderId: string): OrderItem[] {
  return db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(orderId) as OrderItem[];
}

// --- Admin stats ---
export function getAllUsers(): User[] {
  return db.prepare("SELECT * FROM users ORDER BY created_at DESC").all() as User[];
}

export function getAllSubscriptions(): (Subscription & { user_name: string; user_email: string })[] {
  return db
    .prepare(
      `SELECT s.*, u.name as user_name, u.email as user_email
       FROM subscriptions s JOIN users u ON u.id = s.user_id
       ORDER BY s.started_at DESC`
    )
    .all() as (Subscription & { user_name: string; user_email: string })[];
}
