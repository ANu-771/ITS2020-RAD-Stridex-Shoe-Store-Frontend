import { useState } from 'react';
import type { FC } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Lock, 
  X, 
  Sparkles, 
  Loader2 
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import type { Order } from '../../services/orderService';
import { formatLKR } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';

interface SimulatedPaymentModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (updatedOrder: Order) => void;
}

export const SimulatedPaymentModal: FC<SimulatedPaymentModalProps> = ({
  order,
  isOpen,
  onClose,
  onPaymentComplete,
}) => {
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<'form' | 'result'>('form');
  const [lastResult, setLastResult] = useState<'SUCCESS' | 'FAILED' | 'PENDING' | null>(null);

  // Mock Form State (Purely aesthetic demo data - never transmitted or stored)
  const [cardholderName, setCardholderName] = useState<string>(
    order?.customerDetails.fullName || 'Kamal Perera'
  );
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState<string>('12/28');
  const [cvv, setCvv] = useState<string>('888');

  if (!isOpen || !order) return null;

  const handleSimulate = async (result: 'SUCCESS' | 'FAILED' | 'PENDING') => {
    setIsProcessing(true);
    setLastResult(result);

    try {
      // Simulate realistic payment gateway latency (900ms)
      await new Promise((resolve) => setTimeout(resolve, 900));

      const res = await orderService.simulatePayment(order.id, {
        simulationResult: result,
        cardBrand: cardNumber.startsWith('4') ? 'Visa' : 'MasterCard',
        last4: '4242',
        notes:
          result === 'FAILED'
            ? 'Card declined: Insufficient test demo balance (Simulated rejection)'
            : undefined,
      });

      if (res.success && res.data) {
        setActiveStep('result');
        if (result === 'SUCCESS') {
          showToast('Simulated card payment approved! Order confirmed.', 'success');
        } else if (result === 'FAILED') {
          showToast('Payment simulation declined (test failure triggered).', 'error');
        } else {
          showToast('Payment marked as pending verification.', 'info');
        }
        onPaymentComplete(res.data);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Payment simulation failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setActiveStep('form');
    setLastResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-[#DCEBE0] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-[#071A33] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs text-[#50A5FF] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-[#72C98A]" />
            <span>Simulated Payment Gateway</span>
          </div>

          <h2 className="font-outfit text-2xl font-black text-white">STRIDEX Pay Gateway</h2>
          <p className="text-xs text-white/70 mt-1">
            Secure Demo Sandbox • Sri Lankan Rupee Transaction Engine
          </p>

          <div className="mt-4 p-3 bg-white/10 rounded-2xl flex items-center justify-between text-xs backdrop-blur-xs border border-white/10">
            <div>
              <span className="text-white/60 block text-[10px]">Order Reference</span>
              <strong className="font-mono text-white font-bold">{order.orderNumber}</strong>
            </div>
            <div className="text-right">
              <span className="text-white/60 block text-[10px]">Amount Payable</span>
              <strong className="font-outfit text-base font-extrabold text-[#72C98A]">
                {formatLKR(order.finalTotal)}
              </strong>
            </div>
          </div>
        </div>

        {/* Demo Notice Banner */}
        <div className="bg-[#F2FAF4] border-b border-[#DCEBE0] px-6 py-2.5 flex items-center space-x-2 text-[11px] text-[#26352D]">
          <ShieldCheck className="w-4 h-4 text-[#72C98A] shrink-0" />
          <span>
            <strong>Demo Simulator:</strong> No real bank cards or real funds are charged. Select any outcome below to simulate gateway behavior.
          </span>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {activeStep === 'form' ? (
            <>
              {/* Mock Credit Card Visual */}
              <div className="bg-gradient-to-tr from-[#0B2D52] to-[#1677FF] rounded-2xl p-5 text-white shadow-lg space-y-4 relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

                <div className="flex items-center justify-between">
                  <span className="font-outfit font-extrabold text-sm tracking-widest text-[#72C98A]">
                    STRIDEX DEMO
                  </span>
                  <div className="flex space-x-1.5 items-center text-xs font-semibold">
                    <CreditCard className="w-4 h-4" />
                    <span>LKR CARD</span>
                  </div>
                </div>

                <div className="font-mono text-lg tracking-widest text-center py-1">
                  {cardNumber}
                </div>

                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-white/80">
                  <div>
                    <span className="block text-[8px] text-white/50">Cardholder</span>
                    <strong>{cardholderName}</strong>
                  </div>
                  <div>
                    <span className="block text-[8px] text-white/50">Expires</span>
                    <strong>{expiry}</strong>
                  </div>
                  <div>
                    <span className="block text-[8px] text-white/50">Security</span>
                    <strong>•••</strong>
                  </div>
                </div>
              </div>

              {/* Mock Inputs (Editable for demonstration) */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#26352D] mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] focus:outline-none focus:ring-1 focus:ring-[#72C98A]"
                    placeholder="Full name as printed on card"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#26352D] mb-1">Card Number (Demo)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] font-mono focus:outline-none focus:ring-1 focus:ring-[#72C98A]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-[#26352D] mb-1">Exp Date</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] font-mono text-center focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#26352D] mb-1">CVV</label>
                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength={4}
                        className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] font-mono text-center focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulation Trigger Buttons */}
              <div className="space-y-2 pt-2">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-[#718078] text-center">
                  Trigger Gateway Response:
                </span>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    disabled={isProcessing}
                    onClick={() => handleSimulate('SUCCESS')}
                    className="w-full py-3 bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing && lastResult === 'SUCCESS' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span>Simulate Successful Payment (Approved)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      disabled={isProcessing}
                      onClick={() => handleSimulate('FAILED')}
                      className="py-2.5 bg-[#E45D5D]/10 hover:bg-[#E45D5D]/20 text-[#E45D5D] border border-[#E45D5D]/30 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing && lastResult === 'FAILED' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>Simulate Declined (Fail)</span>
                    </button>

                    <button
                      disabled={isProcessing}
                      onClick={() => handleSimulate('PENDING')}
                      className="py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isProcessing && lastResult === 'PENDING' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                      <span>Simulate Pending</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Result View */
            <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-200">
              {lastResult === 'SUCCESS' ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#DDF3E2] text-[#35A866] flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-outfit text-2xl font-extrabold text-[#26352D]">
                    Payment Approved!
                  </h3>
                  <p className="text-xs text-[#718078] max-w-sm mx-auto">
                    The simulated gateway authorized <strong>{formatLKR(order.finalTotal)}</strong>. Order <strong>{order.orderNumber}</strong> is now marked as <strong>PAID & CONFIRMED</strong>.
                  </p>
                </div>
              ) : lastResult === 'FAILED' ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full bg-[#E45D5D]/10 text-[#E45D5D] flex items-center justify-center mx-auto shadow-sm">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-outfit text-2xl font-extrabold text-[#E45D5D]">
                    Transaction Declined
                  </h3>
                  <p className="text-xs text-[#718078] max-w-sm mx-auto">
                    The payment simulation failed as requested. Order remains unpaid with status <strong>FAILED</strong>. You can retry with another simulation or cancel.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h3 className="font-outfit text-2xl font-extrabold text-amber-700">
                    Payment Pending
                  </h3>
                  <p className="text-xs text-[#718078] max-w-sm mx-auto">
                    Authorization is currently pending in demo mode.
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-center space-x-3">
                {lastResult !== 'SUCCESS' && (
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 bg-[#F2FAF4] hover:bg-[#DDF3E2] text-[#26352D] font-bold text-xs rounded-xl border border-[#DCEBE0] transition-colors cursor-pointer"
                  >
                    Retry Simulation
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Close & View Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F2FAF4] px-6 py-3 border-t border-[#DCEBE0] flex items-center justify-between text-[10px] text-[#718078]">
          <span className="flex items-center space-x-1">
            <Lock className="w-3 h-3 text-[#72C98A]" />
            <span>256-Bit SSL Demo Sandbox</span>
          </span>
          <span>STRIDEX Phase 6 Engine</span>
        </div>
      </div>
    </div>
  );
};
