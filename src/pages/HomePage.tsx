import { useState, useRef } from 'react';
import type { FC, MouseEvent } from 'react';
import { ArrowRight, TrendingUp, Compass, Award, Tag } from 'lucide-react';
import heroShoe from '../assets/home_page_shoe.png';
import { HeroVideoBackground } from '../components/home/HeroVideoBackground';

interface CategoryCard {
  title: string;
  tagline: string;
  badge: string;
  imageUrl: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    title: 'Performance Running',
    tagline: 'Engineered for speed, built for distance with responsive energy return.',
    badge: 'Popular',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Street & Casual Sneakers',
    tagline: 'Iconic silhouettes crafted for all-day comfort and trendsetting aesthetics.',
    badge: 'Trending',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Executive & Formal',
    tagline: 'Refined leather classics meticulously crafted for timeless sophistication.',
    badge: 'Premium',
    imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Limited Release Drops',
    tagline: 'Rare collector sneakers and exclusive designer athletic collaborations.',
    badge: 'Exclusive',
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=80',
  },
];

export const HomePage: FC = () => {
  // Hero section container ref for mouse movement tracking
  const heroRef = useRef<HTMLElement | null>(null);

  // 3D perspective mouse tilt & position state
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    translateX: 0,
    translateY: 0,
  });

  // Calculate subtle, professional mouse-following 3D perspective
  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    // Disable 3D tilt tracking on touch screens
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (!heroRef.current) return;

    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    // Subtle 3D tilt angles and translation offsets
    setTilt({
      rotateY: x * 12,     // -6 deg to +6 deg horizontal tilt
      rotateX: -y * 12,    // -6 deg to +6 deg vertical tilt
      translateX: x * 14,  // -7px to +7px lateral shift
      translateY: y * 14,  // -7px to +7px vertical shift
    });
  };

  // Smoothly return shoe to default position when mouse leaves the hero area
  const handleMouseLeave = () => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      translateX: 0,
      translateY: 0,
    });
  };

  return (
    <div className="min-h-screen bg-[#F2FAF4] overflow-x-hidden">
      {/* ======================================================== */}
      {/* 1. HERO SECTION – CLEONE-Inspired Large 3D Diagonal Shoe   */}
      {/* ======================================================== */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden text-[#26352D] pt-10 pb-20 md:pt-14 md:pb-28 border-b border-[#DCEBE0]"
      >
        {/* Cinematic Sneaker Commercial Background Video with Light Green Brand Overlay */}
        <HeroVideoBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center min-h-[500px] lg:min-h-[580px]">
            {/* ----------------- LEFT COLUMN: HEADLINE, CTAS & STATISTICS ----------------- */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-5 text-center lg:text-left z-10">
              {/* Top Feature Pill */}
              <div className="inline-flex items-center space-x-2 bg-[#DDF3E2] border border-[#BDECCB] rounded-full px-3.5 py-1 text-xs font-semibold text-[#26352D] tracking-wider uppercase shadow-xs">
                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 border border-[#BDECCB] shrink-0 shadow-2xs">
                  <img src={heroShoe} alt="Shoe Avatar" className="w-full h-full object-contain -rotate-12" />
                </span>
                <span>Next-Gen Footwear Collection</span>
              </div>

              {/* Bold Modern Headline */}
              <h1 className="font-outfit text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#26352D] leading-[1.12]">
                Step Into Your{' '}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#59B976] via-[#72C98A] to-[#35A866]">
                    Style.
                  </span>
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#BDECCB] rounded-full -z-10" />
                </span>
              </h1>

              {/* Attractive Short Description */}
              <p className="text-base sm:text-lg text-[#718078] max-w-xl mx-auto lg:mx-0 font-sans leading-relaxed">
                Discover your next favourite pair. Explore premium sneakers, casual footwear, and everyday essentials designed for every step.
              </p>

              {/* CTA Buttons */}
              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-white bg-[#72C98A] hover:bg-[#59B976] shadow-lg shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 cursor-pointer"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="ml-2.5 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <a
                  href="#offers"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-[#26352D] bg-white hover:bg-[#DDF3E2] border border-[#DCEBE0] hover:border-[#72C98A] transition-all duration-300 shadow-xs hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <Tag className="mr-2 w-4 h-4 text-[#59B976]" />
                  <span>Explore Offers</span>
                </a>
              </div>

              {/* Statistics Section – Moved Higher, Positioned Directly Below CTAs */}
              <div className="pt-5 mt-4 border-t border-[#DCEBE0] max-w-lg mx-auto lg:mx-0 grid grid-cols-3 gap-6">
                <div>
                  <div className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#26352D]">500+</div>
                  <div className="text-xs text-[#718078] font-medium mt-0.5">Curated Pairs</div>
                </div>
                <div>
                  <div className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#26352D]">100%</div>
                  <div className="text-xs text-[#718078] font-medium mt-0.5">Authentic Leather</div>
                </div>
                <div>
                  <div className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#26352D]">4.9 / 5</div>
                  <div className="text-xs text-[#718078] font-medium mt-0.5">Customer Rating</div>
                </div>
              </div>
            </div>

            {/* ----------------- RIGHT COLUMN: LARGE DIAGONAL 3D FLOATING SHOE ----------------- */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-center justify-center relative select-none mt-6 lg:mt-0">
              {/* Outer Layer: Interactive Mouse Perspective Tilt */}
              <div
                className="relative w-full flex flex-col items-center justify-center transition-transform duration-300 ease-out will-change-transform"
                style={{
                  transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translate3d(${tilt.translateX}px, ${tilt.translateY}px, 0)`,
                }}
              >
                {/* Middle Layer: Diagonal 3D Presentation & Continuous Floating Animation */}
                <div className="animate-shoe-float relative w-full flex items-center justify-center cursor-pointer">
                  {/* Large Dominant Shoe Image (600–750px+ desktop footprint, 85–95% visual coverage) */}
                  <img
                    src={heroShoe}
                    alt="STRIDEX Premium Athletic Sneaker"
                    className="w-[320px] sm:w-[500px] md:w-[600px] lg:w-[680px] xl:w-[760px] max-w-none h-auto object-contain drop-shadow-2xl select-none pointer-events-none transition-transform duration-500 hover:scale-[1.02]"
                    draggable={false}
                  />

                  {/* Clean Floating Badge Tag */}
                  <div className="absolute top-6 right-6 sm:right-12 bg-white/95 backdrop-blur-md border border-[#DCEBE0] text-[#26352D] px-3.5 py-1.5 rounded-full shadow-md text-xs font-semibold flex items-center space-x-1.5 pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-[#72C98A] animate-pulse" />
                    <span>STRIDEX Core Series</span>
                  </div>
                </div>

                {/* Dynamic Ground Shadow – Positioned directly beneath shoe sole */}
                <div className="animate-shadow-pulse -mt-24 sm:-mt-36 lg:-mt-44 w-[320px] sm:w-[460px] lg:w-[560px] h-6 sm:h-9 rounded-[100%] bg-gradient-to-r from-transparent via-[#26352D]/25 to-transparent blur-md sm:blur-lg pointer-events-none relative z-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. FEATURED CATEGORY SECTION – Clean White Cards          */}
      {/* ======================================================== */}
      <section id="categories" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#72C98A] uppercase tracking-widest mb-2">
              <TrendingUp className="w-4 h-4 text-[#59B976]" />
              <span>Curated Collections</span>
            </div>
            <h2 className="font-outfit text-3xl sm:text-4xl font-extrabold text-[#26352D]">
              Featured Categories
            </h2>
            <p className="text-[#718078] mt-2 max-w-xl text-sm sm:text-base font-sans">
              Handpicked footwear lines crafted for athletic performance, street style pioneers, and modern professionals.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center text-sm font-semibold text-[#72C98A] hover:text-[#59B976] transition-colors cursor-pointer"
            >
              <span>View all collections</span>
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Grid (Pure White Cards with Soft Sage Borders & Elevation Lift) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-[#DCEBE0] hover:border-[#72C98A] hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
            >
              <div className="relative h-56 w-full overflow-hidden bg-[#F2FAF4]">
                <img
                  src={cat.imageUrl}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-[#DDF3E2] text-[#26352D] border border-[#BDECCB] text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
                  {cat.badge}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-outfit font-bold text-lg text-[#26352D] group-hover:text-[#72C98A] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#718078] mt-1.5 leading-relaxed font-sans">
                    {cat.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#DCEBE0] flex items-center justify-between text-xs font-semibold text-[#72C98A]">
                  <span>Explore Shoes</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. OFFERS & HIGHLIGHT BANNER                              */}
      {/* ======================================================== */}
      <section id="offers" className="py-12 bg-white border-y border-[#DCEBE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex items-center space-x-4 justify-center md:justify-start p-4 rounded-xl hover:bg-[#F2FAF4] transition-colors">
              <div className="p-3 bg-[#DDF3E2] text-[#59B976] rounded-xl">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-outfit font-bold text-[#26352D]">Precision Craftsmanship</h4>
                <p className="text-xs text-[#718078]">Premium athletic materials engineered for peak durability</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 justify-center md:justify-start p-4 rounded-xl hover:bg-[#F2FAF4] transition-colors">
              <div className="p-3 bg-[#DDF3E2] text-[#59B976] rounded-xl">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-outfit font-bold text-[#26352D]">Global Trend Leaders</h4>
                <p className="text-xs text-[#718078]">Curating the world's most sought-after athletic drops</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 justify-center md:justify-start p-4 rounded-xl hover:bg-[#F2FAF4] transition-colors">
              <div className="p-3 bg-[#DDF3E2] text-[#59B976] rounded-xl">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-outfit font-bold text-[#26352D]">Multi-Tier Management</h4>
                <p className="text-xs text-[#718078]">Customer, Inventory & Administrator roles</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
