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

    const playVideo = () => {
      if (videoRef.current && !motionMediaQuery.matches) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Browser autoplay policy / user interaction handled gracefully
          });
        }
      }
    };

    // Initial play attempt
    playVideo();

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
      if (videoRef.current) {
        if (e.matches) {
          videoRef.current.pause();
        } else {
          playVideo();
        }
      }
    };
    motionMediaQuery.addEventListener('change', handleMotionChange);

    // 2. Tab Visibility Recovery: Resume video immediately when user returns to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && videoRef.current && !motionMediaQuery.matches) {
        if (videoRef.current.paused) {
          playVideo();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 3. Heartbeat Watchdog: Check every 2.5s to ensure video never stays stalled or unexpectedly paused
    const watchdogInterval = setInterval(() => {
      if (
        document.visibilityState === 'visible' &&
        videoRef.current &&
        !motionMediaQuery.matches &&
        videoRef.current.paused
      ) {
        playVideo();
      }
    }, 2500);

    return () => {
      motionMediaQuery.removeEventListener('change', handleMotionChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(watchdogInterval);
    };
  }, []);

  // 4. Video Loop & Anti-Stall Event Handlers
  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      // Proactive zero-hitch loop rewind before Chromium EOF decode stall (within last 250ms)
      if (duration > 0 && currentTime >= duration - 0.25) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const handleStalledOrWaiting = () => {
    if (videoRef.current && !isReducedMotion) {
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none ${className}`}
    >
      {/* Fallback Static Light Green Atmosphere Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F2FAF4] via-[#EAF6ED] to-[#F2FAF4] z-0" />

      {/* HTML5 Video Element with Full Vibrancy & Opacity */}
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
          onEnded={handleVideoEnded}
          onTimeUpdate={handleTimeUpdate}
          onWaiting={handleStalledOrWaiting}
          onStalled={handleStalledOrWaiting}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out z-0 ${
            isVideoLoaded && !hasError ? 'opacity-95 lg:opacity-100' : 'opacity-0'
          }`}
        >
          {/* Primary source: local project asset */}
          <source src={heroVideo} type="video/mp4" />
          {/* Secondary fallback source: public static directory */}
          <source src="/videos/stridex-hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Directional Shade Overlays: Protective tone on left for typography readability, high-clarity on right for visuals */}
      {/* Mobile Vertical Gradient (stacked layout) */}
      <div className="block sm:hidden absolute inset-0 bg-gradient-to-b from-[#F2FAF4]/95 via-[#F2FAF4]/80 to-transparent z-[1] pointer-events-none" />

      {/* Tablet & Desktop Diagonal Directional Shade (matching user red line curve) */}
      <div className="hidden sm:block absolute inset-0 bg-[linear-gradient(110deg,#F2FAF4_0%,#F2FAF4_38%,rgba(242,250,244,0.85)_48%,rgba(242,250,244,0.3)_58%,transparent_72%)] z-[1] pointer-events-none" />

      {/* Bottom Transition Gradient: Smooth blending into the categories section */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#F2FAF4] to-transparent z-[2] pointer-events-none" />

      {/* Subtle Studio Ambient Mint Lighting Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] lg:w-[750px] h-[450px] lg:h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(189,236,203,0.22)_0%,transparent_70%)] pointer-events-none blur-3xl z-[2]" />
      <div className="absolute top-12 left-10 w-80 h-80 rounded-full bg-[#BDECCB]/20 blur-3xl pointer-events-none z-[2]" />
    </div>
  );
};
