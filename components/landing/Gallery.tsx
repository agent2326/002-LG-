
import React, { useState, useEffect } from 'react';
import { GalleryConfig, DesignConfig, TypographySettings } from '../../types';
import Reveal from './Reveal';
import { ChevronLeft, ChevronRight, Play, X, ZoomIn, Film } from 'lucide-react';
import { TiltCard } from './Effects';

interface Props {
  id?: string;
  data: GalleryConfig;
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

const Gallery: React.FC<Props> = ({ id, data, theme, fontHeading, fontBody, primaryColor, borderRadius, enableAnimations, design, onSelect }) => {
  if (!data.show) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const layout = data.layout || 'slider';
  const transition = data.transition || 'slide';
  const cardStyle = data.cardStyle || 'flat';

  useEffect(() => {
    if (!['slider', 'carousel', 'spotlight'].includes(layout)) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.items.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, [data.items.length, layout]);

  const isHighContrast = theme.includes('high-contrast');
  const isHighContrastDark = theme === 'high-contrast-dark';
  const isHighContrastLight = theme === 'high-contrast-light';
  const isDark = theme === 'dark' || isHighContrastDark || theme === 'midnight';

  let defaultBg = '#f3f4f6';
  let defaultText = '#111827';
  let frameBorder = '';
  let cardDefaultBg = 'transparent';
  let shadowClass = '';
  
  if (isHighContrastLight) {
    defaultBg = '#ffffff';
    defaultText = '#000000';
    frameBorder = 'border-4 border-black';
  } else if (isHighContrastDark) {
    defaultBg = '#000000';
    defaultText = '#ffffff';
    frameBorder = 'border-4 border-white';
  } else if (theme === 'midnight') {
    defaultBg = '#1e293b';
    defaultText = '#f8fafc';
  } else if (theme === 'sepia') {
    defaultBg = '#eee8d5';
    defaultText = '#433422';
  } else if (isDark) {
    defaultBg = '#1f2937';
    defaultText = '#ffffff';
  }

  let glassClass = '';
  let extraStyle: React.CSSProperties = {};
  
  if (cardStyle === 'glass') {
      glassClass = 'backdrop-blur-md border border-white/20 bg-white/10';
  } else if (cardStyle === 'neumorphic') {
      cardDefaultBg = defaultBg;
      shadowClass = isDark 
        ? 'shadow-[5px_5px_10px_#151c26,-5px_-5px_10px_#293648]' 
        : 'shadow-[5px_5px_10px_#d1d5db,-5px_-5px_10px_#ffffff]';
  } else if (cardStyle === 'float') {
      shadowClass = 'shadow-xl translate-y-[-4px]';
  } else if (cardStyle === 'border') {
      frameBorder = isDark ? 'border border-gray-700' : 'border border-gray-200';
  } else if (cardStyle === 'flat') {
      shadowClass = 'shadow-md';
  } else if (cardStyle === 'hover-lift') {
      shadowClass = 'shadow-md hover:-translate-y-1 hover:shadow-xl transition-transform duration-300';
  } else if (cardStyle === 'glow-border') {
      frameBorder = 'border border-transparent';
      shadowClass = isDark 
        ? `shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_${primaryColor}40] hover:border-${primaryColor}`
        : `shadow-[0_0_15px_rgba(0,0,0,0.05)] hover:shadow-[0_0_25px_${primaryColor}40] hover:border-${primaryColor}`;
      extraStyle = { borderColor: 'transparent', transition: 'all 0.3s ease' };
  } else if (cardStyle === 'pressed') {
      cardDefaultBg = isDark ? '#111827' : '#f3f4f6';
      shadowClass = 'shadow-inner';
      frameBorder = isDark ? 'border border-gray-800' : 'border border-gray-200';
  } else if (cardStyle === 'skeuomorphic') {
      shadowClass = 'shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.1)]';
      frameBorder = isDark ? 'border-b-2 border-r-2 border-gray-900' : 'border-b-2 border-r-2 border-gray-300';
  } else if (cardStyle === 'shadow-stack') {
      shadowClass = 'shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]';
      frameBorder = isDark ? 'border border-gray-700' : 'border border-gray-200';
  } else if (cardStyle === 'outline-offset') {
      shadowClass = '';
      frameBorder = 'border-2 border-current outline outline-2 outline-offset-4 outline-current opacity-90';
  } else if (cardStyle === 'gradient-border') {
      shadowClass = 'shadow-lg';
      extraStyle = {
          position: 'relative',
          background: `linear-gradient(${cardDefaultBg}, ${cardDefaultBg}) padding-box, linear-gradient(45deg, ${primaryColor}, ${primaryColor}88) border-box`,
          border: '2px solid transparent',
      };
  }

  const bgStyle = data.backgroundImage 
    ? { backgroundImage: `url(${data.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : { backgroundColor: data.backgroundColor || defaultBg };

  const textColor = data.textColor || defaultText;
  const parallaxClass = data.enableParallax ? 'bg-fixed' : '';
  const grayscaleClass = data.enableGrayscale ? 'grayscale' : '';
  const sepiaClass = data.enableSepia ? 'sepia' : '';
  const borderClass = data.enableBorder ? 'border-y-8 border-gray-100/10' : '';

  const nextSlide = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % data.items.length); };
  const prevSlide = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + data.items.length) % data.items.length); };
  const goToSlide = (index: number, e: React.MouseEvent) => { e.stopPropagation(); setCurrentIndex(index); };
  const openLightbox = (index: number, e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); if (data.enableLightbox !== false) { setSelectedImageIndex(index); setLightboxOpen(true); } };

  const radiusClass = {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    '2xl': 'rounded-2xl',
    'full': 'rounded-3xl'
  }[borderRadius] || 'rounded-xl';

  const animationType = data.animation || (design?.animation) || 'slide-up';
  const duration = design?.animationDuration || 'normal';

  // Typography Styles
  const headingStyle = getTypographyStyle(data.headingTypography, fontHeading);
  const bodyStyle = getTypographyStyle(data.bodyTypography, fontBody);

  // Scaled Styles for cards/overlay to match font family/weight but control size
  const overlayTitleStyle = {
      ...headingStyle,
      fontSize: undefined, // Let Tailwind handle size or scale specifically
      color: 'white', // Overlays usually need white text
  };
  const overlayBodyStyle = {
      ...bodyStyle,
      color: 'white',
  };

  const renderImageContent = (item: any, idx: number, isGrid = false) => {
      return (
         <div className={`w-full h-full relative group/image overflow-hidden`}>
             <img src={item.url} alt={item.title || `Gallery Item ${idx + 1}`} className={`w-full h-full object-cover transition-transform duration-700 ${data.enableHoverEffect ? 'group-hover/image:scale-110' : ''}`} />
             <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 ${isGrid ? 'opacity-0 group-hover/image:opacity-100' : (item.title ? 'opacity-100' : 'opacity-0 group-hover/image:opacity-100')}`}>
                {item.showPlayButton && <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/50 mb-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"><Play size={32} className="text-white fill-white ml-1" /></div>}
                {!item.showPlayButton && data.enableLightbox !== false && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 pointer-events-none"><ZoomIn size={32} className="text-white drop-shadow-md" /></div>}
                {(item.title || item.subtitle) && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-white text-center">
                        {item.title && <h3 className="font-bold text-lg mb-1" style={overlayTitleStyle}>{item.title}</h3>}
                        {item.subtitle && <p className="text-xs opacity-90" style={overlayBodyStyle}>{item.subtitle}</p>}
                    </div>
                )}
             </div>
         </div>
      );
  };

  const getTransitionStyle = (isActive: boolean, idx: number) => {
      let style: React.CSSProperties = {};
      let className = `absolute inset-0 w-full h-full transition-all duration-700 ease-in-out `;
      
      switch(transition) {
          case 'fade': className += isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'; break;
          case 'zoom': className += isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'; break;
          case 'blur': className += isActive ? 'opacity-100 blur-0 z-10' : 'opacity-0 blur-lg z-0'; break;
          case 'flip': className += `backface-hidden ${isActive ? 'opacity-100 rotate-y-0 z-10' : 'opacity-0 -rotate-y-180 z-0'}`; style = { transform: isActive ? 'rotateY(0deg)' : 'rotateY(180deg)', backfaceVisibility: 'hidden' }; break;
          case 'bounce': className += isActive ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 -translate-y-full z-0'; style = { transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' }; break;
          case 'ken-burns': className += isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-125 z-0'; style = { transitionDuration: '5000ms' }; break;
          case 'grayscale': className += isActive ? 'opacity-100 grayscale-0 z-10' : 'opacity-0 grayscale z-0'; break;
          case 'slide': default: return <></>; 
      }
      return <div key={idx} className={className} style={style} onClick={(e) => openLightbox(idx, e)}>{data.items[idx].link && !data.enableLightbox ? <a href={data.items[idx].link} className="block w-full h-full">{renderImageContent(data.items[idx], idx)}</a> : renderImageContent(data.items[idx], idx)}</div>;
  };

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
        <Reveal enabled={enableAnimations} animation={animationType} duration={duration} className="text-center mb-12">
          <h2 
            className={`text-3xl font-bold mb-4`} 
            style={headingStyle}
          >
            {data.title}
          </h2>
          <p 
            className={`text-xl opacity-80 whitespace-pre-wrap`} 
            style={bodyStyle}
          >
            {data.subtitle}
          </p>
          {data.description && (
              <p 
                className={`text-lg opacity-70 mt-6 max-w-3xl mx-auto whitespace-pre-wrap`} 
                style={bodyStyle}
              >
                  {data.description}
              </p>
          )}
        </Reveal>

        <Reveal enabled={enableAnimations} animation={animationType} duration={duration}>
          {(layout === 'slider' || layout === 'carousel') && (
              <div className={`relative max-w-4xl mx-auto overflow-hidden aspect-video bg-gray-200 ${radiusClass} ${frameBorder} ${shadowClass} ${glassClass}`} style={{ ...extraStyle, backgroundColor: cardDefaultBg }}>
                 {transition === 'slide' ? (
                     <div className="flex transition-transform duration-500 ease-out h-full" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {data.items.map((item, idx) => (<div key={idx} className="w-full h-full shrink-0 relative" onClick={(e) => openLightbox(idx, e)}>{item.link && !data.enableLightbox ? <a href={item.link} className="block w-full h-full">{renderImageContent(item, idx)}</a> : renderImageContent(item, idx)}</div>))}
                     </div>
                 ) : (
                     <div className="relative w-full h-full">{data.items.map((item, idx) => getTransitionStyle(currentIndex === idx, idx))}</div>
                 )}
                 {data.items.length > 1 && (<><button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white transition-colors z-20"><ChevronLeft size={32} /></button><button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white transition-colors z-20"><ChevronRight size={32} /></button></>)}
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">{data.items.map((_, idx) => (<button key={idx} onClick={(e) => goToSlide(idx, e)} className={`w-3 h-3 rounded-full transition-all border border-white/50 ${currentIndex === idx ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`} style={{ backgroundColor: currentIndex === idx ? primaryColor : undefined }} />))}</div>
              </div>
          )}
          {layout === 'reel' && (
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
                  {data.items.map((item, idx) => (<div key={idx} className={`shrink-0 w-80 md:w-96 aspect-video snap-center overflow-hidden ${radiusClass} ${frameBorder} ${shadowClass} ${glassClass}`} style={{ backgroundColor: cardDefaultBg, ...extraStyle }} onClick={(e) => openLightbox(idx, e)}>{item.link && !data.enableLightbox ? <a href={item.link} className="block w-full h-full">{renderImageContent(item, idx, true)}</a> : renderImageContent(item, idx, true)}</div>))}
              </div>
          )}
          {layout === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.items.map((item, idx) => (<TiltCard key={idx} enabled={cardStyle === 'tilt'}><div className={`aspect-square overflow-hidden ${radiusClass} ${frameBorder} ${shadowClass} ${glassClass}`} style={{ backgroundColor: cardDefaultBg, ...extraStyle }} onClick={(e) => openLightbox(idx, e)}>{item.link && !data.enableLightbox ? <a href={item.link} className="block w-full h-full">{renderImageContent(item, idx, true)}</a> : renderImageContent(item, idx, true)}</div></TiltCard>))}
              </div>
          )}
          {layout === 'masonry' && (
             <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                 {data.items.map((item, idx) => (
                     <div key={idx} className={`break-inside-avoid ${radiusClass} overflow-hidden ${frameBorder} ${shadowClass} ${glassClass}`} style={{ backgroundColor: cardDefaultBg, ...extraStyle }} onClick={(e) => openLightbox(idx, e)}>
                         {item.link && !data.enableLightbox ? <a href={item.link} className="block w-full h-auto">{renderImageContent(item, idx, true)}</a> : renderImageContent(item, idx, true)}
                     </div>
                 ))}
             </div>
          )}
          {layout === 'collage' && (
             <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
                 {data.items.slice(0, 6).map((item, idx) => {
                     // First item big, others small. 
                     // Logic: item 0: 2x2. item 1,2: 1x1. item 3: 1x2 (tall)? No, keep simple.
                     const spanClass = idx === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1';
                     return (
                         <div key={idx} className={`${spanClass} relative ${radiusClass} overflow-hidden ${frameBorder}`} onClick={(e) => openLightbox(idx, e)}>
                             {renderImageContent(item, idx, true)}
                         </div>
                     );
                 })}
             </div>
          )}
          {layout === 'polaroid' && (
             <div className="flex flex-wrap justify-center gap-8 py-8">
                 {data.items.map((item, idx) => {
                     const rotate = idx % 2 === 0 ? 'rotate-2' : '-rotate-2';
                     return (
                         <div key={idx} className={`relative p-4 bg-white shadow-xl w-72 transition-transform hover:z-10 hover:scale-110 hover:rotate-0 duration-300 ${rotate}`} onClick={(e) => openLightbox(idx, e)}>
                             <div className="aspect-[4/5] overflow-hidden mb-4 bg-gray-100">
                                 <img src={item.url} className="w-full h-full object-cover" />
                             </div>
                             {item.title && <div className="text-center font-serif text-gray-800 font-bold">{item.title}</div>}
                         </div>
                     );
                 })}
             </div>
          )}
          {layout === 'spotlight' && (
             <div className="space-y-4">
                 <div className={`aspect-video w-full relative ${radiusClass} overflow-hidden ${frameBorder}`} onClick={(e) => openLightbox(currentIndex, e)}>
                     {renderImageContent(data.items[currentIndex], currentIndex)}
                 </div>
                 <div className="flex gap-2 overflow-x-auto pb-2 justify-center scrollbar-hide">
                     {data.items.map((item, idx) => (
                         <button 
                            key={idx} 
                            onClick={(e) => goToSlide(idx, e)}
                            className={`w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${currentIndex === idx ? `border-[${primaryColor}] ring-2 ring-offset-2 ring-[${primaryColor}]` : 'border-transparent opacity-60 hover:opacity-100'}`}
                         >
                             <img src={item.url} className="w-full h-full object-cover" />
                         </button>
                     ))}
                 </div>
             </div>
          )}
          {layout === 'filmstrip' && (
             <div className="bg-gray-900 p-6 -mx-6 overflow-x-auto">
                 <div className="flex gap-12 px-4">
                     {data.items.map((item, idx) => (
                         <div key={idx} className="relative shrink-0 w-80 bg-black p-4 border-y-8 border-dashed border-gray-600 shadow-2xl" onClick={(e) => openLightbox(idx, e)}>
                             <div className="aspect-video relative grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden">
                                 {renderImageContent(item, idx, true)}
                             </div>
                             <div className="absolute -top-6 left-2 text-gray-500 text-xs font-mono">{idx + 1}A</div>
                             <div className="absolute -bottom-6 right-2 text-gray-500 text-xs font-mono">KODAK 400</div>
                         </div>
                     ))}
                 </div>
             </div>
          )}
          {layout === 'stack' && (
             <div className="relative h-[600px] flex items-center justify-center">
                 {data.items.map((item, idx) => {
                     // Determine stack position relative to current
                     let offset = idx - currentIndex;
                     // Wrap around logic for infinite feel visual
                     if (offset < -data.items.length / 2) offset += data.items.length;
                     if (offset > data.items.length / 2) offset -= data.items.length;
                     
                     // Only render items close to center to save DOM
                     if (Math.abs(offset) > 2) return null; 
                     
                     const isActive = offset === 0;
                     const zIndex = isActive ? 20 : 10 - Math.abs(offset);
                     const scale = isActive ? 1 : 0.8;
                     const opacity = isActive ? 1 : 0.5;
                     const translateX = offset * 50; // px spacing
                     const rotate = offset * 5; // degrees
                     
                     return (
                         <div 
                            key={idx}
                            className={`absolute w-80 md:w-96 aspect-[3/4] shadow-2xl transition-all duration-500 ease-out border-8 border-white cursor-pointer`}
                            style={{ 
                                zIndex,
                                opacity,
                                transform: `translateX(${translateX}px) rotate(${rotate}deg) scale(${scale})`
                            }}
                            onClick={(e) => goToSlide(idx, e)}
                         >
                             {renderImageContent(item, idx, true)}
                         </div>
                     )
                 })}
             </div>
          )}
        </Reveal>
      </div>
      {lightboxOpen && data.enableLightbox !== false && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}>
              <button onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }} className="absolute top-4 right-4 text-white hover:text-gray-300 z-[101] bg-white/10 p-2 rounded-full"><X size={32} /></button>
              <button onClick={(e) => { e.stopPropagation(); setSelectedImageIndex((prev) => (prev - 1 + data.items.length) % data.items.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 z-[101] bg-white/10 rounded-full"><ChevronLeft size={40} /></button>
              <div className="max-w-6xl max-h-[90vh] w-full relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                  <img src={data.items[selectedImageIndex].url} alt={data.items[selectedImageIndex].title} className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"/>
                  {(data.items[selectedImageIndex].title || data.items[selectedImageIndex].subtitle) && (<div className="mt-4 text-center text-white">{data.items[selectedImageIndex].title && <h3 className="font-bold text-2xl mb-1">{data.items[selectedImageIndex].title}</h3>}{data.items[selectedImageIndex].subtitle && <p className="text-lg opacity-80">{data.items[selectedImageIndex].subtitle}</p>}</div>)}
              </div>
              <button onClick={(e) => { e.stopPropagation(); setSelectedImageIndex((prev) => (prev + 1) % data.items.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 z-[101] bg-white/10 rounded-full"><ChevronRight size={40} /></button>
          </div>
      )}
    </section>
  );
};

export default Gallery;
