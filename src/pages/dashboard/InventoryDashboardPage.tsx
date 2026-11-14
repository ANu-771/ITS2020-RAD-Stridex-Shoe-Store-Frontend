import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Boxes, 
  PackageCheck, 
  Palette, 
  Ruler, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  Layers,
  RefreshCw,
  Search
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { logout } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';
import { productService } from '../../services/productService';
import { VariantManagerModal } from '../admin/VariantManagerModal';
import { formatLKR } from '../../utils/currency';
import type { Product } from '../../types';

export const InventoryDashboardPage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await productService.getAll({ search: search.trim() || undefined, limit: 50 });
      setProducts(res.data);
    } catch {
      // Ignore network errors
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

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

  const totalStockAcrossAll = products.reduce((acc, p) => acc + (p.totalStock || 0), 0);
  const totalVariantsAcrossAll = products.reduce((acc, p) => acc + (p.variantCount || 0), 0);

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
              className="px-4 py-2.5 rounded-xl bg-[#E45D5D]/10 hover:bg-[#E45D5D]/20 text-[#E45D5D] text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer"
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
              <div className="text-xs font-medium text-[#718078]">Total Pairs in Stock</div>
              <div className="text-2xl font-extrabold text-[#26352D] font-outfit">{totalStockAcrossAll} Units</div>
              <div className="text-[11px] text-[#35A866] font-medium mt-0.5">MongoDB Atlas Synced</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DCEBE0] shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-[#DDF3E2] text-[#72C98A] rounded-xl">
              <Ruler className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#718078]">Size Variants</div>
              <div className="text-2xl font-extrabold text-[#26352D] font-outfit">{totalVariantsAcrossAll} SKUs</div>
              <div className="text-[11px] text-[#718078] mt-0.5">EU 38 - 46 Grid</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DCEBE0] shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-[#DDF3E2] text-[#72C98A] rounded-xl">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#718078]">Shoe Models</div>
              <div className="text-2xl font-extrabold text-[#26352D] font-outfit">{products.length} Models</div>
              <div className="text-[11px] text-[#718078] mt-0.5">Active Catalog</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#DCEBE0] shadow-sm flex items-center space-x-4">
            <div className="p-3.5 bg-[#DDF3E2] text-[#72C98A] rounded-xl">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#718078]">Inventory Health</div>
              <div className="text-2xl font-extrabold text-[#26352D] font-outfit">Optimal</div>
              <div className="text-[11px] text-[#35A866] font-semibold mt-0.5">Thresholds Stable</div>
            </div>
          </div>
        </div>

        {/* Search & Stock Management Table */}
        <div className="bg-white rounded-3xl border border-[#DCEBE0] shadow-sm p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-outfit text-xl font-bold text-[#26352D]">
                Shoe Stock & Sizing Matrix
              </h2>
              <p className="text-xs text-[#718078]">
                Adjust stock quantities and add sizes/colors for warehouse replenishment
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#718078] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter shoes..."
                  className="pl-9 pr-3 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/50 text-xs text-[#26352D] focus:outline-none focus:border-[#72C98A]"
                />
              </div>
              <button
                onClick={fetchProducts}
                className="p-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] hover:bg-[#DDF3E2] text-[#26352D] transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-xs text-[#718078]">Loading shoe inventory...</div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[#DCEBE0]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F2FAF4] text-[#718078] font-semibold border-b border-[#DCEBE0]">
                  <tr>
                    <th className="px-5 py-3.5">Shoe Item</th>
                    <th className="px-5 py-3.5">Retail Price (LKR)</th>
                    <th className="px-5 py-3.5">Available Sizes</th>
                    <th className="px-5 py-3.5">Stock Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCEBE0]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F2FAF4]/50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#26352D]">{p.name}</td>
                      <td className="px-5 py-3.5 font-semibold text-[#26352D]">
                        {formatLKR(p.discountPrice > 0 ? p.discountPrice : p.basePrice)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {p.availableSizes && p.availableSizes.length > 0 ? (
                            p.availableSizes.map((s, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-[#DDF3E2] text-[10px] font-bold text-[#26352D]"
                              >
                                EU {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-[#718078]">No variants</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            (p.totalStock || 0) > 10
                              ? 'bg-[#35A866]/15 text-[#35A866]'
                              : (p.totalStock || 0) > 0
                              ? 'bg-[#F2B84B]/20 text-[#26352D]'
                              : 'bg-[#E45D5D]/15 text-[#E45D5D]'
                          }`}
                        >
                          {p.totalStock || 0} pairs
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            setIsVariantModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white font-semibold transition-colors flex items-center space-x-1.5 ml-auto cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Manage Variants</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Sizing & Stock Variant Manager Modal */}
      <VariantManagerModal
        isOpen={isVariantModalOpen}
        product={selectedProduct}
        onClose={() => setIsVariantModalOpen(false)}
        onVariantsUpdated={fetchProducts}
      />
    </div>
  );
};
