import CartView from "./CartView";

export const metadata = { title: "Carrinho — Pedro Barber" };

export default function CarrinhoPage() {
  return (
    <div className="container-page py-14">
      <h1 className="font-serif text-3xl font-semibold">Seu carrinho</h1>
      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}
