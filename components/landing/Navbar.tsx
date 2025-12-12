
import React from 'react';
import { NavbarConfig } from '../../types';
import { Globe, Moon, Sun, Contrast } from 'lucide-react';

interface Props {
  data: NavbarConfig;
  theme: string;
  primaryColor: string;
  fontHeading: string;
  currentLang?: string;
  onToggleTheme?: () => void;
  onToggleLanguage?: () => void;
  onSelect?: () => void;
}

const Navbar: React.FC<Props> = ({ data, theme, primaryColor, fontHeading, currentLang = 'en', onToggleTheme, onToggleLanguage, onSelect }) => {
  if (!data.show) return null;

  const isHighContrast = theme.includes('high-contrast');
  const isHighContrastDark = theme === 'high-contrast-dark';
  const isHighContrastLight = theme === 'high-contrast-light';
  const isDark = theme === 'dark' || isHighContrastDark || theme === 'midnight';
  
  // Dynamic classes
  let bgClass = 'bg-white border-b border-gray-100';
  let textClass = 'text-gray-900';
  let logoColor = primaryColor;

  if (isHighContrastLight) {
    bgClass = 'bg-white border-b-2 border-black';
    textClass = 'text-black';
    logoColor = '#000000';
  } else if (isHighContrastDark) {
    bgClass = 'bg-black border-b-2 border-white';
    textClass = 'text-white';
    logoColor = '#ffffff'; // Strictly monochrome
  } else if (theme === 'midnight') {
    bgClass = 'bg-[#0f172a] border-b border-gray-800'; // Slate 900
    textClass = 'text-white';
  } else if (theme === 'sepia') {
    bgClass = 'bg-[#fdf6e3] border-b border-[#e6dcc5]';
    textClass = 'text-[#433422]';
    logoColor = '#433422';
  } else if (isDark) {
    bgClass = 'bg-gray-900 border-b border-gray-800';
    textClass = 'text-white';
  }

  // Override logo color if specific config exists
  if (data.logoColor) {
      logoColor = data.logoColor;
  }

  return (
    <nav 
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      className={`${bgClass} py-4 px-6 relative z-50 transition-colors duration-300 cursor-pointer hover:opacity-95`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
            {data.logoImage && (
                <img src={data.logoImage} alt="Logo" className="h-10 w-auto object-contain" />
            )}
            {data.logoText && (
                <div 
                  className={`text-xl font-bold ${textClass}`} 
                  style={{ color: logoColor, fontFamily: data.logoFont || fontHeading }}
                >
                  {data.logoText}
                </div>
            )}
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6">
            {data.links.map((link, i) => (
              <a 
                key={i} 
                href={link.href}
                onClick={(e) => e.preventDefault()} 
                className={`text-sm font-medium hover:opacity-70 ${textClass}`}
                style={{ fontFamily: fontHeading }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
            {data.showLanguageSwitcher && (
              <div 
                onClick={(e) => { e.stopPropagation(); onToggleLanguage?.(); }}
                className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity"
                title="Switch Language"
              >
                <Globe size={16} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                <span className={`text-xs font-bold ${textClass} uppercase`}>{currentLang}</span>
              </div>
            )}
            
            {data.showThemeToggle && (
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleTheme?.(); }}
                className={`p-1.5 rounded-full transition-colors ${isHighContrast ? 'bg-white text-black border border-black' : isDark ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
                title="Toggle Theme"
              >
                {isHighContrast ? <Contrast size={16} /> : isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
