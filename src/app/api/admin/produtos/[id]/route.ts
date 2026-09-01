import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteProduct } from "@/lib/queries";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const { id } = await params;
  deleteProduct(id);
  return NextResponse.json({ ok: true });
}
