
import React from 'react';
import { CTAConfig, DesignConfig, TypographySettings } from '../../types';
import Reveal from './Reveal';
import { MagneticButton } from './Effects';

interface Props {
  id?: string;
  data: CTAConfig;
  theme: string;
  primaryColor: string;
  buttonTextColor: string;
  fontHeading: string;
  fontBody: string;
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

const CTA: React.FC<Props> = ({ 
    id, data, theme, primaryColor, buttonTextColor, fontHeading, fontBody, borderRadius, enableAnimations, 
    design = { animation: 'slide-up', animationDuration: 'normal', buttonStyle: 'rounded', cardStyle: 'flat' }, 
    onSelect 
}) => {
  if (!data.show) return null;
  
  const isHighContrast = theme.includes('high-contrast');
  const isHighContrastDark = theme === 'high-contrast-dark';
  const isHighContrastLight = theme === 'high-contrast-light';
  const isDark = theme === 'dark' || isHighContrastDark || theme === 'midnight';

  let defaultBg = 'transparent';
  if (isHighContrastLight) defaultBg = '#ffffff';
  if (isHighContrastDark) defaultBg = '#000000';
  
  // Outer container style
  const bgStyle = data.backgroundImage 
    ? { backgroundImage: `url(${data.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : { backgroundColor: data.backgroundColor || defaultBg };

  const parallaxClass = data.enableParallax ? 'bg-fixed' : '';

  // Effects Classes
  const grayscaleClass = data.enableGrayscale ? 'grayscale' : '';
  const sepiaClass = data.enableSepia ? 'sepia' : '';
  const borderClass = data.enableBorder ? 'border-y-8 border-gray-100/10' : '';

  // Inner card style
  const specificButtonBg = data.buttonColor;
  const specificButtonText = data.buttonTextColor;

  let cardBg = primaryColor;
  let cardText = 'white';
  
  // Default Button Styles (Standard Mode)
  let buttonBg = specificButtonBg || 'white';
  let buttonText = specificButtonText || primaryColor;
  
  let cardBorder = '';
  let buttonBorder = '';
  let buttonHover = 'hover:bg-gray-50';
  let glowClass = '';
  let transformClass = 'hover:-translate-y-1';

  // Extended Button Logic
  if (design.buttonStyle === 'glow') {
      glowClass = 'shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]';
  }
  if (design.buttonStyle === 'neumorphic') {
      buttonBg = '#f3f4f6';
      buttonText = primaryColor;
      glowClass = 'shadow-[5px_5px_10px_#d1d5db,-5px_-5px_10px_#ffffff]';
      transformClass = 'hover:scale-[0.98] active:scale-[0.95]';
      buttonHover = '';
  }
  if (design.buttonStyle === '3d') {
      buttonBorder = 'border-b-4 border-gray-200';
      transformClass = 'active:border-b-0 active:translate-y-1';
  }
  if (design.buttonStyle === 'outline') {
      buttonBg = 'transparent';
      buttonText = 'white';
      buttonBorder = 'border-2 border-white';
      buttonHover = 'hover:bg-white/10';
  }

  // Handle High Contrast Overrides
  if (isHighContrastLight) {
     cardBg = '#ffffff';
     cardText = '#000000';
     buttonBg = '#ffffff';
     buttonText = '#000000';
     cardBorder = 'border-4 border-black';
     buttonBorder = 'border-2 border-black';
     buttonHover = 'hover:bg-black hover:text-white';
  } else if (isHighContrastDark) {
     cardBg = '#000000';
     cardText = '#ffffff';
     buttonBg = '#000000';
     buttonText = '#ffffff';
     cardBorder = 'border-4 border-white';
     buttonBorder = 'border-2 border-white';
     buttonHover = 'hover:bg-white hover:text-black';
  } else if (theme === 'sepia') {
     cardBg = '#eee8d5';
     cardText = '#433422';
     if (!specificButtonBg) {
         buttonBg = '#433422';
         buttonHover = 'hover:bg-[#594532]';
     }
     if (!specificButtonText) buttonText = '#fdf6e3';
  } else {
     // Standard theme logic overrides
     if (!specificButtonBg && design.buttonStyle !== 'outline' && design.buttonStyle !== 'neumorphic') {
         buttonBg = 'white';
         buttonHover = 'hover:bg-gray-100';
     }
  }

  // Radius map
  const radiusClass = {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    '2xl': 'rounded-2xl',
    'full': 'rounded-3xl'
  }[borderRadius] || 'rounded-3xl';

  const buttonRadius = design.buttonStyle === 'pill' ? 'rounded-full' : (borderRadius === 'full' ? 'rounded-full' : radiusClass);

  const animationType = data.animation || design.animation || 'slide-up';
  const duration = design.animationDuration || 'normal';

  // Typography Styles
  const headingStyle = getTypographyStyle(data.headingTypography, fontHeading);
  const bodyStyle = getTypographyStyle(data.bodyTypography, fontBody);

  return (
    <section 
      id={id}
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      className={`py-20 px-6 ${parallaxClass} ${grayscaleClass} ${sepiaClass} ${borderClass} relative cursor-pointer group`}
      style={bgStyle}
    >
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 pointer-events-none transition-colors z-20"></div>

      <Reveal enabled={enableAnimations} animation={animationType} duration={duration}>
        <div 
          className={`max-w-4xl mx-auto text-center py-16 px-6 shadow-2xl ${radiusClass} ${cardBorder} ${data.enableHoverEffect ? 'hover:scale-105 transition-transform duration-300' : ''}`}
          style={{ backgroundColor: cardBg }}
        >
          <h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{ ...headingStyle, color: data.headingTypography?.color || data.textColor || cardText }}
          >
            {data.title}
          </h2>
          <p 
            className="text-xl mb-10 max-w-2xl mx-auto"
            style={{ ...bodyStyle, color: data.bodyTypography?.color || data.textColor || cardText, opacity: 0.9 }}
          >
            {data.description}
          </p>
          <MagneticButton enabled={design.buttonStyle === 'magnetic'}>
            <button 
                className={`font-bold py-4 px-10 transition-all shadow-md ${buttonRadius} ${buttonBorder} ${buttonHover} ${glowClass} ${transformClass}`}
                style={{ fontFamily: fontHeading, backgroundColor: buttonBg, color: buttonText }}
                onClick={(e) => e.preventDefault()}
            >
                {data.buttonText}
            </button>
          </MagneticButton>
        </div>
      </Reveal>
    </section>
  );
};

export default CTA;
