import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Boxes, 
  PackageCheck, 
  AlertTriangle, 
  Palette, 
  Ruler, 
  LogOut, 
  ExternalLink,
  ShieldCheck 
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { logout } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';

export const InventoryDashboardPage: FC = () => {
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
              <span>Inventory Portal Authorization Verified</span>
            </div>
            <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-[#26352D]">
              Inventory Manager: {user?.fullName || 'Stock Specialist'}
            </h1>
            <p className="text-sm text-[#718078]">
              STRIDEX Stock Management & Size-Color Matrix • Signed in as <strong className="text-[#26352D]">{user?.email}</strong>
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

        {/* High-level Stock KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-[#DCEBE0] shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-[#DDF3E2] text-[#72C98A] rounded-xl">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#718078]">Stock Health</div>
              <div className="text-2xl font-extrabold text-[#26352D] font-outfit">100%</div>
              <div className="text-[11px] text-[#35A866] font-medium mt-0.5">All Warehouses Active</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DCEBE0] shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-[#DDF3E2] text-[#72C98A] rounded-xl">
              <Ruler className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#718078]">Size Variants</div>
              <div className="text-2xl font-extrabold text-[#26352D] font-outfit">EU 38 - 46</div>
              <div className="text-[11px] text-[#718078] mt-0.5">Standard Size Matrix</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DCEBE0] shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-[#DDF3E2] text-[#72C98A] rounded-xl">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#718078]">Colorways</div>
              <div className="text-2xl font-extrabold text-[#26352D] font-outfit">Multi-Hue</div>
              <div className="text-[11px] text-[#718078] mt-0.5">Dynamic Color Palette</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DCEBE0] shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-[#DDF3E2] text-[#72C98A] rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#718078]">Low Stock Alerts</div>
              <div className="text-2xl font-extrabold text-[#26352D] font-outfit">0</div>
              <div className="text-[11px] text-[#35A866] font-semibold mt-0.5">Thresholds Stable</div>
            </div>
          </div>
        </div>

        {/* Inventory Module Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBE0] shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#DCEBE0] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#26352D] font-outfit">Inventory Manager Responsibilities</h2>
                <p className="text-xs text-[#718078]">IJSE RAD Coursework Specification ITS2020</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#72C98A]/20 text-[#26352D]">
                INVENTORY_MANAGER
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] flex items-start space-x-3">
                <PackageCheck className="w-5 h-5 text-[#72C98A] mt-0.5 shrink-0" />
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-[#26352D]">Stock Tracking & Quantities: </span>
                  <span className="text-[#718078]">Maintain SKU counts across all size/color combinations.</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] flex items-start space-x-3">
                <Ruler className="w-5 h-5 text-[#72C98A] mt-0.5 shrink-0" />
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-[#26352D]">Size Breakdown Configuration: </span>
                  <span className="text-[#718078]">Support half and full sizing increments (US / UK / EU standards).</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] flex items-start space-x-3">
                <Palette className="w-5 h-5 text-[#72C98A] mt-0.5 shrink-0" />
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-[#26352D]">Color Variant Attributes: </span>
                  <span className="text-[#718078]">Sync hex values and visual color indicators for catalog display.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBE0] shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-[#26352D] font-outfit">Inventory Workflows</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-[#DCEBE0] hover:border-[#72C98A] transition-colors cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-lg bg-[#DDF3E2] text-[#72C98A] group-hover:bg-[#72C98A] group-hover:text-white transition-colors">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#26352D]">Stock Adjustments</h3>
                    <p className="text-[11px] text-[#718078]">Add or decrement warehouse units</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#DCEBE0] hover:border-[#72C98A] transition-colors cursor-pointer group">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-lg bg-[#DDF3E2] text-[#72C98A] group-hover:bg-[#72C98A] group-hover:text-white transition-colors">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#26352D]">Low Stock Report</h3>
                    <p className="text-[11px] text-[#718078]">Replenishment warnings</p>
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
