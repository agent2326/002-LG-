
import React, { useState } from 'react';
import { ContactFormConfig, DesignConfig } from '../../types';
import Reveal from './Reveal';
import { MagneticButton } from './Effects';

interface Props {
  data: ContactFormConfig;
  theme: string;
  primaryColor: string;
  fontHeading: string;
  fontBody: string;
  borderRadius: string;
  enableAnimations: boolean;
  design?: DesignConfig;
  onSelect?: () => void;
}

const ContactForm: React.FC<Props> = ({ 
    data, theme, primaryColor, fontHeading, fontBody, borderRadius, enableAnimations, 
    design = { animation: 'slide-up', animationDuration: 'normal', buttonStyle: 'rounded', cardStyle: 'flat' }, 
    onSelect 
}) => {
  if (!data.show) return null;

  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setFormState('submitting');
      // Simulate submission
      setTimeout(() => {
          setFormState('success');
      }, 1500);
  };

  const isHighContrast = theme.includes('high-contrast');
  const isHighContrastDark = theme === 'high-contrast-dark';
  const isHighContrastLight = theme === 'high-contrast-light';
  const isDark = theme === 'dark' || isHighContrastDark || theme === 'midnight';

  let defaultBg = '#ffffff';
  let defaultText = '#111827';
  let inputBg = '#f9fafb';
  let inputBorder = 'border-gray-200';
  
  if (isHighContrastLight) {
    defaultBg = '#ffffff';
    defaultText = '#000000';
    inputBg = '#ffffff';
    inputBorder = 'border-2 border-black';
  } else if (isHighContrastDark) {
    defaultBg = '#000000';
    defaultText = '#ffffff';
    inputBg = '#000000';
    inputBorder = 'border-2 border-white';
  } else if (theme === 'midnight') {
    defaultBg = '#0f172a';
    defaultText = '#f8fafc';
    inputBg = '#1e293b';
    inputBorder = 'border-gray-700';
  } else if (theme === 'sepia') {
    defaultBg = '#fdf6e3';
    defaultText = '#433422';
    inputBg = '#eee8d5';
    inputBorder = 'border-[#d3cbb7]';
  } else if (isDark) {
    defaultBg = '#111827';
    defaultText = '#ffffff';
    inputBg = '#1f2937';
    inputBorder = 'border-gray-700';
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

  // Radius map
  const radiusClass = {
    'none': 'rounded-none',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl',
    '2xl': 'rounded-2xl',
    'full': 'rounded-3xl' 
  }[borderRadius] || 'rounded-lg';

  const animationType = data.animation || design.animation || 'slide-up';
  const duration = design.animationDuration || 'normal';

  return (
    <section 
      onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
      className={`py-20 px-6 ${parallaxClass} ${grayscaleClass} ${sepiaClass} ${borderClass} relative cursor-pointer group`}
      style={{ ...bgStyle, color: textColor }}
    >
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 pointer-events-none transition-colors z-20"></div>
      
      {data.backgroundImage && (
          <div className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-white/80'}`}></div>
       )}

      <div className="max-w-xl mx-auto relative z-10">
        <Reveal enabled={enableAnimations} animation={animationType} duration={duration} className="text-center mb-10">
          <h2 
            className={`text-3xl font-bold mb-4`}
            style={{ fontFamily: fontHeading }}
          >
            {data.title}
          </h2>
          <p 
            className={`text-lg opacity-80`}
            style={{ fontFamily: fontBody }}
          >
            {data.subtitle}
          </p>
        </Reveal>

        <Reveal enabled={enableAnimations} animation={animationType} duration={duration} delay={200}>
            {formState === 'success' ? (
                <div className={`p-8 text-center ${radiusClass} ${isDark ? 'bg-green-900/20' : 'bg-green-50'}`}>
                    <h3 className="text-xl font-bold text-green-600 mb-2">Message Sent!</h3>
                    <p>{data.successMessage}</p>
                    <button onClick={() => setFormState('idle')} className="mt-4 text-sm underline opacity-70">Send another</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input 
                            type="text" 
                            required 
                            placeholder={data.namePlaceholder}
                            className={`w-full p-4 outline-none transition-all focus:ring-2 focus:ring-opacity-50 ${radiusClass} ${inputBorder} border`}
                            style={{ backgroundColor: inputBg, fontFamily: fontBody, color: isHighContrast ? 'currentColor' : 'inherit', borderColor: isHighContrast ? 'currentColor' : undefined, '--tw-ring-color': primaryColor } as any}
                        />
                    </div>
                    <div>
                        <input 
                            type="email" 
                            required 
                            placeholder={data.emailPlaceholder}
                            className={`w-full p-4 outline-none transition-all focus:ring-2 focus:ring-opacity-50 ${radiusClass} ${inputBorder} border`}
                            style={{ backgroundColor: inputBg, fontFamily: fontBody, color: isHighContrast ? 'currentColor' : 'inherit', borderColor: isHighContrast ? 'currentColor' : undefined, '--tw-ring-color': primaryColor } as any}
                        />
                    </div>
                    <div>
                        <textarea 
                            rows={4}
                            required 
                            placeholder={data.messagePlaceholder}
                            className={`w-full p-4 outline-none transition-all focus:ring-2 focus:ring-opacity-50 ${radiusClass} ${inputBorder} border`}
                            style={{ backgroundColor: inputBg, fontFamily: fontBody, color: isHighContrast ? 'currentColor' : 'inherit', borderColor: isHighContrast ? 'currentColor' : undefined, '--tw-ring-color': primaryColor } as any}
                        />
                    </div>
                    
                    <MagneticButton enabled={design.buttonStyle === 'magnetic'} className="w-full">
                        <button 
                            disabled={formState === 'submitting'}
                            className={`w-full font-bold py-4 px-8 transition-all shadow-md hover:opacity-90 disabled:opacity-70 ${radiusClass} ${btnBorder} ${glowClass}`}
                            style={{ fontFamily: fontHeading, backgroundColor: btnBg, color: btnText }}
                        >
                            {formState === 'submitting' ? 'Sending...' : data.buttonText}
                        </button>
                    </MagneticButton>
                </form>
            )}
        </Reveal>
      </div>
    </section>
  );
};

export default ContactForm;
