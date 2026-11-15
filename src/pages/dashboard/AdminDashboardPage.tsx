import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  ShoppingBag, 
  Layers, 
  LogOut,
  ExternalLink,
  Tag,
  LayoutDashboard,
  Star,
  TicketPercent,
  FileText
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { logout } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import { AdminOverviewPage } from '../admin/AdminOverviewPage';
import { AdminProductsPage } from '../admin/AdminProductsPage';
import { AdminCategoriesPage } from '../admin/AdminCategoriesPage';
import { AdminBrandsPage } from '../admin/AdminBrandsPage';
import { AdminOrdersPage } from '../admin/AdminOrdersPage';
import { AdminCustomersPage } from '../admin/AdminCustomersPage';
import { AdminReviewsPage } from '../admin/AdminReviewsPage';
import { AdminCouponsPage } from '../admin/AdminCouponsPage';
import { AdminReportsPage } from '../admin/AdminReportsPage';

type AdminTab = 
  | 'overview'
  | 'products'
  | 'categories'
  | 'brands'
  | 'orders'
  | 'customers'
  | 'reviews'
  | 'coupons'
  | 'reports';

const VALID_TABS: AdminTab[] = [
  'overview',
  'products',
  'categories',
  'brands',
  'orders',
  'customers',
  'reviews',
  'coupons',
  'reports'
];

export const AdminDashboardPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);

  const initialTab = (searchParams.get('tab') as AdminTab) || 'overview';
  const [activeTab, setActiveTab] = useState<AdminTab>(
    VALID_TABS.includes(initialTab) ? initialTab : 'overview'
  );

  useEffect(() => {
    const tab = searchParams.get('tab') as AdminTab;
    if (tab && VALID_TABS.includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: AdminTab) => {
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
              <span>Admin Portal Authorization Verified</span>
            </div>
            <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-[#26352D]">
              Welcome, {user?.fullName || 'Administrator'}
            </h1>
            <p className="text-sm text-[#718078]">
              STRIDEX Administration Console • Signed in as <strong className="text-[#26352D]">{user?.email}</strong>
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
            onClick={() => handleTabChange('overview')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#72C98A] text-white shadow-sm'
                : 'text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => handleTabChange('products')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#72C98A] text-white shadow-sm'
                : 'text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products</span>
          </button>

          <button
            onClick={() => handleTabChange('categories')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-[#72C98A] text-white shadow-sm'
                : 'text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Categories</span>
          </button>

          <button
            onClick={() => handleTabChange('brands')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'brands'
                ? 'bg-[#72C98A] text-white shadow-sm'
                : 'text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4]'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Brands</span>
          </button>

          <button
            onClick={() => handleTabChange('orders')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#72C98A] text-white shadow-sm'
                : 'text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders</span>
          </button>

          <button
            onClick={() => handleTabChange('customers')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-[#72C98A] text-white shadow-sm'
                : 'text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers</span>
          </button>

          <button
            onClick={() => handleTabChange('reviews')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-[#72C98A] text-white shadow-sm'
                : 'text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4]'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews</span>
          </button>

          <button
            onClick={() => handleTabChange('coupons')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'coupons'
                ? 'bg-[#72C98A] text-white shadow-sm'
                : 'text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4]'
            }`}
          >
            <TicketPercent className="w-4 h-4" />
            <span>Coupons</span>
          </button>

          <button
            onClick={() => handleTabChange('reports')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-[#72C98A] text-white shadow-sm'
                : 'text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Reports</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'overview' && <AdminOverviewPage onNavigateTab={handleTabChange} />}
        {activeTab === 'products' && <AdminProductsPage />}
        {activeTab === 'categories' && <AdminCategoriesPage />}
        {activeTab === 'brands' && <AdminBrandsPage />}
        {activeTab === 'orders' && <AdminOrdersPage />}
        {activeTab === 'customers' && <AdminCustomersPage />}
        {activeTab === 'reviews' && <AdminReviewsPage />}
        {activeTab === 'coupons' && <AdminCouponsPage />}
        {activeTab === 'reports' && <AdminReportsPage />}
      </div>
    </div>
  );
};
