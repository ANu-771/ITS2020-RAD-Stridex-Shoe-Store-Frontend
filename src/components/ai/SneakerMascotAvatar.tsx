import React, { useState } from 'react';
import stridexChatbotAvatar from '../../assets/stridex_chatbot.webp';

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
          <div className="flex items-start gap-2.5">
            <img
              src={stridexChatbotAvatar}
              alt="STRIDEX Robot"
              className="w-6 h-6 object-contain shrink-0 mt-0.5"
            />
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
        {/* Floating 3D Robot Character */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 transition-transform duration-300 transform group-hover/avatar:scale-110 motion-reduce:transform-none">
          <div className="w-full h-full animate-mascot-float motion-reduce:animate-none drop-shadow-xl flex items-center justify-center">
            <img
              src={stridexChatbotAvatar}
              alt="STRIDEX AI Robot Mascot"
              className="w-full h-full object-contain filter drop-shadow-md select-none pointer-events-none"
            />
          </div>
        </div>

        {/* Soft Dynamic Shadow (Expands/contracts as robot floats) */}
        <div className="w-14 h-2.5 bg-[#26352D]/20 rounded-full filter blur-[2px] mt-0.5 animate-mascot-shadow motion-reduce:animate-none" />

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
            transform: translateY(-12px) rotate(1deg);
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
