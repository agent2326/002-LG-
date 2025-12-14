
import React from 'react';
import { ManifestoConfig, DesignConfig, TypographySettings } from '../../types';
import Reveal from './Reveal';

interface Props {
  id?: string;
  data: ManifestoConfig;
  theme: string;
  fontHeading: string;
  primaryColor: string;
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

const Manifesto: React.FC<Props> = ({ 
    id, data, theme, fontHeading, primaryColor, enableAnimations, 
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
    : { backgroundColor: data.backgroundColor || defaultBg };

  const textColor = data.textColor || defaultText;
  const parallaxClass = data.enableParallax ? 'bg-fixed' : '';

  // Effects Classes
  const grayscaleClass = data.enableGrayscale ? 'grayscale' : '';
  const sepiaClass = data.enableSepia ? 'sepia' : '';
  const borderClass = data.enableBorder ? 'border-y-8 border-gray-100/10' : '';

  const animationType = data.animation || design.animation || 'slide-up';
  const duration = design.animationDuration || 'normal';

  // Typography Styles
  const headingStyle = getTypographyStyle(data.headingTypography, fontHeading);
  
  return (
    <section 
      id={id}
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      className={`py-24 px-6 ${parallaxClass} ${grayscaleClass} ${sepiaClass} ${borderClass} relative cursor-pointer group flex items-center justify-center`}
      style={{ ...bgStyle, color: textColor }}
    >
       <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 pointer-events-none transition-colors z-20"></div>

       {data.backgroundImage && (
          <div className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-white/80'}`}></div>
       )}

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        {data.title && (
            <Reveal enabled={enableAnimations} animation={animationType} duration={duration} className="mb-12">
                <span className="text-sm font-bold uppercase tracking-[0.2em] opacity-60" style={headingStyle}>
                    {data.title}
                </span>
            </Reveal>
        )}

        <div className="space-y-6 md:space-y-8">
            {data.items.map((item, idx) => (
                <Reveal 
                    key={idx} 
                    enabled={enableAnimations} 
                    animation={animationType} 
                    duration={duration} 
                    delay={idx * 150}
                >
                    <h2 
                        className={`text-3xl md:text-5xl lg:text-6xl font-bold leading-tight ${item.highlight ? '' : 'opacity-80'}`}
                        style={headingStyle}
                    >
                        {item.highlight ? (
                            <span style={{ color: isHighContrast ? textColor : primaryColor }}>
                                {item.text}
                            </span>
                        ) : (
                            item.text
                        )}
                    </h2>
                </Reveal>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
