import Link from "next/link";
import type { Course } from "@/lib/types";
import { formatBRL } from "@/lib/types";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/cursos/${course.slug}`} className="card group flex flex-col overflow-hidden p-5 transition hover:border-gold">
      <div className="flex h-32 items-center justify-center rounded-lg bg-surface-2 text-6xl">
        {course.image}
      </div>
      <span className="mt-4 text-xs uppercase tracking-wide text-gold-strong">{course.level}</span>
      <h3 className="mt-1 font-serif text-lg font-semibold text-foreground group-hover:text-gold-strong">
        {course.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{course.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-semibold text-gold-strong">{formatBRL(course.price_cents)}</span>
        <span className="text-xs text-muted">2 aulas grátis →</span>
      </div>
    </Link>
  );
}
