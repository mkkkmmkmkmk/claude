import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = { title: "Entrar — Pedro Barber" };

export default function LoginPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="text-3xl">💈</span>
          <h1 className="mt-3 font-serif text-2xl font-semibold text-gold-strong">
            Entrar na sua conta
          </h1>
          <p className="mt-1 text-sm text-muted">Acesse seus cursos, pedidos e assinatura.</p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
