
import React from 'react';
import { ProcessConfig, DesignConfig } from '../../types';
import Reveal from './Reveal';

interface Props {
  data: ProcessConfig;
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

const Process: React.FC<Props> = ({ 
    data, theme, fontHeading, fontBody, primaryColor, secondaryColor, borderRadius, enableAnimations, 
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
  let lineColor = '#e5e7eb';
  let nodeBg = primaryColor;
  let nodeText = '#ffffff';

  if (isHighContrastLight) {
    defaultBg = '#ffffff';
    defaultText = '#000000';
    lineColor = '#000000';
    nodeBg = '#000000';
    nodeText = '#ffffff';
  } else if (isHighContrastDark) {
    defaultBg = '#000000';
    defaultText = '#ffffff';
    lineColor = '#ffffff';
    nodeBg = '#ffffff';
    nodeText = '#000000';
  } else if (theme === 'midnight') {
    defaultBg = '#0f172a';
    defaultText = '#f8fafc';
    lineColor = '#334155';
  } else if (theme === 'sepia') {
    defaultBg = '#fdf6e3';
    defaultText = '#433422';
    lineColor = '#d3cbb7';
    nodeBg = '#433422';
    nodeText = '#fdf6e3';
  } else if (isDark) {
    defaultBg = '#111827';
    defaultText = '#ffffff';
    lineColor = '#374151';
  }

  const bgStyle = data.backgroundImage 
    ? { backgroundImage: `url(${data.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : { backgroundColor: data.backgroundColor || defaultBg };

  const textColor = data.textColor || defaultText;
  const parallaxClass = data.enableParallax ? 'bg-fixed' : '';

  // Effects
  const grayscaleClass = data.enableGrayscale ? 'grayscale' : '';
  const sepiaClass = data.enableSepia ? 'sepia' : '';
  const sectionBorderClass = data.enableBorder ? 'border-y-8 border-gray-100/10' : '';

  const animationType = data.animation || design.animation || 'slide-up';
  const duration = design.animationDuration || 'normal';

  return (
    <section 
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      className={`py-24 px-6 ${parallaxClass} ${grayscaleClass} ${sepiaClass} ${sectionBorderClass} relative cursor-pointer group`}
      style={{ ...bgStyle, color: textColor }}
    >
       <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 pointer-events-none transition-colors z-20"></div>

       {data.backgroundImage && (
          <div className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-white/80'}`}></div>
       )}

      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal enabled={enableAnimations} animation={animationType} duration={duration} className="text-center mb-16">
          <h2 
            className={`text-3xl md:text-4xl font-bold mb-4`}
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
            {/* Desktop Horizontal Line */}
            <div className="hidden md:block absolute top-[2.5rem] left-0 w-full h-1 -z-10" style={{ backgroundColor: lineColor }}></div>
            
            {/* Mobile Vertical Line */}
            <div className="md:hidden absolute left-[2.5rem] top-0 h-full w-1 -z-10" style={{ backgroundColor: lineColor }}></div>

            <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-4">
                {data.items.map((item, idx) => (
                    <Reveal 
                        key={idx} 
                        enabled={enableAnimations} 
                        animation="zoom-in" 
                        duration={duration} 
                        delay={idx * 150}
                        className="relative flex flex-row md:flex-col items-start md:items-center text-left md:text-center w-full group/item"
                    >
                        {/* Circle */}
                        <div 
                            className={`shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold z-10 border-8 transition-transform duration-500 group-hover/item:scale-110 shadow-lg`}
                            style={{ 
                                backgroundColor: nodeBg, 
                                color: nodeText,
                                borderColor: data.backgroundColor || defaultBg,
                                fontFamily: fontHeading
                            }}
                        >
                            {item.icon || (idx + 1)}
                        </div>

                        {/* Content */}
                        <div className="ml-6 md:ml-0 md:mt-8">
                            <h3 
                                className={`text-xl font-bold mb-2`}
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
                    </Reveal>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
