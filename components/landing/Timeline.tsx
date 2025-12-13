
import React from 'react';
import { TimelineConfig, DesignConfig } from '../../types';
import Reveal from './Reveal';

interface Props {
  data: TimelineConfig;
  theme: string;
  fontHeading: string;
  fontBody: string;
  primaryColor: string;
  secondaryColor: string;
  borderRadius: string;
  enableAnimations: boolean;
  design?: DesignConfig;
  onSelect?: () => void;
}

const Timeline: React.FC<Props> = ({ 
    data, theme, fontHeading, fontBody, primaryColor, secondaryColor, borderRadius, enableAnimations, 
    design = { animation: 'slide-up', animationDuration: 'normal', buttonStyle: 'rounded', cardStyle: 'flat' }, 
    onSelect 
}) => {
  if (!data.show) return null;

  const isHighContrast = theme.includes('high-contrast');
  const isHighContrastDark = theme === 'high-contrast-dark';
  const isHighContrastLight = theme === 'high-contrast-light';
  const isDark = theme === 'dark' || isHighContrastDark || theme === 'midnight';

  const cardStyle = data.cardStyle || design.cardStyle || 'flat';

  let defaultBg = '#f9fafb';
  let defaultText = '#111827';
  let cardBg = '#ffffff';
  let shadowClass = 'shadow-md';
  let lineColor = '#e5e7eb'; // gray-200
  let dateColor = primaryColor;

  if (isHighContrastLight) {
    defaultBg = '#ffffff';
    defaultText = '#000000';
    cardBg = '#ffffff';
    lineColor = '#000000';
    dateColor = '#000000';
  } else if (isHighContrastDark) {
    defaultBg = '#000000';
    defaultText = '#ffffff';
    cardBg = '#000000';
    lineColor = '#ffffff';
    dateColor = '#ffffff';
  } else if (theme === 'midnight') {
    defaultBg = '#0b1121';
    defaultText = '#f8fafc';
    cardBg = '#1e293b';
    lineColor = '#334155';
  } else if (theme === 'sepia') {
    defaultBg = '#fdf6e3';
    defaultText = '#433422';
    cardBg = '#eee8d5';
    lineColor = '#d3cbb7';
    dateColor = '#b58900';
  } else if (isDark) {
    defaultBg = '#1f2937';
    defaultText = '#ffffff';
    cardBg = '#374151';
    lineColor = '#4b5563';
  }

  // Card Style overrides
  let glassClass = '';
  let cardBorder = '';
  let extraStyle: React.CSSProperties = {};

  if (cardStyle === 'glass') {
      cardBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)';
      glassClass = 'backdrop-blur-md border border-white/20';
  } else if (cardStyle === 'border') {
      cardBorder = isDark ? 'border border-gray-700' : 'border border-gray-200';
      shadowClass = '';
  } else if (cardStyle === 'neumorphic') {
      cardBg = defaultBg;
      shadowClass = isDark 
        ? 'shadow-[5px_5px_10px_#151c26,-5px_-5px_10px_#293648]' 
        : 'shadow-[5px_5px_10px_#d1d5db,-5px_-5px_10px_#ffffff]';
  } else if (cardStyle === 'flat') {
      shadowClass = 'shadow-none border border-gray-100';
      if (isDark) shadowClass = 'shadow-none border border-gray-700';
  }

  if (isHighContrastLight) cardBorder = 'border-2 border-black';
  if (isHighContrastDark) cardBorder = 'border-2 border-white';

  const bgStyle = data.backgroundImage 
    ? { backgroundImage: `url(${data.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : { backgroundColor: data.backgroundColor || defaultBg };

  const textColor = data.textColor || defaultText;
  const parallaxClass = data.enableParallax ? 'bg-fixed' : '';

  // Effects
  const grayscaleClass = data.enableGrayscale ? 'grayscale' : '';
  const sepiaClass = data.enableSepia ? 'sepia' : '';
  const sectionBorderClass = data.enableBorder ? 'border-y-8 border-gray-100/10' : '';

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

  const animationType = data.animation || design.animation || 'slide-up';
  const duration = design.animationDuration || 'normal';

  return (
    <section 
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      className={`py-20 px-6 ${parallaxClass} ${grayscaleClass} ${sepiaClass} ${sectionBorderClass} relative cursor-pointer group`}
      style={{ ...bgStyle, color: textColor }}
    >
       <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 pointer-events-none transition-colors z-20"></div>

       {data.backgroundImage && (
          <div className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-white/80'}`}></div>
       )}

      <div className="max-w-5xl mx-auto relative z-10">
        <Reveal enabled={enableAnimations} animation={animationType} duration={duration} className="text-center mb-16">
          <h2 
            className={`text-3xl font-bold mb-4`}
            style={{ fontFamily: fontHeading }}
          >
            {data.title}
          </h2>
          <p 
            className={`text-xl opacity-80`}
            style={{ fontFamily: fontBody }}
          >
            {data.subtitle}
          </p>
        </Reveal>

        <div className="relative">
            {/* Center Line */}
            <div 
                className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
                style={{ backgroundColor: lineColor }}
            ></div>

            <div className="space-y-12">
                {data.items.map((item, idx) => (
                    <Reveal 
                        key={idx} 
                        enabled={enableAnimations} 
                        animation={idx % 2 === 0 ? 'slide-right' : 'slide-left'} 
                        duration={duration} 
                        delay={idx * 150}
                        className={`relative flex flex-col md:flex-row items-center justify-between ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                        {/* Empty side for layout balance */}
                        <div className="hidden md:block w-5/12"></div>

                        {/* Center Dot */}
                        <div 
                            className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10 border-4"
                            style={{ 
                                backgroundColor: secondaryColor, 
                                borderColor: cardBg,
                                color: isHighContrastDark ? 'black' : 'white'
                            }}
                        >
                            <span className="text-xs font-bold">{item.icon || (idx + 1)}</span>
                        </div>

                        {/* Content Card */}
                        <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                            <div 
                                className={`p-6 ${radiusClass} ${shadowClass} ${cardBorder} ${glassClass} ${data.enableHoverEffect ? 'hover:-translate-y-1 transition-transform' : ''}`}
                                style={{ backgroundColor: cardBg, ...extraStyle }}
                            >
                                <span 
                                    className="text-sm font-bold tracking-wider uppercase mb-2 block"
                                    style={{ color: dateColor, fontFamily: fontBody }}
                                >
                                    {item.date}
                                </span>
                                <h3 
                                    className="text-xl font-bold mb-2"
                                    style={{ fontFamily: fontHeading }}
                                >
                                    {item.title}
                                </h3>
                                <p 
                                    className="opacity-80 text-sm leading-relaxed"
                                    style={{ fontFamily: fontBody }}
                                >
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
