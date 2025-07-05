
"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const PaymentCheckoutFlow = dynamic(() => import("./PaymentCheckoutFlow"), { ssr: false });

export default function PaymentPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Obtener usuario y customerId
        const userRes = await fetch("/api/user");
        if (!userRes.ok) throw new Error("No autenticado");
        const user = await userRes.json();
        // Si el usuario no existe o no tiene el campo stripeCustomerId, lo creamos
        if (!user || typeof user.stripeCustomerId === 'undefined' || !user.stripeCustomerId) {
          const res = await fetch("/api/user/stripe-customer", { method: "POST" });
          if (!res.ok) throw new Error("No se pudo crear el cliente de Stripe");
          const data = await res.json();
          setCustomerId(data.stripeCustomerId);
        } else {
          setCustomerId(user.stripeCustomerId);
        }

        // Obtener planes y precios
        const pricesRes = await fetch("/api/stripe/prices");
        if (!pricesRes.ok) throw new Error("No se pudieron obtener los precios");
        const prices = await pricesRes.json();
        setPlans(prices);
      } catch (err: any) {
        setError(err.message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Cargando...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  if (!customerId) {
    return <div className="p-8 text-red-500">No se pudo obtener el cliente de Stripe.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Compra un producto</h1>
      {!selectedPlan ? (
        <div className="grid md:grid-cols-2 gap-8 max-w-xl mx-auto mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="border rounded-lg p-6 cursor-pointer hover:border-blue-500"
              onClick={() => setSelectedPlan(plan)}
            >
              {plan.productImage && (
                <img src={plan.productImage} alt={plan.productName} className="w-full h-32 object-contain mb-2" />
              )}
              <h2 className="text-xl font-semibold mb-2">{plan.productName}</h2>
              <p className="text-3xl font-bold mb-2">${(plan.unitAmount / 100).toFixed(2)}</p>
              <ul className="mb-2 text-sm text-gray-700">
                {plan.features?.map((f: string, i: number) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
              <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded" onClick={() => setSelectedPlan(plan)}>
                Comprar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <>
          <button className="mb-4 text-blue-600 underline" onClick={() => setSelectedPlan(null)}>
            ← Volver a productos
          </button>
          <PaymentCheckoutFlow selectedPlan={selectedPlan} customerId={customerId} onBack={() => setSelectedPlan(null)} />
        </>
      )}
    </div>
  );
}
