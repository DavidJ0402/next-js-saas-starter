import { checkoutAction } from '@/lib/payments/actions';
import { Check } from 'lucide-react';
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import PaymentForm from '@/components/ui/PaymentForm';
import { useState } from 'react';

// Prices are fresh for one hour max
export const revalidate = 3600;


import React from 'react';

export default async function Page() {
  const [prices, products]: [any[], any[]] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  return <PricingPlans prices={prices} products={products} />;
}

function PricingPlans({ prices, products }: { prices: any[]; products: any[] }) {
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<any | null>(null);
  const [step, setStep] = useState<'select' | 'payment' | 'summary' | 'success'>('select');

  const basePlan = products.find((product: any) => product.name === 'Base');
  const plusPlan = products.find((product: any) => product.name === 'Plus');
  const basePrice = prices.find((price: any) => price.productId === basePlan?.id);
  const plusPrice = prices.find((price: any) => price.productId === plusPlan?.id);

  const handleSelect = (plan: any, price: any) => {
    setSelectedPlan({ ...plan, ...price });
    setStep('payment');
  };

  const handlePaymentSuccess = (info: any) => {
    setPaymentInfo(info);
    setStep('summary');
  };

  const handleConfirm = () => {
    setStep('success');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {step === 'select' && (
        <div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto">
          <PricingCard
            name={basePlan?.name || 'Base'}
            price={basePrice?.unitAmount || 800}
            interval={basePrice?.interval || 'month'}
            trialDays={basePrice?.trialPeriodDays || 7}
            features={['Unlimited Usage','Unlimited Workspace Members','Email Support']}
            priceId={basePrice?.id}
            onSelect={() => handleSelect(basePlan, basePrice)}
          />
          <PricingCard
            name={plusPlan?.name || 'Plus'}
            price={plusPrice?.unitAmount || 1200}
            interval={plusPrice?.interval || 'month'}
            trialDays={plusPrice?.trialPeriodDays || 7}
            features={['Everything in Base, and:','Early Access to New Features','24/7 Support + Slack Access']}
            priceId={plusPrice?.id}
            onSelect={() => handleSelect(plusPlan, plusPrice)}
          />
        </div>
      )}
      {step === 'payment' && selectedPlan && (
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Ingresa los datos de tu tarjeta</h2>
          <PaymentForm customerId={null} onSuccess={handlePaymentSuccess} />
        </div>
      )}
      {step === 'summary' && selectedPlan && paymentInfo && (
        <div className="max-w-md mx-auto bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold mb-4">Resumen de compra</h2>
          <table className="w-full mb-4 text-sm">
            <tbody>
              <tr>
                <td className="font-medium">Producto:</td>
                <td>{selectedPlan.name}</td>
              </tr>
              <tr>
                <td className="font-medium">Precio:</td>
                <td>${selectedPlan.unitAmount / 100} {selectedPlan.currency?.toUpperCase()}</td>
              </tr>
              <tr>
                <td className="font-medium">Tarjeta:</td>
                <td>**** **** **** {paymentInfo.last4}</td>
              </tr>
            </tbody>
          </table>
          <button className="w-full bg-blue-600 text-white py-2 rounded" onClick={handleConfirm}>
            Comprar
          </button>
        </div>
      )}
      {step === 'success' && (
        <div className="max-w-md mx-auto bg-white rounded shadow p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-600">¡Producto comprado!</h2>
          <p className="mb-2">Gracias por tu compra.</p>
        </div>
      )}
    </main>
  );
}

function PricingCard({ name, price, interval, trialDays, features, priceId, onSelect }: {
  name: string;
  price: number;
  interval: string;
  trialDays: number;
  features: string[];
  priceId?: string;
  onSelect?: () => void;
}) {
  return (
    <div className="pt-6">
      <h2 className="text-2xl font-medium text-gray-900 mb-2">{name}</h2>
      <p className="text-sm text-gray-600 mb-4">
        with {trialDays} day free trial
      </p>
      <p className="text-4xl font-medium text-gray-900 mb-6">
        ${price / 100}{' '}
        <span className="text-xl font-normal text-gray-600">
          per user / {interval}
        </span>
      </p>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <button onClick={onSelect} className="w-full rounded-full bg-blue-600 text-white py-2 px-4 flex items-center justify-center">
        Comprar
      </button>
    </div>
  );
}
