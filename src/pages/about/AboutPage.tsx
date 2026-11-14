import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  ShieldCheck, 
  HeartHandshake, 
  ArrowRight,
  Code2,
  GraduationCap
} from 'lucide-react';
import { APP_NAME } from '../../utils/constants';

export const AboutPage: FC = () => {
  return (
    <div className="min-h-screen bg-[#F2FAF4] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Hero Mission */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#72C98A] uppercase tracking-widest bg-[#DDF3E2] px-4 py-1 rounded-full border border-[#BDECCB]">
          <span>Our Story & Vision</span>
        </div>
        <h1 className="font-outfit text-4xl sm:text-5xl font-extrabold text-[#26352D] leading-tight">
          Step Into Your Style with {APP_NAME}
        </h1>
        <p className="text-sm sm:text-base text-[#718078] leading-relaxed">
          Founded in Colombo, STRIDEX merges high-performance athletic engineering with modern streetwear aesthetics. We curate authentic, precision-crafted footwear that empowers athletes, trendsetters, and daily commuters across Sri Lanka.
        </p>
      </section>

      {/* 3 Core Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl border border-[#DCEBE0] p-8 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#DDF3E2] text-[#59B976] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-outfit font-bold text-xl text-[#26352D]">Precision Engineering</h3>
          <p className="text-xs sm:text-sm text-[#718078] leading-relaxed">
            Every sole, upper mesh, and stitch is tested for responsive shock absorption, lightweight breathability, and long-lasting durability.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#DCEBE0] p-8 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#DDF3E2] text-[#59B976] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-outfit font-bold text-xl text-[#26352D]">100% Authentic Guarantee</h3>
          <p className="text-xs sm:text-sm text-[#718078] leading-relaxed">
            We partner directly with leading international brands (Nike, Adidas, Puma, New Balance) and premier local manufacturers (DSI Premier) to ensure absolute legitimacy.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#DCEBE0] p-8 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#DDF3E2] text-[#59B976] flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-outfit font-bold text-xl text-[#26352D]">Sri Lankan Accessibility</h3>
          <p className="text-xs sm:text-sm text-[#718078] leading-relaxed">
            Transparent pricing strictly in Sri Lankan Rupees (LKR), fast island-wide express delivery, and flexible 30-day size swaps designed for local comfort.
          </p>
        </div>
      </section>

      {/* RAD Coursework Capstone Spotlight */}
      <section className="bg-gradient-to-r from-white via-[#F2FAF4] to-white rounded-3xl border border-[#DCEBE0] p-8 sm:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#72C98A] uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-[#DCEBE0]">
              <GraduationCap className="w-4 h-4" />
              <span>IJSE Academic Capstone Project</span>
            </div>
            <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#26352D]">
              Institute of Software Engineering (IJSE)
            </h2>
            <p className="text-xs sm:text-sm text-[#718078] leading-relaxed">
              STRIDEX is developed as the official final coursework for the <strong>Rapid Application Development (RAD)</strong> module in the <strong>Graduate Diploma in Software Engineering (GDSE)</strong>.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#DCEBE0]">
                <span className="text-[#718078] block">Coursework Code</span>
                <strong className="text-[#26352D] font-mono">ITS2020 (RAD)</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#DCEBE0]">
                <span className="text-[#718078] block">Architecture</span>
                <strong className="text-[#26352D]">MERN + TypeScript</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#DCEBE0]">
                <span className="text-[#718078] block">Database & Storage</span>
                <strong className="text-[#26352D]">MongoDB + Supabase</strong>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-[#DCEBE0] space-y-3">
            <Code2 className="w-10 h-10 text-[#72C98A]" />
            <h4 className="font-outfit font-bold text-base text-[#26352D]">Role-Based Architecture</h4>
            <p className="text-xs text-[#718078]">
              Seamlessly integrates Customer storefront, Inventory management, and Super-admin consoles with JWT security.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#72C98A] hover:text-[#59B976] pt-2"
            >
              <span>Explore the Live Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
