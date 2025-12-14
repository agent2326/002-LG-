import { LandingPageConfig } from "../types";

export const escapeHtml = (unsafe: string | undefined) => {
    if (!unsafe) return "";
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

export const getThemeColors = (config: LandingPageConfig, isDark: boolean, isHighContrast: boolean) => {
    let defaultBg = '#ffffff';
    let defaultText = '#111827';
    if (isHighContrast) {
        if (isDark) { defaultBg = '#000000'; defaultText = '#ffffff'; }
        else { defaultBg = '#ffffff'; defaultText = '#000000'; }
    } else if (isDark) {
        defaultBg = '#111827';
        defaultText = '#ffffff';
    } else {
        defaultBg = '#ffffff';
        defaultText = '#111827';
    }
    return { defaultBg, defaultText };
}

const generatePersonalHeroHtml = (data: any, config: LandingPageConfig, isDark: boolean) => {
    if (!data.show) return '';
    const { defaultText } = getThemeColors(config, isDark, false);
    const textColor = data.textColor || defaultText;
    const bg = data.backgroundColor || (isDark ? '#111827' : '#ffffff');
    const imageRadius = data.imageStyle === 'circle' ? 'rounded-full' : data.imageStyle === 'square' ? 'rounded-none' : 'rounded-2xl';

    return `
    <section class="py-20 px-6 reveal-on-scroll" style="background-color: ${bg}; color: ${textColor}">
        <div class="max-w-5xl mx-auto flex flex-col items-center text-center">
            ${data.image ? `
            <div class="mb-8 relative">
                <img src="${escapeHtml(data.image)}" alt="${escapeHtml(data.name)}" class="w-40 h-40 md:w-56 md:h-56 object-cover border-4 shadow-xl ${imageRadius}" style="border-color: ${config.primaryColor}">
            </div>` : ''}
            
            <h1 class="text-4xl md:text-6xl font-bold mb-4 tracking-tight" style="font-family: ${config.fontHeading}">${escapeHtml(data.name)}</h1>
            <p class="text-xl md:text-2xl font-bold mb-6 opacity-90" style="color: ${config.primaryColor}; font-family: ${config.fontBody}">${escapeHtml(data.role)}</p>
            <p class="text-lg md:text-xl mb-10 max-w-2xl opacity-80 leading-relaxed mx-auto" style="font-family: ${config.fontBody}">${escapeHtml(data.bio)}</p>
            
            <div class="flex flex-wrap justify-center gap-4">
                ${data.primaryCtaText ? `<a href="${escapeHtml(data.primaryCtaLink)}" class="px-8 py-3 font-semibold text-lg transition-all shadow-lg rounded-full hover-lift" style="background-color: ${config.primaryColor}; color: ${config.buttonTextColor}; font-family: ${config.fontHeading}">${escapeHtml(data.primaryCtaText)}</a>` : ''}
                ${data.secondaryCtaText ? `<a href="${escapeHtml(data.secondaryCtaLink)}" class="px-8 py-3 font-semibold text-lg transition-all shadow-sm rounded-full border-2 hover-lift" style="border-color: ${config.primaryColor}; color: ${config.primaryColor}; font-family: ${config.fontHeading}">${escapeHtml(data.secondaryCtaText)}</a>` : ''}
            </div>
        </div>
    </section>
    `;
};

const generateSectionHtml = (sectionId: string, data: any, config: LandingPageConfig, isDark: boolean) => {
    // Generic fallback for other sections to ensure valid HTML export
    if (!data || !data.show) return '';
    const { defaultBg, defaultText } = getThemeColors(config, isDark, false);
    const bg = data.backgroundColor || defaultBg;
    const text = data.textColor || defaultText;

    return `
    <section id="${sectionId}" class="py-20 px-6" style="background-color: ${bg}; color: ${text}">
        <div class="max-w-6xl mx-auto text-center">
            ${data.title ? `<h2 class="text-3xl font-bold mb-4" style="font-family: ${config.fontHeading}">${escapeHtml(data.title)}</h2>` : ''}
            ${data.subtitle ? `<p class="text-xl opacity-80" style="font-family: ${config.fontBody}">${escapeHtml(data.subtitle)}</p>` : ''}
            ${data.description ? `<p class="mt-4 max-w-2xl mx-auto">${escapeHtml(data.description)}</p>` : ''}
        </div>
    </section>
    `;
}

export const generateHtml = (config: LandingPageConfig, fullPage: boolean, lang?: string) => {
    const isDark = ['dark', 'midnight', 'high-contrast-dark'].includes(config.theme);
    let sectionsHtml = '';
    
    // Navbar
    sectionsHtml += `
    <nav class="py-4 px-6 fixed w-full z-50 bg-opacity-90 backdrop-blur" style="background-color: ${config.navbar.backgroundColor || (isDark ? '#000000' : '#ffffff')}">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <div class="text-2xl font-bold">${escapeHtml(config.navbar.logoText)}</div>
            <div class="hidden md:flex gap-6">
                ${config.navbar.links.map(l => `<a href="${l.href}" class="hover:opacity-70">${escapeHtml(l.label)}</a>`).join('')}
            </div>
        </div>
    </nav>
    `;

    // Sections loop
    config.sectionOrder.forEach(sectionId => {
        let data: any;
        if (sectionId === 'hero') data = config.hero;
        else if (sectionId === 'personalHero') data = config.personalHero;
        else if (sectionId === 'features') data = config.features;
        else if (sectionId === 'gallery') data = config.gallery;
        else if (sectionId === 'testimonials') data = config.testimonials;
        else if (sectionId === 'cta') data = config.cta;
        else if (sectionId === 'contactForm') data = config.contactForm;
        else if (sectionId === 'footer') return; // Handled separately
        else {
            // Check for dynamic blocks
            if (sectionId.startsWith('block-')) {
                const blockId = sectionId.replace('block-', '');
                data = config.contentBlocks.find(b => b.id === blockId);
            } else {
                // @ts-ignore
                data = config[sectionId];
            }
        }
        
        if (!data) return;

        if (sectionId === 'personalHero' || (data.type === 'personal-hero')) {
             sectionsHtml += generatePersonalHeroHtml(data, config, isDark);
        } else {
             sectionsHtml += generateSectionHtml(sectionId, data, config, isDark);
        }
    });

    // Footer
    const footer = config.footer;
    if (footer && footer.show) {
        const { defaultBg, defaultText } = getThemeColors(config, isDark, false);
        sectionsHtml += `
        <footer class="py-12 px-6" style="background-color: ${footer.backgroundColor || defaultBg}; color: ${footer.textColor || defaultText}">
            <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h3 class="font-bold">${escapeHtml(footer.companyName)}</h3>
                    <p class="opacity-70 text-sm">${escapeHtml(footer.copyright)}</p>
                </div>
                <div class="flex gap-6 mt-4 md:mt-0">
                    ${footer.links.map(l => `<a href="${l.href}">${escapeHtml(l.label)}</a>`).join('')}
                </div>
            </div>
        </footer>
        `;
    }

    if (fullPage) {
        return `<!DOCTYPE html>
<html lang="${lang || 'en'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(config.hero.title || config.navbar.logoText)}</title>
<script src="https://cdn.tailwindcss.com"></script>
<style>
  body { font-family: '${config.fontBody}', sans-serif; } 
  h1,h2,h3,h4,h5,h6 { font-family: '${config.fontHeading}', sans-serif; }
  .reveal-on-scroll { opacity: 0; transform: translateY(20px); transition: all 1s; }
  .reveal-visible { opacity: 1; transform: translateY(0); }
</style>
</head>
<body class="${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}">
${sectionsHtml}
<script>
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
      }
    });
  });
  document.querySelectorAll('section').forEach(s => {
    s.classList.add('reveal-on-scroll');
    observer.observe(s);
  });
});
</script>
</body>
</html>`;
    }
    return sectionsHtml;
}

export const generateCss = (config: LandingPageConfig) => {
    return `
body { margin: 0; font-family: '${config.fontBody}', sans-serif; }
h1,h2,h3 { font-family: '${config.fontHeading}'; }
img { max-width: 100%; height: auto; }
section { padding: 4rem 1rem; }
`;
}

export const generateJs = () => {
    return `console.log('Site loaded');`;
}

export const generateWordPressTheme = (config: LandingPageConfig, html: string) => {
    return {
        'index.php': `<?php get_header(); ?>\n${html}\n<?php get_footer(); ?>`,
        'header.php': `<!DOCTYPE html><html><head><meta charset="utf-8"><?php wp_head(); ?></head><body>`,
        'footer.php': `<?php wp_footer(); ?></body></html>`,
        'style.css': `/*\nTheme Name: Generated Landing Page\nVersion: 1.0\n*/\nbody { font-family: sans-serif; }`,
        'functions.php': `<?php\nfunction theme_scripts() {\n  wp_enqueue_style( 'style', get_stylesheet_uri() );\n}\nadd_action( 'wp_enqueue_scripts', 'theme_scripts' );\n?>`
    };
}