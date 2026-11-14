import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertCircle, 
  XCircle, 
  Ban, 
  Banknote, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw 
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import type { Order, OrderSummaryMetrics } from '../../services/orderService';
import { formatLKR } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import { OrderDetailsModal } from '../../components/orders/OrderDetailsModal';

export const AdminOrdersPage: FC = () => {
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<OrderSummaryMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination State
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(15);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('ALL');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('ALL');

  // Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

  // Quick Status Update Modal / Prompt
  const [statusUpdatingOrder, setStatusUpdatingOrder] = useState<Order | null>(null);
  const [targetOrderStatus, setTargetOrderStatus] = useState<string>('');
  const [targetPaymentStatus, setTargetPaymentStatus] = useState<string>('');
  const [statusNote, setStatusNote] = useState<string>('');
  const [isSavingStatus, setIsSavingStatus] = useState<boolean>(false);

  const fetchAdminOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await orderService.getAllOrdersAdmin({
        page,
        limit,
        search: search.trim() || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        paymentStatus: paymentStatusFilter !== 'ALL' ? paymentStatusFilter : undefined,
        paymentMethod: paymentMethodFilter !== 'ALL' ? paymentMethodFilter : undefined,
      });

      if (res.success) {
        setOrders(res.data);
        setSummary(res.summary);
        setTotalPages(res.pagination.totalPages);
        setTotalItems(res.pagination.totalItems);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch admin orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOrders();
  }, [page, statusFilter, paymentStatusFilter, paymentMethodFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchAdminOrders();
  };

  const handleOpenStatusModal = (order: Order) => {
    setStatusUpdatingOrder(order);
    setTargetOrderStatus(order.orderStatus);
    setTargetPaymentStatus(order.paymentStatus);
    setStatusNote('');
  };

  const handleSaveStatusUpdate = async () => {
    if (!statusUpdatingOrder) return;
    setIsSavingStatus(true);
    try {
      let updatedOrder = statusUpdatingOrder;

      // Update Order Status if changed
      if (targetOrderStatus !== statusUpdatingOrder.orderStatus) {
        const res = await orderService.updateOrderStatusAdmin(statusUpdatingOrder.id, {
          orderStatus: targetOrderStatus as any,
          note: statusNote || undefined,
        });
        if (res.success) {
          updatedOrder = res.data;
          showToast(`Order status updated to ${targetOrderStatus}`, 'success');
        }
      }

      // Update Payment Status if changed
      if (targetPaymentStatus !== statusUpdatingOrder.paymentStatus) {
        const res = await orderService.updatePaymentStatusAdmin(statusUpdatingOrder.id, {
          paymentStatus: targetPaymentStatus as any,
          note: statusNote || undefined,
        });
        if (res.success) {
          updatedOrder = res.data;
          showToast(`Payment status updated to ${targetPaymentStatus}`, 'success');
        }
      }

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
      );
      setStatusUpdatingOrder(null);
      fetchAdminOrders(); // Refresh summaries
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update order status', 'error');
    } finally {
      setIsSavingStatus(false);
    }
  };

  const getOrderStatusBadge = (status: string) => {
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
            <RefreshCw className="w-3 h-3 animate-spin" />
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
            <Package className="w-3 h-3" />
            <span>Delivered</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E45D5D]/10 text-[#E45D5D] border border-[#E45D5D]/20">
            <Ban className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#DDF3E2] text-[#35A866] border border-[#BDECCB]">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>PAID</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#E45D5D]/10 text-[#E45D5D] border border-[#E45D5D]/30">
            <XCircle className="w-2.5 h-2.5" />
            <span>FAILED</span>
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-50 text-purple-600 border border-purple-200">
            <span>REFUNDED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-2.5 h-2.5" />
            <span>PENDING</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Metric Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs space-y-2">
            <span className="text-[11px] font-bold text-[#718078] uppercase tracking-wider block">
              Total Placed Orders
            </span>
            <div className="flex items-center justify-between">
              <strong className="font-outfit text-2xl font-black text-[#26352D]">
                {summary.totalOrders}
              </strong>
              <div className="w-8 h-8 rounded-full bg-[#DDF3E2] text-[#72C98A] flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs space-y-2">
            <span className="text-[11px] font-bold text-[#718078] uppercase tracking-wider block">
              Total Revenue (LKR)
            </span>
            <div className="flex items-center justify-between">
              <strong className="font-outfit text-2xl font-black text-[#26352D]">
                {formatLKR(summary.totalRevenue)}
              </strong>
              <div className="w-8 h-8 rounded-full bg-[#DDF3E2] text-[#35A866] flex items-center justify-center">
                <Banknote className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs space-y-2">
            <span className="text-[11px] font-bold text-[#718078] uppercase tracking-wider block">
              Pending Fulfillment
            </span>
            <div className="flex items-center justify-between">
              <strong className="font-outfit text-2xl font-black text-amber-600">
                {summary.confirmedCount + summary.processingCount}
              </strong>
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs space-y-2">
            <span className="text-[11px] font-bold text-[#718078] uppercase tracking-wider block">
              COD Pending Collection
            </span>
            <div className="flex items-center justify-between">
              <strong className="font-outfit text-2xl font-black text-[#26352D]">
                {summary.codPendingCount}
              </strong>
              <div className="w-8 h-8 rounded-full bg-[#F2FAF4] text-[#26352D] flex items-center justify-center">
                <Banknote className="w-4 h-4 text-[#72C98A]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Control Bar: Search & Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DCEBE0] shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order #, Customer Name, Email, Phone..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-xs text-[#26352D] focus:outline-none focus:ring-1 focus:ring-[#72C98A]"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-3 pt-2 border-t border-[#DCEBE0] text-xs">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-[#718078]" />
            <span className="font-semibold text-[#26352D]">Order Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-[#26352D]">Payment:</span>
            <select
              value={paymentStatusFilter}
              onChange={(e) => {
                setPaymentStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] focus:outline-none"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-[#26352D]">Method:</span>
            <select
              value={paymentMethodFilter}
              onChange={(e) => {
                setPaymentMethodFilter(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] focus:outline-none"
            >
              <option value="ALL">All Methods</option>
              <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
              <option value="ONLINE_CARD">Online Card (Simulated)</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-2xl border border-[#DCEBE0]" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-[#E45D5D]/10 text-[#E45D5D] text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DCEBE0] p-12 text-center space-y-3">
          <Package className="w-8 h-8 text-[#718078] mx-auto" />
          <h3 className="font-outfit font-bold text-lg text-[#26352D]">No orders match your filter</h3>
          <p className="text-xs text-[#718078]">Try clearing your search query or filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#DCEBE0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F2FAF4] text-[#718078] border-b border-[#DCEBE0] uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total Amount (LKR)</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCEBE0]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F2FAF4]/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#26352D]">
                      {order.orderNumber}
                    </td>

                    <td className="py-3.5 px-4 text-[#718078] whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <strong className="text-[#26352D] block">
                          {order.customerDetails.fullName}
                        </strong>
                        <span className="text-[10px] text-[#718078] block">
                          {order.customerDetails.city} • {order.customerDetails.phone}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#718078]">
                      <span>{order.items.length} {order.items.length === 1 ? 'pair' : 'pairs'}</span>
                    </td>

                    <td className="py-3.5 px-4 font-outfit font-extrabold text-[#26352D]">
                      {formatLKR(order.finalTotal)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase font-semibold text-[#718078]">
                          {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'COD' : order.paymentMethod.replace(/_/g, ' ')}
                        </div>
                        {getPaymentBadge(order.paymentStatus)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getOrderStatusBadge(order.orderStatus)}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailsOpen(true);
                        }}
                        title="View Full Order Details"
                        className="px-2.5 py-1 bg-white hover:bg-[#DDF3E2] text-[#26352D] border border-[#DCEBE0] rounded-lg transition-colors cursor-pointer inline-flex items-center space-x-1 font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#718078]" />
                        <span>View</span>
                      </button>

                      <button
                        onClick={() => handleOpenStatusModal(order)}
                        title="Update Status / Record Collection"
                        className="px-2.5 py-1 bg-[#72C98A] hover:bg-[#59B976] text-white rounded-lg transition-colors cursor-pointer font-bold inline-flex items-center space-x-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 bg-[#F2FAF4] border-t border-[#DCEBE0] flex items-center justify-between text-xs text-[#718078]">
            <span>
              Showing {orders.length} of {totalItems} orders (Page {page} of {totalPages})
            </span>

            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-[#DCEBE0] bg-white hover:bg-[#F2FAF4] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-[#DCEBE0] bg-white hover:bg-[#F2FAF4] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onOrderUpdated={(updated) => {
          setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
          setSelectedOrder(updated);
          fetchAdminOrders();
        }}
      />

      {/* Admin Quick Status Update Dialog */}
      {statusUpdatingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#DCEBE0] p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="border-b border-[#DCEBE0] pb-3">
              <h3 className="font-outfit text-xl font-bold text-[#26352D]">
                Manage Order {statusUpdatingOrder.orderNumber}
              </h3>
              <p className="text-xs text-[#718078]">
                Customer: <strong>{statusUpdatingOrder.customerDetails.fullName}</strong> • Total: <strong>{formatLKR(statusUpdatingOrder.finalTotal)}</strong>
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#26352D] mb-1">Order Fulfillment Status</label>
                <select
                  value={targetOrderStatus}
                  onChange={(e) => setTargetOrderStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] focus:outline-none focus:ring-1 focus:ring-[#72C98A]"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED (Restores variant stock)</option>
                </select>
                {targetOrderStatus === 'CANCELLED' && (
                  <p className="text-[11px] text-[#E45D5D] mt-1">
                    ⚠️ Marking as CANCELLED will immediately return all reserved variant pairs to inventory.
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-[#26352D] mb-1">
                  Payment Status {statusUpdatingOrder.paymentMethod === 'CASH_ON_DELIVERY' && '(Record Cash Collection)'}
                </label>
                <select
                  value={targetPaymentStatus}
                  onChange={(e) => setTargetPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] focus:outline-none focus:ring-1 focus:ring-[#72C98A]"
                >
                  <option value="PENDING">PENDING (Awaiting Cash/Card)</option>
                  <option value="PAID">PAID (Cash Collected / Card Authorized)</option>
                  <option value="FAILED">FAILED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#26352D] mb-1">Status Note / Audit Reason</label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Courier reported package delivered and cash collected"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2 border-t border-[#DCEBE0]">
              <button
                disabled={isSavingStatus}
                onClick={() => setStatusUpdatingOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-[#718078] hover:bg-[#F2FAF4] rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isSavingStatus}
                onClick={handleSaveStatusUpdate}
                className="px-5 py-2 bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSavingStatus ? 'Updating...' : 'Save Status Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
