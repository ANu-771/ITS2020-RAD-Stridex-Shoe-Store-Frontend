import { useState } from 'react';
import type { FC } from 'react';
import { 
  X, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  AlertOctagon, 
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Package
} from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import type { InventoryVariantItem } from '../../services/inventoryService';

interface StockAdjustmentModalProps {
  variant: InventoryVariantItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StockAdjustmentModal: FC<StockAdjustmentModalProps> = ({
  variant,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [movementType, setMovementType] = useState<'STOCK_IN' | 'STOCK_OUT' | 'DAMAGED' | 'ADJUSTMENT'>('STOCK_IN');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('');
  const [minThreshold, setMinThreshold] = useState<number>(variant.minStockThreshold || 5);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a specific reason or audit note');
      return;
    }
    if (quantity <= 0) {
      setError('Quantity must be at least 1 unit');
      return;
    }

    if ((movementType === 'STOCK_OUT' || movementType === 'DAMAGED') && quantity > variant.stockQuantity) {
      setError(`Cannot deduct ${quantity} units: current on-hand stock is only ${variant.stockQuantity}`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Perform stock adjustment
      await inventoryService.adjustStock({
        variantId: variant._id || variant.id,
        movementType,
        quantity: Number(quantity),
        reason: reason.trim()
      });

      // 2. If threshold was modified, update threshold as well
      if (minThreshold !== variant.minStockThreshold) {
        await inventoryService.updateThreshold(variant._id || variant.id, minThreshold);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to record stock movement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSimulatedNewStock = () => {
    const q = Number(quantity) || 0;
    if (movementType === 'STOCK_IN') return variant.stockQuantity + q;
    if (movementType === 'STOCK_OUT' || movementType === 'DAMAGED') return Math.max(0, variant.stockQuantity - q);
    if (movementType === 'ADJUSTMENT') return q;
    return variant.stockQuantity;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#DCEBE0] shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#F2FAF4] text-[#718078] hover:text-[#26352D] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#DDF3E2] text-[#26352D] text-xs font-semibold">
            <Package className="w-3.5 h-3.5 text-[#35A866]" />
            <span>Warehouse Stock Control</span>
          </div>
          <h2 className="text-2xl font-black text-[#26352D] font-outfit">Adjust Inventory Stock</h2>
          <p className="text-xs text-[#718078]">
            {variant.productId?.name} • SKU: <strong className="text-[#26352D]">{variant.SKU}</strong> (Size {variant.size}, {variant.color})
          </p>
        </div>

        {/* Current Stock Banner */}
        <div className="p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#718078] uppercase tracking-wider">Current Stock On Hand</div>
            <div className="text-2xl font-black text-[#26352D] font-outfit">
              {variant.stockQuantity} <span className="text-sm font-normal text-[#718078]">Pairs</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-semibold text-[#718078] uppercase tracking-wider">Min Threshold Alert</div>
            <div className="text-sm font-bold text-[#35A866]">
              {variant.minStockThreshold} Units
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Operation Type Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#26352D] uppercase tracking-wider">
              Operation Type *
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setMovementType('STOCK_IN')}
                className={`p-3 rounded-xl border flex items-center space-x-2.5 font-semibold transition-all cursor-pointer ${
                  movementType === 'STOCK_IN'
                    ? 'border-[#35A866] bg-[#DDF3E2] text-[#26352D]'
                    : 'border-[#DCEBE0] bg-white text-[#718078] hover:bg-[#F2FAF4]'
                }`}
              >
                <ArrowDownToLine className="w-4 h-4 text-[#35A866]" />
                <span>Stock-In (Receive)</span>
              </button>

              <button
                type="button"
                onClick={() => setMovementType('STOCK_OUT')}
                className={`p-3 rounded-xl border flex items-center space-x-2.5 font-semibold transition-all cursor-pointer ${
                  movementType === 'STOCK_OUT'
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-[#DCEBE0] bg-white text-[#718078] hover:bg-[#F2FAF4]'
                }`}
              >
                <ArrowUpFromLine className="w-4 h-4 text-blue-600" />
                <span>Stock-Out (Transfer)</span>
              </button>

              <button
                type="button"
                onClick={() => setMovementType('DAMAGED')}
                className={`p-3 rounded-xl border flex items-center space-x-2.5 font-semibold transition-all cursor-pointer ${
                  movementType === 'DAMAGED'
                    ? 'border-rose-500 bg-rose-50 text-rose-900'
                    : 'border-[#DCEBE0] bg-white text-[#718078] hover:bg-[#F2FAF4]'
                }`}
              >
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>Damaged / Write-Off</span>
              </button>

              <button
                type="button"
                onClick={() => setMovementType('ADJUSTMENT')}
                className={`p-3 rounded-xl border flex items-center space-x-2.5 font-semibold transition-all cursor-pointer ${
                  movementType === 'ADJUSTMENT'
                    ? 'border-purple-500 bg-purple-50 text-purple-900'
                    : 'border-[#DCEBE0] bg-white text-[#718078] hover:bg-[#F2FAF4]'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                <span>Audit Adjustment</span>
              </button>
            </div>
          </div>

          {/* Quantity & Threshold */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#26352D]">
                {movementType === 'ADJUSTMENT' ? 'New Exact Count *' : 'Quantity Units *'}
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DCEBE0] focus:outline-none focus:ring-2 focus:ring-[#72C98A] text-sm text-[#26352D] font-bold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#26352D]">
                Min Alert Threshold
              </label>
              <input
                type="number"
                min="0"
                value={minThreshold}
                onChange={(e) => setMinThreshold(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DCEBE0] focus:outline-none focus:ring-2 focus:ring-[#72C98A] text-sm text-[#26352D]"
              />
            </div>
          </div>

          {/* Reason / Reference Note */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#26352D]">
              Movement Reason & Audit Reference *
            </label>
            <input
              type="text"
              placeholder="e.g. Supplier PO #4092 received, or Floor display wear write-off"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#DCEBE0] focus:outline-none focus:ring-2 focus:ring-[#72C98A] text-xs text-[#26352D]"
              required
            />
          </div>

          {/* Result preview */}
          <div className="p-3 rounded-xl bg-[#DDF3E2]/50 border border-[#DCEBE0] flex items-center justify-between text-xs">
            <span className="font-semibold text-[#26352D]">Resulting New Stock:</span>
            <span className="font-black text-sm text-[#35A866] font-outfit">
              {getSimulatedNewStock()} Pairs
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-[#DCEBE0] text-[#718078] hover:bg-[#F2FAF4] text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#72C98A] hover:bg-[#5bb875] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
            >
              {isSubmitting ? (
                <span>Recording...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Execute Stock Movement</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
