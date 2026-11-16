import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  ShieldCheck, 
  HeartHandshake, 
  ArrowRight
} from 'lucide-react';
import { ShoeAvatarIcon } from '../../components/common/ShoeAvatarIcon';
import { APP_NAME } from '../../utils/constants';
import nieraEditorialImg from '../../assets/Niera8268_1.webp';
import aboutSlide1 from '../../assets/about slide.jpg';
import aboutSlide2 from '../../assets/about slide 2.jpg';
import aboutSlide3 from '../../assets/abot slide 3.jpg';

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

      {/* 3 Core Pillars with Photoshoot Backgrounds & Neon Shadow Micro-Interactions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-2">
        {/* Card 1: Precision Engineering (Left Tilt -6°) */}
        <div className="relative overflow-hidden rounded-3xl min-h-[440px] sm:min-h-[470px] p-7 sm:p-8 flex flex-col justify-end group transition-all duration-500 ease-out will-change-transform cursor-pointer border border-[#BDECCB] shadow-[0_10px_25px_-5px_rgba(114,201,138,0.35)] hover:shadow-[0_0_35px_rgba(114,201,138,0.65),0_15px_30px_rgba(114,201,138,0.3)] hover:border-[#72C98A] hover:-rotate-6 hover:scale-105 hover:-translate-y-2 z-10 hover:z-20">
          <img
            src={aboutSlide1}
            alt="Precision Engineering - STRIDEX Performance Footwear"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#26352D]/15 group-hover:bg-[#26352D]/10 transition-colors duration-500 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#26352D]/95 via-[#26352D]/60 via-45% to-transparent pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#72C98A]/20 blur-2xl group-hover:bg-[#72C98A]/35 transition-all duration-500 pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-[#72C98A] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-[#72C98A] group-hover:text-white transition-all duration-300">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-outfit font-bold text-xl sm:text-2xl text-white tracking-tight drop-shadow-sm">
              Precision Engineering
            </h3>
            <p className="text-xs sm:text-sm text-[#DCEBE0] leading-relaxed drop-shadow-2xs">
              Every sole, upper mesh, and stitch is tested for responsive shock absorption, lightweight breathability, and long-lasting durability.
            </p>
            <div className="w-10 h-1 bg-[#72C98A] rounded-full group-hover:w-16 transition-all duration-300 shadow-[0_0_10px_#72C98A]" />
          </div>
        </div>

        {/* Card 2: 100% Authentic Guarantee (Center Elevated Lift +1°) */}
        <div className="relative overflow-hidden rounded-3xl min-h-[440px] sm:min-h-[470px] p-7 sm:p-8 flex flex-col justify-end group transition-all duration-500 ease-out will-change-transform cursor-pointer border border-[#BDECCB] shadow-[0_10px_25px_-5px_rgba(114,201,138,0.35)] hover:shadow-[0_0_35px_rgba(114,201,138,0.65),0_15px_30px_rgba(114,201,138,0.3)] hover:border-[#72C98A] hover:rotate-1 hover:scale-105 hover:-translate-y-3 z-10 hover:z-20">
          <img
            src={aboutSlide2}
            alt="100% Authentic Guarantee - STRIDEX Certified Pairs"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#26352D]/15 group-hover:bg-[#26352D]/10 transition-colors duration-500 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#26352D]/95 via-[#26352D]/60 via-45% to-transparent pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#72C98A]/20 blur-2xl group-hover:bg-[#72C98A]/35 transition-all duration-500 pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-[#72C98A] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-[#72C98A] group-hover:text-white transition-all duration-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-outfit font-bold text-xl sm:text-2xl text-white tracking-tight drop-shadow-sm">
              100% Authentic Guarantee
            </h3>
            <p className="text-xs sm:text-sm text-[#DCEBE0] leading-relaxed drop-shadow-2xs">
              We partner directly with leading international brands (Nike, Adidas, Puma, New Balance) and premier local manufacturers (DSI Premier) to ensure absolute legitimacy.
            </p>
            <div className="w-10 h-1 bg-[#72C98A] rounded-full group-hover:w-16 transition-all duration-300 shadow-[0_0_10px_#72C98A]" />
          </div>
        </div>

        {/* Card 3: Sri Lankan Accessibility (Right Tilt +6°) */}
        <div className="relative overflow-hidden rounded-3xl min-h-[440px] sm:min-h-[470px] p-7 sm:p-8 flex flex-col justify-end group transition-all duration-500 ease-out will-change-transform cursor-pointer border border-[#BDECCB] shadow-[0_10px_25px_-5px_rgba(114,201,138,0.35)] hover:shadow-[0_0_35px_rgba(114,201,138,0.65),0_15px_30px_rgba(114,201,138,0.3)] hover:border-[#72C98A] hover:rotate-6 hover:scale-105 hover:-translate-y-2 z-10 hover:z-20">
          <img
            src={aboutSlide3}
            alt="Sri Lankan Accessibility - STRIDEX Island-Wide Reach"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#26352D]/15 group-hover:bg-[#26352D]/10 transition-colors duration-500 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#26352D]/95 via-[#26352D]/60 via-45% to-transparent pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#72C98A]/20 blur-2xl group-hover:bg-[#72C98A]/35 transition-all duration-500 pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-[#72C98A] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-[#72C98A] group-hover:text-white transition-all duration-300">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-outfit font-bold text-xl sm:text-2xl text-white tracking-tight drop-shadow-sm">
              Sri Lankan Accessibility
            </h3>
            <p className="text-xs sm:text-sm text-[#DCEBE0] leading-relaxed drop-shadow-2xs">
              Transparent pricing strictly in Sri Lankan Rupees (LKR), fast island-wide express delivery, and flexible 30-day size swaps designed for local comfort.
            </p>
            <div className="w-10 h-1 bg-[#72C98A] rounded-full group-hover:w-16 transition-all duration-300 shadow-[0_0_10px_#72C98A]" />
          </div>
        </div>
      </section>

      {/* Brand Craftsmanship & Heritage Spotlight */}
      <section className="bg-gradient-to-r from-white via-[#F2FAF4] to-white rounded-3xl border border-[#DCEBE0] p-8 sm:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#72C98A] uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-[#DCEBE0]">
              <ShoeAvatarIcon className="w-4 h-4" />
              <span>Premium Footwear Heritage & Innovation</span>
            </div>
            <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#26352D]">
              Curated for Performance, Styled for Sri Lankan Streets
            </h2>
            <p className="text-xs sm:text-sm text-[#718078] leading-relaxed">
              At STRIDEX, we partner directly with certified global distributors and authorized partners to bring genuine athletic, running, and lifestyle footwear to sneaker enthusiasts across all 9 provinces in Sri Lanka.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#DCEBE0]">
                <span className="text-[#718078] block">Authenticity</span>
                <strong className="text-[#26352D]">100% Verified Pairs</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#DCEBE0]">
                <span className="text-[#718078] block">Delivery Reach</span>
                <strong className="text-[#26352D]">All 25 Districts</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#DCEBE0]">
                <span className="text-[#718078] block">Exchange Policy</span>
                <strong className="text-[#26352D]">7-Day Hassle-Free</strong>
              </div>
            </div>
          </div>

          {/* Streetwear Lookbook Editorial Card */}
          <div className="lg:col-span-4 relative rounded-3xl overflow-hidden bg-white border border-[#DCEBE0] shadow-sm group">
            <div className="relative h-80 sm:h-96 w-full overflow-hidden">
              <img
                src={nieraEditorialImg}
                alt="STRIDEX Streetwear & Lifestyle Editorial"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#26352D] via-[#26352D]/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white space-y-2 z-10">
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-[#72C98A] bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                  <span>STRIDEX Editorial</span>
                </span>
                <h4 className="font-outfit font-bold text-base sm:text-lg text-white leading-snug">
                  Modern Streetwear & Athletic Fusion
                </h4>
                <p className="text-[11px] text-[#DCEBE0]/80 leading-relaxed line-clamp-2">
                  Real street fashion tailored for style and comfort across Sri Lanka.
                </p>
                <div className="pt-1">
                  <Link
                    to="/shop"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#72C98A] hover:text-white transition-colors"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
