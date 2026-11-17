import { useEffect, useRef, useState } from 'react';
import type { FC, ReactNode, CSSProperties } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // ms
  duration?: number; // ms
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number; // px
  threshold?: number; // 0 to 1
  once?: boolean;
}

export const ScrollReveal: FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 750,
  direction = 'up',
  distance = 28,
  threshold = 0.12,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Respect accessibility settings
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const element = domRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  const getTransform = (): string => {
    if (isVisible) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0) scale(0.99)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0) scale(0.99)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0) scale(0.99)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0) scale(0.99)`;
      case 'none':
        return 'translate3d(0, 0, 0) scale(0.98)';
      default:
        return `translate3d(0, ${distance}px, 0) scale(0.99)`;
    }
  };

  const style: CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: isVisible ? 'auto' : 'opacity, transform',
  };

  return (
    <div ref={domRef} style={style} className={className}>
      {children}
    </div>
  );
};
