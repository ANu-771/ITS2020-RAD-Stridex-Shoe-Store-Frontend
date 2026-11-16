import React from 'react';

export interface ShoeAvatarIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
  strokeWidth?: number;
  variant?: 'icon' | 'badge';
  badgeClassName?: string;
}

/**
 * STRIDEX Custom Footwear & Sneaker Avatar Icon
 * A sleek, modern athletic shoe vector designed to replace generic star/sparkle avatars
 * with an authentic footwear brand symbol across hero badges, category headers, and pills.
 */
export const ShoeAvatarIcon: React.FC<ShoeAvatarIconProps> = ({
  className = 'w-4 h-4',
  size,
  strokeWidth = 2,
  variant = 'icon',
  badgeClassName = 'w-5 h-5 rounded-full bg-white border border-[#BDECCB] shadow-2xs p-0.5',
  ...props
}) => {
  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={variant === 'badge' ? 'w-full h-full object-contain' : className}
      aria-hidden="true"
      {...props}
    >
      {/* Sneaker Upper & Sole Profile */}
      <path d="M2.5 17.5h14.5c2.2 0 4-.7 4.7-1.8.6-1.1-.3-2.1-1.4-2.5l-3.3-1.1-2.8-4.2c-.6-.8-1.5-1.4-2.5-1.4H9.2c-.6 0-1.1.4-1.3 1L6.4 10l-2.9 1.4C2.5 12.1 2 13.4 2 14.8v2.7z" />
      {/* Midsole Layer Line */}
      <path d="M2.2 15.5h18" />
      {/* Athletic Dynamic Sweep / Swoosh Accent */}
      <path d="M6.5 13.5c2.8-1.2 6.2-.8 9.5 1" />
      {/* Sneaker Laces / Eyelets */}
      <path d="M12.2 8.6l1.8 1.4" />
      <path d="M10.8 10.4l1.8 1.4" />
    </svg>
  );

  if (variant === 'badge') {
    return (
      <span className={`inline-flex items-center justify-center shrink-0 ${badgeClassName}`}>
        {icon}
      </span>
    );
  }

  return icon;
};

export default ShoeAvatarIcon;
