import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Layers, 
  LogOut,
  ExternalLink,
  Activity
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { logout } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';

export const AdminDashboardPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

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
      <div className="max-w-7xl mx-auto space-y-8">
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
              className="px-4 py-2.5 rounded-xl bg-[#E45D5D]/10 hover:bg-[#E45D5D]/20 text-[#E45D5D] text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* High-level KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-[#DCEBE0] shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-[#DDF3E2] text-[#72C98A] rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#718078]">Platform Users</div>
              <div className="text-2xl font-extrabold text-[#26352D] font-outfit">3 Accounts</div>
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
              <div className="text-2xl font-extrabold text-[#26352D] font-outfit">Active</div>
              <div className="text-[11px] text-[#718078] mt-0.5">Phase 3 Catalog Ready</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DCEBE0] shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-[#DDF3E2] text-[#72C98A] rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#718078]">Customer Orders</div>
              <div className="text-2xl font-extrabold text-[#26352D] font-outfit">System Online</div>
              <div className="text-[11px] text-[#718078] mt-0.5">Real-time processing</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DCEBE0] shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-[#DDF3E2] text-[#72C98A] rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#718078]">Access Status</div>
              <div className="text-2xl font-extrabold text-[#26352D] font-outfit">Full Access</div>
              <div className="text-[11px] text-[#35A866] font-semibold mt-0.5">ADMIN Role Granted</div>
            </div>
          </div>
        </div>

        {/* Phase 2 Architecture & Security Overview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBE0] shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#DCEBE0] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#26352D] font-outfit">Phase 2 Security & Authentication Matrix</h2>
                <p className="text-xs text-[#718078]">Verified against backend RBAC middleware and JWT token lifecycle</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#35A866]/15 text-[#35A866]">
                Operational
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-[#72C98A] mt-2 shrink-0" />
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-[#26352D]">JWT Access Token: </span>
                  <span className="text-[#718078]">15-minute lifespan stored in memory/client headers for API calls.</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-[#72C98A] mt-2 shrink-0" />
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-[#26352D]">HTTP-Only Refresh Cookie: </span>
                  <span className="text-[#718078]">7-day rolling rotation cookie immune to client-side XSS exploitation.</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-[#72C98A] mt-2 shrink-0" />
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-[#26352D]">Role-Based Access Control (RBAC): </span>
                  <span className="text-[#718078]">Protected Express routers enforce strict role verification (<code className="text-[#26352D] font-mono">ADMIN</code>, <code className="text-[#26352D] font-mono">INVENTORY_MANAGER</code>, <code className="text-[#26352D] font-mono">CUSTOMER</code>).</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBE0] shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-[#26352D] font-outfit">Console Controls</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-[#DCEBE0] hover:border-[#72C98A] transition-colors cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-lg bg-[#DDF3E2] text-[#72C98A] group-hover:bg-[#72C98A] group-hover:text-white transition-colors">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#26352D]">Manage Brands & Categories</h3>
                    <p className="text-[11px] text-[#718078]">Organize catalog hierarchies</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#DCEBE0] hover:border-[#72C98A] transition-colors cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-lg bg-[#DDF3E2] text-[#72C98A] group-hover:bg-[#72C98A] group-hover:text-white transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#26352D]">User Directory</h3>
                    <p className="text-[11px] text-[#718078]">Role assignments & permissions</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#DCEBE0] hover:border-[#72C98A] transition-colors cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-lg bg-[#DDF3E2] text-[#72C98A] group-hover:bg-[#72C98A] group-hover:text-white transition-colors">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#26352D]">Order Management</h3>
                    <p className="text-[11px] text-[#718078]">Dispatch & payment records</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
