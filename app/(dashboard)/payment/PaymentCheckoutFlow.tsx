"use client";

import { useState } from "react";
import PaymentForm from "@/components/ui/PaymentForm";

export default function PaymentCheckoutFlow({ selectedPlan, customerId, onBack }: {
  selectedPlan: any;
  customerId: string;
  onBack: () => void;
}) {

  const [step, setStep] = useState<'payment' | 'summary' | 'success'>('payment');
  const [cardInfo, setCardInfo] = useState<{ last4: string } | null>(null);
  const [selectedSaved, setSelectedSaved] = useState<string | null>(null);
  // Métodos simulados (como si vinieran de Stripe)
  const savedMethods = [
    { id: 'pm_1', brand: 'Visa', last4: '4242', exp: '12/28' },
    { id: 'pm_2', brand: 'Mastercard', last4: '4444', exp: '11/27' },
  ];

  const handlePaymentSuccess = (info: { last4: string }) => {
    setCardInfo(info);
    setStep('summary');
  };

  const handleConfirm = () => {
    setStep('success');
  };

  return (
    <div>
      {step === 'payment' && (
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Agregar método nuevo */}
          <div>
            <h2 className="text-lg font-bold mb-2">Agregar método de pago nuevo</h2>
            <PaymentForm customerId={customerId} onSuccess={handlePaymentSuccess} />
          </div>
          {/* Métodos guardados */}
          <div>
            <h2 className="text-lg font-bold mb-2">Seleccionar método guardado</h2>
            {savedMethods.length === 0 ? (
              <div className="text-gray-500">No tienes métodos guardados.</div>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (selectedSaved) {
                    setCardInfo({ last4: savedMethods.find(m => m.id === selectedSaved)?.last4 || '' });
                    setStep('summary');
                  }
                }}
                className="space-y-4"
              >
                {savedMethods.map(method => (
                  <label key={method.id} className="flex items-center gap-2 cursor-pointer border rounded p-2 mb-2">
                    <input
                      type="radio"
                      name="savedMethod"
                      value={method.id}
                      checked={selectedSaved === method.id}
                      onChange={() => setSelectedSaved(method.id)}
                    />
                    <span>{method.brand} **** {method.last4} (exp. {method.exp})</span>
                  </label>
                ))}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded"
                  disabled={!selectedSaved}
                >
                  Confirmar compra
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      {step === 'summary' && cardInfo && (
        <div className="max-w-md mx-auto bg-white rounded shadow p-6">
          <h2 className="text-xl font-bold mb-4">Resumen de compra</h2>
          <table className="w-full mb-4 text-sm">
            <tbody>
              <tr>
                <td className="font-medium">Producto:</td>
                <td>{selectedPlan.productName}</td>
              </tr>
              <tr>
                <td className="font-medium">Precio:</td>
                <td>${(selectedPlan.unitAmount / 100).toFixed(2)} {selectedPlan.currency?.toUpperCase()}</td>
              </tr>
              <tr>
                <td className="font-medium">Tarjeta:</td>
                <td>**** **** **** {cardInfo.last4}</td>
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
          <button className="mt-4 text-blue-600 underline" onClick={onBack}>Volver a productos</button>
        </div>
      )}
    </div>
  );
}
