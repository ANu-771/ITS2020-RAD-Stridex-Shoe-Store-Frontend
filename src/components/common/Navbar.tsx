import { useState } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '../../utils/constants';

export const Navbar: FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#DCEBE0]">
      {/* Top micro-bar in soft mint accent */}
      <div className="bg-[#DDF3E2] py-1.5 px-4 text-center text-xs tracking-wider text-[#26352D] font-medium border-b border-[#DCEBE0]">
        Free express delivery on orders over $120 | 100% Authentic Guaranteed
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex flex-col">
              <span className="font-outfit text-3xl font-extrabold tracking-wider text-[#26352D]">
                {APP_NAME}
                <span className="text-[#72C98A]">.</span>
              </span>
              <span className="text-[10px] tracking-widest text-[#72C98A] font-semibold uppercase -mt-1 hidden sm:block">
                {APP_TAGLINE}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <Link
              to="/"
              className="text-[#26352D] hover:text-[#72C98A] transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/#categories"
              className="text-[#718078] hover:text-[#72C98A] transition-colors duration-200"
            >
              Categories
            </Link>
            <Link
              to="/#featured"
              className="text-[#718078] hover:text-[#72C98A] transition-colors duration-200"
            >
              Featured
            </Link>
            <Link
              to="/#about"
              className="text-[#718078] hover:text-[#72C98A] transition-colors duration-200"
            >
              About
            </Link>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-5">
            <button
              type="button"
              aria-label="Search shoes"
              className="p-2 text-[#26352D] hover:text-[#72C98A] transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              type="button"
              aria-label="Shopping Cart"
              className="relative p-2 text-[#26352D] hover:text-[#72C98A] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#72C98A] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </button>

            <button
              type="button"
              aria-label="User Account"
              className="p-2 text-[#26352D] hover:text-[#72C98A] transition-colors"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#26352D] hover:text-[#72C98A]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-[#DCEBE0] space-y-2 bg-white">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-[#26352D] hover:bg-[#F2FAF4]"
            >
              Home
            </Link>
            <Link
              to="/#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-[#718078] hover:bg-[#F2FAF4]"
            >
              Categories
            </Link>
            <Link
              to="/#featured"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-[#718078] hover:bg-[#F2FAF4]"
            >
              Featured
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};
