
export type Theme = 'light' | 'dark' | 'midnight' | 'sepia' | 'high-contrast-dark' | 'high-contrast-light' | 'ocean' | 'forest' | 'wine' | 'cyberpunk' | 'luxury' | 'retro' | 'lavender' | 'sunset' | 'dracula' | 'nord' | 'coffee' | 'navy' | 'hacker' | 'dim';
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

// Base interface for styling any section
export interface SectionStyle {
  backgroundColor?: string;
  textColor?: string;
  backgroundImage?: string;
  enableParallax?: boolean;
  enableHoverEffect?: boolean;
  enableGrayscale?: boolean;
  enableSepia?: boolean;
  enableBorder?: boolean;
  // Expanded Card Styles (13 options)
  cardStyle?: 'flat' | 'hover-lift' | 'glass' | 'tilt' | 'border' | 'neumorphic' | 'float' | 'glow-border' | 'pressed' | 'skeuomorphic' | 'shadow-stack' | 'outline-offset' | 'gradient-border';
  show: boolean;
}

export interface DesignConfig {
  animation: 'fade' | 'slide-up' | 'zoom-in' | 'reveal' | 'none';
  buttonStyle: 'rounded' | 'pill' | 'magnetic' | 'glow' | 'outline' | 'soft' | 'neumorphic' | '3d';
}

export interface NavbarConfig extends SectionStyle {
  logoText: string;
  logoImage?: string;
  logoFont?: string;
  logoColor?: string;
  links: { label: string; href: string }[];
  showLanguageSwitcher: boolean;
  showThemeToggle: boolean;
  supportedLanguages: string[]; 
}

export interface HeroConfig extends SectionStyle {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image?: string; 
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string; 
}

export interface FeaturesConfig extends SectionStyle {
  title: string;
  subtitle: string;
  items: FeatureItem[];
}

export interface GalleryItem {
  url: string;
  title?: string;
  subtitle?: string;
  link?: string;
  showPlayButton?: boolean;
}

export interface GalleryConfig extends SectionStyle {
  title: string;
  subtitle: string;
  // Expanded Layouts (10 options)
  layout?: 'slider' | 'grid' | 'masonry' | 'carousel' | 'reel' | 'collage' | 'polaroid' | 'spotlight' | 'stack' | 'filmstrip';
  // Expanded Transitions (8 options)
  transition?: 'slide' | 'fade' | 'zoom' | 'blur' | 'flip' | 'bounce' | 'ken-burns' | 'grayscale';
  enableLightbox?: boolean;
  items: GalleryItem[];
}

export interface TestimonialItem {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface TestimonialsConfig extends SectionStyle {
  title: string;
  items: TestimonialItem[];
}

export interface CTAConfig extends SectionStyle {
  title: string;
  description: string;
  buttonText: string;
  buttonColor?: string;
  buttonTextColor?: string;
}

export interface FooterConfig extends SectionStyle {
  copyright: string;
  companyName: string;
  links: { label: string; href: string }[];
}

export interface ContentBlock extends SectionStyle {
  id: string;
  type: 'content' | 'gallery' | 'features' | 'testimonials' | 'cta';
  title: string;
  subtitle?: string;
  content?: string;
  description?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  image?: string;
  imagePosition?: 'left' | 'right' | 'bottom';
  images?: string[];
  items?: any[];
  // Gallery specific in custom block
  layout?: 'slider' | 'grid' | 'masonry' | 'carousel' | 'reel' | 'collage' | 'polaroid' | 'spotlight' | 'stack' | 'filmstrip';
  transition?: 'slide' | 'fade' | 'zoom' | 'blur' | 'flip' | 'bounce' | 'ken-burns' | 'grayscale';
  enableLightbox?: boolean;
}

export interface LandingPageConfig {
  theme: Theme; 
  primaryColor: string;
  secondaryColor: string;
  buttonTextColor: string;
  backgroundColor: string;
  surfaceColor: string;
  fontHeading: string;
  fontBody: string;
  borderRadius: BorderRadius;
  backgroundImage?: string;
  enableAnimations: boolean;
  design: DesignConfig;
  sectionOrder: string[];
  navbar: NavbarConfig;
  hero: HeroConfig;
  features: FeaturesConfig;
  gallery: GalleryConfig;
  testimonials: TestimonialsConfig;
  cta: CTAConfig;
  footer: FooterConfig;
  contentBlocks: ContentBlock[];
}

export const DEFAULT_CONFIG: LandingPageConfig = {
  theme: 'light',
  primaryColor: '#2563eb',
  secondaryColor: '#4f46e5',
  buttonTextColor: '#ffffff',
  backgroundColor: '#ffffff',
  surfaceColor: '#f3f4f6',
  fontHeading: 'Inter',
  fontBody: 'Inter',
  borderRadius: 'lg',
  enableAnimations: true,
  design: {
      animation: 'slide-up',
      buttonStyle: 'rounded'
  },
  sectionOrder: ['hero', 'features', 'gallery', 'testimonials', 'cta'],
  navbar: {
    logoText: "LandingGen",
    links: [
      { label: "Features", href: "#features" },
      { label: "Gallery", href: "#gallery" },
      { label: "Testimonials", href: "#testimonials" }
    ],
    showLanguageSwitcher: true,
    showThemeToggle: true,
    show: true,
    supportedLanguages: ['en', 'uk', 'ru']
  },
  hero: {
    title: "Build Faster with AI",
    subtitle: "Generate high-converting landing pages in seconds using the power of Gemini.",
    ctaText: "Get Started Free",
    ctaLink: "#",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    show: true,
    enableParallax: false,
    enableHoverEffect: false
  },
  features: {
    title: "Why Choose Us?",
    subtitle: "We provide the tools you need to succeed.",
    items: [
      { title: "Lightning Fast", description: "Optimized for speed and performance.", icon: "⚡" },
      { title: "Secure", description: "Enterprise-grade security included.", icon: "🔒" },
      { title: "Scalable", description: "Grow with your user base effortlessly.", icon: "📈" },
    ],
    show: true,
    enableHoverEffect: true,
    cardStyle: 'hover-lift'
  },
  gallery: {
    title: "Our Work",
    subtitle: "Take a look at what we've built.",
    layout: 'slider',
    transition: 'slide',
    enableLightbox: true,
    items: [
      { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", title: "Modern Workspace", subtitle: "Designed for productivity" },
      { url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80", title: "Team Collaboration", subtitle: "Working together" },
      { url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80", title: "Product Design", subtitle: "Innovative solutions" }
    ],
    show: true,
    enableHoverEffect: true
  },
  testimonials: {
    title: "Trusted by Developers",
    items: [
      { name: "Alex Johnson", role: "CTO", content: "This tool saved us weeks of development time.", avatar: "https://picsum.photos/100/100?random=1" },
      { name: "Sarah Smith", role: "Designer", content: "The default designs are incredibly clean and modern.", avatar: "https://picsum.photos/100/100?random=2" },
    ],
    show: true,
    enableHoverEffect: true,
    cardStyle: 'flat'
  },
  cta: {
    title: "Ready to launch?",
    description: "Join thousands of satisfied users today.",
    buttonText: "Start Now",
    show: true,
    enableHoverEffect: true
  },
  footer: {
    companyName: "Acme Inc.",
    copyright: "© 2024 All rights reserved.",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
    show: true
  },
  contentBlocks: []
};
