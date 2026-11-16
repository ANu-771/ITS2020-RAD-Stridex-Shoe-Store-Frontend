import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck, 
  Boxes,
  Heart,
  Package,
  Gift
} from 'lucide-react';
import { ShoeAvatarIcon } from './ShoeAvatarIcon';
import { APP_NAME, APP_TAGLINE } from '../../utils/constants';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { logout } from '../../store/slices/authSlice';
import { toggleCartOpen, resetCartState } from '../../store/slices/cartSlice';
import { resetWishlistState } from '../../store/slices/wishlistSlice';
import { authService } from '../../services/authService';

export const Navbar: FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalWishlistCount = wishlistItems.length;

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Proceed even if network call fails
    } finally {
      dispatch(logout());
      dispatch(resetCartState());
      dispatch(resetWishlistState());
      setUserDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate('/');
    }
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const isActiveRoute = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top subtle announcement micro-bar */}
      <div className="bg-[#DDF3E2] py-1.5 px-4 text-center text-xs tracking-wider text-[#26352D] font-medium border-b border-[#DCEBE0]">
        Free island-wide express delivery on orders over Rs. 15,000.00 | 100% Authentic Footwear
      </div>

      {/* Floating White Rounded Navigation Header */}
      <header className="sticky top-2 z-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-2 w-full">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#DCEBE0] shadow-sm px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between transition-all duration-300">
          {/* Left: Brand Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex flex-col group">
              <span className="font-outfit text-2xl sm:text-3xl font-extrabold tracking-wider text-[#26352D] transition-colors">
                {APP_NAME}
                <span className="text-[#72C98A] transition-transform duration-300 inline-block group-hover:scale-125">.</span>
              </span>
              <span className="text-[9px] tracking-widest text-[#72C98A] font-semibold uppercase -mt-1 hidden sm:block">
                {APP_TAGLINE}
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium">
            <Link
              to="/"
              className={`py-1 transition-colors duration-200 relative ${
                isActiveRoute('/') 
                  ? 'text-[#26352D] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#72C98A] after:rounded-full' 
                  : 'text-[#718078] hover:text-[#72C98A]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`py-1 transition-colors duration-200 relative ${
                isActiveRoute('/shop') 
                  ? 'text-[#26352D] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#72C98A] after:rounded-full' 
                  : 'text-[#718078] hover:text-[#72C98A]'
              }`}
            >
              Shop All
            </Link>
            <Link
              to="/brands"
              className={`py-1 transition-colors duration-200 relative ${
                isActiveRoute('/brands') 
                  ? 'text-[#26352D] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#72C98A] after:rounded-full' 
                  : 'text-[#718078] hover:text-[#72C98A]'
              }`}
            >
              Brands
            </Link>
            <Link
              to="/gift-vouchers"
              className={`py-1 transition-colors duration-200 relative ${
                isActiveRoute('/gift-vouchers') 
                  ? 'text-[#26352D] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#72C98A] after:rounded-full' 
                  : 'text-[#718078] hover:text-[#72C98A]'
              }`}
            >
              Gift Vouchers
            </Link>
            <Link
              to="/about"
              className={`py-1 transition-colors duration-200 relative ${
                isActiveRoute('/about') 
                  ? 'text-[#26352D] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#72C98A] after:rounded-full' 
                  : 'text-[#718078] hover:text-[#72C98A]'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`py-1 transition-colors duration-200 relative ${
                isActiveRoute('/contact') 
                  ? 'text-[#26352D] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#72C98A] after:rounded-full' 
                  : 'text-[#718078] hover:text-[#72C98A]'
              }`}
            >
              Contact
            </Link>

            {/* Quick Portal Shortcuts for Admin or Inventory Manager */}
            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#DDF3E2] text-[#26352D] text-xs font-semibold hover:bg-[#BDECCB] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#72C98A]" />
                <span>Admin Console</span>
              </Link>
            )}

            {isAuthenticated && user?.role === 'INVENTORY_MANAGER' && (
              <Link
                to="/inventory"
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#DDF3E2] text-[#26352D] text-xs font-semibold hover:bg-[#BDECCB] transition-colors"
              >
                <Boxes className="w-3.5 h-3.5 text-[#72C98A]" />
                <span>Stock Console</span>
              </Link>
            )}
          </nav>

          {/* Right: Actions, Search, Wishlist, Cart & Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Inline Quick Search Button/Form */}
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative flex items-center animate-in fade-in zoom-in-95 duration-200">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shoes, brands..."
                  className="w-40 sm:w-60 px-3.5 py-1.5 pr-8 text-xs rounded-xl bg-[#F2FAF4] border border-[#72C98A] focus:outline-none focus:ring-2 focus:ring-[#72C98A]/30 text-[#26352D] placeholder-[#718078]"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 text-[#718078] hover:text-[#26352D]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search shoes"
                className="p-2 text-[#26352D] hover:text-[#72C98A] hover:bg-[#F2FAF4] rounded-full transition-all"
                title="Search collection"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Wishlist Link with Badge */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative p-2 text-[#26352D] hover:text-[#72C98A] hover:bg-[#F2FAF4] rounded-full transition-all"
              title="Saved Shoes"
            >
              <Heart className="w-5 h-5" />
              {totalWishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#72C98A] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <button
              type="button"
              onClick={() => dispatch(toggleCartOpen())}
              aria-label="Shopping Cart"
              className="relative p-2 text-[#26352D] hover:text-[#72C98A] hover:bg-[#F2FAF4] rounded-full transition-all cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#72C98A] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs animate-in zoom-in duration-200">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Area */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-label="User Account Menu"
                  className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full border border-[#DCEBE0] bg-[#F2FAF4] hover:bg-[#DDF3E2] transition-colors text-xs font-medium text-[#26352D]"
                >
                  <div className="w-6 h-6 rounded-full bg-[#72C98A] text-white flex items-center justify-center text-[10px] font-bold uppercase">
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="hidden sm:inline font-semibold">{user.fullName.split(' ')[0]}</span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#DCEBE0] py-2 z-50 text-xs"
                  >
                    <div className="px-4 py-2 border-b border-[#DCEBE0]">
                      <p className="font-semibold text-[#26352D] truncate">{user.fullName}</p>
                      <p className="text-[11px] text-[#718078] truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#DDF3E2] text-[#26352D] uppercase">
                        {user.role}
                      </span>
                    </div>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2.5 text-[#26352D] hover:bg-[#F2FAF4] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#72C98A]" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    {user.role === 'INVENTORY_MANAGER' && (
                      <Link
                        to="/inventory"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2.5 text-[#26352D] hover:bg-[#F2FAF4] transition-colors"
                      >
                        <Boxes className="w-4 h-4 text-[#72C98A]" />
                        <span>Inventory Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2.5 text-[#26352D] hover:bg-[#F2FAF4] transition-colors"
                    >
                      <Package className="w-4 h-4 text-[#72C98A]" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/my-vouchers"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2.5 text-[#26352D] hover:bg-[#F2FAF4] transition-colors"
                    >
                      <Gift className="w-4 h-4 text-[#72C98A]" />
                      <span>My Gift Vouchers</span>
                    </Link>

                    <Link
                      to="/gift-vouchers"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2.5 text-[#26352D] hover:bg-[#F2FAF4] transition-colors"
                    >
                      <ShoeAvatarIcon className="w-4 h-4 text-[#72C98A]" />
                      <span>Buy Gift Voucher</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2.5 text-[#26352D] hover:bg-[#F2FAF4] transition-colors"
                    >
                      <Heart className="w-4 h-4 text-[#72C98A]" />
                      <span>Saved Wishlist</span>
                    </Link>

                    <Link
                      to="/shop"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2.5 text-[#26352D] hover:bg-[#F2FAF4] transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#72C98A]" />
                      <span>Browse Footwear</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-[#E45D5D] hover:bg-[#E45D5D]/10 transition-colors border-t border-[#DCEBE0]"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#26352D] hover:text-[#72C98A] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#72C98A] hover:bg-[#59B976] shadow-sm transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#26352D] hover:text-[#72C98A] rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 bg-white/98 backdrop-blur-md rounded-2xl border border-[#DCEBE0] shadow-lg space-y-2">
            {/* Search Input for Mobile */}
            <form onSubmit={handleSearchSubmit} className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search footwear collection..."
                  className="w-full px-3.5 py-2 pl-9 text-xs rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] focus:border-[#72C98A] focus:outline-none text-[#26352D]"
                />
                <Search className="w-4 h-4 text-[#718078] absolute left-3 top-2.5" />
              </div>
            </form>

            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-[#26352D] hover:bg-[#F2FAF4]"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-[#26352D] hover:bg-[#F2FAF4]"
            >
              Shop All Footwear
            </Link>
            <Link
              to="/brands"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-[#26352D] hover:bg-[#F2FAF4]"
            >
              Featured Brands
            </Link>
            <Link
              to="/gift-vouchers"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-[#26352D] hover:bg-[#F2FAF4]"
            >
              Gift Vouchers
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-[#26352D] hover:bg-[#F2FAF4]"
            >
              About STRIDEX
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-[#26352D] hover:bg-[#F2FAF4]"
            >
              Saved Wishlist ({totalWishlistCount})
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-[#26352D] hover:bg-[#F2FAF4]"
                >
                  My Orders
                </Link>
                <Link
                  to="/my-vouchers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-[#26352D] hover:bg-[#F2FAF4]"
                >
                  My Gift Vouchers
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#72C98A] hover:bg-[#F2FAF4]"
              >
                Admin Dashboard
              </Link>
            )}

            {isAuthenticated && user?.role === 'INVENTORY_MANAGER' && (
              <Link
                to="/inventory"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#72C98A] hover:bg-[#F2FAF4]"
              >
                Inventory Dashboard
              </Link>
            )}

            <div className="pt-2 border-t border-[#DCEBE0]">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="px-3 text-xs text-[#718078]">
                    Signed in as <strong className="text-[#26352D]">{user.email}</strong> ({user.role})
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-[#E45D5D] hover:bg-[#E45D5D]/10"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 rounded-xl border border-[#DCEBE0] text-sm font-medium text-[#26352D]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 rounded-xl bg-[#72C98A] text-sm font-medium text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
