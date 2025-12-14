
import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ 
  data, 
  theme, 
  primaryColor, 
  fontHeading, 
  currentLang, 
  onToggleLanguage, 
  onToggleTheme, 
  onSelect 
}: any) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Определяем, темная ли тема глобально
  const isDark = ['dark', 'midnight', 'high-contrast-dark', 'ocean', 'forest', 'wine', 'cyberpunk', 'luxury', 'navy', 'hacker', 'dim', 'dracula', 'nord', 'coffee'].includes(theme);
  
  const position = data.position || 'fixed';
  const positionClass = position; // 'fixed', 'absolute', 'relative'

  // Логика базовых цветов
  // Если меню открыто, фон должен быть непрозрачным, иначе пункты сольются с контентом
  // Если позиция 'relative' (в потоке), то фон желательно сразу делать непрозрачным, если явно не задан прозрачный
  const isFixed = position === 'fixed';
  const isRelative = position === 'relative';
  
  const forceSolidBackground = (isFixed && isScrolled) || isMobileMenuOpen || data.backgroundColor || isRelative;

  const baseBgColor = forceSolidBackground
    ? (isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)')
    : 'transparent';
    
  // Цвет текста: если скролл или открыто меню или темная тема -> контрастный цвет
  const baseTextColor = forceSolidBackground || isDark ? (isDark ? '#ffffff' : '#111827') : (isDark ? '#ffffff' : '#111827');
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  // --- ХЕЛПЕР ДЛЯ ПРИМЕНЕНИЯ TYPOGRAPHY OVERRIDE ---
  const getCustomStyle = (settings: any, defaultFont: string, defaultColor: string) => {
    if (!settings) return { fontFamily: defaultFont, color: defaultColor };

    return {
      fontFamily: settings.fontFamily || defaultFont,
      fontWeight: settings.fontWeight,
      fontSize: settings.fontSize ? `${settings.fontSize}px` : undefined,
      lineHeight: settings.lineHeight,
      letterSpacing: settings.letterSpacing ? `${settings.letterSpacing}em` : undefined,
      textTransform: settings.textTransform as any,
      color: settings.color || defaultColor,
    };
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!data.show) return null;

  const logoStyle = getCustomStyle(data.headingTypography, fontHeading, baseTextColor);
  const linkStyle = getCustomStyle(data.bodyTypography, 'inherit', baseTextColor);

  // Используем кастомный фон если задан, иначе вычисленный
  const finalBackgroundColor = data.backgroundColor || baseBgColor;

  return (
    <nav 
      onClick={onSelect}
      className={`${positionClass} top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'backdrop-blur-md shadow-sm' : ''}`}
      style={{ 
        backgroundColor: finalBackgroundColor,
        borderBottom: (isScrolled || isMobileMenuOpen || isRelative) ? `1px solid ${borderColor}` : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            {data.logoImage ? (
              <img src={data.logoImage} alt="Logo" className="h-10 w-auto object-contain" />
            ) : (
              <span 
                className="font-bold text-2xl tracking-tight"
                style={logoStyle}
              >
                {data.logoText || 'Brand'}
              </span>
            )}
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center space-x-8">
            {data.links.map((link: any, index: number) => (
              <a
                key={index}
                href={link.href}
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={linkStyle}
              >
                {link.label}
              </a>
            ))}

            <div className="flex items-center gap-2 pl-4 border-l border-gray-200/20">
              
              {/* ЯЗЫК */}
              {onToggleLanguage && (
                <button
                  onClick={(e) => {
                     e.stopPropagation();
                     onToggleLanguage();
                  }}
                  className="p-2 rounded-full transition-colors hover:bg-gray-100/10 flex items-center gap-1"
                  style={{ color: linkStyle.color }}
                  title="Change Language"
                >
                  <Globe size={18} />
                  <span className="text-xs font-bold uppercase">{currentLang}</span>
                </button>
              )}

              {/* ТЕМА */}
              {onToggleTheme && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleTheme();
                  }}
                  className="p-2 rounded-full transition-colors hover:bg-gray-100/10"
                  style={{ color: linkStyle.color }}
                  title="Toggle Theme"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}

              {/* ACTION BUTTON */}
              {(data.buttonText || data.ctaText) && data.showButton && (
                <a
                  href={data.buttonLink || data.ctaLink || '#'}
                  className="px-5 py-2.5 rounded-full text-sm font-bold transition-transform hover:scale-105 shadow-lg ml-2"
                  style={{ 
                    backgroundColor: primaryColor, 
                    color: '#ffffff',
                  }}
                >
                  {data.buttonText || data.ctaText}
                </a>
              )}
            </div>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100/10 transition-colors"
              style={{ color: linkStyle.color }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden shadow-xl"
            style={{ 
                // Важно: фон мобильного меню должен совпадать с хедером
                backgroundColor: finalBackgroundColor !== 'transparent' ? finalBackgroundColor : (isDark ? '#1f2937' : '#ffffff') 
            }}
          >
            <div className="px-4 pt-2 pb-6 space-y-2 border-t border-gray-100/10">
              {data.links.map((link: any, index: number) => (
                <a
                  key={index}
                  href={link.href}
                  className="block px-3 py-3 rounded-md text-base font-medium hover:bg-gray-100/5 transition-colors"
                  // Теперь используем тот же стиль, что и у десктопа, чтобы уважались настройки пользователя
                  style={{ 
                    color: linkStyle.color,
                    fontFamily: linkStyle.fontFamily
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              
              <div className="pt-4 flex items-center justify-between border-t border-gray-100/10 mt-4 px-2">
                 <div className="flex gap-4">
                    {/* Мобильный язык */}
                    {onToggleLanguage && (
                        <button 
                            onClick={onToggleLanguage}
                            className="flex items-center gap-2 text-sm font-medium p-2 rounded hover:bg-gray-100/5"
                            style={{ color: linkStyle.color }}
                        >
                            <Globe size={18} />
                            <span className="uppercase">{currentLang}</span>
                        </button>
                    )}
                    {/* Мобильная тема */}
                    {onToggleTheme && (
                        <button 
                            onClick={onToggleTheme}
                            className="flex items-center gap-2 text-sm font-medium p-2 rounded hover:bg-gray-100/5"
                            style={{ color: linkStyle.color }}
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    )}
                 </div>
                 
                 {(data.buttonText || data.ctaText) && data.showButton && (
                    <a
                      href={data.buttonLink || data.ctaLink || '#'}
                      className="block px-4 py-2 rounded-lg text-center text-sm font-bold"
                      style={{ backgroundColor: primaryColor, color: '#ffffff' }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {data.buttonText || data.ctaText}
                    </a>
                  )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
