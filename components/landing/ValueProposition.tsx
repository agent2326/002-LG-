
import React from 'react';
import { ValuePropositionConfig, DesignConfig, TypographySettings } from '../../types';
import Reveal from './Reveal';
import { Check, Star, Zap, TrendingUp, Award } from 'lucide-react';

interface Props {
  id?: string;
  data: ValuePropositionConfig;
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

const ValueProposition: React.FC<Props> = ({ 
    id, data, theme, fontHeading, fontBody, primaryColor, borderRadius, enableAnimations, 
    design = { animation: 'slide-up', animationDuration: 'normal', buttonStyle: 'rounded' }, 
    onSelect 
}) => {
  if (!data.show) return null;

  const isHighContrast = theme.includes('high-contrast');
  const isHighContrastDark = theme === 'high-contrast-dark';
  const isHighContrastLight = theme === 'high-contrast-light';
  const isDark = theme === 'dark' || isHighContrastDark || theme === 'midnight';

  let defaultBg = '#f3f4f6';
  let defaultText = '#111827';
  let itemBg = '#ffffff';
  let borderItem = 'border border-gray-100';
  let iconBg = `${primaryColor}20`; // 20% opacity
  let iconColor = primaryColor;

  if (isHighContrastLight) {
    defaultBg = '#ffffff';
    defaultText = '#000000';
    itemBg = '#ffffff';
    borderItem = 'border-2 border-black';
    iconBg = 'transparent';
    iconColor = '#000000';
  } else if (isHighContrastDark) {
    defaultBg = '#000000';
    defaultText = '#ffffff';
    itemBg = '#000000';
    borderItem = 'border-2 border-white';
    iconBg = 'transparent';
    iconColor = '#ffffff';
  } else if (theme === 'midnight') {
    defaultBg = '#1e293b'; // slate-800
    defaultText = '#f8fafc';
    itemBg = '#0f172a'; // slate-900
    borderItem = 'border border-gray-700';
  } else if (theme === 'sepia') {
    defaultBg = '#eee8d5';
    defaultText = '#433422';
    itemBg = '#fdf6e3';
    borderItem = 'border-[#d3cbb7]';
    iconBg = '#d3cbb7';
    iconColor = '#b58900';
  } else if (isDark) {
    defaultBg = '#1f2937';
    defaultText = '#ffffff';
    itemBg = '#111827';
    borderItem = 'border border-gray-700';
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
  }[borderRadius] || 'rounded-xl';

  const animationType = data.animation || design.animation || 'slide-up';
  const duration = design.animationDuration || 'normal';

  // Typography Styles
  const headingStyle = getTypographyStyle(data.headingTypography, fontHeading);
  const bodyStyle = getTypographyStyle(data.bodyTypography, fontBody);

  return (
    <section 
      id={id}
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      className={`py-24 px-6 ${parallaxClass} ${grayscaleClass} ${sepiaClass} ${borderClass} relative cursor-pointer group`}
      style={{ ...bgStyle, color: textColor }}
    >
       <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 pointer-events-none transition-colors z-20"></div>

       {data.backgroundImage && (
          <div className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-white/80'}`}></div>
       )}

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <Reveal enabled={enableAnimations} animation={animationType} duration={duration} className="mb-16">
          <h2 
            className={`text-4xl md:text-5xl font-extrabold mb-6`}
            style={headingStyle}
          >
            {data.title}
          </h2>
          <p 
            className={`text-xl md:text-2xl opacity-80 max-w-2xl mx-auto`}
            style={bodyStyle}
          >
            {data.description}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-3xl mx-auto">
          {data.items.map((item, idx) => (
            <Reveal 
                key={idx} 
                enabled={enableAnimations} 
                animation={animationType} 
                duration={duration} 
                delay={idx * 100}
            >
                <div 
                    className={`flex items-center gap-4 p-4 ${radiusClass} shadow-sm transition-all duration-300 ${data.enableHoverEffect ? 'hover:scale-[1.02] hover:shadow-md' : ''} ${borderItem}`}
                    style={{ backgroundColor: itemBg }}
                >
                    <div 
                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: iconBg, color: iconColor }}
                    >
                        {item.icon ? (
                            <span className="font-bold text-lg">{item.icon}</span>
                        ) : (
                            <Check size={20} />
                        )}
                    </div>
                    <span 
                        className="font-semibold text-lg"
                        style={{ ...bodyStyle, color: isHighContrast ? 'inherit' : (data.bodyTypography?.color || undefined) }}
                    >
                        {item.text}
                    </span>
                </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
