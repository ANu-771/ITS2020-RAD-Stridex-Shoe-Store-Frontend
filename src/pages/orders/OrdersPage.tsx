import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  ArrowRight,
  ShoppingBag,
  MapPin,
  Calendar
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import type { Order } from '../../services/orderService';
import { formatLKR } from '../../utils/currency';
import { useAppSelector } from '../../hooks/reduxHooks';

export const OrdersPage: FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await orderService.getMyOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load your orders');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    } else {
      setIsLoading(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isAuthenticated]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DDF3E2] text-[#35A866] border border-[#BDECCB]">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmed</span>
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
            <Clock className="w-3 h-3" />
            <span>Processing</span>
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
            <Truck className="w-3 h-3" />
            <span>In Transit</span>
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DDF3E2] text-[#26352D] border border-[#BDECCB]">
            <CheckCircle2 className="w-3 h-3" />
            <span>Delivered</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
            <span>{status}</span>
          </span>
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F2FAF4] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-[#DCEBE0] p-10 max-w-md text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#DDF3E2] text-[#72C98A] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-outfit font-bold text-2xl text-[#26352D]">Sign In to View Orders</h2>
          <p className="text-xs text-[#718078]">
            Please sign in to view your placed footwear orders, delivery tracking, and purchase receipts.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-2.5 bg-[#72C98A] text-white text-xs font-bold rounded-xl hover:bg-[#59B976] transition-all"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2FAF4] py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-[#DCEBE0]">
        <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-[#26352D]">
          Your Footwear Orders
        </h1>
        <p className="text-xs sm:text-sm text-[#718078] mt-1">
          Track fulfillment status, delivery addresses, and purchase history.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 bg-white rounded-3xl border border-[#DCEBE0]" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-[#E45D5D]/10 text-[#E45D5D] text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      ) : orders.length === 0 ? (
        /* Empty Orders State */
        <div className="bg-white rounded-3xl border border-[#DCEBE0] p-12 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#F2FAF4] text-[#718078] flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="font-outfit font-bold text-2xl text-[#26352D]">No orders placed yet</h2>
          <p className="text-xs text-[#718078]">
            You have not placed any orders yet. Discover our premium sneaker and footwear lines.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#72C98A] text-white text-xs font-bold rounded-xl hover:bg-[#59B976] shadow-sm transition-all"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-[#DCEBE0] overflow-hidden shadow-xs hover:border-[#72C98A]/50 transition-colors"
            >
              {/* Order Header */}
              <div className="p-5 bg-[#F2FAF4]/50 border-b border-[#DCEBE0] flex flex-wrap gap-4 items-center justify-between text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-[#718078] block text-[10px]">Order Number</span>
                    <strong className="font-mono text-[#26352D] font-bold text-sm">
                      {order.orderNumber}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[#718078] block text-[10px]">Date Placed</span>
                    <span className="text-[#26352D] font-medium flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-[#718078]" />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[#718078] block text-[10px]">Payment</span>
                    <span className="text-[#26352D] font-medium uppercase">
                      {order.paymentMethod.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(order.orderStatus)}
                  <div className="text-right">
                    <span className="text-[#718078] block text-[10px]">Total (LKR)</span>
                    <strong className="font-outfit text-base font-extrabold text-[#26352D]">
                      {formatLKR(order.finalTotal)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-5 divide-y divide-[#DCEBE0]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-[#F2FAF4] rounded-2xl border border-[#DCEBE0] p-1.5 shrink-0 flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
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
                    <strong className="font-outfit font-bold text-sm text-[#26352D]">
                      {formatLKR(item.totalPrice)}
                    </strong>
                  </div>
                ))}
              </div>

              {/* Delivery Address Summary */}
              <div className="px-5 py-3 bg-[#F2FAF4]/30 border-t border-[#DCEBE0] flex items-center justify-between text-xs text-[#718078]">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-[#72C98A]" />
                  <span>
                    Delivering to <strong>{order.customerDetails.fullName}</strong> ({order.customerDetails.deliveryAddress}, {order.customerDetails.city})
                  </span>
                </div>
                <span className="font-semibold text-[#26352D]">
                  {order.deliveryFee === 0 ? 'Free Shipping' : `Delivery: ${formatLKR(order.deliveryFee)}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
