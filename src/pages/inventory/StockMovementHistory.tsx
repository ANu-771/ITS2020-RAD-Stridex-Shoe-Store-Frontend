import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { 
  History, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  AlertOctagon, 
  SlidersHorizontal, 
  ShoppingBag, 
  RotateCcw, 
  RefreshCw, 
  User, 
  Clock 
} from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import type { StockMovement, StockMovementType } from '../../services/inventoryService';

export const StockMovementHistory: FC = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<{ totalPages: number; totalItems: number }>({
    totalPages: 1,
    totalItems: 0
  });

  const fetchMovements = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await inventoryService.getMovements({
        page,
        limit: 15,
        type: typeFilter === 'ALL' ? undefined : typeFilter
      });
      if (res.success) {
        setMovements(res.data);
        setPagination({
          totalPages: res.pagination.totalPages,
          totalItems: res.pagination.totalItems
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch stock movement audit log');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [page, typeFilter]);

  const getMovementBadge = (type: StockMovementType) => {
    switch (type) {
      case 'STOCK_IN':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#DDF3E2] text-[#26352D] border border-[#DCEBE0]">
            <ArrowDownToLine className="w-3 h-3 text-[#35A866]" />
            <span>Stock-In</span>
          </span>
        );
      case 'STOCK_OUT':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <ArrowUpFromLine className="w-3 h-3 text-blue-600" />
            <span>Stock-Out</span>
          </span>
        );
      case 'DAMAGED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertOctagon className="w-3 h-3 text-rose-600" />
            <span>Damaged</span>
          </span>
        );
      case 'ADJUSTMENT':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <SlidersHorizontal className="w-3 h-3 text-purple-600" />
            <span>Audit Adjustment</span>
          </span>
        );
      case 'ORDER_FULFILLMENT':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <ShoppingBag className="w-3 h-3 text-teal-600" />
            <span>Order Fulfillment</span>
          </span>
        );
      case 'ORDER_CANCELLATION':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <RotateCcw className="w-3 h-3 text-amber-600" />
            <span>Order Restored</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-700">
            {type}
          </span>
        );
    }
  };

  const MOVEMENT_TYPES = [
    { label: 'All Operations', value: 'ALL' },
    { label: 'Stock-In', value: 'STOCK_IN' },
    { label: 'Stock-Out', value: 'STOCK_OUT' },
    { label: 'Damaged', value: 'DAMAGED' },
    { label: 'Adjustments', value: 'ADJUSTMENT' },
    { label: 'Orders Sold', value: 'ORDER_FULFILLMENT' },
    { label: 'Cancellations Restored', value: 'ORDER_CANCELLATION' }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-[#DCEBE0] shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DDF3E2] text-[#26352D] text-xs font-semibold mb-1">
            <History className="w-3.5 h-3.5 text-[#35A866]" />
            <span>Immutable Audit Trail</span>
          </div>
          <h2 className="text-xl font-black text-[#26352D] font-outfit">Stock Movement Ledger</h2>
          <p className="text-xs text-[#718078]">
            Complete record of every stock increase, deduction, write-off, and customer order fulfillment
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="px-3.5 py-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] font-bold text-[#26352D] focus:outline-none focus:ring-2 focus:ring-[#72C98A]"
          >
            {MOVEMENT_TYPES.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          <button
            onClick={fetchMovements}
            className="p-2.5 rounded-xl border border-[#DCEBE0] text-[#718078] hover:bg-[#F2FAF4] transition-colors cursor-pointer"
            title="Refresh ledger"
          >
            <RefreshCw className={`w-4 h-4 text-[#35A866] ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Movement Table Card */}
      <div className="bg-white rounded-3xl border border-[#DCEBE0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#DCEBE0] bg-[#F2FAF4]/80 text-[#718078] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6">Shoe / SKU</th>
                <th className="py-4 px-6">Operation</th>
                <th className="py-4 px-6">Stock Delta</th>
                <th className="py-4 px-6">Quantity Flow</th>
                <th className="py-4 px-6">Reason / Reference</th>
                <th className="py-4 px-6">Performed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCEBE0]">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="py-6 px-6">
                      <div className="h-6 bg-slate-100 rounded-lg w-full" />
                    </td>
                  </tr>
                ))
              ) : movements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#718078]">
                    <History className="w-10 h-10 mx-auto text-[#718078]/40 mb-2" />
                    <p className="font-semibold text-sm">No stock movements recorded yet</p>
                  </td>
                </tr>
              ) : (
                movements.map((m) => {
                  const isPositive = ['STOCK_IN', 'ORDER_CANCELLATION'].includes(m.movementType) || 
                    (m.movementType === 'ADJUSTMENT' && m.newQuantity > m.previousQuantity);
                  const isNegative = ['STOCK_OUT', 'DAMAGED', 'ORDER_FULFILLMENT'].includes(m.movementType) ||
                    (m.movementType === 'ADJUSTMENT' && m.newQuantity < m.previousQuantity);

                  return (
                    <tr key={m.id} className="hover:bg-[#F2FAF4]/40 transition-colors">
                      {/* Timestamp */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5 text-[#26352D] font-semibold">
                          <Clock className="w-3.5 h-3.5 text-[#718078]" />
                          <span>{new Date(m.createdAt).toLocaleDateString('en-GB')}</span>
                        </div>
                        <div className="text-[10px] text-[#718078] pl-5">
                          {new Date(m.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Product & Variant */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#26352D]">
                          {m.productId?.name || 'Shoe Model'}
                        </div>
                        <div className="text-[11px] text-[#718078] font-mono">
                          {m.variantId?.SKU || 'SKU'} • Size {m.variantId?.size || '-'} ({m.variantId?.color || '-'})
                        </div>
                      </td>

                      {/* Movement Type Badge */}
                      <td className="py-4 px-6">
                        {getMovementBadge(m.movementType)}
                      </td>

                      {/* Stock Delta */}
                      <td className="py-4 px-6 font-bold">
                        <span className={`px-2 py-0.5 rounded-md font-mono ${
                          isPositive ? 'text-[#35A866] bg-[#DDF3E2]' : 
                          isNegative ? 'text-rose-700 bg-rose-50' : 'text-[#26352D] bg-slate-100'
                        }`}>
                          {isPositive ? `+${m.changedQuantity}` : isNegative ? `-${m.changedQuantity}` : `${m.changedQuantity}`}
                        </span>
                      </td>

                      {/* Quantity Flow */}
                      <td className="py-4 px-6 font-mono text-xs">
                        <span className="text-[#718078]">{m.previousQuantity}</span>
                        <span className="mx-1.5 text-[#718078] font-sans">→</span>
                        <strong className="text-[#26352D] font-bold">{m.newQuantity}</strong>
                      </td>

                      {/* Reason */}
                      <td className="py-4 px-6 max-w-xs truncate text-[#718078]" title={m.reason}>
                        {m.reason}
                      </td>

                      {/* Performed by */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <User className="w-3.5 h-3.5 text-[#35A866]" />
                          <span className="font-semibold text-[#26352D]">
                            {m.performedBy?.fullName || 'Staff Member'}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#718078] pl-5">
                          {m.performedBy?.role || 'SYSTEM'}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-[#DCEBE0] flex items-center justify-between text-xs text-[#718078]">
            <div>
              Showing {movements.length} of {pagination.totalItems} ledger entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-[#DCEBE0] hover:bg-[#F2FAF4] disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <span className="font-bold text-[#26352D]">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-[#DCEBE0] hover:bg-[#F2FAF4] disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
