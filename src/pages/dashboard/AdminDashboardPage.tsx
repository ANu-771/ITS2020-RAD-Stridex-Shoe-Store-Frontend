import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Layers, 
  LogOut,
  ExternalLink,
  Activity,
  Tag,
  LayoutDashboard
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { logout } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import { AdminProductsPage } from '../admin/AdminProductsPage';
import { AdminCategoriesPage } from '../admin/AdminCategoriesPage';
import { AdminBrandsPage } from '../admin/AdminBrandsPage';

export const AdminDashboardPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);

  const initialTab = searchParams.get('tab') || 'products';
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'brands' | 'overview'>(
    initialTab as any
  );

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['products', 'categories', 'brands', 'overview'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'products' | 'categories' | 'brands' | 'overview') => {
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
            onClick={() => handleTabChange('products')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#72C98A] text-white shadow-sm'
                : 'text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Shoe Products</span>
          </button>

          <button
            onClick={() => handleTabChange('categories')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
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
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'brands'
                ? 'bg-[#72C98A] text-white shadow-sm'
                : 'text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4]'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Brand Partners</span>
          </button>

          <button
            onClick={() => handleTabChange('overview')}
            className={`px-5 py-2.5 rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#72C98A] text-white shadow-sm'
                : 'text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview & Security</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'products' && <AdminProductsPage />}
        {activeTab === 'categories' && <AdminCategoriesPage />}
        {activeTab === 'brands' && <AdminBrandsPage />}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* High-level KPI Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-[#DCEBE0] shadow-sm flex items-center space-x-4">
                <div className="p-3.5 bg-[#DDF3E2] text-[#72C98A] rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-medium text-[#718078]">Platform Accounts</div>
                  <div className="text-2xl font-extrabold text-[#26352D] font-outfit">3 Users</div>
                  <div className="text-[11px] text-[#35A866] font-medium flex items-center space-x-1 mt-0.5">
                    <Activity className="w-3 h-3" />
                    <span>MongoDB Atlas Synced</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#DCEBE0] shadow-sm flex items-center space-x-4">
                <div className="p-3.5 bg-[#DDF3E2] text-[#72C98A] rounded-xl">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-medium text-[#718078]">Catalog Shoes</div>
                  <div className="text-2xl font-extrabold text-[#26352D] font-outfit">5 Models</div>
                  <div className="text-[11px] text-[#35A866] font-semibold mt-0.5">Phase 3 Live in Atlas</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#DCEBE0] shadow-sm flex items-center space-x-4">
                <div className="p-3.5 bg-[#DDF3E2] text-[#72C98A] rounded-xl">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-medium text-[#718078]">Currency Standard</div>
                  <div className="text-2xl font-extrabold text-[#26352D] font-outfit">LKR (Rs.)</div>
                  <div className="text-[11px] text-[#35A866] font-medium mt-0.5">Sri Lankan Rupees</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#DCEBE0] shadow-sm flex items-center space-x-4">
                <div className="p-3.5 bg-[#DDF3E2] text-[#72C98A] rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-medium text-[#718078]">Access Tier</div>
                  <div className="text-2xl font-extrabold text-[#26352D] font-outfit">ADMIN</div>
                  <div className="text-[11px] text-[#35A866] font-semibold mt-0.5">Full Clearance</div>
                </div>
              </div>
            </div>

            {/* Architecture & Security Matrix */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBE0] shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-[#DCEBE0] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#26352D] font-outfit">
                    Phase 3 Product Management Architecture & Matrix
                  </h2>
                  <p className="text-xs text-[#718078]">
                    Mongoose schemas with strict references: Category & Brand, Product with LKR numeric values, and separate ProductVariant models
                  </p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#35A866]/15 text-[#35A866]">
                  Active & Verified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1.5">
                  <h3 className="font-bold text-[#26352D] text-xs">Categories & Brands</h3>
                  <p className="text-[11px] text-[#718078] leading-relaxed">
                    Full CRUD support with unique slugs, image/logo media assets, active toggles, and relational product counts.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1.5">
                  <h3 className="font-bold text-[#26352D] text-xs">Product Catalog (LKR)</h3>
                  <p className="text-[11px] text-[#718078] leading-relaxed">
                    Numeric base and discount prices in Sri Lankan Rupees, populated references, search, filtering, and pagination.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1.5">
                  <h3 className="font-bold text-[#26352D] text-xs">Size & Color Variants</h3>
                  <p className="text-[11px] text-[#718078] leading-relaxed">
                    Dedicated SKU tracking with composite indexes preventing duplicate size-color variants for the same shoe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
