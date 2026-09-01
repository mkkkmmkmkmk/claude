import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCourseById, enrollUser, createOrder, getEnrollment } from "@/lib/queries";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "É necessário entrar na conta." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const courseId = body?.courseId as string | undefined;
  if (!courseId) return NextResponse.json({ error: "Curso inválido." }, { status: 400 });

  const course = getCourseById(courseId);
  if (!course) return NextResponse.json({ error: "Curso não encontrado." }, { status: 404 });

  if (getEnrollment(session.user.id, course.id)) {
    return NextResponse.json({ ok: true, alreadyEnrolled: true });
  }

  createOrder(session.user.id, [
    {
      product_id: course.id,
      product_name: `Curso: ${course.title}`,
      quantity: 1,
      price_cents: course.price_cents,
    },
  ]);
  enrollUser(session.user.id, course.id, "purchase");

  return NextResponse.json({ ok: true });
}
