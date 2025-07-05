import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';

export async function GET() {
  try {
    const prices = await getStripePrices();
    const products = await getStripeProducts();

    // Enlazar features dummy por nombre de producto
    const featuresByProduct: Record<string, string[]> = {
      Base: [
        'Unlimited Usage',
        'Unlimited Workspace Members',
        'Email Support',
      ],
      Plus: [
        'Everything in Base, and:',
        'Early Access to New Features',
        '24/7 Support + Slack Access',
      ],
    };

    const result = prices.map((price) => {
      const product = products.find((p) => p.id === price.productId);
      return {
        ...price,
        productName: product?.name || '',
        features: featuresByProduct[product?.name || ''] || [],
        productImage: product?.images?.[0] || null,
      };
    });

    // Log para depuración
    console.log('Stripe prices:', JSON.stringify(result, null, 2));

    return Response.json(result);
  } catch (err) {
    console.error('Error obteniendo precios de Stripe:', err);
    return new Response(JSON.stringify({ error: 'No se pudieron obtener los precios de Stripe' }), { status: 500 });
  }
}
