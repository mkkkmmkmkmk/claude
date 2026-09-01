import Link from "next/link";
import { getAllProducts, getAllCourses } from "@/lib/queries";
import ProductCard from "@/components/ProductCard";
import CourseCard from "@/components/CourseCard";

export default function Home() {
  const products = getAllProducts().slice(0, 3);
  const courses = getAllCourses();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="container-page grid gap-10 py-20 md:grid-cols-2 md:py-28">
          <div className="flex flex-col justify-center">
            <span className="pill inline-flex w-fit items-center gap-2 px-3 py-1 text-xs text-gold-strong">
              ✂️ Loja oficial Pedro Barber
            </span>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-tight md:text-5xl">
              Produtos de barbearia e cursos para quem vive da{" "}
              <span className="text-gold-strong">navalha</span>.
            </h1>
            <p className="mt-5 max-w-md text-muted">
              Pomadas, óleos e ferramentas profissionais + cursos online direto com o Pedro Barber.
              Assine por <strong className="text-foreground">R$ 100/mês</strong> e ganhe acesso a
              todos os cursos e um brinde exclusivo.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/produtos" className="btn-gold rounded-full px-6 py-3 text-sm">
                Comprar produtos
              </Link>
              <Link href="/assinatura" className="btn-outline rounded-full px-6 py-3 text-sm">
                Conhecer assinatura
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="card flex h-72 w-72 items-center justify-center rounded-full text-[8rem] md:h-96 md:w-96">
              💈
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="container-page py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold md:text-3xl">Produtos em destaque</h2>
            <p className="mt-1 text-sm text-muted">Cuidado profissional para cabelo e barba.</p>
          </div>
          <Link href="/produtos" className="text-sm text-gold-strong hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Subscription banner */}
      <section className="border-y border-border bg-surface/60">
        <div className="container-page grid items-center gap-10 py-16 md:grid-cols-2">
          <div>
            <span className="pill inline-flex w-fit items-center gap-2 px-3 py-1 text-xs text-gold-strong">
              🎁 Oferta de assinatura
            </span>
            <h2 className="mt-4 font-serif text-3xl font-semibold">
              Assine por <span className="text-gold-strong">R$ 100/mês</span> e ganhe um brinde
            </h2>
            <p className="mt-3 max-w-md text-muted">
              Acesso ilimitado a todos os cursos da Pedro Barber Academy + um kit de produtos de
              brinde na sua primeira assinatura. Cancele quando quiser.
            </p>
            <Link href="/assinatura" className="btn-gold mt-6 inline-block rounded-full px-6 py-3 text-sm">
              Quero assinar
            </Link>
          </div>
          <ul className="card space-y-3 p-6 text-sm">
            <li className="flex gap-2"><span className="text-gold-strong">✔</span> Acesso a todos os cursos, presentes e futuros</li>
            <li className="flex gap-2"><span className="text-gold-strong">✔</span> Brinde exclusivo na primeira mensalidade</li>
            <li className="flex gap-2"><span className="text-gold-strong">✔</span> Certificado de conclusão por curso</li>
            <li className="flex gap-2"><span className="text-gold-strong">✔</span> Novas aulas todo mês</li>
            <li className="flex gap-2"><span className="text-gold-strong">✔</span> Cancele quando quiser, sem fidelidade</li>
          </ul>
        </div>
      </section>

      {/* Courses */}
      <section className="container-page py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold md:text-3xl">Cursos Pedro Barber Academy</h2>
            <p className="mt-1 text-sm text-muted">Experimente as 2 primeiras aulas de cada curso, grátis.</p>
          </div>
          <Link href="/cursos" className="text-sm text-gold-strong hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
