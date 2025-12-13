
import React from 'react';
import { FeaturesConfig, DesignConfig } from '../../types';
import Reveal from './Reveal';
import { TiltCard } from './Effects';

interface Props {
  data: FeaturesConfig;
  theme: string;
  fontHeading: string;
  fontBody: string;
  secondaryColor: string;
  borderRadius: string;
  enableAnimations: boolean;
  design?: DesignConfig;
  onSelect?: () => void;
}

const Features: React.FC<Props> = ({ 
    data, theme, fontHeading, fontBody, secondaryColor, borderRadius, enableAnimations, 
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
  let cardDefaultBg = 'white';
  let shadowClass = 'shadow-sm';
  
  if (isHighContrastLight) {
    defaultBg = '#ffffff';
    defaultText = '#000000';
    cardDefaultBg = 'transparent';
  } else if (isHighContrastDark) {
    defaultBg = '#000000';
    defaultText = '#ffffff';
    cardDefaultBg = 'transparent';
  } else if (theme === 'midnight') {
    defaultBg = '#0b1121'; 
    defaultText = '#f8fafc';
    cardDefaultBg = '#1e293b'; 
  } else if (theme === 'sepia') {
    defaultBg = '#fdf6e3';
    defaultText = '#433422';
    cardDefaultBg = '#eee8d5';
  } else if (isDark) {
    defaultBg = '#1f2937';
    defaultText = '#ffffff';
    cardDefaultBg = '#374151';
  }

  let glassClass = '';
  let borderClass = '';
  let extraStyle: React.CSSProperties = {};
  
  if (cardStyle === 'glass') {
      cardDefaultBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)';
      glassClass = 'backdrop-blur-md border border-white/20';
  } else if (cardStyle === 'neumorphic') {
      cardDefaultBg = defaultBg; 
      shadowClass = isDark 
        ? 'shadow-[5px_5px_10px_#151c26,-5px_-5px_10px_#293648]' 
        : 'shadow-[5px_5px_10px_#d1d5db,-5px_-5px_10px_#ffffff]';
  } else if (cardStyle === 'float') {
      shadowClass = 'shadow-xl translate-y-[-4px]';
  } else if (cardStyle === 'border') {
      borderClass = isDark ? 'border border-gray-700' : 'border border-gray-200';
      shadowClass = '';
  } else if (cardStyle === 'glow-border') {
      borderClass = 'border border-transparent';
      shadowClass = isDark 
        ? `shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_${secondaryColor}40] hover:border-${secondaryColor}`
        : `shadow-[0_0_15px_rgba(0,0,0,0.05)] hover:shadow-[0_0_25px_${secondaryColor}40] hover:border-${secondaryColor}`;
      extraStyle = { borderColor: 'transparent', transition: 'all 0.3s ease' };
  } else if (cardStyle === 'pressed') {
      cardDefaultBg = isDark ? '#111827' : '#f3f4f6';
      shadowClass = 'shadow-inner';
      borderClass = isDark ? 'border border-gray-800' : 'border border-gray-200';
  } else if (cardStyle === 'skeuomorphic') {
      shadowClass = 'shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.1)]';
      borderClass = 'border-b-2 border-r-2 border-gray-300';
      if (isDark) borderClass = 'border-b-2 border-r-2 border-gray-900';
  } else if (cardStyle === 'shadow-stack') {
      shadowClass = 'shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]';
      borderClass = isDark ? 'border border-gray-700' : 'border border-gray-200';
  } else if (cardStyle === 'outline-offset') {
      shadowClass = '';
      borderClass = 'border-2 border-current outline outline-2 outline-offset-4 outline-current opacity-90';
  } else if (cardStyle === 'gradient-border') {
      shadowClass = 'shadow-lg';
      extraStyle = {
          position: 'relative',
          background: `linear-gradient(${cardDefaultBg}, ${cardDefaultBg}) padding-box, linear-gradient(45deg, ${secondaryColor}, ${secondaryColor}88) border-box`,
          border: '2px solid transparent',
      };
  }

  if (isHighContrastLight) borderClass = 'border-2 border-black';
  if (isHighContrastDark) borderClass = 'border-2 border-white';

  const bgStyle = data.backgroundImage 
    ? { backgroundImage: `url(${data.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : { backgroundColor: data.backgroundColor || defaultBg };

  const textColor = data.textColor || defaultText;
  const parallaxClass = data.enableParallax ? 'bg-fixed' : '';
  const grayscaleClass = data.enableGrayscale ? 'grayscale' : '';
  const sepiaClass = data.enableSepia ? 'sepia' : '';
  const sectionBorderClass = data.enableBorder ? 'border-y-8 border-gray-100/10' : '';
  
  let iconColor = secondaryColor;
  if (isHighContrastLight) iconColor = 'black';
  if (isHighContrastDark) iconColor = 'white';
  if (theme === 'sepia') iconColor = '#b58900';

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

      <div className="max-w-6xl mx-auto relative z-10">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.items.map((item, idx) => (
            <Reveal key={idx} enabled={enableAnimations} animation={animationType} duration={duration} delay={idx * 100}>
              <TiltCard enabled={cardStyle === 'tilt'}>
                  <div 
                    className={`p-8 h-full transition-all ${radiusClass} ${borderClass} ${shadowClass} ${hoverEffect} ${glassClass}`}
                    style={{ backgroundColor: cardDefaultBg, ...extraStyle }}
                  >
                    <div className="text-4xl mb-4" style={{ color: iconColor }}>{item.icon}</div>
                    <h3 
                      className={`text-xl font-bold mb-2`}
                      style={{ fontFamily: fontHeading }}
                    >
                      {item.title}
                    </h3>
                    <p 
                      className="opacity-80"
                      style={{ fontFamily: fontBody }}
                    >
                      {item.description}
                    </p>
                  </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
