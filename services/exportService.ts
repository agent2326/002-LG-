
import { LandingPageConfig } from "../types";

// Helper to determine text/bg colors based on theme settings, mirroring React logic
const getThemeColors = (config: LandingPageConfig, isDark: boolean, isHighContrast: boolean) => {
  let defaultBg = config.backgroundColor || '#ffffff';
  let defaultText = '#111827';
  
  if (config.theme === 'high-contrast-light') {
    defaultBg = '#ffffff';
    defaultText = '#000000';
  } else if (config.theme === 'high-contrast-dark') {
    defaultBg = '#000000';
    defaultText = '#ffffff';
  } else if (config.theme === 'midnight') {
    defaultBg = '#0f172a';
    defaultText = '#f8fafc';
  } else if (config.theme === 'sepia') {
    defaultBg = '#fdf6e3';
    defaultText = '#433422';
  } else if (isDark) {
    defaultBg = '#111827';
    defaultText = '#ffffff';
  }
  return { defaultBg, defaultText };
};

const getRadiusClass = (radius: string) => {
    const map: Record<string, string> = {
        'none': 'rounded-none',
        'sm': 'rounded-sm',
        'md': 'rounded-md',
        'lg': 'rounded-lg',
        'xl': 'rounded-xl',
        '2xl': 'rounded-2xl',
        'full': 'rounded-3xl'
    };
    return map[radius] || 'rounded-lg';
};

const generateNavbarHtml = (config: LandingPageConfig, isDark: boolean) => {
    if (!config.navbar.show) return '';
    const { logoText, links } = config.navbar;
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const bg = isDark ? 'bg-gray-900' : 'bg-white';
    
    const linksHtml = links.map(l => `<a href="${l.href}" class="text-sm font-medium hover:opacity-70 ${textColor}" style="font-family: ${config.fontHeading}">${l.label}</a>`).join('');
    
    return `
    <nav class="${bg} border-b border-gray-200 py-4 px-6 sticky top-0 z-50">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
            <div class="text-xl font-bold ${textColor}" style="font-family: ${config.fontHeading}; color: ${config.primaryColor}">${logoText}</div>
            <div class="hidden md:flex gap-6 items-center">
                ${linksHtml}
            </div>
        </div>
    </nav>`;
};

const generateHeroHtml = (config: LandingPageConfig, isDark: boolean) => {
    if (!config.hero.show) return '';
    const { hero } = config;
    const { defaultText } = getThemeColors(config, isDark, false);
    const textColor = hero.textColor || defaultText;
    const radius = getRadiusClass(config.borderRadius);
    
    // Background style
    const bgStyle = hero.backgroundImage 
        ? `background-image: url('${hero.backgroundImage}'); background-size: cover; background-position: center;` 
        : `background-color: ${hero.backgroundColor || (isDark ? '#111827' : '#ffffff')};`;
    
    const overlay = hero.backgroundImage ? `<div class="absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-white/60'}"></div>` : '';

    return `
    <section class="py-20 px-6 relative overflow-hidden" style="${bgStyle} color: ${textColor};">
        ${overlay}
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div class="flex-1 text-center md:text-left">
                <h1 class="text-4xl md:text-6xl font-bold mb-6 tracking-tight" style="font-family: ${config.fontHeading}">${hero.title}</h1>
                <p class="text-xl md:text-2xl mb-10 opacity-90" style="font-family: ${config.fontBody}">${hero.subtitle}</p>
                <a href="${hero.ctaLink}" class="inline-block px-8 py-4 font-semibold text-lg shadow-lg ${radius}" style="background-color: ${config.primaryColor}; color: ${config.buttonTextColor}; font-family: ${config.fontHeading}">${hero.ctaText}</a>
            </div>
            ${hero.image ? `
            <div class="flex-1">
                <img src="${hero.image}" alt="Hero" class="relative shadow-2xl w-full object-cover ${radius}" />
            </div>` : ''}
        </div>
    </section>`;
};

const generateFeaturesHtml = (config: LandingPageConfig, isDark: boolean) => {
    if (!config.features.show) return '';
    const { features } = config;
    const { defaultText } = getThemeColors(config, isDark, false);
    const bg = features.backgroundColor || (isDark ? '#1f2937' : '#f9fafb');
    const cardBg = isDark ? 'transparent' : 'white';
    const radius = getRadiusClass(config.borderRadius);

    const itemsHtml = features.items.map(item => `
        <div class="p-8 shadow-sm h-full ${radius}" style="background-color: ${cardBg}">
            <div class="text-4xl mb-4" style="color: ${config.secondaryColor}">${item.icon}</div>
            <h3 class="text-xl font-bold mb-2" style="font-family: ${config.fontHeading}">${item.title}</h3>
            <p class="opacity-80" style="font-family: ${config.fontBody}">${item.description}</p>
        </div>
    `).join('');

    return `
    <section class="py-20 px-6" style="background-color: ${bg}; color: ${features.textColor || defaultText}">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold mb-4" style="font-family: ${config.fontHeading}">${features.title}</h2>
                <p class="text-xl opacity-80" style="font-family: ${config.fontBody}">${features.subtitle}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                ${itemsHtml}
            </div>
        </div>
    </section>`;
};

const generateStepsHtml = (config: LandingPageConfig, isDark: boolean) => {
    if (!config.steps || !config.steps.show) return '';
    const { steps } = config;
    const { defaultText } = getThemeColors(config, isDark, false);
    const bg = steps.backgroundColor || (isDark ? '#111827' : '#ffffff');
    const cardBg = isDark ? '#1f2937' : '#f9fafb';
    const radius = getRadiusClass(config.borderRadius);

    const itemsHtml = steps.items.map((item, idx) => `
        <div class="relative flex flex-col h-full">
            <div class="p-8 h-full flex flex-col items-center text-center relative z-10 ${radius} shadow-sm" style="background-color: ${cardBg}">
                <div class="w-12 h-12 flex items-center justify-center rounded-full text-xl font-bold mb-6" style="background-color: ${config.primaryColor}; color: white; font-family: ${config.fontHeading}">
                    ${idx + 1}
                </div>
                <h3 class="text-xl font-bold mb-3" style="font-family: ${config.fontHeading}">${item.title}</h3>
                <p class="opacity-80 text-sm leading-relaxed" style="font-family: ${config.fontBody}">${item.description}</p>
            </div>
        </div>
    `).join('');

    return `
    <section class="py-20 px-6" style="background-color: ${bg}; color: ${steps.textColor || defaultText}">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold mb-4" style="font-family: ${config.fontHeading}">${steps.title}</h2>
                <p class="text-xl opacity-80" style="font-family: ${config.fontBody}">${steps.subtitle}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                ${itemsHtml}
            </div>
        </div>
    </section>`;
};

const generateManifestoHtml = (config: LandingPageConfig, isDark: boolean) => {
    if (!config.manifesto || !config.manifesto.show) return '';
    const { manifesto } = config;
    const { defaultText } = getThemeColors(config, isDark, false);
    const bg = manifesto.backgroundColor || (isDark ? '#111827' : '#ffffff');
    
    const itemsHtml = manifesto.items.map(item => `
        <h2 class="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight ${item.highlight ? '' : 'opacity-80'}" style="font-family: ${config.fontHeading}">
            ${item.highlight ? `<span style="color: ${config.primaryColor}">${item.text}</span>` : item.text}
        </h2>
    `).join('');

    return `
    <section class="py-24 px-6 flex items-center justify-center text-center" style="background-color: ${bg}; color: ${manifesto.textColor || defaultText}">
        <div class="max-w-5xl mx-auto">
            ${manifesto.title ? `<div class="mb-12 text-sm font-bold uppercase tracking-[0.2em] opacity-60" style="font-family: ${config.fontHeading}">${manifesto.title}</div>` : ''}
            <div class="space-y-6 md:space-y-8">
                ${itemsHtml}
            </div>
        </div>
    </section>`;
};

const generateValuePropositionHtml = (config: LandingPageConfig, isDark: boolean) => {
    if (!config.valueProposition || !config.valueProposition.show) return '';
    const { valueProposition } = config;
    const { defaultText } = getThemeColors(config, isDark, false);
    const bg = valueProposition.backgroundColor || (isDark ? '#1f2937' : '#f3f4f6');
    const itemBg = isDark ? '#111827' : '#ffffff';
    const radius = getRadiusClass(config.borderRadius);

    const itemsHtml = valueProposition.items.map(item => `
        <div class="flex items-center gap-4 p-4 ${radius} shadow-sm" style="background-color: ${itemBg}">
            <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full" style="background-color: ${config.primaryColor}20; color: ${config.primaryColor}">
                ${item.icon || '✓'}
            </div>
            <span class="font-semibold text-lg" style="font-family: ${config.fontBody}">${item.text}</span>
        </div>
    `).join('');

    return `
    <section class="py-24 px-6" style="background-color: ${bg}; color: ${valueProposition.textColor || defaultText}">
        <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-4xl md:text-5xl font-extrabold mb-6" style="font-family: ${config.fontHeading}">${valueProposition.title}</h2>
            <p class="text-xl md:text-2xl opacity-80 max-w-2xl mx-auto mb-16" style="font-family: ${config.fontBody}">${valueProposition.description}</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-3xl mx-auto">
                ${itemsHtml}
            </div>
        </div>
    </section>`;
};

const generatePhilosophyHtml = (config: LandingPageConfig, isDark: boolean) => {
    if (!config.philosophy || !config.philosophy.show) return '';
    const { philosophy } = config;
    const { defaultText } = getThemeColors(config, isDark, false);
    const bg = philosophy.backgroundColor || (isDark ? '#111827' : '#ffffff');
    const cardBg = isDark ? '#1f2937' : '#f3f4f6';
    const radius = getRadiusClass(config.borderRadius);

    const itemsHtml = philosophy.items.map((item, idx) => `
        <div class="p-8 h-full flex flex-col items-start text-left ${radius}" style="background-color: ${cardBg}">
            <div class="text-3xl font-bold mb-4 opacity-40" style="font-family: ${config.fontHeading}; color: ${config.primaryColor}">
                ${item.icon || (idx + 1).toString().padStart(2, '0')}
            </div>
            <h3 class="text-xl font-bold mb-3" style="font-family: ${config.fontHeading}">${item.title}</h3>
            <p class="opacity-80 text-sm leading-relaxed" style="font-family: ${config.fontBody}">${item.content}</p>
        </div>
    `).join('');

    return `
    <section class="py-20 px-6" style="background-color: ${bg}; color: ${philosophy.textColor || defaultText}">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold mb-4" style="font-family: ${config.fontHeading}">${philosophy.title}</h2>
                <p class="text-xl opacity-80" style="font-family: ${config.fontBody}">${philosophy.subtitle}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                ${itemsHtml}
            </div>
        </div>
    </section>`;
};

const generateTimelineHtml = (config: LandingPageConfig, isDark: boolean) => {
    if (!config.timeline || !config.timeline.show) return '';
    const { timeline } = config;
    const { defaultText } = getThemeColors(config, isDark, false);
    const bg = timeline.backgroundColor || (isDark ? '#111827' : '#ffffff');
    const cardBg = isDark ? '#1f2937' : '#ffffff';
    const radius = getRadiusClass(config.borderRadius);
    const lineColor = isDark ? '#4b5563' : '#e5e7eb';

    const itemsHtml = timeline.items.map((item, index) => `
        <div class="relative pl-8 md:pl-0 flex flex-col md:flex-row items-center justify-between w-full mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}">
            <div class="hidden md:block w-5/12"></div>
            
            <div class="absolute left-0 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10 border-4" style="background-color: ${config.secondaryColor}; border-color: ${cardBg}; color: white; left: 50%;">
                <span style="font-size: 10px;">${item.icon || ''}</span>
            </div>

            <div class="w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} pl-12 md:pl-0">
                <div class="p-6 shadow-md ${radius}" style="background-color: ${cardBg}">
                    <span class="text-sm font-bold tracking-wider uppercase mb-2 block" style="color: ${config.primaryColor}; font-family: ${config.fontBody}">${item.date}</span>
                    <h3 class="text-xl font-bold mb-2" style="font-family: ${config.fontHeading}">${item.title}</h3>
                    <p class="opacity-80 text-sm leading-relaxed" style="font-family: ${config.fontBody}">${item.description}</p>
                </div>
            </div>
        </div>
    `).join('');

    return `
    <section class="py-20 px-6" style="background-color: ${bg}; color: ${timeline.textColor || defaultText}">
        <div class="max-w-5xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold mb-4" style="font-family: ${config.fontHeading}">${timeline.title}</h2>
                <p class="text-xl opacity-80" style="font-family: ${config.fontBody}">${timeline.subtitle}</p>
            </div>
            <div class="relative">
                <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2" style="background-color: ${lineColor}; left: 50%;"></div>
                ${itemsHtml}
            </div>
        </div>
    </section>`;
};

const generateProcessHtml = (config: LandingPageConfig, isDark: boolean) => {
    if (!config.process || !config.process.show) return '';
    const { process } = config;
    const { defaultText } = getThemeColors(config, isDark, false);
    const bg = process.backgroundColor || (isDark ? '#111827' : '#ffffff');
    const lineColor = isDark ? '#374151' : '#e5e7eb';
    const nodeBg = config.primaryColor;
    
    const itemsHtml = process.items.map((item, idx) => `
        <div class="relative flex flex-col md:flex-col items-center text-center w-full mb-8 md:mb-0">
            <div class="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-6 z-10 border-4 relative" style="background-color: ${nodeBg}; color: white; border-color: ${bg}; font-family: ${config.fontHeading}">
                ${item.icon || (idx + 1)}
            </div>
            <h3 class="text-xl font-bold mb-2" style="font-family: ${config.fontHeading}">${item.title}</h3>
            <p class="opacity-80 text-sm leading-relaxed" style="font-family: ${config.fontBody}">${item.description}</p>
        </div>
    `).join('');

    return `
    <section class="py-24 px-6" style="background-color: ${bg}; color: ${process.textColor || defaultText}">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold mb-4" style="font-family: ${config.fontHeading}">${process.title}</h2>
                <p class="text-xl opacity-80" style="font-family: ${config.fontBody}">${process.subtitle}</p>
            </div>
            <div class="relative">
                <div class="hidden md:block absolute top-8 left-0 w-full h-1 -z-0" style="background-color: ${lineColor}"></div>
                <div class="flex flex-col md:flex-row justify-between items-start gap-8">
                    ${itemsHtml}
                </div>
            </div>
        </div>
    </section>`;
};

const generateTeamHtml = (config: LandingPageConfig, isDark: boolean) => {
    if (!config.team || !config.team.show) return '';
    const { team } = config;
    const { defaultText } = getThemeColors(config, isDark, false);
    const bg = team.backgroundColor || (isDark ? '#111827' : '#ffffff');
    const cardBg = isDark ? '#1f2937' : '#f9fafb';
    const radius = getRadiusClass(config.borderRadius);

    const itemsHtml = team.items.map((item) => `
        <div class="p-6 flex flex-col items-center text-center ${radius} shadow-sm" style="background-color: ${cardBg}">
            <img src="${item.avatar}" alt="${item.name}" class="w-32 h-32 rounded-full object-cover mb-4" />
            <h3 class="text-xl font-bold mb-1" style="font-family: ${config.fontHeading}">${item.name}</h3>
            <p class="text-sm font-bold uppercase tracking-wider mb-4" style="font-family: ${config.fontBody}; color: ${config.primaryColor}">${item.role}</p>
            <p class="opacity-70 text-sm leading-relaxed" style="font-family: ${config.fontBody}">${item.bio}</p>
        </div>
    `).join('');

    return `
    <section class="py-20 px-6" style="background-color: ${bg}; color: ${team.textColor || defaultText}">
        <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold mb-4" style="font-family: ${config.fontHeading}">${team.title}</h2>
                <p class="text-xl opacity-80" style="font-family: ${config.fontBody}">${team.subtitle}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${itemsHtml}
            </div>
        </div>
    </section>`;
};

const generateTwoColumnInfoHtml = (config: LandingPageConfig, isDark: boolean) => {
    if (!config.twoColumnInfo || !config.twoColumnInfo.show) return '';
    const { twoColumnInfo } = config;
    const { defaultText } = getThemeColors(config, isDark, false);
    const bg = twoColumnInfo.backgroundColor || (isDark ? '#111827' : '#ffffff');
    const radius = getRadiusClass(config.borderRadius);
    const flexDirection = twoColumnInfo.imagePosition === 'left' ? 'md:flex-row' : 'md:flex-row-reverse';

    return `
    <section class="py-20 px-6" style="background-color: ${bg}; color: ${twoColumnInfo.textColor || defaultText}">
        <div class="max-w-6xl mx-auto flex flex-col ${flexDirection} items-center gap-12">
            <div class="flex-1 w-full">
                <img src="${twoColumnInfo.image}" alt="${twoColumnInfo.title}" class="w-full h-auto object-cover shadow-xl ${radius}" />
            </div>
            <div class="flex-1 w-full text-left">
                <h2 class="text-3xl md:text-4xl font-bold mb-4" style="font-family: ${config.fontHeading}">${twoColumnInfo.title}</h2>
                <p class="text-lg md:text-xl opacity-70 mb-6 font-medium" style="font-family: ${config.fontBody}">${twoColumnInfo.subtitle}</p>
                <div class="text-lg leading-relaxed opacity-90 mb-8 whitespace-pre-wrap" style="font-family: ${config.fontBody}">${twoColumnInfo.description}</div>
                ${twoColumnInfo.showButton ? `
                <a href="${twoColumnInfo.buttonLink}" class="inline-block font-bold py-3 px-8 shadow-md ${radius}" style="background-color: ${config.primaryColor}; color: white; font-family: ${config.fontHeading}">${twoColumnInfo.buttonText}</a>
                ` : ''}
            </div>
        </div>
    </section>`;
};

const generateContactFormHtml = (config: LandingPageConfig, isDark: boolean) => {
    if (!config.contactForm || !config.contactForm.show) return '';
    const { contactForm } = config;
    const { defaultText } = getThemeColors(config, isDark, false);
    const bg = contactForm.backgroundColor || (isDark ? '#111827' : '#ffffff');
    const inputBg = isDark ? '#1f2937' : '#f9fafb';
    const inputBorder = isDark ? 'border-gray-700' : 'border-gray-200';
    const radius = getRadiusClass(config.borderRadius);

    return `
    <section class="py-20 px-6" style="background-color: ${bg}; color: ${contactForm.textColor || defaultText}">
        <div class="max-w-xl mx-auto text-center">
            <h2 class="text-3xl font-bold mb-4" style="font-family: ${config.fontHeading}">${contactForm.title}</h2>
            <p class="text-lg opacity-80 mb-10" style="font-family: ${config.fontBody}">${contactForm.subtitle}</p>
            
            <form class="space-y-6 text-left">
                <input type="text" placeholder="${contactForm.namePlaceholder}" class="w-full p-4 border ${inputBorder} ${radius}" style="background-color: ${inputBg}; color: inherit;" />
                <input type="email" placeholder="${contactForm.emailPlaceholder}" class="w-full p-4 border ${inputBorder} ${radius}" style="background-color: ${inputBg}; color: inherit;" />
                <textarea rows="4" placeholder="${contactForm.messagePlaceholder}" class="w-full p-4 border ${inputBorder} ${radius}" style="background-color: ${inputBg}; color: inherit;"></textarea>
                <button type="button" class="w-full font-bold py-4 px-8 ${radius}" style="background-color: ${config.primaryColor}; color: white; font-family: ${config.fontHeading}">${contactForm.buttonText}</button>
            </form>
        </div>
    </section>`;
};

const generateFooterHtml = (config: LandingPageConfig, isDark: boolean) => {
    if (!config.footer.show) return '';
    const { footer } = config;
    const bg = footer.backgroundColor || (isDark ? '#111827' : '#111827');
    const text = footer.textColor || 'white';
    
    const linksHtml = footer.links.map(l => `<a href="${l.href}" class="text-gray-300 hover:text-white transition-colors" style="font-family: ${config.fontBody}">${l.label}</a>`).join('');

    return `
    <footer class="py-12 px-6" style="background-color: ${bg}; color: ${text}">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div class="mb-6 md:mb-0">
                <h3 class="text-xl font-bold mb-2" style="font-family: ${config.fontHeading}">${footer.companyName}</h3>
                <p class="text-sm opacity-70" style="font-family: ${config.fontBody}">${footer.copyright}</p>
            </div>
            <div class="flex gap-8">
                ${linksHtml}
            </div>
        </div>
    </footer>`;
};

// Generates the full HTML string for the landing page
export const generateHtml = (config: LandingPageConfig) => {
    const isDark = ['dark', 'midnight', 'high-contrast-dark', 'ocean', 'forest', 'wine', 'cyberpunk', 'luxury', 'navy', 'hacker', 'dim', 'dracula'].includes(config.theme);
    const globalBg = config.backgroundImage ? `background-image: url('${config.backgroundImage}'); background-size: cover; background-attachment: fixed;` : `background-color: ${config.backgroundColor || (isDark ? '#111827' : '#ffffff')}`;
    
    let sectionsHtml = '';
    
    if (config.sectionOrder.includes('hero')) sectionsHtml += generateHeroHtml(config, isDark);
    if (config.sectionOrder.includes('valueProposition')) sectionsHtml += generateValuePropositionHtml(config, isDark);
    if (config.sectionOrder.includes('features')) sectionsHtml += generateFeaturesHtml(config, isDark);
    if (config.sectionOrder.includes('twoColumnInfo')) sectionsHtml += generateTwoColumnInfoHtml(config, isDark);
    if (config.sectionOrder.includes('steps')) sectionsHtml += generateStepsHtml(config, isDark);
    if (config.sectionOrder.includes('process')) sectionsHtml += generateProcessHtml(config, isDark);
    if (config.sectionOrder.includes('manifesto')) sectionsHtml += generateManifestoHtml(config, isDark);
    if (config.sectionOrder.includes('philosophy')) sectionsHtml += generatePhilosophyHtml(config, isDark);
    if (config.sectionOrder.includes('timeline')) sectionsHtml += generateTimelineHtml(config, isDark);
    if (config.sectionOrder.includes('team')) sectionsHtml += generateTeamHtml(config, isDark);
    
    // Add other sections logic if implemented in the future, for now standard order logic for export
    // For this update we specifically added Contact Form support
    if (config.sectionOrder.includes('contactForm')) sectionsHtml += generateContactFormHtml(config, isDark);
    
    sectionsHtml += generateFooterHtml(config, isDark);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.hero.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=${config.fontHeading.replace(' ', '+')}:wght@400;700&family=${config.fontBody.replace(' ', '+')}:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: '${config.fontBody}', sans-serif; }
    </style>
</head>
<body style="${globalBg}">
    ${generateNavbarHtml(config, isDark)}
    ${sectionsHtml}
</body>
</html>`;
};

export const generateWordPressTheme = (config: LandingPageConfig, htmlContent: string) => {
    // Extract body content from the HTML
    const bodyContent = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || '';
    const bodyStyle = htmlContent.match(/<body[^>]*style="([^"]*)"/i)?.[1] || '';

    const styleCss = `/*
Theme Name: ${config.hero.title} Theme
Author: LandingGen
Version: 1.0.0
Description: Custom landing page theme generated by AI.
*/
body { font-family: '${config.fontBody}', sans-serif; }
`;

    const indexPhp = `<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php wp_title(); ?></title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=${config.fontHeading.replace(' ', '+')}:wght@400;700&family=${config.fontBody.replace(' ', '+')}:wght@300;400;500;700&display=swap" rel="stylesheet">
    <?php wp_head(); ?>
    <style>
        /* Custom Styles */
    </style>
</head>
<body <?php body_class(); ?> style="${bodyStyle}">
    <?php wp_body_open(); ?>
    
    ${bodyContent}

    <?php wp_footer(); ?>
</body>
</html>`;

    return {
        'style.css': styleCss,
        'index.php': indexPhp,
        'functions.php': '<?php \n// Basic functions file\n'
    };
};
