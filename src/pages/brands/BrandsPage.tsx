import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ShoeAvatarIcon } from '../../components/common/ShoeAvatarIcon';
import { brandService } from '../../services/brandService';
import type { Brand } from '../../types';

export const BrandsPage: FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await brandService.getAll({ active: true });
        if (res.success) {
          setBrands(res.data);
        }
      } catch (err) {
        console.error('Failed to load brands', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBrands();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#F2FAF4] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#72C98A] uppercase tracking-widest bg-[#DDF3E2] px-3.5 py-1 rounded-full border border-[#BDECCB]">
          <ShoeAvatarIcon className="w-3.5 h-3.5" />
          <span>Curated Global Partners</span>
        </div>
        <h1 className="font-outfit text-3xl sm:text-5xl font-extrabold text-[#26352D]">
          Our Partner Brands
        </h1>
        <p className="text-sm sm:text-base text-[#718078] leading-relaxed">
          STRIDEX brings world-renowned athletic footwear powerhouses and premier Sri Lankan craftsmanship directly to your doorstep.
        </p>
      </div>

      {/* Brands Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-white rounded-3xl border border-[#DCEBE0]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((b) => (
            <div
              key={b.id}
              className="group bg-white rounded-3xl border border-[#DCEBE0] hover:border-[#72C98A] p-8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Brand Logo / Icon Box */}
                <div className="w-20 h-20 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] flex items-center justify-center p-3 mb-6 group-hover:scale-105 transition-transform duration-300">
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <span className="font-outfit font-extrabold text-xl text-[#26352D] uppercase">
                      {b.name.substring(0, 3)}
                    </span>
                  )}
                </div>

                <h3 className="font-outfit font-bold text-2xl text-[#26352D] group-hover:text-[#72C98A] transition-colors">
                  {b.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#718078] mt-2 leading-relaxed line-clamp-3">
                  {b.description || `Explore performance-engineered athletic and casual silhouettes from ${b.name}.`}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#DCEBE0] flex items-center justify-between">
                <span className="text-xs text-[#718078] font-medium">
                  {b.productCount !== undefined ? `${b.productCount} Models Available` : 'Active Collection'}
                </span>
                <Link
                  to={`/shop?brand=${b.slug}`}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#72C98A] hover:text-[#59B976] group-hover:translate-x-1 transition-all"
                >
                  <span>Explore Shoes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
