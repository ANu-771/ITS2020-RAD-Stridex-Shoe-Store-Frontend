import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { 
  AlertTriangle, 
  XCircle, 
  ArrowDownToLine, 
  RefreshCw, 
  CheckCircle2
} from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import type { InventoryVariantItem } from '../../services/inventoryService';
import { StockAdjustmentModal } from './StockAdjustmentModal';
import { formatLKR } from '../../utils/currency';

export const LowStockReportView: FC = () => {
  const [items, setItems] = useState<Array<InventoryVariantItem & { severity: 'LOW_STOCK' | 'OUT_OF_STOCK' }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<'ALL' | 'OUT_OF_STOCK' | 'LOW_STOCK'>('ALL');

  // Adjustment Modal
  const [selectedVariant, setSelectedVariant] = useState<InventoryVariantItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchLowStockReport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await inventoryService.getLowStockReport();
      if (res.success) {
        setItems(res.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load low-stock audit report');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStockReport();
  }, []);

  const handleRestock = (variant: InventoryVariantItem) => {
    setSelectedVariant(variant);
    setIsModalOpen(true);
  };

  const filteredItems = items.filter(item => {
    if (filter === 'OUT_OF_STOCK') return item.stockQuantity === 0;
    if (filter === 'LOW_STOCK') return item.stockQuantity > 0;
    return true;
  });

  const outOfStockCount = items.filter(i => i.stockQuantity === 0).length;
  const lowStockCount = items.filter(i => i.stockQuantity > 0).length;

  return (
    <div className="space-y-6">
      {/* Header & Metric Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#DCEBE0] shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Inventory Depletion Watchlist</span>
          </div>
          <h2 className="text-2xl font-black text-[#26352D] font-outfit">Low & Out-of-Stock Report</h2>
          <p className="text-xs text-[#718078]">
            Items currently below their configured minimum threshold or fully exhausted. Immediate restock required.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center space-x-2">
            <XCircle className="w-4 h-4 text-rose-500" />
            <span>{outOfStockCount} Out of Stock</span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>{lowStockCount} Low Stock</span>
          </div>
          <button
            onClick={fetchLowStockReport}
            className="p-2.5 rounded-xl border border-[#DCEBE0] text-[#718078] hover:bg-[#F2FAF4] transition-colors cursor-pointer"
            title="Refresh Report"
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

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 text-xs">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            filter === 'ALL'
              ? 'bg-[#72C98A] text-white shadow-xs'
              : 'bg-white text-[#718078] hover:text-[#26352D] border border-[#DCEBE0]'
          }`}
        >
          All Warnings ({items.length})
        </button>
        <button
          onClick={() => setFilter('OUT_OF_STOCK')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            filter === 'OUT_OF_STOCK'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
          }`}
        >
          Out of Stock Only ({outOfStockCount})
        </button>
        <button
          onClick={() => setFilter('LOW_STOCK')}
          className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            filter === 'LOW_STOCK'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
          }`}
        >
          Low Stock Only ({lowStockCount})
        </button>
      </div>

      {/* Grid of Alert Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-white rounded-3xl border border-[#DCEBE0]" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#DCEBE0] text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-[#35A866] mx-auto" />
          <h3 className="font-outfit font-black text-xl text-[#26352D]">All Stock Levels Healthy!</h3>
          <p className="text-xs text-[#718078] max-w-md mx-auto">
            No footwear variants are currently below their minimum threshold. Your warehouse is adequately stocked.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isZero = item.stockQuantity === 0;
            const threshold = item.effectiveThreshold || item.minStockThreshold || 5;

            return (
              <div
                key={item._id || item.id}
                className={`bg-white rounded-3xl p-6 border shadow-xs flex flex-col justify-between space-y-5 transition-all ${
                  isZero ? 'border-rose-200 hover:border-rose-300' : 'border-amber-200 hover:border-amber-300'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Badge & SKU */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      isZero ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {isZero ? (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span>OUT OF STOCK (0)</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                          <span>LOW STOCK WARNING</span>
                        </>
                      )}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#718078]">
                      {item.SKU}
                    </span>
                  </div>

                  {/* Product Details with Thumbnail */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.productId?.images?.[0] || 'https://placehold.co/80x80?text=Shoe'}
                      alt={item.productId?.name}
                      className="w-16 h-16 object-cover rounded-2xl border border-[#DCEBE0] shrink-0 bg-[#F2FAF4]"
                    />
                    <div className="space-y-1">
                      <h4 className="font-bold text-[#26352D] text-sm leading-snug line-clamp-1">
                        {item.productId?.name}
                      </h4>
                      <div className="text-xs text-[#718078] flex items-center space-x-2">
                        <span className="font-semibold text-[#26352D]">Size {item.size}</span>
                        <span>•</span>
                        <span>{item.color}</span>
                      </div>
                      <div className="text-[11px] font-bold text-[#35A866]">
                        {formatLKR(item.productId?.basePrice || 0)}
                      </div>
                    </div>
                  </div>

                  {/* Progress & Threshold Comparison */}
                  <div className="p-3.5 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[#718078]">On-Hand Stock:</span>
                      <span className={isZero ? 'text-rose-600' : 'text-amber-700'}>
                        {item.stockQuantity} Pairs
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#718078]">Configured Threshold:</span>
                      <span className="font-bold text-[#26352D]">{threshold} Units</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isZero ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.round((item.stockQuantity / threshold) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Restock Action Button */}
                <button
                  onClick={() => handleRestock(item)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#72C98A] hover:bg-[#5bb875] text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>Restock Variant Now</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selectedVariant && (
        <StockAdjustmentModal
          variant={selectedVariant}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedVariant(null);
          }}
          onSuccess={() => {
            fetchLowStockReport();
          }}
        />
      )}
    </div>
  );
};
