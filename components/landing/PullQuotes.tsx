
import React from 'react';
import { PullQuotesConfig, DesignConfig } from '../../types';
import Reveal from './Reveal';
import { Quote } from 'lucide-react';

interface Props {
  data: PullQuotesConfig;
  theme: string;
  fontHeading: string;
  fontBody: string;
  primaryColor: string;
  borderRadius: string;
  enableAnimations: boolean;
  design?: DesignConfig;
  onSelect?: () => void;
}

const PullQuotes: React.FC<Props> = ({ 
    data, theme, fontHeading, fontBody, primaryColor, borderRadius, enableAnimations, 
    design = { animation: 'slide-up', animationDuration: 'normal', buttonStyle: 'rounded' }, 
    onSelect 
}) => {
  if (!data.show) return null;

  const isHighContrast = theme.includes('high-contrast');
  const isHighContrastDark = theme === 'high-contrast-dark';
  const isHighContrastLight = theme === 'high-contrast-light';
  const isDark = theme === 'dark' || isHighContrastDark || theme === 'midnight';

  let defaultBg = '#ffffff';
  let defaultText = '#111827';
  let quoteIconColor = primaryColor;

  if (isHighContrastLight) {
    defaultBg = '#ffffff';
    defaultText = '#000000';
    quoteIconColor = '#000000';
  } else if (isHighContrastDark) {
    defaultBg = '#000000';
    defaultText = '#ffffff';
    quoteIconColor = '#ffffff';
  } else if (theme === 'midnight') {
    defaultBg = '#0f172a';
    defaultText = '#f8fafc';
  } else if (theme === 'sepia') {
    defaultBg = '#fdf6e3';
    defaultText = '#433422';
    quoteIconColor = '#b58900';
  } else if (isDark) {
    defaultBg = '#111827';
    defaultText = '#ffffff';
  }

  const bgStyle = data.backgroundImage 
    ? { backgroundImage: `url(${data.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : { backgroundColor: data.backgroundColor || defaultBg };

  const textColor = data.textColor || defaultText;
  const parallaxClass = data.enableParallax ? 'bg-fixed' : '';

  // Effects Classes
  const grayscaleClass = data.enableGrayscale ? 'grayscale' : '';
  const sepiaClass = data.enableSepia ? 'sepia' : '';
  const borderClass = data.enableBorder ? 'border-y-8 border-gray-100/10' : '';

  const animationType = data.animation || design.animation || 'slide-up';
  const duration = design.animationDuration || 'normal';

  // Radius map
  const radiusClass = {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    '2xl': 'rounded-2xl',
    'full': 'rounded-3xl' 
  }[borderRadius] || 'rounded-xl';

  return (
    <section 
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      className={`py-24 px-6 ${parallaxClass} ${grayscaleClass} ${sepiaClass} ${borderClass} relative cursor-pointer group`}
      style={{ ...bgStyle, color: textColor }}
    >
       <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 pointer-events-none transition-colors z-20"></div>

       {data.backgroundImage && (
          <div className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-white/80'}`}></div>
       )}

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="space-y-20">
            {data.items.map((item, idx) => (
                <Reveal 
                    key={idx} 
                    enabled={enableAnimations} 
                    animation={animationType} 
                    duration={duration} 
                    delay={idx * 150}
                    className="flex flex-col items-center text-center"
                >
                    <div className="mb-8 opacity-20">
                        <Quote size={64} style={{ color: quoteIconColor }} className="fill-current" />
                    </div>
                    
                    <blockquote 
                        className="text-3xl md:text-5xl font-serif italic leading-tight mb-8"
                        style={{ fontFamily: fontHeading }}
                    >
                        "{item.quote}"
                    </blockquote>

                    <div className="flex items-center gap-4">
                        {item.image && (
                            <img 
                                src={item.image} 
                                alt={item.author} 
                                className={`w-14 h-14 rounded-full object-cover border-2 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
                            />
                        )}
                        <div className="text-left">
                            <cite 
                                className="block font-bold not-italic text-lg"
                                style={{ fontFamily: fontBody }}
                            >
                                {item.author}
                            </cite>
                            {item.role && (
                                <span 
                                    className="block text-sm opacity-70"
                                    style={{ fontFamily: fontBody }}
                                >
                                    {item.role}
                                </span>
                            )}
                        </div>
                    </div>
                </Reveal>
            ))}
        </div>
      </div>
    </section>
  );
};

export default PullQuotes;
