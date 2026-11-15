import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { 
  Search, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2, 
  SlidersHorizontal,
  RefreshCw,
  Edit2,
  Package
} from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import type { InventoryVariantItem } from '../../services/inventoryService';
import { StockAdjustmentModal } from './StockAdjustmentModal';
import { formatLKR } from '../../utils/currency';

export const InventoryVariantsTable: FC = () => {
  const [variants, setVariants] = useState<InventoryVariantItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<{ totalPages: number; totalItems: number }>({
    totalPages: 1,
    totalItems: 0
  });

  // Adjustment Modal
  const [selectedVariant, setSelectedVariant] = useState<InventoryVariantItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Quick Threshold Editing
  const [editingThresholdId, setEditingThresholdId] = useState<string | null>(null);
  const [tempThreshold, setTempThreshold] = useState<number>(5);
  const [isSavingThreshold, setIsSavingThreshold] = useState<boolean>(false);

  const fetchVariants = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await inventoryService.getVariants({
        page,
        limit: 12,
        search: search.trim() || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter
      });
      if (res.success) {
        setVariants(res.data);
        setPagination({
          totalPages: res.pagination.totalPages,
          totalItems: res.pagination.totalItems
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch variant inventory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [page, statusFilter]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      fetchVariants();
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  const handleOpenAdjust = (variant: InventoryVariantItem) => {
    setSelectedVariant(variant);
    setIsModalOpen(true);
  };

  const handleSaveThreshold = async (variantId: string) => {
    setIsSavingThreshold(true);
    try {
      await inventoryService.updateThreshold(variantId, tempThreshold);
      setEditingThresholdId(null);
      fetchVariants();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update threshold');
    } finally {
      setIsSavingThreshold(false);
    }
  };

  const getStatusBadge = (variant: InventoryVariantItem) => {
    const stock = variant.stockQuantity;
    const threshold = variant.effectiveThreshold || variant.minStockThreshold || 5;

    if (stock === 0) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3 text-rose-500" />
          <span>Out of Stock (0)</span>
        </span>
      );
    }
    if (stock <= threshold) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-500" />
          <span>Low Stock ({stock})</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#DDF3E2] text-[#26352D] border border-[#DCEBE0]">
        <CheckCircle2 className="w-3 h-3 text-[#35A866]" />
        <span>In Stock ({stock})</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-3xl border border-[#DCEBE0] shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by shoe name, SKU, size, color..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCEBE0] focus:outline-none focus:ring-2 focus:ring-[#72C98A] text-xs text-[#26352D] bg-[#F2FAF4]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {(['ALL', 'HEALTHY', 'LOW_STOCK', 'OUT_OF_STOCK'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#72C98A] text-white shadow-xs'
                  : 'bg-[#F2FAF4] text-[#718078] hover:text-[#26352D]'
              }`}
            >
              {status === 'ALL' && 'All Items'}
              {status === 'HEALTHY' && 'In Stock'}
              {status === 'LOW_STOCK' && 'Low Stock Warning'}
              {status === 'OUT_OF_STOCK' && 'Out of Stock'}
            </button>
          ))}

          <button
            onClick={fetchVariants}
            className="p-2.5 rounded-xl border border-[#DCEBE0] text-[#718078] hover:bg-[#F2FAF4] transition-colors cursor-pointer ml-auto"
            title="Refresh list"
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

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-[#DCEBE0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#DCEBE0] bg-[#F2FAF4]/80 text-[#718078] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-6">Product & Image</th>
                <th className="py-4 px-6">Variant SKU</th>
                <th className="py-4 px-6">Size / Color</th>
                <th className="py-4 px-6">Available Stock</th>
                <th className="py-4 px-6">Min Threshold</th>
                <th className="py-4 px-6">Stock Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
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
              ) : variants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#718078]">
                    <Package className="w-10 h-10 mx-auto text-[#718078]/40 mb-2" />
                    <p className="font-semibold text-sm">No shoe variants matched your criteria</p>
                  </td>
                </tr>
              ) : (
                variants.map((v) => (
                  <tr key={v._id || v.id} className="hover:bg-[#F2FAF4]/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={v.productId?.images?.[0] || 'https://placehold.co/80x80?text=Shoe'}
                          alt={v.productId?.name}
                          className="w-12 h-12 object-cover rounded-xl border border-[#DCEBE0] shrink-0 bg-[#F2FAF4]"
                        />
                        <div>
                          <div className="font-bold text-[#26352D] text-sm">
                            {v.productId?.name || 'Unnamed Model'}
                          </div>
                          <div className="text-[11px] text-[#718078]">
                            Base Price: {formatLKR(v.productId?.basePrice || 0)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono font-bold text-[#26352D]">
                      {v.SKU}
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <div className="font-bold text-[#26352D]">Size {v.size}</div>
                        <div className="text-[11px] text-[#718078]">{v.color}</div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-black font-outfit text-sm text-[#26352D]">
                      {v.stockQuantity} Pairs
                    </td>

                    <td className="py-4 px-6">
                      {editingThresholdId === (v._id || v.id) ? (
                        <div className="flex items-center space-x-1.5">
                          <input
                            type="number"
                            min="0"
                            value={tempThreshold}
                            onChange={(e) => setTempThreshold(parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 border border-[#72C98A] rounded-lg text-xs font-bold"
                          />
                          <button
                            onClick={() => handleSaveThreshold(v._id || v.id)}
                            disabled={isSavingThreshold}
                            className="px-2 py-1 rounded bg-[#72C98A] text-white text-[10px] font-bold cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingThresholdId(null)}
                            className="px-1.5 py-1 text-[#718078] text-[10px]"
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5">
                          <span className="font-semibold text-[#26352D]">
                            {v.minStockThreshold || 5} Units
                          </span>
                          <button
                            onClick={() => {
                              setEditingThresholdId(v._id || v.id);
                              setTempThreshold(v.minStockThreshold || 5);
                            }}
                            className="p-1 text-[#718078] hover:text-[#26352D] rounded-md transition-colors cursor-pointer"
                            title="Edit Minimum Warning Threshold"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {getStatusBadge(v)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenAdjust(v)}
                        className="px-3.5 py-2 rounded-xl bg-[#F2FAF4] hover:bg-[#DDF3E2] text-[#26352D] font-bold text-xs border border-[#DCEBE0] transition-colors cursor-pointer inline-flex items-center space-x-1.5"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#35A866]" />
                        <span>Adjust Stock</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-[#DCEBE0] flex items-center justify-between text-xs text-[#718078]">
            <div>
              Showing {variants.length} of {pagination.totalItems} variant entries
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

      {/* Adjustment Form Modal */}
      {selectedVariant && (
        <StockAdjustmentModal
          variant={selectedVariant}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedVariant(null);
          }}
          onSuccess={() => {
            fetchVariants();
          }}
        />
      )}
    </div>
  );
};
