import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createOrReactivateSubscription, createOrder, cancelSubscription } from "@/lib/queries";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "É necessário entrar na conta." }, { status: 401 });
  }

  const subscription = createOrReactivateSubscription(session.user.id);

  createOrder(session.user.id, [
    {
      product_id: "subscription",
      product_name: "Assinatura Pedro Barber (mensal)",
      quantity: 1,
      price_cents: 10000,
    },
  ]);

  return NextResponse.json({ ok: true, giftCode: subscription.gift_code });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "É necessário entrar na conta." }, { status: 401 });
  }

  cancelSubscription(session.user.id);

  return NextResponse.json({ ok: true });
}
