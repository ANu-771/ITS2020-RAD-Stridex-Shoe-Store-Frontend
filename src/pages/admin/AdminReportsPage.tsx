import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { 
  FileText, 
  TrendingUp, 
  Package, 
  RefreshCw, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  CreditCard,
  AlertTriangle,
  XCircle,
  Tag,
  Clock
} from 'lucide-react';
import { adminDashboardService } from '../../services/adminDashboardService';
import type { SalesReportData, InventoryValuationData, SalesReportFilterParams } from '../../services/adminDashboardService';
import { formatLKR } from '../../utils/currency';

type PresetRange = 'all' | 'today' | 'last7days' | 'last30days' | 'thisMonth' | 'custom';

export const AdminReportsPage: FC = () => {
  const [salesReport, setSalesReport] = useState<SalesReportData | null>(null);
  const [valuationReport, setValuationReport] = useState<InventoryValuationData | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Date Filter State
  const [selectedRange, setSelectedRange] = useState<PresetRange>('all');
  const [startDateInput, setStartDateInput] = useState<string>('');
  const [endDateInput, setEndDateInput] = useState<string>('');

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const salesParams: SalesReportFilterParams = {};
      if (selectedRange !== 'custom') {
        salesParams.range = selectedRange;
      } else {
        if (startDateInput) salesParams.startDate = startDateInput;
        if (endDateInput) salesParams.endDate = endDateInput;
      }

      const [salesRes, valuationRes] = await Promise.all([
        adminDashboardService.getSalesReport(salesParams),
        adminDashboardService.getInventoryValuation()
      ]);

      if (salesRes.success) setSalesReport(salesRes.data);
      if (valuationRes.success) setValuationReport(valuationRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load business intelligence reports');
    } finally {
      setIsLoading(false);
    }
  }, [selectedRange, startDateInput, endDateInput]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handlePresetClick = (preset: PresetRange) => {
    setSelectedRange(preset);
    if (preset !== 'custom') {
      setStartDateInput('');
      setEndDateInput('');
    }
  };

  const handleApplyCustomDates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDateInput && !endDateInput) return;
    setSelectedRange('custom');
    fetchReports();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DCEBE0] shadow-xs">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DDF3E2] text-[#26352D] text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5 text-[#72C98A]" />
            <span>Business Intelligence & Financial Audit</span>
          </div>
          <h2 className="text-2xl font-black text-[#26352D] font-outfit">Financial & Stock Reports</h2>
          <p className="text-xs text-[#718078]">
            Real-time verified sales revenue, payment channel breakdown, and warehouse asset valuation in Sri Lankan Rupees (LKR)
          </p>
        </div>

        <button
          onClick={() => fetchReports()}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] hover:bg-[#DDF3E2] text-[#26352D] text-xs font-semibold transition-colors flex items-center space-x-2 cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#35A866] ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Reports</span>
        </button>
      </div>

      {/* Date Range Control Bar */}
      <div className="bg-white p-5 rounded-3xl border border-[#DCEBE0] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3 border-b border-[#DCEBE0]">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#26352D]">
            <Calendar className="w-4 h-4 text-[#72C98A]" />
            <span>Reporting Period Filter:</span>
          </div>
          {salesReport?.dateRange && (
            <span className="text-[11px] font-mono font-medium text-[#718078] bg-[#F2FAF4] px-3 py-1 rounded-full border border-[#DCEBE0]">
              Active Scope: <strong className="text-[#26352D] uppercase">{salesReport.dateRange.range}</strong>
              {salesReport.dateRange.startDate && (
                <span> ({new Date(salesReport.dateRange.startDate).toLocaleDateString()} – {salesReport.dateRange.endDate ? new Date(salesReport.dateRange.endDate).toLocaleDateString() : 'Now'})</span>
              )}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {(
              [
                { id: 'all', label: 'All Time' },
                { id: 'today', label: 'Today' },
                { id: 'last7days', label: 'Last 7 Days' },
                { id: 'last30days', label: 'Last 30 Days' },
                { id: 'thisMonth', label: 'This Month' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => handlePresetClick(p.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedRange === p.id
                    ? 'bg-[#72C98A] text-white shadow-xs'
                    : 'bg-[#F2FAF4] text-[#718078] hover:text-[#26352D] hover:bg-[#DDF3E2]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Custom Date Form */}
          <form onSubmit={handleApplyCustomDates} className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#718078] font-medium text-[11px]">Custom:</span>
            <input
              type="date"
              value={startDateInput}
              onChange={(e) => {
                setStartDateInput(e.target.value);
                setSelectedRange('custom');
              }}
              className="px-2.5 py-1.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] text-xs focus:outline-none focus:border-[#72C98A]"
            />
            <span className="text-[#718078]">–</span>
            <input
              type="date"
              value={endDateInput}
              onChange={(e) => {
                setEndDateInput(e.target.value);
                setSelectedRange('custom');
              }}
              className="px-2.5 py-1.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] text-xs focus:outline-none focus:border-[#72C98A]"
            />
            <button
              type="submit"
              disabled={!startDateInput && !endDateInput}
              className="px-3 py-1.5 rounded-xl bg-[#26352D] hover:bg-[#1E2B24] text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-40"
            >
              Apply
            </button>
          </form>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-2xl border border-[#DCEBE0]" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-white rounded-3xl border border-[#DCEBE0]" />
            <div className="h-80 bg-white rounded-3xl border border-[#DCEBE0]" />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 1. SALES PERFORMANCE REPORT */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCEBE0] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#DCEBE0] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#DDF3E2] text-[#35A866] rounded-2xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-outfit font-black text-xl text-[#26352D]">Sales Performance Report</h3>
                  <p className="text-xs text-[#718078]">Authoritative realized revenue derived strictly from verified paid orders</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-[#35A866] bg-[#DDF3E2] px-3 py-1 rounded-full border border-[#BDECCB]">
                  LKR Currency Standard
                </span>
              </div>
            </div>

            {/* 4 Core Sales KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Realized Revenue */}
              <div className="p-5 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1.5">
                <div className="text-[10px] font-bold text-[#718078] uppercase tracking-wider">Realized Revenue</div>
                <div className="text-xl sm:text-2xl font-black text-[#26352D] font-outfit truncate">
                  {formatLKR(salesReport?.totalSalesRevenue || 0)}
                </div>
                <div className="text-[11px] text-[#35A866] flex items-center space-x-1 font-semibold">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Paid Orders Only</span>
                </div>
              </div>

              {/* Average Order Value */}
              <div className="p-5 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1.5">
                <div className="text-[10px] font-bold text-[#718078] uppercase tracking-wider">Average Order Value</div>
                <div className="text-xl sm:text-2xl font-black text-[#26352D] font-outfit truncate">
                  {formatLKR(salesReport?.averageOrderValue || 0)}
                </div>
                <div className="text-[11px] text-[#718078]">Per customer checkout</div>
              </div>

              {/* Paid Orders Count */}
              <div className="p-5 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1.5">
                <div className="text-[10px] font-bold text-[#718078] uppercase tracking-wider">Paid Transactions</div>
                <div className="text-xl sm:text-2xl font-black text-[#26352D] font-outfit">
                  {salesReport?.totalOrders || 0}
                </div>
                <div className="text-[11px] text-[#718078]">Confirmed & collected</div>
              </div>

              {/* Shoe Pairs Dispatched */}
              <div className="p-5 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1.5">
                <div className="text-[10px] font-bold text-[#718078] uppercase tracking-wider">Pairs Sold</div>
                <div className="text-xl sm:text-2xl font-black text-[#26352D] font-outfit">
                  {salesReport?.totalPairsSold || 0} Pairs
                </div>
                <div className="text-[11px] text-[#718078]">Footwear volume delivered</div>
              </div>
            </div>

            {/* Financial Ledger Audit Banner */}
            <div className="p-4 rounded-2xl bg-[#DDF3E2]/40 border border-[#BDECCB] flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#35A866] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-[#26352D]">Ledger Integrity Assurance:</span>
                  <p className="text-[#718078]">
                    Cancelled orders ({salesReport?.cancelledOrdersCount || 0}) and uncollected pending payments are strictly separated from realized revenue.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <div className="px-3 py-1 rounded-xl bg-white border border-[#DCEBE0] text-[11px]">
                  <span className="text-[#718078]">Pending COD/Bank: </span>
                  <strong className="text-amber-700 font-mono">{formatLKR(salesReport?.pendingRevenue || 0)}</strong>
                  <span className="text-[10px] text-[#718078]"> ({salesReport?.pendingOrdersCount || 0} orders)</span>
                </div>
                <div className="px-3 py-1 rounded-xl bg-white border border-[#DCEBE0] text-[11px]">
                  <span className="text-[#718078]">Discounts Granted: </span>
                  <strong className="text-[#35A866] font-mono">{formatLKR(salesReport?.totalDiscountsGiven || 0)}</strong>
                </div>
              </div>
            </div>

            {/* Payment Channels & Top Selling Shoes Grid (2 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* Payment Methods Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-[#72C98A]" />
                  <h4 className="font-bold text-[#26352D] text-sm">Payment Methods Breakdown</h4>
                </div>

                <div className="divide-y divide-[#DCEBE0] border border-[#DCEBE0] rounded-2xl overflow-hidden bg-white text-xs">
                  {salesReport?.paymentMethodBreakdown && salesReport.paymentMethodBreakdown.length > 0 ? (
                    salesReport.paymentMethodBreakdown.map((pm, idx) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-[#F2FAF4]/40 transition-colors">
                        <div className="space-y-0.5">
                          <strong className="text-[#26352D] block">{pm.label}</strong>
                          <span className="text-[11px] text-[#718078]">{pm.orderCount} customer orders</span>
                        </div>
                        <div className="text-right">
                          <strong className="font-outfit font-black text-[#26352D] text-sm block">
                            {formatLKR(pm.revenue)}
                          </strong>
                          <span className="text-[10px] text-[#35A866] font-semibold">Realized</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-[#718078] italic">No payment data in this range.</div>
                  )}
                </div>
              </div>

              {/* Order Status Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#72C98A]" />
                  <h4 className="font-bold text-[#26352D] text-sm">Order Status Breakdown</h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {salesReport?.orderStatusBreakdown?.map((st, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs text-center space-y-1 ${
                        st.status === 'DELIVERED' || st.status === 'CONFIRMED'
                          ? 'bg-[#DDF3E2]/40 border-[#BDECCB] text-[#26352D]'
                          : st.status === 'CANCELLED'
                          ? 'bg-rose-50/60 border-rose-200 text-rose-800'
                          : 'bg-[#F2FAF4] border-[#DCEBE0] text-[#718078]'
                      }`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wider">{st.status}</div>
                      <div className="text-lg font-black font-outfit">{st.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top-Selling Products in Selected Range */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-[#72C98A]" />
                  <h4 className="font-bold text-[#26352D] text-sm">Best-Selling Footwear in Selected Range</h4>
                </div>
                <span className="text-[11px] text-[#718078]">Ranked by units sold</span>
              </div>

              {!salesReport?.topSellingProducts || salesReport.topSellingProducts.length === 0 ? (
                <div className="p-8 text-center bg-[#F2FAF4] rounded-2xl border border-[#DCEBE0] text-[#718078] text-xs">
                  No footwear sales recorded for the selected reporting period.
                </div>
              ) : (
                <div className="divide-y divide-[#DCEBE0] border border-[#DCEBE0] rounded-2xl overflow-hidden bg-white text-xs">
                  {salesReport.topSellingProducts.map((prod, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-[#F2FAF4]/30 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-xs text-[#718078] w-5 text-center">
                          #{idx + 1}
                        </span>
                        <div className="w-10 h-10 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] p-1 flex items-center justify-center shrink-0">
                          {prod.image ? (
                            <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" />
                          ) : (
                            <Package className="w-4 h-4 text-[#72C98A]" />
                          )}
                        </div>
                        <div>
                          <strong className="text-[#26352D] font-bold block">{prod.name}</strong>
                          <span className="text-[11px] text-[#718078]">{prod.pairsSold} pairs sold</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <strong className="font-outfit font-extrabold text-[#26352D] text-sm block">
                          {formatLKR(prod.revenue)}
                        </strong>
                        <span className="text-[10px] text-[#35A866] font-semibold">Volume Generated</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 2. INVENTORY ASSET VALUATION REPORT */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCEBE0] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#DCEBE0] pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-[#DDF3E2] text-[#35A866] rounded-2xl">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-outfit font-black text-xl text-[#26352D]">Inventory Asset Valuation</h3>
                  <p className="text-xs text-[#718078]">Current warehouse stock retail value dynamically computed from active variant units</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#35A866] bg-[#DDF3E2] px-3 py-1 rounded-full border border-[#BDECCB]">
                Warehouse Assets
              </span>
            </div>

            {/* Core Valuation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1.5 md:col-span-1">
                <div className="text-[10px] font-bold text-[#718078] uppercase tracking-wider">Total Warehouse Valuation</div>
                <div className="text-2xl sm:text-3xl font-black text-[#35A866] font-outfit truncate">
                  {formatLKR(valuationReport?.totalValuation || 0)}
                </div>
                <div className="text-[11px] text-[#718078]">Sum of units × catalog base prices</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1.5">
                <div className="text-[10px] font-bold text-[#718078] uppercase tracking-wider">Stock Units on Hand</div>
                <div className="text-2xl font-black text-[#26352D] font-outfit">
                  {valuationReport?.totalUnits || 0} Units
                </div>
                <div className="text-[11px] text-[#718078]">Physical footwear inventory</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1.5">
                <div className="text-[10px] font-bold text-[#718078] uppercase tracking-wider">Active SKU Variants</div>
                <div className="text-2xl font-black text-[#26352D] font-outfit">
                  {valuationReport?.activeVariantsCount || 0} SKUs
                </div>
                <div className="text-[11px] text-[#718078]">Distinct size-color combinations</div>
              </div>
            </div>

            {/* Stock Health Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#DDF3E2]/50 border border-[#BDECCB] flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#35A866] shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-[#26352D]">{valuationReport?.healthyStockCount || 0} SKUs Healthy</div>
                  <span className="text-[10px] text-[#718078]">Stock above threshold</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-amber-900">{valuationReport?.lowStockCount || 0} SKUs Low Stock</div>
                  <span className="text-[10px] text-amber-700">Stock ≤ configured threshold</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center space-x-3">
                <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-rose-900">{valuationReport?.outOfStockCount || 0} SKUs Exhausted</div>
                  <span className="text-[10px] text-rose-700">0 units remaining</span>
                </div>
              </div>
            </div>

            {/* Category & Brand Valuation Breakdown (2 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              {/* Category Asset Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-[#72C98A]" />
                  <h4 className="font-bold text-[#26352D] text-sm">Asset Valuation by Category</h4>
                </div>

                <div className="divide-y divide-[#DCEBE0] border border-[#DCEBE0] rounded-2xl overflow-hidden bg-white text-xs">
                  {valuationReport?.categoryBreakdown && valuationReport.categoryBreakdown.length > 0 ? (
                    valuationReport.categoryBreakdown.map((cat, idx) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-[#F2FAF4]/40 transition-colors">
                        <div>
                          <strong className="text-[#26352D] block">{cat.categoryName}</strong>
                          <span className="text-[11px] text-[#718078]">{cat.units} units stored</span>
                        </div>
                        <div className="text-right">
                          <strong className="font-outfit font-extrabold text-[#26352D] text-sm block">
                            {formatLKR(cat.valuation)}
                          </strong>
                          <span className="text-[10px] text-[#718078]">
                            {valuationReport.totalValuation > 0
                              ? `${((cat.valuation / valuationReport.totalValuation) * 100).toFixed(1)}% of assets`
                              : '0%'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-[#718078] italic">No category assets recorded.</div>
                  )}
                </div>
              </div>

              {/* Brand Asset Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-[#72C98A]" />
                  <h4 className="font-bold text-[#26352D] text-sm">Asset Valuation by Brand Partner</h4>
                </div>

                <div className="divide-y divide-[#DCEBE0] border border-[#DCEBE0] rounded-2xl overflow-hidden bg-white text-xs">
                  {valuationReport?.brandBreakdown && valuationReport.brandBreakdown.length > 0 ? (
                    valuationReport.brandBreakdown.slice(0, 6).map((br, idx) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-[#F2FAF4]/40 transition-colors">
                        <div>
                          <strong className="text-[#26352D] block">{br.brandName}</strong>
                          <span className="text-[11px] text-[#718078]">{br.units} units stored</span>
                        </div>
                        <div className="text-right">
                          <strong className="font-outfit font-extrabold text-[#26352D] text-sm block">
                            {formatLKR(br.valuation)}
                          </strong>
                          <span className="text-[10px] text-[#718078]">
                            {valuationReport.totalValuation > 0
                              ? `${((br.valuation / valuationReport.totalValuation) * 100).toFixed(1)}% of assets`
                              : '0%'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-[#718078] italic">No brand partner assets recorded.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Inventory Integrity Footer */}
            <div className="p-4 rounded-2xl bg-[#DDF3E2]/40 border border-[#BDECCB] flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-[#35A866] shrink-0 mt-0.5" />
              <div className="text-xs text-[#26352D] space-y-0.5">
                <span className="font-bold">Real-time Stock Movement Audit:</span>
                <p className="text-[#718078]">
                  Asset valuation synchronizes live with stock adjustment events, customer checkouts, returns, and write-offs. All valuation figures are authoritative.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
