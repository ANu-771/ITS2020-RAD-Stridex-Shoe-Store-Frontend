import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { Brand } from '../../types';

// Import brand logos from assets
import nikeLogo from '../../assets/nike-com-brandmark.svg';
import adidasLogo from '../../assets/adidas-com-brandmark.svg';
import dsiLogo from '../../assets/DSI-139x30-1.png';
import pumaLogo from '../../assets/puma-com-banner-2.jpg';
import newBalanceLogo from '../../assets/newbalance-com-brandmark.svg';
import underArmourLogo from '../../assets/underarmour-com-brandmark.svg';
import reebokLogo from '../../assets/reebok-com-brandmark.svg';
import converseLogo from '../../assets/converse-com-brandmark.svg';
import skechersLogo from '../../assets/skechers-com-brandmark.svg';
import timberlandLogo from '../../assets/timberland-com-brandmark.svg';
import columbiaLogo from '../../assets/columbia-com-logo.svg';
import allbirdsLogo from '../../assets/allbirds-com-brandmark.svg';

export interface BrandPartnerItem {
  name: string;
  slug: string;
  logo: string;
}

export const BRAND_PARTNERS: BrandPartnerItem[] = [
  { name: 'Nike', slug: 'nike', logo: nikeLogo },
  { name: 'Adidas', slug: 'adidas', logo: adidasLogo },
  { name: 'DSI Premier', slug: 'dsi-premier', logo: dsiLogo },
  { name: 'Puma', slug: 'puma', logo: pumaLogo },
  { name: 'New Balance', slug: 'new-balance', logo: newBalanceLogo },
  { name: 'Under Armour', slug: 'under-armour', logo: underArmourLogo },
  { name: 'Reebok', slug: 'reebok', logo: reebokLogo },
  { name: 'Converse', slug: 'converse', logo: converseLogo },
  { name: 'Skechers', slug: 'skechers', logo: skechersLogo },
  { name: 'Timberland', slug: 'timberland', logo: timberlandLogo },
  { name: 'Columbia', slug: 'columbia', logo: columbiaLogo },
  { name: 'Allbirds', slug: 'allbirds', logo: allbirdsLogo },
];

export interface BrandMarqueeBannerProps {
  brands?: Brand[];
}

export const BrandMarqueeBanner: FC<BrandMarqueeBannerProps> = ({ brands: _brands }) => {
  // Duplicate array twice to produce an unbroken, seamless continuous loop
  const marqueeItems = [...BRAND_PARTNERS, ...BRAND_PARTNERS];

  return (
    <div className="relative w-full overflow-hidden py-4 select-none">
      {/* Left Smooth Fade Vignette */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#F2FAF4] via-[#F2FAF4]/80 to-transparent z-10 pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Right Smooth Fade Vignette */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#F2FAF4] via-[#F2FAF4]/80 to-transparent z-10 pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Infinite Marquee Track */}
      <div className="animate-brand-marquee flex items-center">
        {marqueeItems.map((brand, index) => (
          <Link
            key={`${brand.slug}-${index}`}
            to={`/shop?brand=${brand.slug}`}
            className="group shrink-0 mx-3 sm:mx-4 px-6 sm:px-8 py-3.5 sm:py-4 h-20 sm:h-22 min-w-[150px] sm:min-w-[180px] bg-white rounded-2xl border border-[#DCEBE0] hover:border-[#72C98A] shadow-2xs hover:shadow-md transition-all duration-300 flex items-center justify-center cursor-pointer"
            title={`Browse ${brand.name} Footwear Collection`}
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="max-h-8 sm:max-h-9 max-w-[110px] sm:max-w-[130px] w-auto h-auto object-contain transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:scale-105"
              loading="lazy"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BrandMarqueeBanner;
