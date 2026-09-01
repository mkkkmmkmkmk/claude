import { getAllCourses } from "@/lib/queries";
import CourseCard from "@/components/CourseCard";

export const metadata = { title: "Cursos — Pedro Barber" };

export default function CursosPage() {
  const courses = getAllCourses();

  return (
    <div className="container-page py-14">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-semibold">Pedro Barber Academy</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Cursos online de barbearia direto com o Pedro. Experimente as 2 primeiras aulas de
          qualquer curso gratuitamente, sem cadastro de cartão.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </div>
  );
}
