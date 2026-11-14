import { useState } from 'react';
import type { FC } from 'react';
import { 
  X, 
  Package, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertCircle, 
  XCircle, 
  RefreshCw, 
  Ban 
} from 'lucide-react';
import type { Order } from '../../services/orderService';
import { orderService } from '../../services/orderService';
import { formatLKR } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import { SimulatedPaymentModal } from './SimulatedPaymentModal';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated: (updatedOrder: Order) => void;
}

const ORDER_STEPS = [
  { key: 'PENDING', label: 'Placed', icon: Clock },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'PROCESSING', label: 'Processing', icon: RefreshCw },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: Package },
];

export const OrderDetailsModal: FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onOrderUpdated,
}) => {
  const { showToast } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of delivery plans');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (!isOpen || !order) return null;

  const isCancelled = order.orderStatus === 'CANCELLED';
  const isDelivered = order.orderStatus === 'DELIVERED';
  const isShipped = order.orderStatus === 'SHIPPED';
  const canCancel = !isCancelled && !isDelivered && !isShipped;
  const canPayOnline =
    order.paymentMethod === 'ONLINE_CARD' &&
    order.paymentStatus !== 'PAID' &&
    !isCancelled;

  // Compute current step index for the tracker
  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.key === order.orderStatus);

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      const res = await orderService.cancelOrder(order.id, cancelReason);
      if (res.success && res.data) {
        showToast('Order cancelled and reserved stock restored to inventory', 'info');
        onOrderUpdated(res.data);
        setShowCancelConfirm(false);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to cancel order', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-[#DDF3E2] text-[#35A866] border border-[#BDECCB]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirmed</span>
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Processing</span>
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">
            <Truck className="w-3.5 h-3.5" />
            <span>In Transit</span>
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-[#DDF3E2] text-[#26352D] border border-[#BDECCB]">
            <Package className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-[#E45D5D]/10 text-[#E45D5D] border border-[#E45D5D]/20">
            <Ban className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DDF3E2] text-[#35A866] border border-[#BDECCB]">
            <CheckCircle2 className="w-3 h-3" />
            <span>PAID</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E45D5D]/10 text-[#E45D5D] border border-[#E45D5D]/30">
            <XCircle className="w-3 h-3" />
            <span>PAYMENT FAILED</span>
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-200">
            <span>REFUNDED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            <span>PAYMENT PENDING</span>
          </span>
        );
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-3xl w-full border border-[#DCEBE0] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200">
          {/* Modal Header */}
          <div className="p-6 bg-[#F2FAF4] border-b border-[#DCEBE0] flex items-center justify-between shrink-0">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h2 className="font-outfit text-2xl font-black text-[#26352D]">
                  Order {order.orderNumber}
                </h2>
                {getOrderStatusBadge(order.orderStatus)}
              </div>
              <p className="text-xs text-[#718078] flex items-center space-x-2">
                <span>Placed on {new Date(order.createdAt).toLocaleString()}</span>
                <span>•</span>
                <span>LKR Currency Standard</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white text-[#718078] hover:text-[#26352D] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Visual Step-by-Step Order Tracker */}
            {isCancelled ? (
              <div className="p-4 rounded-2xl bg-[#E45D5D]/10 border border-[#E45D5D]/20 text-[#E45D5D] text-xs flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="block font-bold text-sm">This order was cancelled</strong>
                  <p>
                    Reason: {order.cancellationReason || 'Cancelled by customer'}. All allocated variant quantities have been safely restored to stock.
                  </p>
                  {order.cancelledAt && (
                    <span className="text-[10px] text-[#E45D5D]/80 block">
                      Cancelled at: {new Date(order.cancelledAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-4">
                <span className="text-[11px] font-bold text-[#718078] uppercase tracking-wider block">
                  Delivery Fulfillment Progress
                </span>

                <div className="grid grid-cols-5 gap-2 relative">
                  {ORDER_STEPS.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isPassed = currentStepIndex >= idx;
                    const isCurrent = currentStepIndex === idx;

                    return (
                      <div key={step.key} className="flex flex-col items-center text-center space-y-1.5 z-10">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            isCurrent
                              ? 'bg-[#72C98A] text-white ring-4 ring-[#DDF3E2] shadow-sm'
                              : isPassed
                              ? 'bg-[#35A866] text-white'
                              : 'bg-white text-[#718078] border border-[#DCEBE0]'
                          }`}
                        >
                          <StepIcon className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-[10px] sm:text-xs font-semibold ${
                            isPassed ? 'text-[#26352D]' : 'text-[#718078]'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Online Payment Call-to-Action (If unpaid) */}
            {canPayOnline && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2 text-amber-800">
                  <CreditCard className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <strong className="block font-bold">Online Payment Pending</strong>
                    <span>Complete your simulated card transaction to finalize order dispatch.</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-4 py-2 bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  Pay Now (Demo Gateway)
                </button>
              </div>
            )}

            {/* Order Items Snapshots */}
            <div className="space-y-3">
              <h3 className="font-outfit font-bold text-base text-[#26352D]">
                Ordered Footwear ({order.items.length} {order.items.length === 1 ? 'pair' : 'pairs'})
              </h3>

              <div className="border border-[#DCEBE0] rounded-2xl divide-y divide-[#DCEBE0] overflow-hidden">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between gap-4 bg-white">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-16 h-16 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] p-1.5 shrink-0 flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-outfit font-bold text-sm text-[#26352D]">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[#718078]">
                          Size: <strong>EU {item.size}</strong> • Color: <strong>{item.color}</strong>
                        </p>
                        <p className="text-xs text-[#718078]">
                          Qty: {item.quantity} × {formatLKR(item.unitPrice)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#718078] block">Line Total</span>
                      <strong className="font-outfit text-sm font-extrabold text-[#26352D]">
                        {formatLKR(item.totalPrice)}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Payment Information (2 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Delivery Details */}
              <div className="p-4 rounded-2xl border border-[#DCEBE0] bg-white space-y-2.5 text-xs">
                <div className="flex items-center space-x-1.5 text-[#26352D] font-bold pb-1 border-b border-[#DCEBE0]">
                  <MapPin className="w-4 h-4 text-[#72C98A]" />
                  <span>Delivery Address</span>
                </div>
                <div className="text-[#718078] space-y-1">
                  <p className="font-bold text-[#26352D]">{order.customerDetails.fullName}</p>
                  <p>{order.customerDetails.deliveryAddress}</p>
                  <p>{order.customerDetails.city}, {order.customerDetails.postalCode}</p>
                  <p>Contact Phone: <strong className="text-[#26352D]">{order.customerDetails.phone}</strong></p>
                  {order.customerDetails.deliveryNotes && (
                    <p className="italic text-[11px] bg-[#F2FAF4] p-2 rounded-lg text-[#26352D] mt-1">
                      Notes: "{order.customerDetails.deliveryNotes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-4 rounded-2xl border border-[#DCEBE0] bg-white space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-[#DCEBE0]">
                  <div className="flex items-center space-x-1.5 text-[#26352D] font-bold">
                    <CreditCard className="w-4 h-4 text-[#72C98A]" />
                    <span>Payment Information</span>
                  </div>
                  {getPaymentBadge(order.paymentStatus)}
                </div>

                <div className="space-y-1.5 text-[#718078]">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <strong className="text-[#26352D] uppercase">
                      {order.paymentMethod.replace(/_/g, ' ')}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Footwear Subtotal:</span>
                    <span>{formatLKR(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Express Island-wide Shipping:</span>
                    <span>{order.deliveryFee === 0 ? 'FREE' : formatLKR(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#DCEBE0] text-sm">
                    <span className="font-bold text-[#26352D]">Final Total (LKR):</span>
                    <strong className="font-outfit font-black text-[#26352D]">
                      {formatLKR(order.finalTotal)}
                    </strong>
                  </div>

                  {order.paymentDetails?.transactionId && (
                    <div className="pt-2 text-[10px] text-[#718078] border-t border-[#DCEBE0]">
                      <span>Txn ID: <code className="font-mono text-[#26352D]">{order.paymentDetails.transactionId}</code></span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tracking Timeline Log */}
            {order.trackingTimeline && order.trackingTimeline.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-outfit font-bold text-sm text-[#26352D]">
                  Tracking History & Event Log
                </h3>
                <div className="border border-[#DCEBE0] rounded-2xl p-4 bg-[#F2FAF4]/50 space-y-3">
                  {order.trackingTimeline.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#72C98A] mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-[#26352D]">{item.title}</strong>
                          <span className="text-[10px] text-[#718078]">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-[#718078] mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-6 bg-[#F2FAF4] border-t border-[#DCEBE0] flex flex-wrap items-center justify-between gap-3 shrink-0">
            {canCancel && !showCancelConfirm ? (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="px-4 py-2 text-xs font-bold text-[#E45D5D] hover:bg-[#E45D5D]/10 rounded-xl border border-[#E45D5D]/30 transition-colors cursor-pointer"
              >
                Cancel This Order
              </button>
            ) : showCancelConfirm ? (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Reason for cancellation"
                  className="px-3 py-1.5 text-xs rounded-lg border border-[#DCEBE0] bg-white text-[#26352D] focus:outline-none"
                />
                <button
                  disabled={isCancelling}
                  onClick={handleCancelOrder}
                  className="px-3 py-1.5 bg-[#E45D5D] text-white font-bold text-xs rounded-lg hover:bg-[#d44949] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isCancelling ? 'Restoring Stock...' : 'Confirm Cancel'}
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#718078] hover:bg-white rounded-lg transition-colors cursor-pointer"
                >
                  Back
                </button>
              </div>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-2">
              {canPayOnline && (
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-4 py-2 bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Open Payment Simulator
                </button>
              )}
              <button
                onClick={onClose}
                className="px-5 py-2 bg-white hover:bg-[#F2FAF4] text-[#26352D] font-bold text-xs rounded-xl border border-[#DCEBE0] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Simulated Payment Gateway Dialog */}
      <SimulatedPaymentModal
        order={order}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentComplete={(updatedOrder) => {
          onOrderUpdated(updatedOrder);
          setIsPaymentModalOpen(false);
        }}
      />
    </>
  );
};
