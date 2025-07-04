'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  customerId: string | null;
}

export default function PaymentForm({ customerId }: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm customerId={customerId} />
    </Elements>
  );
}

function CheckoutForm({ customerId }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setMessage('');

    const card = elements.getElement(CardElement);
    if (!card) {
      setMessage('No se encontró el elemento de tarjeta.');
      setLoading(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      setMessage(error.message || 'Ocurrió un error.');
    } else {
      setMessage('Método de pago agregado exitosamente.');

      // Aquí llamas a tu API para guardar paymentMethod.id en tu base de datos
      // await fetch('/api/save-payment-method', { method: 'POST', body: JSON.stringify({ paymentMethodId: paymentMethod.id, customerId }) })
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <CardElement className="border p-2 rounded" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Procesando...' : 'Agregar método de pago'}
      </button>
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </form>
  );
}
