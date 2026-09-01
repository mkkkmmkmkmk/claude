import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getProductById, createOrder } from "@/lib/queries";

interface CheckoutItem {
  id: string;
  quantity: number;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "É necessário entrar na conta." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const items = (body?.items as CheckoutItem[] | undefined) ?? [];

  if (items.length === 0) {
    return NextResponse.json({ error: "Carrinho vazio." }, { status: 400 });
  }

  const orderItems = [];
  for (const item of items) {
    const product = getProductById(item.id);
    if (!product) continue;
    orderItems.push({
      product_id: product.id,
      product_name: product.name,
      quantity: item.quantity,
      price_cents: product.price_cents,
    });
  }

  if (orderItems.length === 0) {
    return NextResponse.json({ error: "Produtos inválidos." }, { status: 400 });
  }

  const order = createOrder(session.user.id, orderItems);

  return NextResponse.json({ ok: true, orderId: order.id });
}
