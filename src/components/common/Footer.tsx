import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME, APP_TAGLINE } from '../../utils/constants';
import { ShieldCheck, Truck, RefreshCw, Headphones, MapPin, Phone, Mail } from 'lucide-react';

export const Footer: FC = () => {
  return (
    <footer className="bg-white text-[#26352D] pt-16 pb-8 border-t border-[#DCEBE0]">
      {/* Value propositions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-[#DCEBE0]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0]">
            <div className="p-3 bg-[#DDF3E2] text-[#59B976] rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-outfit font-semibold text-[#26352D]">Free Express Shipping</h4>
              <p className="text-xs text-[#718078]">On all footwear orders over Rs. 15,000.00</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0]">
            <div className="p-3 bg-[#DDF3E2] text-[#59B976] rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-outfit font-semibold text-[#26352D]">100% Authentic</h4>
              <p className="text-xs text-[#718078]">Directly sourced brand partners</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0]">
            <div className="p-3 bg-[#DDF3E2] text-[#59B976] rounded-xl">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-outfit font-semibold text-[#26352D]">30-Day Hassle-Free Swaps</h4>
              <p className="text-xs text-[#718078]">Easy size swaps & store credit</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0]">
            <div className="p-3 bg-[#DDF3E2] text-[#59B976] rounded-xl">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-outfit font-semibold text-[#26352D]">Colombo Support</h4>
              <p className="text-xs text-[#718078]">Expert shoe advisors +94 11 234 5678</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <span className="font-outfit text-2xl font-bold tracking-wider text-[#26352D]">
            {APP_NAME}
            <span className="text-[#72C98A]">.</span>
          </span>
          <p className="text-xs text-[#72C98A] font-semibold tracking-widest uppercase mt-1 mb-4">
            {APP_TAGLINE}
          </p>
          <p className="text-sm text-[#718078] leading-relaxed mb-4">
            Elevating your journey one step at a time. Crafted for athletic performance, styled for modern fashion.
          </p>
          <div className="space-y-1.5 text-xs text-[#718078]">
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-[#72C98A]" />
              <span>Galle Road, Colombo 03, Sri Lanka</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-[#72C98A]" />
              <span>+94 (11) 234 5678</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-[#72C98A]" />
              <span>support@stridex.lk</span>
            </div>
          </div>
        </div>

        <div>
          <h5 className="font-outfit text-[#26352D] font-semibold mb-4 text-base">Shop Collection</h5>
          <ul className="space-y-2.5 text-sm">
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
          <h5 className="font-outfit text-[#26352D] font-semibold mb-4 text-base">Company & Care</h5>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="text-[#718078] hover:text-[#72C98A] transition-colors">About STRIDEX</Link></li>
            <li><Link to="/contact" className="text-[#718078] hover:text-[#72C98A] transition-colors">Showroom & Contact</Link></li>
            <li><Link to="/contact#faq" className="text-[#718078] hover:text-[#72C98A] transition-colors">Size Guide & FAQs</Link></li>
            <li><Link to="/shop" className="text-[#718078] hover:text-[#72C98A] transition-colors">Island-wide Shipping</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-outfit text-[#26352D] font-semibold mb-4 text-base">IJSE RAD Coursework</h5>
          <p className="text-xs text-[#718078] mb-2">
            Graduate Diploma in Software Engineering (GDSE)
          </p>
          <p className="text-xs text-[#718078]">
            ITS2020 Rapid Application Development Capstone Project
          </p>
          <div className="mt-4 pt-4 border-t border-[#DCEBE0]">
            <span className="inline-block bg-[#DDF3E2] text-[#26352D] border border-[#BDECCB] text-xs font-semibold px-3 py-1 rounded-full">
              Phase 4: Customer Storefront Live
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-[#DCEBE0] text-center text-xs text-[#718078]">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved. Prices strictly in Sri Lankan Rupees (LKR).
      </div>
    </footer>
  );
};
