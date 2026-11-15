import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Boxes, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  History,
  AlertTriangle,
  LayoutDashboard
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { logout } from '../../store/slices/authSlice';
import { resetCartState } from '../../store/slices/cartSlice';
import { resetWishlistState } from '../../store/slices/wishlistSlice';
import { authService } from '../../services/authService';
import { InventoryDashboardOverview } from '../inventory/InventoryDashboardOverview';
import { InventoryVariantsTable } from '../inventory/InventoryVariantsTable';
import { StockMovementHistory } from '../inventory/StockMovementHistory';
import { LowStockReportView } from '../inventory/LowStockReportView';

type InventoryTab = 'dashboard' | 'variants' | 'movements' | 'low-stock';

export const InventoryDashboardPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);

  const initialTab = (searchParams.get('tab') as InventoryTab) || 'dashboard';
  const [activeTab, setActiveTab] = useState<InventoryTab>(
    ['dashboard', 'variants', 'movements', 'low-stock'].includes(initialTab) ? initialTab : 'dashboard'
  );

  useEffect(() => {
    const tab = searchParams.get('tab') as InventoryTab;
    if (tab && ['dashboard', 'variants', 'movements', 'low-stock'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: InventoryTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      dispatch(logout());
      dispatch(resetCartState());
      dispatch(resetWishlistState());
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F2FAF4] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBE0] shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DDF3E2] text-[#26352D] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#72C98A]" />
              <span>Inventory Portal Authorization Verified</span>
            </div>
            <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-[#26352D]">
              Inventory Manager: {user?.fullName || 'Stock Specialist'}
            </h1>
            <p className="text-sm text-[#718078]">
              STRIDEX Warehouse Stock & Variant Ledger • Signed in as <strong className="text-[#26352D]">{user?.email}</strong>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] hover:bg-[#DDF3E2] text-[#26352D] text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <span>Storefront View</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#718078]" />
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-[#E45D5D]/10 hover:bg-[#E45D5D]/20 text-[#E45D5D] text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-white p-2 rounded-2xl border border-[#DCEBE0] shadow-sm flex flex-wrap gap-2 text-xs font-semibold">
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#72C98A] text-white shadow-sm'
                : 'text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => handleTabChange('variants')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'variants'
                ? 'bg-[#72C98A] text-white shadow-sm'
                : 'text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4]'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Variant Inventory</span>
          </button>

          <button
            onClick={() => handleTabChange('movements')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'movements'
                ? 'bg-[#72C98A] text-white shadow-sm'
                : 'text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Stock Movements Ledger</span>
          </button>

          <button
            onClick={() => handleTabChange('low-stock')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'low-stock'
                ? 'bg-[#72C98A] text-white shadow-sm'
                : 'text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4]'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Low-Stock Alerts</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'dashboard' && <InventoryDashboardOverview onNavigateTab={handleTabChange} />}
        {activeTab === 'variants' && <InventoryVariantsTable />}
        {activeTab === 'movements' && <StockMovementHistory />}
        {activeTab === 'low-stock' && <LowStockReportView />}
      </div>
    </div>
  );
};
