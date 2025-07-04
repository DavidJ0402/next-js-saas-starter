import { getSession } from '@/lib/auth/session';
import { db } from "@/lib/db";
import PaymentForm from "@/components/PaymentForm";

export default async function PaymentPage() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return <p className="text-red-500">Debes iniciar sesión para acceder.</p>;
  }

  // Obtener el stripe_customer_id desde la base de datos
  const profile = await db
    .selectFrom("profiles")
    .select("stripe_customer_id")
    .where("id", "=", user.id)
    .executeTakeFirst();

  const customerId = profile?.stripe_customer_id;

  if (!customerId) {
    return <p className="text-red-500">No se encontró un ID de cliente de Stripe.</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Agregar Método de Pago</h1>
      <PaymentForm customerId={customerId} />
    </div>
  );
}
