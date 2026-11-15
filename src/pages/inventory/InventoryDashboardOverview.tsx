import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { 
  Boxes,
  PackageCheck, 
  AlertTriangle, 
  XCircle, 
  DollarSign, 
  ArrowRight, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  History 
} from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import type { InventoryDashboardStats } from '../../services/inventoryService';
import { formatLKR } from '../../utils/currency';

interface InventoryDashboardOverviewProps {
  onNavigateTab: (tab: 'dashboard' | 'variants' | 'movements' | 'low-stock') => void;
}

export const InventoryDashboardOverview: FC<InventoryDashboardOverviewProps> = ({ onNavigateTab }) => {
  const [stats, setStats] = useState<InventoryDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await inventoryService.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load inventory dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-[#DCEBE0]" />
          ))}
        </div>
        <div className="h-96 bg-white rounded-3xl border border-[#DCEBE0]" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-[#DCEBE0] text-center space-y-3">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h3 className="font-outfit font-bold text-xl text-[#26352D]">Dashboard Unavailable</h3>
        <p className="text-xs text-[#718078]">{error || 'Could not load metrics'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 5 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Variants */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#718078]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Variants</span>
            <div className="w-7 h-7 rounded-lg bg-[#DDF3E2] text-[#35A866] flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#26352D] font-outfit">
            {stats.totalVariants}
          </div>
          <div className="text-[11px] text-[#718078]">Distinct size-color SKUs</div>
        </div>

        {/* Available Stock */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#718078]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Available Stock</span>
            <div className="w-7 h-7 rounded-lg bg-[#DDF3E2] text-[#35A866] flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#35A866] font-outfit">
            {stats.availableStock} <span className="text-xs font-semibold text-[#718078]">Pairs</span>
          </div>
          <div className="text-[11px] text-[#718078]">Physical units ready</div>
        </div>

        {/* Low Stock Count */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#718078]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Low Stock</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 font-outfit">
            {stats.lowStockCount}
          </div>
          <button
            onClick={() => onNavigateTab('low-stock')}
            className="text-[11px] text-amber-700 font-bold hover:underline cursor-pointer flex items-center space-x-1"
          >
            <span>Below threshold</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Out of Stock Count */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#718078]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Out of Stock</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 font-outfit">
            {stats.outOfStockCount}
          </div>
          <div className="text-[11px] text-rose-700 font-bold">Depleted inventory</div>
        </div>

        {/* Total Stock Value */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#718078]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Stock Valuation</span>
            <div className="w-7 h-7 rounded-lg bg-[#DDF3E2] text-[#35A866] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-[#26352D] font-outfit truncate" title={formatLKR(stats.totalStockValueLKR)}>
            {formatLKR(stats.totalStockValueLKR)}
          </div>
          <div className="text-[11px] text-[#718078]">LKR retail value</div>
        </div>
      </div>

      {/* Quick Action Navigation Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigateTab('variants')}
          className="p-5 rounded-2xl bg-white border border-[#DCEBE0] shadow-xs hover:border-[#72C98A] transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-[#26352D] group-hover:text-[#35A866] transition-colors">
              Manage Variant Stock
            </h4>
            <p className="text-xs text-[#718078]">
              View all shoe SKUs, update thresholds, and trigger manual adjustments
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#718078] group-hover:text-[#35A866] group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={() => onNavigateTab('movements')}
          className="p-5 rounded-2xl bg-white border border-[#DCEBE0] shadow-xs hover:border-[#72C98A] transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-[#26352D] group-hover:text-[#35A866] transition-colors">
              Stock Movement Ledger
            </h4>
            <p className="text-xs text-[#718078]">
              Audit chronological logs of receiving, write-offs, and order dispatches
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#718078] group-hover:text-[#35A866] group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={() => onNavigateTab('low-stock')}
          className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs hover:border-amber-400 transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-amber-800 group-hover:text-amber-900 transition-colors">
              Low Stock Alert Center
            </h4>
            <p className="text-xs text-amber-700/80">
              {stats.lowStockCount + stats.outOfStockCount} items need attention
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* Recent Stock Movements Feed */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBE0] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#DCEBE0] pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#DDF3E2] text-[#35A866] rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-outfit font-black text-lg text-[#26352D]">Recent Stock Movements</h3>
              <p className="text-xs text-[#718078]">Latest warehouse stock adjustments and order deductions</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('movements')}
            className="text-xs font-bold text-[#35A866] hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>View Full Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats.recentMovements.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#718078]">
            No recent stock movements recorded. Use "Adjust Stock" on any shoe variant to record stock.
          </div>
        ) : (
          <div className="divide-y divide-[#DCEBE0]">
            {stats.recentMovements.slice(0, 6).map((m: any) => {
              const isPositive = ['STOCK_IN', 'ORDER_CANCELLATION'].includes(m.movementType) || 
                (m.movementType === 'ADJUSTMENT' && m.newQuantity > m.previousQuantity);
              const isNegative = ['STOCK_OUT', 'DAMAGED', 'ORDER_FULFILLMENT'].includes(m.movementType) ||
                (m.movementType === 'ADJUSTMENT' && m.newQuantity < m.previousQuantity);

              return (
                <div key={m.id || m._id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isPositive ? 'bg-[#DDF3E2] text-[#35A866]' :
                      isNegative ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {isPositive ? <ArrowDownToLine className="w-4 h-4" /> : <ArrowUpFromLine className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-bold text-[#26352D]">
                        {m.productId?.name || 'Shoe Model'}
                      </div>
                      <div className="text-[11px] text-[#718078]">
                        SKU: <span className="font-mono">{m.variantId?.SKU || 'SKU'}</span> • {m.reason}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 self-end sm:self-auto">
                    <span className={`px-2 py-0.5 rounded-md font-mono font-bold ${
                      isPositive ? 'text-[#35A866] bg-[#DDF3E2]' : 
                      isNegative ? 'text-rose-700 bg-rose-50' : 'text-[#26352D] bg-slate-100'
                    }`}>
                      {isPositive ? `+${m.changedQuantity}` : isNegative ? `-${m.changedQuantity}` : `${m.changedQuantity}`}
                    </span>
                    <span className="text-[#718078] text-[11px]">
                      {new Date(m.createdAt).toLocaleDateString('en-GB')} {new Date(m.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
