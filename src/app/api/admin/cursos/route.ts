import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { createCourse } from "@/lib/queries";

const schema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().min(5),
  price_cents: z.coerce.number().int().positive(),
  image: z.string().trim().min(1),
  level: z.string().trim().min(2),
});

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos" }, { status: 400 });
  }

  const course = createCourse(parsed.data);
  return NextResponse.json({ ok: true, course });
}
