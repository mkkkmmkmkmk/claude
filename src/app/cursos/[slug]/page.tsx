import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import {
  getCourseBySlug,
  getAllCourses,
  getLessonsByCourseId,
  getEnrollment,
} from "@/lib/queries";
import { formatBRL } from "@/lib/types";
import BuyCourseButton from "./BuyCourseButton";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getAllCourses().map((c) => ({ slug: c.slug }));
}

export default async function CursoPage({ params }: PageProps<"/cursos/[slug]">) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const session = await auth();
  const lessons = getLessonsByCourseId(course.id);

  let hasFullAccess = false;
  if (session?.user) {
    if (session.user.role === "ADMIN") hasFullAccess = true;
    else if (getEnrollment(session.user.id, course.id)) hasFullAccess = true;
  }

  return (
    <div className="container-page py-14">
      <Link href="/cursos" className="text-sm text-muted hover:text-gold-strong">
        ← Voltar aos cursos
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-[1fr_320px]">
        <div>
          <span className="text-xs uppercase tracking-wide text-gold-strong">{course.level}</span>
          <h1 className="mt-2 font-serif text-3xl font-semibold">{course.title}</h1>
          <p className="mt-4 text-muted">{course.description}</p>

          <h2 className="mt-10 mb-4 font-serif text-xl font-semibold">Conteúdo do curso</h2>
          <ul className="space-y-3">
            {lessons.map((lesson, idx) => {
              const unlocked = hasFullAccess || lesson.is_free === 1;
              return (
                <li
                  key={lesson.id}
                  className={`card flex items-center justify-between gap-4 p-4 ${
                    unlocked ? "" : "opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm text-gold-strong">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-medium">{lesson.title}</p>
                      <p className="text-sm text-muted">{lesson.description}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 text-sm">
                    <span className="text-muted">{lesson.duration_min} min</span>
                    {unlocked ? (
                      lesson.is_free === 1 && !hasFullAccess ? (
                        <span className="pill px-3 py-1 text-xs text-gold-strong">Grátis</span>
                      ) : (
                        <span className="text-gold-strong">▶</span>
                      )
                    ) : (
                      <span title="Disponível após compra ou assinatura">🔒</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="card sticky top-24 h-fit p-6">
          <div className="flex h-24 items-center justify-center rounded-lg bg-surface-2 text-5xl">
            {course.image}
          </div>
          <p className="mt-4 text-3xl font-semibold text-gold-strong">{formatBRL(course.price_cents)}</p>
          <p className="text-sm text-muted">ou incluso na assinatura de R$ 100/mês</p>

          {hasFullAccess ? (
            <div className="mt-6 rounded-lg border border-gold/50 bg-surface-2 px-4 py-3 text-sm text-gold-strong">
              ✔ Você já tem acesso a este curso.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              <BuyCourseButton course={course} />
              <Link
                href="/assinatura"
                className="btn-outline block rounded-full py-2.5 text-center text-sm"
              >
                Assinar e liberar todos os cursos
              </Link>
            </div>
          )}

          <p className="mt-4 text-xs text-muted">
            As duas primeiras aulas são gratuitas para qualquer visitante experimentar o conteúdo.
          </p>
        </aside>
      </div>
    </div>
  );
}
