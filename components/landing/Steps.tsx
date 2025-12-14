
import React from 'react';
import { StepsConfig, DesignConfig, TypographySettings } from '../../types';
import Reveal from './Reveal';
import { ArrowRight, ArrowDown } from 'lucide-react';

interface Props {
  id?: string;
  data: StepsConfig;
  theme: string;
  fontHeading: string;
  fontBody: string;
  primaryColor: string;
  borderRadius: string;
  enableAnimations: boolean;
  design?: DesignConfig;
  onSelect?: () => void;
}

const getTypographyStyle = (settings?: TypographySettings, defaultFont?: string) => ({
    fontFamily: settings?.fontFamily || defaultFont,
    fontWeight: settings?.fontWeight,
    fontSize: settings?.fontSize ? `${settings.fontSize}px` : undefined,
    lineHeight: settings?.lineHeight,
    letterSpacing: settings?.letterSpacing ? `${settings.letterSpacing}em` : undefined,
    textTransform: settings?.textTransform,
    color: settings?.color
});

const Steps: React.FC<Props> = ({ 
    id, data, theme, fontHeading, fontBody, primaryColor, borderRadius, enableAnimations, 
    design = { animation: 'slide-up', animationDuration: 'normal', buttonStyle: 'rounded', cardStyle: 'flat' }, 
    onSelect 
}) => {
  if (!data.show) return null;

  const isHighContrast = theme.includes('high-contrast');
  const isHighContrastDark = theme === 'high-contrast-dark';
  const isHighContrastLight = theme === 'high-contrast-light';
  const isDark = theme === 'dark' || isHighContrastDark || theme === 'midnight';

  const cardStyle = data.cardStyle || design.cardStyle || 'flat';

  let defaultBg = '#ffffff';
  let defaultText = '#111827';
  let cardBg = '#f9fafb';
  let shadowClass = '';
  
  if (isHighContrastLight) {
    defaultBg = '#ffffff';
    defaultText = '#000000';
    cardBg = '#ffffff';
  } else if (isHighContrastDark) {
    defaultBg = '#000000';
    defaultText = '#ffffff';
    cardBg = '#000000';
  } else if (theme === 'midnight') {
    defaultBg = '#0b1121'; 
    defaultText = '#f8fafc';
    cardBg = '#1e293b'; 
  } else if (theme === 'sepia') {
    defaultBg = '#fdf6e3';
    defaultText = '#433422';
    cardBg = '#eee8d5';
  } else if (isDark) {
    defaultBg = '#111827';
    defaultText = '#ffffff';
    cardBg = '#1f2937';
  }

  // Card Style Overrides
  let glassClass = '';
  let borderClass = '';
  let extraStyle: React.CSSProperties = {};
  
  if (cardStyle === 'glass') {
      cardBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)';
      glassClass = 'backdrop-blur-md border border-white/20';
  } else if (cardStyle === 'neumorphic') {
      cardBg = defaultBg;
      shadowClass = isDark 
        ? 'shadow-[5px_5px_10px_#151c26,-5px_-5px_10px_#293648]' 
        : 'shadow-[5px_5px_10px_#d1d5db,-5px_-5px_10px_#ffffff]';
  } else if (cardStyle === 'border') {
      borderClass = isDark ? 'border border-gray-700' : 'border border-gray-200';
  } else if (cardStyle === 'hover-lift' || cardStyle === 'flat') {
      shadowClass = cardStyle === 'hover-lift' ? 'shadow-md' : 'shadow-sm';
  }

  if (isHighContrastLight) borderClass = 'border-2 border-black';
  if (isHighContrastDark) borderClass = 'border-2 border-white';

  const bgStyle = data.backgroundImage 
    ? { backgroundImage: `url(${data.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : { backgroundColor: data.backgroundColor || defaultBg };

  const textColor = data.textColor || defaultText;
  const parallaxClass = data.enableParallax ? 'bg-fixed' : '';

  // Effects Classes
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

  const hoverEffect = (cardStyle === 'hover-lift' || data.enableHoverEffect) ? 'hover:-translate-y-2 hover:shadow-xl duration-300' : '';
  const animationType = data.animation || design.animation || 'slide-up';
  const duration = design.animationDuration || 'normal';

  // Typography Styles
  const headingStyle = getTypographyStyle(data.headingTypography, fontHeading);
  const bodyStyle = getTypographyStyle(data.bodyTypography, fontBody);

  return (
    <section 
      id={id}
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      className={`py-20 px-6 ${parallaxClass} ${grayscaleClass} ${sepiaClass} ${sectionBorderClass} relative cursor-pointer group`}
      style={{ ...bgStyle, color: textColor }}
    >
       <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 pointer-events-none transition-colors z-20"></div>

       {data.backgroundImage && (
          <div className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-white/80'}`}></div>
       )}

      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal enabled={enableAnimations} animation={animationType} duration={duration} className="text-center mb-16">
          <h2 
            className={`text-3xl font-bold mb-4`}
            style={headingStyle}
          >
            {data.title}
          </h2>
          <p 
            className={`text-xl opacity-80`}
            style={bodyStyle}
          >
            {data.subtitle}
          </p>
        </Reveal>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {data.items.map((item, idx) => (
            <div key={idx} className="relative flex flex-col h-full">
                <Reveal enabled={enableAnimations} animation={animationType} duration={duration} delay={idx * 150} className="h-full">
                    <div 
                        className={`p-8 h-full flex flex-col items-center text-center relative z-10 ${radiusClass} ${borderClass} ${shadowClass} ${hoverEffect} ${glassClass}`}
                        style={{ backgroundColor: cardBg, ...extraStyle }}
                    >
                        <div 
                            className={`w-12 h-12 flex items-center justify-center rounded-full text-xl font-bold mb-6`}
                            style={{ backgroundColor: primaryColor, color: '#ffffff', fontFamily: fontHeading }}
                        >
                            {idx + 1}
                        </div>
                        <h3 
                            className={`text-xl font-bold mb-3`}
                            style={headingStyle}
                        >
                            {item.title}
                        </h3>
                        <p 
                            className="opacity-80 text-sm leading-relaxed"
                            style={bodyStyle}
                        >
                            {item.description}
                        </p>
                    </div>
                </Reveal>

                {/* Connector Arrows (Desktop: Right, Mobile: Down) */}
                {idx < data.items.length - 1 && (
                    <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 md:top-1/2 md:left-full md:bottom-auto md:translate-x-0 md:-translate-y-1/2 z-0 md:pl-2">
                        <ArrowDown className="md:hidden text-gray-300" size={24} />
                        <ArrowRight className="hidden md:block text-gray-300" size={24} />
                    </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;
