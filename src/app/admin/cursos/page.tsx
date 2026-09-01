import { getAllCourses, getLessonsByCourseId } from "@/lib/queries";
import { formatBRL } from "@/lib/types";
import NewCourseForm from "./NewCourseForm";
import CourseLessonsPanel from "./CourseLessonsPanel";

export const metadata = { title: "Cursos — Admin Pedro Barber" };

export default function AdminCursosPage() {
  const courses = getAllCourses();

  return (
    <div className="space-y-8">
      <NewCourseForm />

      <div className="space-y-6">
        {courses.map((course) => {
          const lessons = getLessonsByCourseId(course.id);
          return (
            <div key={course.id} className="card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wide text-gold-strong">{course.level}</span>
                  <h3 className="font-serif text-lg font-semibold">
                    {course.image} {course.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{course.description}</p>
                  <p className="mt-1 text-sm text-gold-strong">{formatBRL(course.price_cents)}</p>
                </div>
              </div>

              <CourseLessonsPanel courseId={course.id} lessons={lessons} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
