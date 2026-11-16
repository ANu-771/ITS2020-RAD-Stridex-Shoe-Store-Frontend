import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { ShoeAvatarIcon } from '../../components/common/ShoeAvatarIcon';
import { adminDashboardService } from '../../services/adminDashboardService';
import type { AdminDashboardMetrics } from '../../services/adminDashboardService';
import { formatLKR } from '../../utils/currency';

interface AdminOverviewPageProps {
  onNavigateTab: (tab: any) => void;
}

export const AdminOverviewPage: FC<AdminOverviewPageProps> = ({ onNavigateTab }) => {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await adminDashboardService.getStats();
        if (res.success) {
          setMetrics(res.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load admin dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-[#DCEBE0]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-white rounded-3xl border border-[#DCEBE0]" />
          <div className="h-80 bg-white rounded-3xl border border-[#DCEBE0]" />
        </div>
      </div>
    );
  }

  if (error || !metrics) {
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
      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Revenue in LKR */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#718078]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-[#DDF3E2] text-[#35A866] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <strong className="font-outfit text-xl sm:text-2xl font-black text-[#26352D] block truncate">
            {formatLKR(metrics.totalRevenue)}
          </strong>
          <span className="text-[10px] text-[#35A866] font-semibold flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Paid Orders</span>
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#718078]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-7 h-7 rounded-lg bg-[#DDF3E2] text-[#72C98A] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <strong className="font-outfit text-2xl font-black text-[#26352D] block">
            {metrics.totalOrders}
          </strong>
          <span className="text-[10px] text-[#718078] block">All-time transactions</span>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#718078]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Customers</span>
            <div className="w-7 h-7 rounded-lg bg-[#DDF3E2] text-[#72C98A] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <strong className="font-outfit text-2xl font-black text-[#26352D] block">
            {metrics.totalCustomers}
          </strong>
          <span className="text-[10px] text-[#718078] block">Registered accounts</span>
        </div>

        {/* Total Catalog Shoes */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#718078]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Catalog Shoes</span>
            <div className="w-7 h-7 rounded-lg bg-[#DDF3E2] text-[#72C98A] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <strong className="font-outfit text-2xl font-black text-[#26352D] block">
            {metrics.totalProducts}
          </strong>
          <span className="text-[10px] text-[#718078] block">Active shoe models</span>
        </div>

        {/* Low-Stock Warning Products */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#718078]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Low Stock</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <strong className="font-outfit text-2xl font-black text-amber-600 block">
            {metrics.lowStockProducts}
          </strong>
          <span className="text-[10px] text-amber-700 font-semibold block">Variants ≤ threshold</span>
        </div>

        {/* Out-of-Stock Warning Products */}
        <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#718078]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Out of Stock</span>
            <div className="w-7 h-7 rounded-lg bg-[#E45D5D]/10 text-[#E45D5D] flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <strong className="font-outfit text-2xl font-black text-[#E45D5D] block">
            {metrics.outOfStockProducts}
          </strong>
          <span className="text-[10px] text-[#E45D5D] font-semibold block">0 units available</span>
        </div>
      </div>

      {/* Quick Actions Action Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#DCEBE0] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-[#26352D] flex items-center space-x-2">
          <ShoeAvatarIcon className="w-4 h-4 text-[#72C98A]" />
          <span>Quick Admin Shortcuts:</span>
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('products')}
            className="px-3.5 py-1.5 bg-[#F2FAF4] hover:bg-[#DDF3E2] text-[#26352D] border border-[#DCEBE0] rounded-xl font-bold transition-colors cursor-pointer"
          >
            + Add New Shoe
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-3.5 py-1.5 bg-[#F2FAF4] hover:bg-[#DDF3E2] text-[#26352D] border border-[#DCEBE0] rounded-xl font-bold transition-colors cursor-pointer"
          >
            Manage Orders
          </button>
          <Link
            to="/inventory"
            className="px-3.5 py-1.5 bg-[#72C98A] hover:bg-[#59B976] text-white rounded-xl font-bold transition-colors cursor-pointer shadow-xs inline-flex items-center space-x-1"
          >
            <span>Stock Adjustment</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => onNavigateTab('coupons')}
            className="px-3.5 py-1.5 bg-[#F2FAF4] hover:bg-[#DDF3E2] text-[#26352D] border border-[#DCEBE0] rounded-xl font-bold transition-colors cursor-pointer"
          >
            Coupons & Vouchers
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="px-3.5 py-1.5 bg-[#F2FAF4] hover:bg-[#DDF3E2] text-[#26352D] border border-[#DCEBE0] rounded-xl font-bold transition-colors cursor-pointer"
          >
            Reports
          </button>
        </div>
      </div>

      {/* Recharts Data Visualizations Grid (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="bg-white p-6 rounded-3xl border border-[#DCEBE0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-outfit font-bold text-lg text-[#26352D]">Revenue Trend (LKR)</h3>
              <p className="text-xs text-[#718078]">Monthly verified Sri Lankan Rupee revenue</p>
            </div>
            <span className="text-xs font-bold text-[#72C98A] bg-[#DDF3E2] px-2.5 py-1 rounded-full">
              LKR Standard
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.monthlySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#72C98A" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#72C98A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBF4EE" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#718078' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: '#718078' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `Rs. ${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any) => [formatLKR(Number(value) || 0), 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #DCEBE0',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#72C98A" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Sales Count Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-[#DCEBE0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-outfit font-bold text-lg text-[#26352D]">Order Volume</h3>
              <p className="text-xs text-[#718078]">Monthly order transactions across Sri Lanka</p>
            </div>
            <span className="text-xs font-bold text-[#26352D] bg-[#F2FAF4] px-2.5 py-1 rounded-full border border-[#DCEBE0]">
              Orders Count
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.monthlySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBF4EE" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#718078' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#718078' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value: any) => [`${value} Orders`, 'Volume']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #DCEBE0',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                />
                <Bar dataKey="orders" fill="#35A866" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Orders & Top-Selling Shoes (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Table */}
        <div className="bg-white p-6 rounded-3xl border border-[#DCEBE0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-outfit font-bold text-lg text-[#26352D]">Recent Customer Orders</h3>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-[#72C98A] hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {metrics.recentOrders.length === 0 ? (
            <p className="text-xs text-[#718078] py-8 text-center">No orders recorded yet.</p>
          ) : (
            <div className="divide-y divide-[#DCEBE0] text-xs">
              {metrics.recentOrders.map((o) => (
                <div key={o.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <strong className="font-mono text-[#26352D] font-bold">{o.orderNumber}</strong>
                      <span className="text-[10px] text-[#718078]">• {o.customerName}</span>
                    </div>
                    <span className="text-[10px] text-[#718078] block">
                      {new Date(o.date).toLocaleDateString()} • {o.itemsCount} {o.itemsCount === 1 ? 'pair' : 'pairs'}
                    </span>
                  </div>

                  <div className="text-right space-y-1">
                    <strong className="font-outfit font-extrabold text-[#26352D] block">
                      {formatLKR(o.finalTotal)}
                    </strong>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        o.orderStatus === 'CONFIRMED' || o.orderStatus === 'DELIVERED'
                          ? 'bg-[#DDF3E2] text-[#35A866]'
                          : o.orderStatus === 'CANCELLED'
                          ? 'bg-[#E45D5D]/10 text-[#E45D5D]'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {o.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top-Selling Footwear Models */}
        <div className="bg-white p-6 rounded-3xl border border-[#DCEBE0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-outfit font-bold text-lg text-[#26352D]">Top-Selling Footwear</h3>
            <span className="text-xs text-[#718078]">By units sold</span>
          </div>

          {metrics.topSellingShoes.length === 0 ? (
            <p className="text-xs text-[#718078] py-8 text-center">No shoe sales recorded yet.</p>
          ) : (
            <div className="divide-y divide-[#DCEBE0] text-xs">
              {metrics.topSellingShoes.map((shoe, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-xs text-[#718078] w-4">{idx + 1}</span>
                    <div className="w-12 h-12 bg-[#F2FAF4] rounded-xl border border-[#DCEBE0] p-1 shrink-0 flex items-center justify-center">
                      <img src={shoe.image} alt={shoe.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-outfit font-bold text-[#26352D] text-xs">{shoe.name}</h4>
                      <span className="text-[10px] text-[#718078] block">{shoe.pairsSold} pairs sold</span>
                    </div>
                  </div>

                  <strong className="font-outfit font-extrabold text-[#26352D] text-sm">
                    {formatLKR(shoe.revenue)}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Low-Stock Alerts Row */}
      {metrics.lowStockAlerts.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h3 className="font-outfit font-bold text-lg text-[#26352D]">
                Warehouse Low-Stock Warnings ({metrics.lowStockAlerts.length})
              </h3>
            </div>
            <Link
              to="/inventory"
              className="text-xs font-bold text-[#72C98A] hover:underline flex items-center space-x-1"
            >
              <span>Restock in Inventory Manager</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {metrics.lowStockAlerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                  alert.severity === 'OUT_OF_STOCK'
                    ? 'bg-[#E45D5D]/5 border-[#E45D5D]/30'
                    : 'bg-amber-50/50 border-amber-200'
                }`}
              >
                <div className="space-y-0.5">
                  <strong className="font-outfit font-bold text-[#26352D] block truncate max-w-[160px]">
                    {alert.productName}
                  </strong>
                  <span className="text-[10px] text-[#718078] block">
                    Size: <strong>EU {alert.size}</strong> • Color: <strong>{alert.color}</strong>
                  </span>
                  <span className="text-[10px] font-mono text-[#718078] block">
                    SKU: {alert.SKU}
                  </span>
                </div>

                <div className="text-right space-y-1">
                  <span
                    className={`font-black font-outfit text-base block ${
                      alert.severity === 'OUT_OF_STOCK' ? 'text-[#E45D5D]' : 'text-amber-600'
                    }`}
                  >
                    {alert.stockQuantity} pairs
                  </span>
                  <span className="text-[9px] text-[#718078] block">Threshold: {alert.threshold}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
