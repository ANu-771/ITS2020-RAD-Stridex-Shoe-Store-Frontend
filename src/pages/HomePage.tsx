import { useState, useEffect, useRef } from 'react';
import type { FC, MouseEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  TrendingUp, 
  Tag, 
  Star, 
  CheckCircle2, 
  Mail, 
  Cpu, 
  Zap, 
  ChevronRight,
  Percent
} from 'lucide-react';
import { ShoeAvatarIcon } from '../components/common/ShoeAvatarIcon';
import heroShoe from '../assets/home_page_shoe.png';
import { HeroVideoBackground } from '../components/home/HeroVideoBackground';
import { BrandMarqueeBanner } from '../components/home/BrandMarqueeBanner';
import { productService } from '../services/productService';
import { brandService } from '../services/brandService';
import { categoryService } from '../services/categoryService';
import type { Product, Brand, Category } from '../types';
import { ProductCard } from '../components/shop/ProductCard';
import { ProductSkeleton } from '../components/shop/ProductSkeleton';
import { useToast } from '../context/ToastContext';

interface CategoryCard {
  title: string;
  slug: string;
  tagline: string;
  badge: string;
  imageUrl: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    title: 'Performance Running',
    slug: 'running-athletic',
    tagline: 'Engineered for speed, built for distance with responsive energy return.',
    badge: 'Popular',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Street & Casual Sneakers',
    slug: 'casual-sneakers',
    tagline: 'Iconic silhouettes crafted for all-day comfort and trendsetting aesthetics.',
    badge: 'Trending',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Executive & Formal',
    slug: 'formal-leather',
    tagline: 'Refined leather classics meticulously crafted for timeless sophistication.',
    badge: 'Premium',
    imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Limited Release Drops',
    slug: 'limited-edition',
    tagline: 'Rare collector sneakers and exclusive designer athletic collaborations.',
    badge: 'Exclusive',
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=80',
  },
];

const REVIEWS = [
  {
    name: 'Dilshan Silva',
    city: 'Colombo 07',
    shoe: 'Nike Air Zoom Pegasus',
    rating: 5,
    comment:
      'The cushion bounce is unreal. Delivery arrived in Bambalapitiya in under 24 hours. Genuine packaging and 100% authentic.',
  },
  {
    name: 'Sachini Wickramasinghe',
    city: 'Kandy',
    shoe: 'Adidas Ultraboost Light',
    rating: 5,
    comment:
      'Finding real brand sneakers in Sri Lanka with honest LKR pricing was impossible until STRIDEX. The size exchange service is effortless.',
  },
  {
    name: 'Rohan Jayawardena',
    city: 'Galle',
    shoe: 'Puma Velocity Nitro 2',
    rating: 5,
    comment:
      'Top-tier athletic footwear. The 3D view on the site showed the exact sole grip. Highly recommended for marathon runners.',
  },
];

export const HomePage: FC = () => {
  const { showToast } = useToast();
  const heroRef = useRef<HTMLElement | null>(null);

  // 3D perspective mouse tilt state
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    translateX: 0,
    translateY: 0,
  });

  // Dynamic API Data States
  const [trendingShoes, setTrendingShoes] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [specialOffers, setSpecialOffers] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // AI Fit Recommendation Interactive State
  const [quizGender, setQuizGender] = useState<'MEN' | 'WOMEN' | 'UNISEX'>('MEN');
  const [quizGoal, setQuizGoal] = useState<'running' | 'daily' | 'formal'>('running');

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Handle subtle 3D perspective tilt
  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (!heroRef.current) return;

    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      rotateY: x * 12,
      rotateX: -y * 12,
      translateX: x * 14,
      translateY: y * 14,
    });
  };

  const handleMouseLeave = () => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      translateX: 0,
      translateY: 0,
    });
  };

  // Fetch Homepage Data from Real Backend APIs
  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        const [trendingRes, newestRes, brandsRes, catsRes] = await Promise.all([
          productService.getAll({ featured: true, limit: 4 }),
          productService.getAll({ sort: 'newest', limit: 4 }),
          brandService.getAll({ active: true }),
          categoryService.getAll({ active: true }),
        ]);

        if (trendingRes.success) {
          setTrendingShoes(trendingRes.data);
          // Shoes with discount price for special offers
          const discounted = trendingRes.data.filter(
            (p) => p.discountPrice && p.discountPrice < p.basePrice
          );
          setSpecialOffers(discounted.length > 0 ? discounted : trendingRes.data.slice(0, 4));
        }

        if (newestRes.success) {
          setNewArrivals(newestRes.data);
        }

        if (brandsRes.success) {
          setBrands(brandsRes.data);
        }

        if (catsRes.success) {
          setCategories(catsRes.data);
        }
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const displayCategories = categories.length > 0
    ? categories.slice(0, 4).map((c, i) => ({
        title: c.name,
        slug: c.slug,
        tagline: c.description || CATEGORIES[i % CATEGORIES.length].tagline,
        badge: CATEGORIES[i % CATEGORIES.length].badge,
        imageUrl: c.image || CATEGORIES[i % CATEGORIES.length].imageUrl,
      }))
    : CATEGORIES;

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      showToast('Welcome to the STRIDEX community! Check your email for your 10% welcome coupon.', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F2FAF4] overflow-x-hidden">
      {/* ======================================================== */}
      {/* 1. HERO SECTION – Cinematic Sneaker Commercial Background */}
      {/* ======================================================== */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden text-[#26352D] pt-10 pb-20 md:pt-14 md:pb-28 border-b border-[#DCEBE0]"
      >
        <HeroVideoBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center min-h-[500px] lg:min-h-[580px]">
            {/* Left Headline & CTAs */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-5 text-center lg:text-left z-10">
              <div className="inline-flex items-center space-x-2 bg-[#DDF3E2] border border-[#BDECCB] rounded-full px-3.5 py-1 text-xs font-semibold text-[#26352D] tracking-wider uppercase shadow-xs">
                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 border border-[#BDECCB] shrink-0 shadow-2xs">
                  <img src={heroShoe} alt="Shoe Avatar" className="w-full h-full object-contain -rotate-12" />
                </span>
                <span>Next-Gen Footwear Collection</span>
              </div>

              <h1 className="font-outfit text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#26352D] leading-[1.12]">
                Step Into Your{' '}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#59B976] via-[#72C98A] to-[#35A866]">
                    Style.
                  </span>
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#BDECCB] rounded-full -z-10" />
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#718078] max-w-xl mx-auto lg:mx-0 font-sans leading-relaxed">
                Discover your next favourite pair. Explore premium sneakers, casual footwear, and everyday essentials designed for every step.
              </p>

              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-white bg-[#72C98A] hover:bg-[#59B976] shadow-lg shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 cursor-pointer"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="ml-2.5 w-5 h-5" />
                </Link>

                <Link
                  to="/shop?sort=price_asc"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-[#26352D] bg-white hover:bg-[#DDF3E2] border border-[#DCEBE0] hover:border-[#72C98A] transition-all duration-300 shadow-xs hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <Tag className="mr-2 w-4 h-4 text-[#59B976]" />
                  <span>Explore Offers</span>
                </Link>
              </div>

              {/* Statistics */}
              <div className="pt-5 mt-4 border-t border-[#DCEBE0] max-w-lg mx-auto lg:mx-0 grid grid-cols-3 gap-6">
                <div>
                  <div className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#26352D]">500+</div>
                  <div className="text-xs text-[#718078] font-medium mt-0.5">Curated Pairs</div>
                </div>
                <div>
                  <div className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#26352D]">100%</div>
                  <div className="text-xs text-[#718078] font-medium mt-0.5">Authentic Pairs</div>
                </div>
                <div>
                  <div className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#26352D]">4.9 / 5</div>
                  <div className="text-xs text-[#718078] font-medium mt-0.5">Customer Rating</div>
                </div>
              </div>
            </div>

            {/* Right: 3D Shoe Floating */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-center justify-center relative select-none mt-6 lg:mt-0">
              <div
                className="relative w-full flex flex-col items-center justify-center transition-transform duration-300 ease-out will-change-transform"
                style={{
                  transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translate3d(${tilt.translateX}px, ${tilt.translateY}px, 0)`,
                }}
              >
                <div className="animate-shoe-float relative w-full flex items-center justify-center cursor-pointer">
                  <img
                    src={heroShoe}
                    alt="STRIDEX Premium Athletic Sneaker"
                    className="w-[320px] sm:w-[500px] md:w-[600px] lg:w-[680px] xl:w-[760px] max-w-none h-auto object-contain drop-shadow-2xl select-none pointer-events-none transition-transform duration-500 hover:scale-[1.02]"
                    draggable={false}
                  />

                  <div className="absolute top-6 right-6 sm:right-12 bg-white/95 backdrop-blur-md border border-[#DCEBE0] text-[#26352D] px-3.5 py-1.5 rounded-full shadow-md text-xs font-semibold flex items-center space-x-1.5 pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-[#72C98A] animate-pulse" />
                    <span>STRIDEX Core Series</span>
                  </div>
                </div>

                <div className="animate-shadow-pulse -mt-24 sm:-mt-36 lg:-mt-44 w-[320px] sm:w-[460px] lg:w-[560px] h-6 sm:h-9 rounded-[100%] bg-gradient-to-r from-transparent via-[#26352D]/25 to-transparent blur-md sm:blur-lg pointer-events-none relative z-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. FEATURED CATEGORIES SECTION                           */}
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
            <p className="text-[#718078] mt-2 max-w-xl text-sm sm:text-base">
              Handpicked footwear lines crafted for athletic performance, street style pioneers, and modern professionals.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              to="/shop"
              className="inline-flex items-center text-sm font-semibold text-[#72C98A] hover:text-[#59B976] transition-colors"
            >
              <span>View all collections</span>
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/category/${cat.slug}`}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-[#DCEBE0] hover:border-[#72C98A] hover:-translate-y-1 flex flex-col justify-between"
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
            </Link>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. TRENDING SHOES (CONNECTED TO REAL BACKEND APIS)        */}
      {/* ======================================================== */}
      <section className="py-16 bg-white border-y border-[#DCEBE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#72C98A] uppercase tracking-widest mb-1">
                <ShoeAvatarIcon className="w-4 h-4 text-[#72C98A]" />
                <span>Trending Footwear Drops</span>
              </div>
              <h2 className="font-outfit text-3xl sm:text-4xl font-extrabold text-[#26352D]">
                Most Wanted Shoes
              </h2>
              <p className="text-[#718078] text-sm mt-1">
                Top rated silhouettes engineered for responsive speed and unmatched comfort.
              </p>
            </div>

            <Link
              to="/shop?filter=featured"
              className="mt-4 md:mt-0 inline-flex items-center space-x-1 text-xs font-bold text-[#72C98A] hover:text-[#59B976]"
            >
              <span>Explore All Trending</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : trendingShoes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {trendingShoes.map((shoe) => (
                <ProductCard key={shoe.id} product={shoe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#718078] text-sm">
              Discover authentic footwear in our catalog.
            </div>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. NEW ARRIVALS SECTION                                  */}
      {/* ======================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#72C98A] uppercase tracking-widest mb-1">
              <Zap className="w-4 h-4 text-[#72C98A]" />
              <span>Just In</span>
            </div>
            <h2 className="font-outfit text-3xl sm:text-4xl font-extrabold text-[#26352D]">
              New Arrivals
            </h2>
            <p className="text-[#718078] text-sm mt-1">
              Fresh additions straight from official brand partners in Sri Lanka.
            </p>
          </div>

          <Link
            to="/shop?sort=newest"
            className="mt-4 md:mt-0 inline-flex items-center space-x-1 text-xs font-bold text-[#72C98A] hover:text-[#59B976]"
          >
            <span>View All New Additions</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((shoe) => (
              <ProductCard key={shoe.id} product={shoe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#718078] text-sm">
            Fresh drops arriving daily.
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 4.5 SPECIAL OFFERS SECTION                                */}
      {/* ======================================================== */}
      {specialOffers.length > 0 && (
        <section className="py-16 bg-white border-y border-[#DCEBE0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#72C98A] uppercase tracking-widest mb-1">
                  <Percent className="w-4 h-4 text-[#72C98A]" />
                  <span>Limited Time Price Drops</span>
                </div>
                <h2 className="font-outfit text-3xl sm:text-4xl font-extrabold text-[#26352D]">
                  Special Offers in Sri Lanka
                </h2>
                <p className="text-[#718078] text-sm mt-1">
                  Grab authentic pairs with exclusive discounts in Sri Lankan Rupees (LKR).
                </p>
              </div>

              <Link
                to="/shop?sort=price_asc"
                className="mt-4 md:mt-0 inline-flex items-center space-x-1 text-xs font-bold text-[#72C98A] hover:text-[#59B976]"
              >
                <span>View All Offers</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {specialOffers.map((shoe) => (
                <ProductCard key={shoe.id} product={shoe} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== */}
      {/* 5. BRAND PARTNERS INFINITE MARQUEE BANNER                 */}
      {/* ======================================================== */}
      <section className="py-16 bg-[#EAF6ED]/60 border-y border-[#DCEBE0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#72C98A] uppercase tracking-widest mb-2">
            <ShoeAvatarIcon className="w-3.5 h-3.5" />
            <span>Official Sri Lanka Partners</span>
          </div>
          <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#26352D]">
            Engineered By Global Leaders
          </h2>
          <p className="text-[#718078] text-xs sm:text-sm mt-1 max-w-xl mx-auto">
            Authorized partnerships bringing authenticated performance and lifestyle footwear directly to Sri Lanka.
          </p>
        </div>

        {/* Continuous Looping Brand Marquee Track */}
        <BrandMarqueeBanner brands={brands} />
      </section>

      {/* ======================================================== */}
      {/* 6. AI RECOMMENDATION INTRODUCTION WIZARD                 */}
      {/* ======================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#26352D] to-[#1B2720] text-white p-8 sm:p-14 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#72C98A] uppercase tracking-wider bg-white/10 px-3.5 py-1 rounded-full backdrop-blur-xs">
              <Cpu className="w-3.5 h-3.5" />
              <span>Smart Footwear Advisory</span>
            </div>
            <h2 className="font-outfit text-3xl sm:text-4xl font-extrabold leading-tight">
              Find Your Perfect Fit with STRIDEX Smart Advisor
            </h2>
            <p className="text-sm sm:text-base text-[#DCEBE0]/80 leading-relaxed">
              Unsure which model matches your arch, training routine, or daily commute? Select your preferences below for instant tailored suggestions.
            </p>

            {/* Quick Interactive Selector */}
            <div className="pt-2 space-y-4">
              <div className="space-y-1.5">
                <span className="text-xs text-[#BDECCB] font-semibold uppercase">1. Who are you shopping for?</span>
                <div className="flex gap-2">
                  {(['MEN', 'WOMEN', 'UNISEX'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setQuizGender(g)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        quizGender === g
                          ? 'bg-[#72C98A] text-white shadow-md'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs text-[#BDECCB] font-semibold uppercase">2. Primary activity?</span>
                <div className="flex gap-2">
                  {[
                    { label: 'Running & Marathon', value: 'running', slug: 'running-athletic' },
                    { label: 'Streetwear & Daily', value: 'daily', slug: 'casual-sneakers' },
                    { label: 'Executive Formal', value: 'formal', slug: 'formal-leather' },
                  ].map((goal) => (
                    <button
                      key={goal.value}
                      type="button"
                      onClick={() => setQuizGoal(goal.value as any)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        quizGoal === goal.value
                          ? 'bg-[#72C98A] text-white shadow-md'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      {goal.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={`/shop?gender=${quizGender}&category=${
                    quizGoal === 'running'
                      ? 'running-athletic'
                      : quizGoal === 'daily'
                      ? 'casual-sneakers'
                      : 'formal-leather'
                  }`}
                  className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs shadow-lg transition-all"
                >
                  <span>View Tailored Shoes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative Background Circles */}
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#72C98A]/20 blur-3xl pointer-events-none" />
          <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-[#BDECCB]/15 blur-2xl pointer-events-none" />
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. CUSTOMER REVIEWS & TESTIMONIALS                       */}
      {/* ======================================================== */}
      <section className="py-16 bg-white border-y border-[#DCEBE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#72C98A] uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>Sri Lanka Verified Customers</span>
            </div>
            <h2 className="font-outfit text-3xl font-extrabold text-[#26352D]">
              Trusted by 10,000+ Footwear Enthusiasts
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((rev, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#F2FAF4] border border-[#DCEBE0] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-1 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#26352D] leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#DCEBE0] flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-[#26352D] block font-outfit">{rev.name}</strong>
                    <span className="text-[#718078]">{rev.city}</span>
                  </div>
                  <span className="inline-flex items-center space-x-1 text-[#35A866] font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. NEWSLETTER SUBSCRIPTION SECTION                        */}
      {/* ======================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#DDF3E2] rounded-3xl border border-[#BDECCB] p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-white text-[#72C98A] flex items-center justify-center mx-auto shadow-xs">
            <Mail className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#26352D]">
              Unlock 10% Off Your First Pair
            </h2>
            <p className="text-xs sm:text-sm text-[#718078] max-w-md mx-auto">
              Subscribe to the STRIDEX insider newsletter for early access to limited sneaker releases, athlete reviews, and secret sales.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#DCEBE0] focus:border-[#72C98A] focus:outline-none text-xs text-[#26352D]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Subscribe
            </button>
          </form>

          <p className="text-[10px] text-[#718078]">
            No spam guaranteed. You can unsubscribe anytime with one click.
          </p>
        </div>
      </section>
    </div>
  );
};
