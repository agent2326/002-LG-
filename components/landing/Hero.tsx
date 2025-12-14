
import React from 'react';
import { HeroConfig, DesignConfig, TypographySettings } from '../../types';
import Reveal from './Reveal';
import { MagneticButton } from './Effects';

interface Props {
  id?: string;
  data: HeroConfig;
  theme: string;
  primaryColor: string;
  secondaryColor: string;
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

const Hero: React.FC<Props> = ({ 
    id, data, theme, primaryColor, secondaryColor, buttonTextColor, fontHeading, fontBody, borderRadius, enableAnimations, 
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
  
  if (isHighContrastLight) {
    defaultBg = '#ffffff';
    defaultText = '#000000';
  } else if (isHighContrastDark) {
    defaultBg = '#000000';
    defaultText = '#ffffff';
  } else if (theme === 'midnight') {
    defaultBg = '#0f172a'; 
    defaultText = '#f8fafc';
  } else if (theme === 'sepia') {
    defaultBg = '#fdf6e3'; 
    defaultText = '#433422';
  } else if (isDark) {
    defaultBg = '#111827';
    defaultText = '#ffffff';
  }

  const bgStyle = data.backgroundImage 
    ? { backgroundImage: `url(${data.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : (data.backgroundType === 'gradient' 
        ? { backgroundImage: `radial-gradient(circle at center, ${data.gradientStart || '#ffffff'}, ${data.gradientEnd || '#000000'})` }
        : { backgroundColor: data.backgroundColor || defaultBg }
      );

  const textColor = data.textColor || defaultText;
  const parallaxClass = data.enableParallax ? 'bg-fixed' : '';
  const grayscaleClass = data.enableGrayscale ? 'grayscale' : '';
  const sepiaClass = data.enableSepia ? 'sepia' : '';
  const borderClass = data.enableBorder ? 'border-y-8 border-gray-100/10' : '';
  
  // Button logic...
  let btnBg = primaryColor;
  let btnText = buttonTextColor;
  let btnBorder = 'border border-transparent';
  let glowClass = '';
  let transformClass = 'hover:-translate-y-1';
  
  // ... (button styling logic same as before) ...
  if (design.buttonStyle === 'outline') {
      btnBg = 'transparent';
      btnText = primaryColor;
      btnBorder = `border-2 border-[${primaryColor}]`;
  }

  const radiusClass = design.buttonStyle === 'pill' ? 'rounded-full' : {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    '2xl': 'rounded-2xl',
    'full': 'rounded-full'
  }[borderRadius] || 'rounded-lg';

  const imageRadiusClass = {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    '2xl': 'rounded-2xl',
    'full': 'rounded-3xl'
  }[borderRadius] || 'rounded-2xl';

  const animationType = data.animation || design.animation || 'slide-up';
  const duration = design.animationDuration || 'normal';

  // Typography Styles
  const headingStyle = getTypographyStyle(data.headingTypography, fontHeading);
  const bodyStyle = getTypographyStyle(data.bodyTypography, fontBody);

  return (
    <section 
      id={id}
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      className={`py-20 px-6 ${parallaxClass} ${grayscaleClass} ${sepiaClass} ${borderClass} relative overflow-hidden cursor-pointer group`}
      style={{ ...bgStyle, color: textColor }}
    >
       <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 pointer-events-none transition-colors z-20"></div>

       {data.backgroundImage && (
          <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-white/60'}`}></div>
       )}

      <Reveal enabled={enableAnimations} animation={animationType} duration={duration} className="relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left relative">
            <h1 
              className={`text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight whitespace-pre-wrap`}
              style={headingStyle}
            >
              {data.title}
            </h1>
            <p 
              className={`text-xl md:text-2xl mb-10 opacity-90 whitespace-pre-wrap`}
              style={bodyStyle}
            >
              {data.subtitle}
            </p>
            
            {data.showButton !== false && (
                <div className="inline-block">
                   <MagneticButton enabled={design.buttonStyle === 'magnetic'}>
                    <a 
                      href={data.ctaLink}
                      onClick={(e) => e.preventDefault()} 
                      className={`inline-block px-8 py-4 font-semibold text-lg transition-all shadow-lg ${btnBorder} ${radiusClass} ${glowClass} ${transformClass}`}
                      style={{ fontFamily: fontHeading, backgroundColor: btnBg, color: btnText }}
                    >
                      {data.ctaText}
                    </a>
                   </MagneticButton>
                </div>
            )}
          </div>
          {data.image && (
            <div className="flex-1 relative">
              <img 
                src={data.image} 
                alt="Hero" 
                className={`relative shadow-2xl w-full object-cover ${imageRadiusClass} ${isHighContrastLight ? 'border-4 border-black' : isHighContrastDark ? 'border-4 border-white' : ''}`} 
              />
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
};

export default Hero;
