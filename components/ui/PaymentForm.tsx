"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function CheckoutForm({ customerId }: { customerId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const res = await fetch("/api/stripe/setup-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    });

    const { clientSecret, error: setupError } = await res.json();

    if (setupError) {
      setError(setupError);
      return;
    }

    const result = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      setError(result.error.message ?? "Error al guardar tarjeta");
    } else {
      setSuccess(true);
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <CardElement />
      <button
        type="submit"
        disabled={!stripe}
        className="bg-blue-600 text-white p-2 rounded"
      >
        Guardar método de pago
      </button>
      {error && <div className="text-red-500">{error}</div>}
      {success && (
        <div className="text-green-600">Tarjeta guardada correctamente</div>
      )}
    </form>
  );
}

export default function PaymentForm({ customerId }: { customerId: string }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm customerId={customerId} />
    </Elements>
  );
}
