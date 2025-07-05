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
        <>
          <h2 className="text-xl font-bold mb-4">Completa tu compra para {selectedPlan.productName}</h2>
          <PaymentForm customerId={customerId} onSuccess={handlePaymentSuccess} />
        </>
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
