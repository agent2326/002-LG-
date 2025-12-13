
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  enabled: boolean;
  className?: string;
  animation?: 'fade' | 'slide-up' | 'zoom-in' | 'reveal' | 'none' | 'slide-left' | 'slide-right';
  duration?: 'fast' | 'normal' | 'slow';
  delay?: number;
}

const Reveal: React.FC<Props> = ({ children, enabled, className = '', animation = 'slide-up', duration = 'normal', delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled || animation === 'none') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [enabled, animation, delay]);

  let initialClass = '';
  let visibleClass = '';
  
  // Map duration presets to Tailwind classes
  const durationClass = duration === 'fast' ? 'duration-500' : duration === 'slow' ? 'duration-[1500ms]' : 'duration-1000';

  switch (animation) {
      case 'fade':
          initialClass = 'opacity-0';
          visibleClass = 'opacity-100';
          break;
      case 'zoom-in':
          initialClass = 'opacity-0 scale-90';
          visibleClass = 'opacity-100 scale-100';
          break;
      case 'reveal':
          // Clip path reveal effect
          initialClass = 'opacity-0 translate-y-8 blur-sm';
          visibleClass = 'opacity-100 translate-y-0 blur-0';
          break;
      case 'slide-left':
          initialClass = 'opacity-0 -translate-x-12';
          visibleClass = 'opacity-100 translate-x-0';
          break;
      case 'slide-right':
          initialClass = 'opacity-0 translate-x-12';
          visibleClass = 'opacity-100 translate-x-0';
          break;
      case 'slide-up':
      default:
          initialClass = 'opacity-0 translate-y-12';
          visibleClass = 'opacity-100 translate-y-0';
          break;
  }

  if (animation === 'none' || !enabled) {
      return <div className={className}>{children}</div>;
  }

  return (
    <div 
      ref={ref} 
      className={`${className} transition-all ease-out ${durationClass} ${isVisible ? visibleClass : initialClass}`}
    >
      {children}
    </div>
  );
};

export default Reveal;
