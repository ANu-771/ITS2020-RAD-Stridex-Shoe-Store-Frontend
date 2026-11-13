import { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import heroVideo from '../../assets/Adidas_HomePage_advertisment.mp4';

interface HeroVideoBackgroundProps {
  className?: string;
}

export const HeroVideoBackground: FC<HeroVideoBackgroundProps> = ({ className = '' }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // 1. Accessibility: Respect user's prefers-reduced-motion OS/browser setting
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionMediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
      if (videoRef.current) {
        if (e.matches) {
          videoRef.current.pause();
        } else {
          videoRef.current.play().catch(() => {
            // Autoplay policies handled gracefully
          });
        }
      }
    };

    motionMediaQuery.addEventListener('change', handleMotionChange);

    // 2. Autoplay attempt: modern browsers require muted + playsInline
    if (videoRef.current && !motionMediaQuery.matches) {
      videoRef.current.play().catch(() => {
        // Fallback: If autoplay is blocked by browser policy, keep video muted
      });
    }

    return () => {
      motionMediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none ${className}`}
    >
      {/* Fallback Static Light Green Atmosphere Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F2FAF4] via-[#EAF6ED] to-[#F2FAF4] z-0" />

      {/* HTML5 Video Element */}
      {!isReducedMotion && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlayThrough={() => setIsVideoLoaded(true)}
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={() => setHasError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out z-0 ${
            isVideoLoaded && !hasError ? 'opacity-65 sm:opacity-75' : 'opacity-0'
          }`}
        >
          {/* Primary source: local project asset */}
          <source src={heroVideo} type="video/mp4" />
          {/* Secondary fallback source: public static directory */}
          <source src="/videos/stridex-hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Light-Green Readability & Brand Atmospheric Overlays */}
      {/* 1. Horizontal Directional Tint: Higher opacity on left for crystal-clear headline readability, softer on right for sneaker action */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F2FAF4]/95 via-[#F2FAF4]/85 to-[#F2FAF4]/65 z-[1] pointer-events-none" />

      {/* 2. Vertical Transition Gradient: Smooth blending into the bottom section */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F2FAF4]/30 to-[#F2FAF4] z-[2] pointer-events-none" />

      {/* 3. STRIDEX Studio Ambient Mint Lighting Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[650px] lg:w-[850px] h-[500px] lg:h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(189,236,203,0.5)_0%,rgba(221,243,226,0.3)_50%,transparent_75%)] pointer-events-none blur-3xl z-[3]" />
      <div className="absolute top-12 left-10 w-80 h-80 rounded-full bg-[#BDECCB]/30 blur-3xl pointer-events-none z-[3]" />
    </div>
  );
};
