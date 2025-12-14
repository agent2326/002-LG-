
import React from 'react';
import { TeamConfig, DesignConfig, TypographySettings } from '../../types';
import Reveal from './Reveal';
import { TiltCard } from './Effects';

interface Props {
  id?: string;
  data: TeamConfig;
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

const Team: React.FC<Props> = ({ 
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
  let cardDefaultBg = '#f9fafb';
  let shadowClass = 'shadow-sm';
  let roleColor = primaryColor;

  if (isHighContrastLight) {
    defaultBg = '#ffffff';
    defaultText = '#000000';
    cardDefaultBg = '#ffffff';
    roleColor = '#000000';
  } else if (isHighContrastDark) {
    defaultBg = '#000000';
    defaultText = '#ffffff';
    cardDefaultBg = '#000000';
    roleColor = '#ffffff';
  } else if (theme === 'midnight') {
    defaultBg = '#0b1121'; 
    defaultText = '#f8fafc';
    cardDefaultBg = '#1e293b'; 
  } else if (theme === 'sepia') {
    defaultBg = '#fdf6e3';
    defaultText = '#433422';
    cardDefaultBg = '#eee8d5';
    roleColor = '#b58900';
  } else if (isDark) {
    defaultBg = '#111827';
    defaultText = '#ffffff';
    cardDefaultBg = '#1f2937';
  }

  // Card Style Overrides
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
        ? `shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_${primaryColor}40] hover:border-${primaryColor}`
        : `shadow-[0_0_15px_rgba(0,0,0,0.05)] hover:shadow-[0_0_25px_${primaryColor}40] hover:border-${primaryColor}`;
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
          background: `linear-gradient(${cardDefaultBg}, ${cardDefaultBg}) padding-box, linear-gradient(45deg, ${primaryColor}, ${primaryColor}88) border-box`,
          border: '2px solid transparent',
      };
  }

  // Handle High Contrast Borders
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.items.map((item, idx) => (
            <Reveal key={idx} enabled={enableAnimations} animation={animationType} duration={duration} delay={idx * 100}>
              <TiltCard enabled={cardStyle === 'tilt'}>
                  <div 
                    className={`p-6 flex flex-col items-center text-center h-full transition-all ${radiusClass} ${borderClass} ${shadowClass} ${hoverEffect} ${glassClass}`}
                    style={{ backgroundColor: cardDefaultBg, ...extraStyle }}
                  >
                    <img 
                        src={item.avatar} 
                        alt={item.name} 
                        className={`w-32 h-32 rounded-full object-cover mb-6 ${isHighContrast ? 'border-2 border-current' : 'border-4 border-white/10'}`} 
                    />
                    <h3 
                      className={`text-xl font-bold mb-1`}
                      style={{ ...headingStyle, fontSize: data.headingTypography?.fontSize ? `${parseInt(data.headingTypography.fontSize) * 0.7}px` : undefined }}
                    >
                      {item.name}
                    </h3>
                    <p 
                      className="text-sm font-bold uppercase tracking-wider mb-4"
                      style={{ ...bodyStyle, color: isHighContrast ? 'inherit' : (data.bodyTypography?.color || roleColor), opacity: isHighContrast ? 1 : 0.9 }}
                    >
                      {item.role}
                    </p>
                    <p 
                      className="opacity-70 text-sm leading-relaxed"
                      style={{ ...bodyStyle, fontSize: data.bodyTypography?.fontSize ? `${parseInt(data.bodyTypography.fontSize) * 0.9}px` : undefined }}
                    >
                      {item.bio}
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

export default Team;
