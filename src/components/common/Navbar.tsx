import { useState } from 'react';
import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck, 
  Boxes 
} from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '../../utils/constants';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { logout } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';

export const Navbar: FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Proceed even if network call fails
    } finally {
      dispatch(logout());
      setUserDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate('/');
    }
  };

  return (
    <>
      {/* Top subtle announcement micro-bar */}
      <div className="bg-[#DDF3E2] py-1.5 px-4 text-center text-xs tracking-wider text-[#26352D] font-medium border-b border-[#DCEBE0]">
        Free island-wide express delivery on orders over Rs. 15,000.00 | 100% Authentic Guaranteed
      </div>

      {/* Floating White Rounded Navigation Header */}
      <header className="sticky top-2 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-2 w-full">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#DCEBE0] shadow-sm px-6 h-18 sm:h-20 flex items-center justify-between transition-all duration-300">
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
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link
              to="/"
              className="text-[#26352D] hover:text-[#72C98A] relative py-1 transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#72C98A] after:rounded-full"
            >
              Home
            </Link>
            <Link
              to="/#categories"
              className="text-[#718078] hover:text-[#72C98A] py-1 transition-colors duration-200"
            >
              Categories
            </Link>
            <Link
              to="/#featured"
              className="text-[#718078] hover:text-[#72C98A] py-1 transition-colors duration-200"
            >
              Featured
            </Link>
            <Link
              to="/#offers"
              className="text-[#718078] hover:text-[#72C98A] py-1 transition-colors duration-200"
            >
              Offers
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

          {/* Right: Actions, Cart & Auth */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              type="button"
              aria-label="Search shoes"
              className="p-2 text-[#26352D] hover:text-[#72C98A] hover:bg-[#F2FAF4] rounded-full transition-all"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              type="button"
              aria-label="Shopping Cart"
              className="relative p-2 text-[#26352D] hover:text-[#72C98A] hover:bg-[#F2FAF4] rounded-full transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#72C98A] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                0
              </span>
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
              className="md:hidden p-2 text-[#26352D] hover:text-[#72C98A] rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 p-4 bg-white/98 backdrop-blur-md rounded-2xl border border-[#DCEBE0] shadow-lg space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-[#26352D] hover:bg-[#F2FAF4]"
            >
              Home
            </Link>
            <Link
              to="/#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-[#718078] hover:bg-[#F2FAF4]"
            >
              Categories
            </Link>
            <Link
              to="/#featured"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-[#718078] hover:bg-[#F2FAF4]"
            >
              Featured
            </Link>

            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-[#72C98A] hover:bg-[#F2FAF4]"
              >
                Admin Dashboard
              </Link>
            )}

            {isAuthenticated && user?.role === 'INVENTORY_MANAGER' && (
              <Link
                to="/inventory"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-base font-semibold text-[#72C98A] hover:bg-[#F2FAF4]"
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
