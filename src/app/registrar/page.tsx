import RegisterForm from "./RegisterForm";

export const metadata = { title: "Criar conta — Pedro Barber" };

export default function RegisterPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="text-3xl">💈</span>
          <h1 className="mt-3 font-serif text-2xl font-semibold text-gold-strong">Criar conta</h1>
          <p className="mt-1 text-sm text-muted">
            Cadastre-se para comprar produtos, cursos e assinar o plano Pedro Barber.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
