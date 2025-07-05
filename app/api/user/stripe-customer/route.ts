
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { getSession } from '@/lib/auth/session';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function POST() {
  const session = await getSession();
  const sessionUser = session?.user;
  if (!sessionUser) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), { status: 401 });
  }

  // Consulta el usuario
  const [user] = await db.select().from(users).where(eq(users.id, sessionUser.id)).limit(1);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), { status: 404 });
  }

  // Si ya tiene stripeCustomerId, devolverlo
  if (user.stripeCustomerId) {
    return new Response(JSON.stringify({ stripeCustomerId: user.stripeCustomerId }), { status: 200 });
  }

  // Crear cliente en Stripe
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name || undefined,
    metadata: { userId: user.id.toString() },
  });

  // Guardar el stripeCustomerId en la base de datos
  await db.update(users).set({ stripeCustomerId: customer.id }).where(eq(users.id, user.id));

  return new Response(JSON.stringify({ stripeCustomerId: customer.id }), { status: 200 });
}
