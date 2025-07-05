import { getStripeProducts } from '@/lib/payments/stripe';

export async function GET() {
  try {
    const products = await getStripeProducts();
    return Response.json(products);
  } catch (err) {
    console.error('Error obteniendo productos de Stripe:', err);
    return new Response(JSON.stringify({ error: 'No se pudieron obtener los productos de Stripe' }), { status: 500 });
  }
}