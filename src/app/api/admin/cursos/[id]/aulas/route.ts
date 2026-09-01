import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { addLesson } from "@/lib/queries";

const schema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().min(3),
  video_url: z.string().trim().min(3),
  duration_min: z.coerce.number().int().positive(),
  is_free: z.boolean().optional().default(false),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos" }, { status: 400 });
  }

  const lesson = addLesson({ course_id: id, ...parsed.data });
  return NextResponse.json({ ok: true, lesson });
}
