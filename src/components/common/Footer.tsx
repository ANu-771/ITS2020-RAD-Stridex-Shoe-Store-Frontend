import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, APP_TAGLINE } from '../../utils/constants';
import { ShieldCheck, Truck, RefreshCw, Headphones, MapPin, Phone, Mail } from 'lucide-react';
import stridexStudioPortrait from '../../assets/STRIDEX Studio Sneaker Portrait.png';

export const Footer: FC = () => {
  return (
    <footer className="bg-white text-[#26352D] pt-12 pb-8 border-t border-[#DCEBE0] relative overflow-hidden">
      {/* 1. Value propositions strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 mb-10 border-b border-[#DCEBE0]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0]">
            <div className="p-3 bg-[#DDF3E2] text-[#59B976] rounded-xl">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-outfit font-semibold text-sm text-[#26352D]">Free Express Shipping</h4>
              <p className="text-[11px] text-[#718078]">On footwear orders over Rs. 15,000.00</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0]">
            <div className="p-3 bg-[#DDF3E2] text-[#59B976] rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-outfit font-semibold text-sm text-[#26352D]">100% Authentic</h4>
              <p className="text-[11px] text-[#718078]">Directly sourced brand partners</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0]">
            <div className="p-3 bg-[#DDF3E2] text-[#59B976] rounded-xl">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-outfit font-semibold text-sm text-[#26352D]">30-Day Hassle-Free Swaps</h4>
              <p className="text-[11px] text-[#718078]">Easy size swaps & store credit</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0]">
            <div className="p-3 bg-[#DDF3E2] text-[#59B976] rounded-xl">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-outfit font-semibold text-sm text-[#26352D]">Colombo Support</h4>
              <p className="text-[11px] text-[#718078]">Expert shoe advisors +94 11 234 5678</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main 50:50 Layout: Left Full-Height Model Showcase + Right Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left 50% Column: Fully Clear Model & STRIDEX Shoe Boxes Visual */}
        <div className="lg:col-span-5 xl:col-span-6 relative rounded-3xl overflow-hidden bg-[#F2FAF4]/40 border border-[#DCEBE0] shadow-xs flex items-end justify-center min-h-[460px] lg:min-h-[520px] group">
          <img
            src={stridexStudioPortrait}
            alt="STRIDEX Official Model and Shoe Boxes"
            className="w-full h-full max-h-[560px] object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />

          {/* Subtle shade to top-left corner only */}
          <div 
            className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-[#26352D]/10 via-[#26352D]/2 to-transparent pointer-events-none" 
            aria-hidden="true" 
          />

          {/* Top-Left Floating Words & Slogan (Editorial Typography) */}
          <div className="absolute top-6 left-6 z-10 space-y-1.5 select-none pointer-events-none text-left">
            <div className="inline-flex items-center space-x-1.5 bg-white/85 backdrop-blur-md border border-[#BDECCB] px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[#26352D] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#72C98A] animate-pulse" />
              <span>100% Authentic Pairs</span>
            </div>
            <div>
              <h4 className="font-outfit font-extrabold text-lg sm:text-xl text-[#26352D] tracking-tight leading-tight">
                STRIDEX Studio Edition
              </h4>
              <p className="text-[11px] sm:text-xs font-semibold text-[#718078] tracking-wide">
                Official Footwear & Packaging
              </p>
            </div>
          </div>
        </div>

        {/* Right 50% Column: Brand Info, Navigation Columns & Showroom */}
        <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-between space-y-8">
          {/* Brand Headline & Contact Header */}
          <div className="space-y-3">
            <span className="font-outfit text-3xl font-extrabold tracking-wider text-[#26352D]">
              {APP_NAME}
              <span className="text-[#72C98A]">.</span>
            </span>
            <p className="text-xs text-[#72C98A] font-bold tracking-widest uppercase">
              {APP_TAGLINE}
            </p>
            <p className="text-xs sm:text-sm text-[#718078] leading-relaxed max-w-xl">
              Elevating your journey one step at a time. Crafted for athletic performance, styled for modern streetwear fashion. Certified authentic pairs with doorstep delivery across Sri Lanka.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-[#718078]">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#72C98A] shrink-0" />
                <span>Galle Road, Colombo 03</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#72C98A] shrink-0" />
                <span>+94 (11) 234 5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#72C98A] shrink-0" />
                <span>support@stridex.lk</span>
              </div>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-[#DCEBE0]">
            <div>
              <h5 className="font-outfit text-[#26352D] font-bold mb-3 text-sm">Shop Collection</h5>
              <ul className="space-y-2 text-xs">
                <li><Link to="/shop" className="text-[#718078] hover:text-[#72C98A] transition-colors">All Footwear</Link></li>
                <li><Link to="/shop?gender=MEN" className="text-[#718078] hover:text-[#72C98A] transition-colors">Men's Sneakers</Link></li>
                <li><Link to="/shop?gender=WOMEN" className="text-[#718078] hover:text-[#72C98A] transition-colors">Women's Collection</Link></li>
                <li><Link to="/brands" className="text-[#718078] hover:text-[#72C98A] transition-colors">Partner Brands</Link></li>
                <li><Link to="/gift-vouchers" className="text-[#718078] hover:text-[#72C98A] transition-colors">Digital Gift Vouchers</Link></li>
                <li><Link to="/my-vouchers" className="text-[#718078] hover:text-[#72C98A] transition-colors">My Gift Vouchers</Link></li>
                <li><Link to="/shop?filter=featured" className="text-[#718078] hover:text-[#72C98A] transition-colors">Featured Drops</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-outfit text-[#26352D] font-bold mb-3 text-sm">Company & Care</h5>
              <ul className="space-y-2 text-xs">
                <li><Link to="/about" className="text-[#718078] hover:text-[#72C98A] transition-colors">About STRIDEX</Link></li>
                <li><Link to="/contact" className="text-[#718078] hover:text-[#72C98A] transition-colors">Showroom & Contact</Link></li>
                <li><Link to="/contact#faq" className="text-[#718078] hover:text-[#72C98A] transition-colors">Size Guide & FAQs</Link></li>
                <li><Link to="/shop" className="text-[#718078] hover:text-[#72C98A] transition-colors">Island-wide Shipping</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-outfit text-[#26352D] font-bold mb-3 text-sm">Showroom Hours</h5>
              <div className="space-y-2 text-xs text-[#718078]">
                <div>
                  <span className="font-semibold text-[#26352D] block">Flagship Showroom</span>
                  <span>Galle Road, Colombo 03</span>
                </div>
                <div>
                  <span className="font-semibold text-[#26352D] block">Operating Hours</span>
                  <span>Mon – Sat: 9:00 AM – 8:00 PM</span><br />
                  <span>Sunday: 10:00 AM – 6:00 PM</span>
                </div>
                <div>
                  <span className="font-semibold text-[#26352D] block">Payment Methods</span>
                  <span>COD &bull; Direct Bank Transfer</span>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 bg-[#DDF3E2] text-[#26352D] border border-[#BDECCB] text-[10px] font-bold px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#72C98A] animate-pulse"></span>
                    <span>Island-Wide Delivery</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright Line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-[#DCEBE0] text-center text-xs text-[#718078]">
        &copy; {new Date().getFullYear()} {APP_NAME} Footwear Sri Lanka. All rights reserved. Prices strictly in Sri Lankan Rupees (LKR).
      </div>
    </footer>
  );
};
