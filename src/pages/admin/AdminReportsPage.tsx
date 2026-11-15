import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { 
  FileText, 
  TrendingUp, 
  Package, 
  RefreshCw, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { adminDashboardService } from '../../services/adminDashboardService';
import { formatLKR } from '../../utils/currency';

export const AdminReportsPage: FC = () => {
  const [salesReport, setSalesReport] = useState<{
    totalSalesRevenue: number;
    totalOrders: number;
    totalPairsSold: number;
    averageOrderValue: number;
  } | null>(null);

  const [valuationReport, setValuationReport] = useState<{
    totalUnits: number;
    totalValuation: number;
    activeVariantsCount: number;
  } | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [salesRes, valuationRes] = await Promise.all([
        adminDashboardService.getSalesReport(),
        adminDashboardService.getInventoryValuation()
      ]);

      if (salesRes.success) setSalesReport(salesRes.data);
      if (valuationRes.success) setValuationReport(valuationRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load business intelligence reports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DCEBE0] shadow-xs">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DDF3E2] text-[#26352D] text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5 text-[#72C98A]" />
            <span>Business Intelligence & Valuation</span>
          </div>
          <h2 className="text-2xl font-black text-[#26352D] font-outfit">Financial & Stock Reports</h2>
          <p className="text-xs text-[#718078]">
            Real-time aggregated sales revenue, pair volume, and inventory asset valuation in Sri Lankan Rupees (LKR)
          </p>
        </div>

        <button
          onClick={fetchReports}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] hover:bg-[#DDF3E2] text-[#26352D] text-xs font-semibold transition-colors flex items-center space-x-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#35A866] ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className="h-64 bg-white rounded-3xl border border-[#DCEBE0]" />
          <div className="h-64 bg-white rounded-3xl border border-[#DCEBE0]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales & Revenue Report Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCEBE0] shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#DCEBE0] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#DDF3E2] text-[#35A866] rounded-2xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-outfit font-black text-lg text-[#26352D]">Sales Performance Report</h3>
                  <p className="text-xs text-[#718078]">Completed and confirmed order totals</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#35A866] bg-[#DDF3E2] px-2.5 py-1 rounded-full">
                LKR Standard
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1">
                <div className="text-[11px] font-semibold text-[#718078] uppercase tracking-wider">Total Sales Revenue</div>
                <div className="text-xl sm:text-2xl font-black text-[#26352D] font-outfit">
                  {formatLKR(salesReport?.totalSalesRevenue || 0)}
                </div>
                <div className="text-[11px] text-[#35A866] flex items-center space-x-1">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>Realized Income</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1">
                <div className="text-[11px] font-semibold text-[#718078] uppercase tracking-wider">Average Order Value</div>
                <div className="text-xl sm:text-2xl font-black text-[#26352D] font-outfit">
                  {formatLKR(salesReport?.averageOrderValue || 0)}
                </div>
                <div className="text-[11px] text-[#718078]">Per customer checkout</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1">
                <div className="text-[11px] font-semibold text-[#718078] uppercase tracking-wider">Orders Processed</div>
                <div className="text-xl sm:text-2xl font-black text-[#26352D] font-outfit">
                  {salesReport?.totalOrders || 0}
                </div>
                <div className="text-[11px] text-[#718078]">Total customer transactions</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1">
                <div className="text-[11px] font-semibold text-[#718078] uppercase tracking-wider">Shoe Pairs Dispatched</div>
                <div className="text-xl sm:text-2xl font-black text-[#26352D] font-outfit">
                  {salesReport?.totalPairsSold || 0} Pairs
                </div>
                <div className="text-[11px] text-[#718078]">Cumulative unit volume</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#DDF3E2]/50 border border-[#DCEBE0] flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-[#35A866] shrink-0 mt-0.5" />
              <div className="text-xs text-[#26352D] space-y-0.5">
                <span className="font-bold">Audit Assurance:</span>
                <p className="text-[#718078]">
                  Sales metrics exclude cancelled orders and are dynamically recalculated from authoritative MongoDB ledger documents.
                </p>
              </div>
            </div>
          </div>

          {/* Inventory Valuation Report Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCEBE0] shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#DCEBE0] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#DDF3E2] text-[#35A866] rounded-2xl">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-outfit font-black text-lg text-[#26352D]">Inventory Asset Valuation</h3>
                  <p className="text-xs text-[#718078]">Current warehouse stock retail value</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#35A866] bg-[#DDF3E2] px-2.5 py-1 rounded-full">
                Warehouse Assets
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1 col-span-2">
                <div className="text-[11px] font-semibold text-[#718078] uppercase tracking-wider">Total Warehouse Valuation</div>
                <div className="text-2xl sm:text-3xl font-black text-[#35A866] font-outfit">
                  {formatLKR(valuationReport?.totalValuation || 0)}
                </div>
                <div className="text-[11px] text-[#718078]">Sum of all active variant units multiplied by catalog base prices</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1">
                <div className="text-[11px] font-semibold text-[#718078] uppercase tracking-wider">Stock Units on Hand</div>
                <div className="text-xl sm:text-2xl font-black text-[#26352D] font-outfit">
                  {valuationReport?.totalUnits || 0} Units
                </div>
                <div className="text-[11px] text-[#718078]">Available shoe pairs</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1">
                <div className="text-[11px] font-semibold text-[#718078] uppercase tracking-wider">Active SKU Variants</div>
                <div className="text-xl sm:text-2xl font-black text-[#26352D] font-outfit">
                  {valuationReport?.activeVariantsCount || 0} SKUs
                </div>
                <div className="text-[11px] text-[#718078]">Distinct size-color pairs</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#DDF3E2]/50 border border-[#DCEBE0] flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-[#35A866] shrink-0 mt-0.5" />
              <div className="text-xs text-[#26352D] space-y-0.5">
                <span className="font-bold">Inventory Integrity:</span>
                <p className="text-[#718078]">
                  Asset valuation synchronizes live with stock adjustment events, customer checkouts, and cancellations in real time.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
