export type Role = "ADMIN" | "CLIENTE";

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  image: string;
  category: string;
  stock: number;
  created_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  price_cents: number;
  image: string;
  level: string;
  created_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url: string;
  duration_min: number;
  order_index: number;
  is_free: number;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  source: "purchase" | "subscription";
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  status: "active" | "canceled";
  gift_code: string;
  gift_redeemed: number;
  started_at: string;
  canceled_at: string | null;
}

export interface Order {
  id: string;
  user_id: string;
  total_cents: number;
  status: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price_cents: number;
}

export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
