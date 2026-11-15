import React, { useState } from 'react';

interface SneakerMascotAvatarProps {
  onClick: () => void;
  isOpen: boolean;
  unreadCount?: number;
}

export const SneakerMascotAvatar: React.FC<SneakerMascotAvatarProps> = ({
  onClick,
  isOpen,
  unreadCount = 0,
}) => {
  const [bubbleDismissed, setBubbleDismissed] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none group">
      {/* Speech Greeting Bubble (Visible when chat is closed and not dismissed) */}
      {!isOpen && !bubbleDismissed && (
        <div
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick();
            }
          }}
          className="relative mb-3 mr-1 bg-white text-[#26352D] px-4 py-2.5 rounded-2xl shadow-lg border border-[#DCEBE0] max-w-[240px] text-xs sm:text-sm font-medium leading-snug cursor-pointer transition-all duration-300 hover:scale-105 hover:border-[#72C98A] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#72C98A]"
        >
          <div className="flex items-start gap-2">
            <span className="text-base select-none">👟</span>
            <div>
              <p className="font-semibold text-[#1B2820]">
                Hi! Need help finding your perfect shoes?
              </p>
              <p className="text-[11px] text-[#718078] mt-0.5">
                Chat with STRIDEX AI Assistant
              </p>
            </div>
          </div>

          {/* Dismiss tiny cross button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setBubbleDismissed(true);
            }}
            aria-label="Dismiss greeting"
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#F2FAF4] border border-[#DCEBE0] text-[#718078] hover:text-[#26352D] hover:bg-white rounded-full flex items-center justify-center text-[10px] shadow-sm transition-colors"
          >
            ✕
          </button>

          {/* Tail of speech bubble */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-[#DCEBE0] transform rotate-45" />
        </div>
      )}

      {/* Mascot Trigger Button */}
      <button
        type="button"
        onClick={onClick}
        aria-label={isOpen ? 'Close STRIDEX AI Assistant' : 'Open STRIDEX AI Assistant'}
        aria-expanded={isOpen}
        className="relative flex flex-col items-center justify-center focus:outline-none group/avatar"
      >
        {/* Floating Sneaker Character */}
        <div className="w-16 h-16 sm:w-18 sm:h-18 transition-transform duration-300 transform group-hover/avatar:scale-110 motion-reduce:transform-none">
          <div className="w-full h-full animate-mascot-float motion-reduce:animate-none drop-shadow-md">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full filter"
            >
              {/* Sneaker Outsole (Bottom rubber tread) */}
              <path
                d="M12 78 C25 80, 50 81, 75 80 C86 79, 92 74, 90 68 C87 63, 78 64, 70 65 C55 67, 30 67, 18 69 C10 70, 7 74, 12 78 Z"
                fill="#26352D"
              />

              {/* Sneaker Midsole (White foam cushion with mint stripe) */}
              <path
                d="M14 74 C26 76, 52 76, 74 74 C84 73, 90 69, 88 64 C84 60, 75 61, 68 62 C52 64, 28 64, 18 66 C11 67, 9 71, 14 74 Z"
                fill="#FFFFFF"
                stroke="#DCEBE0"
                strokeWidth="1.5"
              />
              {/* Midsole Fresh Green Accent Line */}
              <path
                d="M22 71 C38 72, 60 71, 80 68"
                stroke="#72C98A"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Main Shoe Upper Body (STRIDEX Fresh Green #72C98A) */}
              <path
                d="M18 66 C24 55, 34 40, 48 38 C56 36, 62 44, 65 50 C70 52, 78 54, 85 58 C88 60, 87 64, 85 66 C75 66, 32 66, 18 66 Z"
                fill="url(#stridexGreenGrad)"
                stroke="#59B976"
                strokeWidth="1.2"
              />

              {/* Sneaker Collar & Tongue (Soft Mint #DDF3E2) */}
              <path
                d="M44 38 C42 30, 48 24, 56 26 C62 28, 64 36, 62 44 C56 42, 48 40, 44 38 Z"
                fill="#DDF3E2"
                stroke="#BDECCB"
                strokeWidth="1"
              />

              {/* Sneaker Toe Box Cap (Pure White) */}
              <path
                d="M72 55 C78 57, 85 60, 85 65 C78 65, 72 65, 68 64 C67 60, 70 56, 72 55 Z"
                fill="#FFFFFF"
                opacity="0.95"
              />

              {/* Friendly Smiling Face on Upper Quarter */}
              {/* Left Happy Eye (Curved happy arc) */}
              <path
                d="M40 50 C41 46, 45 46, 46 50"
                stroke="#26352D"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Right Happy Eye (Curved happy arc with wink twinkle) */}
              <path
                d="M52 48 C53 44, 57 44, 58 48"
                stroke="#26352D"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Sparkle star next to eye */}
              <path
                d="M62 42 L63 45 L66 46 L63 47 L62 50 L61 47 L58 46 L61 45 Z"
                fill="#FFE27A"
              />

              {/* Rosy Cheeks (Blush) */}
              <circle cx="37" cy="54" r="3" fill="#F8A599" opacity="0.65" />
              <circle cx="61" cy="52" r="3" fill="#F8A599" opacity="0.65" />

              {/* Sweet Smiling Mouth */}
              <path
                d="M46 54 C48 57, 51 57, 53 54"
                stroke="#26352D"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />

              {/* Sneaker Laces (White criss-cross ribbons) */}
              <line x1="50" y1="36" x2="57" y2="40" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              <line x1="54" y1="33" x2="61" y2="37" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

              {/* Tiny Cute Bow at top of tongue */}
              <path
                d="M53 26 C50 24, 48 26, 52 28 C56 26, 58 24, 55 26"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
              />

              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="stridexGreenGrad" x1="18" y1="38" x2="88" y2="68" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#72C98A" />
                  <stop offset="0.6" stopColor="#59B976" />
                  <stop offset="1" stopColor="#43A361" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Soft Dynamic Shadow (Expands/contracts as sneaker floats) */}
        <div className="w-12 h-2.5 bg-[#26352D]/15 rounded-full filter blur-[2px] mt-1 animate-mascot-shadow motion-reduce:animate-none" />

        {/* Online Indicator Badge */}
        <span className="absolute top-0 right-0 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#72C98A] opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#72C98A] border-2 border-white shadow-sm" />
        </span>

        {/* Unread Message Pill */}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -left-1 bg-[#E45D5D] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-md animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Animation Styles */}
      <style>{`
        @keyframes mascotFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(2deg);
          }
        }
        @keyframes mascotShadow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.25;
          }
          50% {
            transform: scale(0.8);
            opacity: 0.12;
          }
        }
        .animate-mascot-float {
          animation: mascotFloat 3.4s ease-in-out infinite;
        }
        .animate-mascot-shadow {
          animation: mascotShadow 3.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
