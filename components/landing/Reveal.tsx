
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  enabled: boolean;
  className?: string;
  animation?: 'fade' | 'slide-up' | 'zoom-in' | 'reveal' | 'none';
  delay?: number;
}

const Reveal: React.FC<Props> = ({ children, enabled, className = '', animation = 'slide-up', delay = 0 }) => {
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

  switch (animation) {
      case 'fade':
          initialClass = 'opacity-0 duration-1000';
          visibleClass = 'opacity-100';
          break;
      case 'zoom-in':
          initialClass = 'opacity-0 scale-90 duration-700';
          visibleClass = 'opacity-100 scale-100';
          break;
      case 'reveal':
          // Clip path reveal effect
          initialClass = 'opacity-0 translate-y-8 blur-sm duration-700';
          visibleClass = 'opacity-100 translate-y-0 blur-0';
          break;
      case 'slide-up':
      default:
          initialClass = 'opacity-0 translate-y-12 duration-700';
          visibleClass = 'opacity-100 translate-y-0';
          break;
  }

  if (animation === 'none' || !enabled) {
      return <div className={className}>{children}</div>;
  }

  return (
    <div 
      ref={ref} 
      className={`${className} transition-all ease-out ${isVisible ? visibleClass : initialClass}`}
    >
      {children}
    </div>
  );
};

export default Reveal;
