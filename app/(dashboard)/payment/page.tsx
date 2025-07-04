import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/drizzle';
import PaymentForm from '@/components/ui/PaymentForm';

export default async function PaymentPage() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return <p className="text-red-500">Debes iniciar sesión para acceder.</p>;
  }

  // Consulta para ver si el usuario tiene un método de pago (ejemplo con tabla `payment_methods`)
  const paymentMethod = await db
    .selectFrom('payment_methods')
    .select('id')
    .where('user_id', '=', user.id)
    .executeTakeFirst();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Método de Pago</h1>
      {paymentMethod ? (
        <p className="text-green-600">¡Ya tienes un método de pago configurado!</p>
      ) : (
        // Enviar el customerId si tienes uno guardado (o null)
        <PaymentForm customerId="tu_customer_id_aqui" />
      )}
    </div>
  );
}
