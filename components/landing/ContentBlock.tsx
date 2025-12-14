
import React from 'react';
import { ContentBlock, DesignConfig, TypographySettings } from '../../types';
import Reveal from './Reveal';

interface Props {
  id?: string;
  data: ContentBlock;
  theme: string;
  primaryColor: string;
  fontHeading: string;
  fontBody: string;
  borderRadius?: string;
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

const ContentBlockRenderer: React.FC<Props> = ({ id, data, theme, primaryColor, fontHeading, fontBody, borderRadius = 'lg', enableAnimations, design, onSelect }) => {
  const isHighContrast = theme.includes('high-contrast');
  const isHighContrastDark = theme === 'high-contrast-dark';
  const isHighContrastLight = theme === 'high-contrast-light';
  const isDark = theme === 'dark' || isHighContrastDark || theme === 'midnight';
  
  let defaultBg = 'white';
  let defaultText = '#111827';
  let imageBorder = '';

  if (isHighContrastLight) {
     defaultBg = '#ffffff';
     defaultText = '#000000';
     imageBorder = 'border-4 border-black';
  } else if (isHighContrastDark) {
     defaultBg = '#000000';
     defaultText = '#ffffff';
     imageBorder = 'border-4 border-white';
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
  const hoverClass = data.enableHoverEffect ? 'hover:scale-[1.01] transition-transform duration-500' : '';
  
  // Effects Classes
  const grayscaleClass = data.enableGrayscale ? 'grayscale' : '';
  const sepiaClass = data.enableSepia ? 'sepia' : '';
  const borderClass = data.enableBorder ? 'border-y-8 border-gray-100/10' : '';

  const flexDir = data.imagePosition === 'left' ? 'md:flex-row' : data.imagePosition === 'right' ? 'md:flex-row-reverse' : 'flex-col';

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

  const animationType = data.animation || (design?.animation) || 'slide-up';
  const duration = design?.animationDuration || 'normal';

  // Typography Styles
  const headingStyle = getTypographyStyle(data.headingTypography, fontHeading);
  const bodyStyle = getTypographyStyle(data.bodyTypography, fontBody);

  return (
    <section 
      id={id}
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      className={`py-20 px-6 relative ${parallaxClass} ${hoverClass} ${grayscaleClass} ${sepiaClass} ${borderClass} cursor-pointer group`}
      style={{ ...bgStyle, color: textColor }}
    >
       <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 pointer-events-none transition-colors z-20"></div>

       {data.backgroundImage && (
          <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-white/60'}`}></div>
       )}

      <Reveal enabled={enableAnimations} animation={animationType} duration={duration} className="relative z-10">
        <div className={`max-w-6xl mx-auto flex flex-col ${flexDir} items-center gap-12`}>
          
          {data.image && (
            <div className={`flex-1 w-full ${data.imagePosition === 'bottom' ? 'order-2' : ''}`}>
               <img 
                 src={data.image} 
                 alt="Content" 
                 className={`shadow-lg w-full object-cover max-h-[500px] ${radiusClass} ${imageBorder}`} 
               />
            </div>
          )}

          <div className="flex-1 text-left w-full">
             <h2 
               className={`text-3xl font-bold mb-6`}
               style={headingStyle}
             >
               {data.title}
             </h2>
             <div 
               className={`text-lg leading-relaxed opacity-90 whitespace-pre-wrap`}
               style={bodyStyle}
             >
               {data.content}
             </div>
          </div>

        </div>
      </Reveal>
    </section>
  );
};

export default ContentBlockRenderer;
