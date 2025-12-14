
import React from 'react';
import { TwoColumnInfoConfig, DesignConfig, TypographySettings } from '../../types';
import Reveal from './Reveal';
import { MagneticButton } from './Effects';

interface Props {
  id?: string;
  data: TwoColumnInfoConfig;
  theme: string;
  primaryColor: string;
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

const TwoColumnInfo: React.FC<Props> = ({ 
    id, data, theme, primaryColor, fontHeading, fontBody, borderRadius, enableAnimations, 
    design = { animation: 'slide-up', animationDuration: 'normal', buttonStyle: 'rounded', cardStyle: 'flat' }, 
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
    : { backgroundColor: data.backgroundColor || defaultBg };

  const textColor = data.textColor || defaultText;
  const parallaxClass = data.enableParallax ? 'bg-fixed' : '';

  // Effects Classes
  const grayscaleClass = data.enableGrayscale ? 'grayscale' : '';
  const sepiaClass = data.enableSepia ? 'sepia' : '';
  const borderClass = data.enableBorder ? 'border-y-8 border-gray-100/10' : '';

  // Radius map
  const radiusClass = {
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

  // Layout direction
  const flexDirection = data.imagePosition === 'left' ? 'md:flex-row' : 'md:flex-row-reverse';

  // Button styles
  let btnBg = primaryColor;
  let btnText = '#ffffff';
  let btnBorder = 'border border-transparent';
  let glowClass = '';
  
  if (design.buttonStyle === 'outline') {
      btnBg = 'transparent';
      btnText = primaryColor;
      btnBorder = `border-2 border-current`;
  } else if (design.buttonStyle === 'neumorphic') {
      btnBg = isDark ? '#1f2937' : '#f3f4f6';
      btnText = isDark ? '#ffffff' : '#1f2937';
      glowClass = isDark 
        ? 'shadow-[5px_5px_10px_#151c26,-5px_-5px_10px_#293648]' 
        : 'shadow-[5px_5px_10px_#d1d5db,-5px_-5px_10px_#ffffff]';
  }

  if (isHighContrastLight) {
     btnBg = '#000000';
     btnText = '#ffffff';
  } else if (isHighContrastDark) {
     btnBg = '#ffffff';
     btnText = '#000000';
  }

  // Typography Styles
  const headingStyle = getTypographyStyle(data.headingTypography, fontHeading);
  const bodyStyle = getTypographyStyle(data.bodyTypography, fontBody);

  return (
    <section 
      id={id}
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      className={`py-20 px-6 ${parallaxClass} ${grayscaleClass} ${sepiaClass} ${borderClass} relative cursor-pointer group`}
      style={{ ...bgStyle, color: textColor }}
    >
       <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 pointer-events-none transition-colors z-20"></div>

       {data.backgroundImage && (
          <div className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-white/80'}`}></div>
       )}

      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal enabled={enableAnimations} animation={animationType} duration={duration}>
            <div className={`flex flex-col ${flexDirection} items-center gap-12`}>
                
                {/* Image Side */}
                <div className="flex-1 w-full">
                    <img 
                        src={data.image} 
                        alt={data.title} 
                        className={`w-full h-auto object-cover shadow-xl ${radiusClass} ${data.enableHoverEffect ? 'hover:scale-[1.02] transition-transform duration-500' : ''}`}
                    />
                </div>

                {/* Content Side */}
                <div className="flex-1 w-full text-left">
                    <h2 
                        className={`text-3xl md:text-4xl font-bold mb-4`}
                        style={headingStyle}
                    >
                        {data.title}
                    </h2>
                    <p 
                        className={`text-lg md:text-xl opacity-70 mb-6 font-medium`}
                        style={bodyStyle}
                    >
                        {data.subtitle}
                    </p>
                    <div 
                        className={`text-lg leading-relaxed opacity-90 mb-8 whitespace-pre-wrap`}
                        style={bodyStyle}
                    >
                        {data.description}
                    </div>

                    {data.showButton && (
                        <MagneticButton enabled={design.buttonStyle === 'magnetic'}>
                            <a 
                                href={data.buttonLink}
                                onClick={(e) => e.preventDefault()}
                                className={`inline-block font-bold py-3 px-8 transition-all shadow-md hover:opacity-90 ${radiusClass} ${btnBorder} ${glowClass}`}
                                style={{ fontFamily: fontHeading, backgroundColor: btnBg, color: btnText }}
                            >
                                {data.buttonText}
                            </a>
                        </MagneticButton>
                    )}
                </div>

            </div>
        </Reveal>
      </div>
    </section>
  );
};

export default TwoColumnInfo;
