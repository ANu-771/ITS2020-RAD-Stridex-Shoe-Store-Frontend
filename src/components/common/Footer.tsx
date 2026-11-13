import type { FC } from 'react';
import { APP_NAME, APP_TAGLINE } from '../../utils/constants';
import { ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react';

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
              <p className="text-xs text-[#718078]">On all footwear orders over $120</p>
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
              <h4 className="font-outfit font-semibold text-[#26352D]">30-Day Hassle-Free Returns</h4>
              <p className="text-xs text-[#718078]">Easy size swaps and refunds</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0]">
            <div className="p-3 bg-[#DDF3E2] text-[#59B976] rounded-xl">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-outfit font-semibold text-[#26352D]">Dedicated Support</h4>
              <p className="text-xs text-[#718078]">Expert shoe specialists available 24/7</p>
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
          <p className="text-sm text-[#718078] leading-relaxed">
            Elevating your journey one step at a time. Crafted for athletic performance, styled for modern fashion.
          </p>
        </div>

        <div>
          <h5 className="font-outfit text-[#26352D] font-semibold mb-4 text-base">Explore</h5>
          <ul className="space-y-2.5 text-sm">
            <li><a href="#categories" className="text-[#718078] hover:text-[#72C98A] transition-colors">Running & Athletic</a></li>
            <li><a href="#categories" className="text-[#718078] hover:text-[#72C98A] transition-colors">Casual Sneakers</a></li>
            <li><a href="#categories" className="text-[#718078] hover:text-[#72C98A] transition-colors">Formal & Leather</a></li>
            <li><a href="#categories" className="text-[#718078] hover:text-[#72C98A] transition-colors">Limited Edition Drops</a></li>
          </ul>
        </div>

        <div>
          <h5 className="font-outfit text-[#26352D] font-semibold mb-4 text-base">Customer Care</h5>
          <ul className="space-y-2.5 text-sm">
            <li><span className="text-[#718078]">Order Tracking</span></li>
            <li><span className="text-[#718078]">Size & Fit Guide</span></li>
            <li><span className="text-[#718078]">Shipping Policies</span></li>
            <li><span className="text-[#718078]">Contact Support</span></li>
          </ul>
        </div>

        <div>
          <h5 className="font-outfit text-[#26352D] font-semibold mb-4 text-base">RAD Coursework Info</h5>
          <p className="text-xs text-[#718078] mb-2">
            Graduate Diploma in Software Engineering (GDSE)
          </p>
          <p className="text-xs text-[#718078]">
            ITS2020 Rapid Application Development Capstone Project
          </p>
          <div className="mt-4 pt-4 border-t border-[#DCEBE0]">
            <span className="inline-block bg-[#DDF3E2] text-[#26352D] border border-[#BDECCB] text-xs font-semibold px-3 py-1 rounded-full">
              Phase 1: Architecture Ready
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-[#DCEBE0] text-center text-xs text-[#718078]">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved. Built with MERN Stack + TypeScript.
      </div>
    </footer>
  );
};
