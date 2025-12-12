
import React from 'react';
import { FooterConfig } from '../../types';
import Reveal from './Reveal';

interface Props {
  data: FooterConfig;
  theme: string;
  fontHeading: string;
  fontBody: string;
  secondaryColor: string;
  enableAnimations: boolean;
  onSelect?: () => void;
}

const Footer: React.FC<Props> = ({ data, theme, fontHeading, fontBody, secondaryColor, enableAnimations, onSelect }) => {
  if (!data.show) return null;

  const isHighContrast = theme.includes('high-contrast');
  const isHighContrastDark = theme === 'high-contrast-dark';
  const isHighContrastLight = theme === 'high-contrast-light';
  const isDark = theme === 'dark' || isHighContrastDark || theme === 'midnight';

  let defaultBg = '#111827';
  let defaultText = 'white';
  let borderTop = '';

  if (isHighContrastLight) {
    defaultBg = '#ffffff';
    defaultText = '#000000';
    borderTop = 'border-t-2 border-black';
  } else if (isHighContrastDark) {
    defaultBg = '#000000';
    defaultText = '#ffffff';
    borderTop = 'border-t-2 border-white';
  } else if (theme === 'midnight') {
    defaultBg = '#0f172a';
  } else if (theme === 'sepia') {
    defaultBg = '#fdf6e3';
    defaultText = '#433422';
    borderTop = 'border-t border-[#e6dcc5]';
  } else if (isDark) {
     defaultBg = '#111827';
  }

  const bgStyle = data.backgroundImage 
    ? { backgroundImage: `url(${data.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : { backgroundColor: data.backgroundColor || defaultBg };
  
  const textColor = data.textColor || defaultText;
  const parallaxClass = data.enableParallax ? 'bg-fixed' : '';

  // Effects Classes
  const grayscaleClass = data.enableGrayscale ? 'grayscale' : '';
  const sepiaClass = data.enableSepia ? 'sepia' : '';
  // Combine custom border with theme border
  const borderClass = data.enableBorder ? 'border-t-8 border-gray-100/10' : borderTop;

  const animationType = data.animation || 'slide-up'; // Footer doesn't access global design config in this prop list, default to slide-up

  return (
    <footer 
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      className={`py-12 px-6 transition-colors duration-300 ${parallaxClass} ${borderClass} ${grayscaleClass} ${sepiaClass} relative cursor-pointer group`}
      style={{ ...bgStyle, color: textColor }}
    >
       <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 pointer-events-none transition-colors z-20"></div>

       {data.backgroundImage && (
          <div className="absolute inset-0 bg-black/80"></div>
       )}
      <Reveal enabled={enableAnimations} animation={animationType} className="relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 
              className="text-xl font-bold mb-2" 
              style={{ fontFamily: fontHeading }}
            >
              {data.companyName}
            </h3>
            <p 
              className="text-sm opacity-70"
              style={{ fontFamily: fontBody }}
            >
              {data.copyright}
            </p>
          </div>
          <div className="flex gap-8">
            {data.links.map((link, idx) => (
              <a 
                key={idx} 
                href={link.href}
                onClick={(e) => e.preventDefault()} 
                className={`transition-colors ${isHighContrast ? 'underline hover:no-underline' : 'text-gray-300 hover:text-white'}`}
                style={{ fontFamily: fontBody, color: isHighContrastLight ? 'black' : isHighContrastDark ? 'white' : undefined }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </footer>
  );
};

export default Footer;
