import type { FC } from 'react';
import { ArrowRight, Sparkles, TrendingUp, Compass, Award } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '../utils/constants';

interface CategoryCard {
  title: string;
  tagline: string;
  badge: string;
  imageUrl: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    title: 'Performance Running',
    tagline: 'Engineered for speed, built for distance with responsive cushioning.',
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
    tagline: 'Rare collector sneakers and exclusive designer collaborations.',
    badge: 'Exclusive',
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=80',
  },
];

export const HomePage: FC = () => {
  return (
    <div className="min-h-screen bg-[#F2FAF4]">
      {/* HERO SECTION - Fresh & Bright Sporty Mint Theme */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EAF6ED] via-[#F2FAF4] to-[#E3F5E8] text-[#26352D] pt-16 pb-24 md:py-28 border-b border-[#DCEBE0]">
        {/* Subtle mint glowing decorative accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#BDECCB]/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#DDF3E2]/60 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-[#DDF3E2] border border-[#BDECCB] rounded-full px-4 py-1.5 text-xs font-semibold text-[#26352D] tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#59B976]" />
                <span>Next-Gen Footwear Destination</span>
              </div>

              <h1 className="font-outfit text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#26352D] leading-tight">
                {APP_TAGLINE} with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#59B976] to-[#72C98A]">
                  {APP_NAME}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#718078] max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed">
                Discover exceptional athletic comfort, unmatched durability, and fresh, modern designs. Whether hitting the pavement or commanding the room, elevate your every stride.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-white bg-[#72C98A] hover:bg-[#59B976] shadow-lg shadow-green-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="ml-2.5 w-5 h-5" />
                </button>

                <a
                  href="#categories"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-[#26352D] bg-white hover:bg-[#DDF3E2] border border-[#DCEBE0] transition-all duration-200 shadow-sm"
                >
                  <span>Explore Categories</span>
                </a>
              </div>

              {/* Quick Stat Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#DCEBE0] max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="font-outfit text-2xl font-bold text-[#26352D]">500+</div>
                  <div className="text-xs text-[#718078]">Curated Models</div>
                </div>
                <div>
                  <div className="font-outfit text-2xl font-bold text-[#26352D]">100%</div>
                  <div className="text-xs text-[#718078]">Verified Authentic</div>
                </div>
                <div>
                  <div className="font-outfit text-2xl font-bold text-[#26352D]">4.9 / 5</div>
                  <div className="text-xs text-[#718078]">Customer Rating</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase in White Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Decorative glow backing */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#BDECCB] to-[#72C98A] rounded-3xl transform rotate-3 scale-95 opacity-40 blur-lg" />
                
                {/* Main Card */}
                <div className="relative bg-white p-6 rounded-3xl border border-[#DCEBE0] shadow-xl">
                  <div className="relative h-72 w-full rounded-2xl overflow-hidden bg-[#F2FAF4] mb-5 flex items-center justify-center border border-[#DCEBE0]">
                    <img
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
                      alt="STRIDEX Apex Runner"
                      className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#DDF3E2] text-[#26352D] border border-[#BDECCB] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Featured Release
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-outfit text-xl font-bold text-[#26352D]">STRIDEX Apex Pro</h3>
                      <p className="text-xs text-[#718078]">Velocity Cushioned Performance</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs line-through text-[#718078] block">$189</span>
                      <span className="font-outfit text-xl font-bold text-[#59B976]">$149</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORY SECTION - Clean White Cards */}
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
              Handpicked footwear lines crafted for athletes, street style pioneers, and modern professionals.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center text-sm font-semibold text-[#72C98A] hover:text-[#59B976] transition-colors"
            >
              <span>View all collections</span>
              <ArrowRight className="ml-1 w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Grid (Pure White Cards with Soft Sage Borders) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#DCEBE0] hover:border-[#72C98A] flex flex-col justify-between"
            >
              <div className="relative h-56 w-full overflow-hidden bg-[#F2FAF4]">
                <img
                  src={cat.imageUrl}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-[#DDF3E2] text-[#26352D] border border-[#BDECCB] text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
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

      {/* BRAND ARCHITECTURE HIGHLIGHT BANNER */}
      <section className="py-12 bg-white border-y border-[#DCEBE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex items-center space-x-4 justify-center md:justify-start">
              <div className="p-3 bg-[#DDF3E2] text-[#59B976] rounded-xl">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-outfit font-bold text-[#26352D]">Precision Craftsmanship</h4>
                <p className="text-xs text-[#718078]">Premium athletic materials engineered for peak durability</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 justify-center md:justify-start">
              <div className="p-3 bg-[#DDF3E2] text-[#59B976] rounded-xl">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-outfit font-bold text-[#26352D]">Global Trend Leaders</h4>
                <p className="text-xs text-[#718078]">Curating the world's most sought-after athletic drops</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 justify-center md:justify-start">
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
