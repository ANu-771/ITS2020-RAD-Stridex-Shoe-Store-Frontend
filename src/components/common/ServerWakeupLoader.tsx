import { useEffect, useState, useRef } from 'react';
import type { FC } from 'react';
import shoeImg from '../../assets/home_page_shoe.png';
import bgImg from '../../assets/STRIDEX Studio Sneaker Portrait.png';
import api from '../../services/api';

export const ServerWakeupLoader: FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Initializing STRIDEX Footwear Cloud...');
  const isCheckedRef = useRef(false);

  useEffect(() => {
    const startTime = Date.now();
    const MIN_DISPLAY_MS = 1200; // Minimum splash screen presentation

    // Timer for dynamic seconds counter
    const timerInterval = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1;
        if (next < 3) {
          setStatusMessage('Connecting to STRIDEX Cloud...');
        } else if (next < 10) {
          setStatusMessage('Contacting server instance (checking live status)...');
        } else if (next < 25) {
          setStatusMessage('Waking up cloud server (Render free-tier cold start)...');
        } else {
          setStatusMessage('Database connected. Hydrating catalog... Almost ready!');
        }
        return next;
      });
    }, 1000);

    // Poll backend health check
    let pollTimeoutId: ReturnType<typeof setTimeout>;

    const dismissLoader = () => {
      if (isCheckedRef.current) return;
      isCheckedRef.current = true;
      clearInterval(timerInterval);

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

      setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          setIsDismissed(true);
        }, 650);
      }, remaining);
    };

    const checkServerHealth = async () => {
      try {
        await api.get('/health');
        dismissLoader();
      } catch {
        // If server is cold-starting, retry every 2 seconds
        if (!isCheckedRef.current) {
          pollTimeoutId = setTimeout(checkServerHealth, 2000);
        }
      }
    };

    checkServerHealth();

    // Safety timeout: dismiss after 45 seconds regardless to prevent infinite lockout
    const maxSafetyTimeout = setTimeout(() => {
      dismissLoader();
    }, 45000);

    return () => {
      clearInterval(timerInterval);
      clearTimeout(pollTimeoutId);
      clearTimeout(maxSafetyTimeout);
    };
  }, []);

  if (isDismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Self-contained keyframe styles for smooth hardware-accelerated animations */}
      <style>{`
        @keyframes stridexShoeFloat {
          0%, 100% {
            transform: translateY(-14px) rotate(-6deg);
          }
          50% {
            transform: translateY(14px) rotate(6deg);
          }
        }
        @keyframes stridexShadowPulse {
          0%, 100% {
            transform: scale(0.85);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.65;
          }
        }
        @keyframes stridexProgressBar {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(30%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        .animate-stridex-shoe {
          animation: stridexShoeFloat 3.2s ease-in-out infinite;
          will-change: transform;
        }
        .animate-stridex-shadow {
          animation: stridexShadowPulse 3.2s ease-in-out infinite;
          will-change: transform, opacity;
        }
        .animate-stridex-bar {
          animation: stridexProgressBar 1.8s ease-in-out infinite;
          will-change: transform;
        }
      `}</style>

      {/* Background Image: Editorial Photoshoot Asset */}
      <img
        src={bgImg}
        alt="STRIDEX Background"
        className="absolute inset-0 w-full h-full object-cover scale-105 filter blur-xs"
      />

      {/* Dark Luxury Emerald Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1A10]/92 via-[#09150D]/88 to-[#050B07]/96 backdrop-blur-md" />

      {/* Ambient Radial Neon Glow */}
      <div className="absolute w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-[#238F0D]/22 blur-[130px] pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#72C98A]/15 blur-[100px] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg mx-auto select-none">
        {/* Brand Header */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-[#BDECCB]/30 rounded-full px-4 py-1.5 shadow-lg mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-[#72C98A] animate-pulse" />
          <span className="font-outfit font-extrabold text-sm sm:text-base tracking-wider text-white">
            STRIDEX<span className="text-[#72C98A]">.</span>
          </span>
          <span className="text-[10px] tracking-widest uppercase font-mono text-[#A8F0BE] bg-black/30 px-2 py-0.5 rounded-full border border-white/10">
            CLOUD READY
          </span>
        </div>

        {/* 3D Floating & Rocking Sneaker */}
        <div className="relative flex flex-col items-center justify-center my-6 sm:my-8">
          <div className="animate-stridex-shoe relative flex items-center justify-center">
            <img
              src={shoeImg}
              alt="STRIDEX Sneaker"
              className="w-56 sm:w-72 md:w-80 h-auto object-contain drop-shadow-[0_25px_40px_rgba(35,143,13,0.38)] pointer-events-none"
              draggable={false}
            />
          </div>

          {/* Synchronized Pulsing Sole Shadow */}
          <div className="animate-stridex-shadow -mt-6 sm:-mt-8 w-44 sm:w-56 h-4 sm:h-5 rounded-[100%] bg-gradient-to-r from-transparent via-[#238F0D]/50 to-transparent blur-md" />
        </div>

        {/* Dynamic Status Text */}
        <h3 className="font-outfit font-bold text-lg sm:text-xl text-white tracking-wide mt-2">
          {statusMessage}
        </h3>
        <p className="text-xs sm:text-sm text-[#DCEBE0]/80 mt-1.5 font-sans max-w-sm">
          {seconds >= 3
            ? 'Free tier instances may take 20–30s to boot. Thank you for your patience!'
            : 'Authenticating digital catalog and product inventories...'}
        </p>

        {/* Luminous Animated Progress Bar */}
        <div className="w-56 sm:w-72 h-1.5 rounded-full bg-white/15 overflow-hidden relative mt-6 border border-white/10 shadow-inner">
          <div className="animate-stridex-bar absolute top-0 left-0 w-1/2 h-full rounded-full bg-gradient-to-r from-[#238F0D] via-[#72C98A] to-[#BDECCB] shadow-[0_0_12px_#72C98A]" />
        </div>

        {/* Connection Timer Badge */}
        <div className="mt-4 flex items-center space-x-2 text-[11px] font-mono text-[#A8F0BE]/80">
          <span className="w-1.5 h-1.5 rounded-full bg-[#72C98A]" />
          <span>Handshake elapsed: {seconds}s</span>
        </div>

        {/* Emergency bypass if taking unusually long */}
        {seconds >= 12 && (
          <button
            onClick={() => {
              setIsFading(true);
              setTimeout(() => setIsDismissed(true), 650);
            }}
            className="mt-5 text-xs text-[#A8F0BE] hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
          >
            Enter storefront directly &rarr;
          </button>
        )}
      </div>
    </div>
  );
};
