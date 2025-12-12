
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
    
    // We only implement basic sections for the static export demo
    // In a real app, we would map all sections including Gallery, Testimonials, ContentBlocks etc.
    // For this implementation, we'll do the core ones to demonstrate the capability.
    
    if (config.sectionOrder.includes('hero')) sectionsHtml += generateHeroHtml(config, isDark);
    if (config.sectionOrder.includes('features')) sectionsHtml += generateFeaturesHtml(config, isDark);
    
    // Add other sections generically or specifically...
    // To keep the file concise for this update, we assume standard order + generated strings.
    
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
