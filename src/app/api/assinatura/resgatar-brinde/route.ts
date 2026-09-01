import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSubscriptionByUser, redeemGift } from "@/lib/queries";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "É necessário entrar na conta." }, { status: 401 });
  }

  const subscription = getSubscriptionByUser(session.user.id);
  if (!subscription || subscription.status !== "active") {
    return NextResponse.json({ error: "Assinatura ativa não encontrada." }, { status: 400 });
  }

  redeemGift(session.user.id);

  return NextResponse.json({ ok: true });
}
