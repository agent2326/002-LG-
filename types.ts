
export type Theme = string;
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface TypographySettings {
  fontFamily?: string;
  fontWeight?: string;
  fontSize?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  color?: string;
}

export interface DesignConfig {
  animation?: 'fade' | 'slide-up' | 'zoom-in' | 'reveal' | 'none' | 'slide-left' | 'slide-right';
  animationDuration?: 'fast' | 'normal' | 'slow' | 'extra-slow';
  buttonStyle?: 'rounded' | 'pill' | 'square' | 'outline' | 'ghost' | 'magnetic' | 'glow' | 'neumorphic' | '3d';
  cardStyle?: 'flat' | 'shadow' | 'border' | 'glass' | 'neumorphic' | 'float' | 'hover-lift' | 'tilt' | 'glow-border' | 'pressed' | 'skeuomorphic' | 'shadow-stack' | 'outline-offset' | 'gradient-border';
}

export interface NavbarConfig {
  logoText: string;
  logoImage?: string;
  links: { label: string; href: string }[];
  showLanguageSwitcher: boolean;
  showThemeToggle: boolean;
  show: boolean;
  supportedLanguages: string[];
  backgroundColor?: string;
  buttonText?: string;
  buttonLink?: string;
  ctaText?: string;
  ctaLink?: string;
  showButton?: boolean;
  headingTypography?: TypographySettings;
  bodyTypography?: TypographySettings;
  hideThemeToggle?: boolean;
  hideLangToggle?: boolean;
  position?: 'fixed' | 'absolute' | 'relative';
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  showButton: boolean;
  image: string;
  show: boolean;
  enableParallax?: boolean;
  enableHoverEffect?: boolean;
  backgroundImage?: string;
  backgroundType?: string;
  gradientStart?: string;
  gradientEnd?: string;
  backgroundColor?: string;
  textColor?: string;
  headingTypography?: TypographySettings;
  bodyTypography?: TypographySettings;
  enableGrayscale?: boolean;
  enableSepia?: boolean;
  enableBorder?: boolean;
  animation?: string;
}

export interface PersonalHeroConfig {
  name: string;
  role: string;
  bio: string;
  image: string;
  imageStyle: 'circle' | 'rounded' | 'square';
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  show: boolean;
  backgroundImage?: string;
  backgroundType?: string;
  gradientStart?: string;
  gradientEnd?: string;
  backgroundColor?: string;
  textColor?: string;
  headingTypography?: TypographySettings;
  bodyTypography?: TypographySettings;
  enableParallax?: boolean;
  enableGrayscale?: boolean;
  enableSepia?: boolean;
  enableBorder?: boolean;
  animation?: string;
}

export interface FeaturesConfig {
  title: string;
  subtitle: string;
  items: { title: string; description: string; icon: string }[];
  show: boolean;
  enableHoverEffect: boolean;
  cardStyle?: string;
  backgroundImage?: string;
  backgroundType?: string;
  gradientStart?: string;
  gradientEnd?: string;
  backgroundColor?: string;
  textColor?: string;
  headingTypography?: TypographySettings;
  bodyTypography?: TypographySettings;
  enableParallax?: boolean;
  enableGrayscale?: boolean;
  enableSepia?: boolean;
  enableBorder?: boolean;
  animation?: string;
}

export interface GalleryItem {
  url: string;
  title: string;
  subtitle: string;
  link?: string;
  showPlayButton?: boolean;
}

export interface GalleryConfig {
  title: string;
  subtitle: string;
  description?: string;
  layout?: 'slider' | 'grid' | 'masonry' | 'carousel' | 'collage' | 'polaroid' | 'spotlight' | 'filmstrip' | 'stack' | 'reel';
  transition?: string;
  enableLightbox?: boolean;
  items: GalleryItem[];
  show: boolean;
  enableHoverEffect: boolean;
  cardStyle?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  headingTypography?: TypographySettings;
  bodyTypography?: TypographySettings;
  enableParallax?: boolean;
  enableGrayscale?: boolean;
  enableSepia?: boolean;
  enableBorder?: boolean;
  animation?: string;
}

export interface TestimonialsConfig {
  title: string;
  items: { name: string; role: string; content: string; avatar: string }[];
  show: boolean;
  enableHoverEffect: boolean;
  cardStyle?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  headingTypography?: TypographySettings;
  bodyTypography?: TypographySettings;
  enableParallax?: boolean;
  enableGrayscale?: boolean;
  enableSepia?: boolean;
  enableBorder?: boolean;
  animation?: string;
}

export interface TimelineConfig {
  title: string;
  subtitle: string;
  items: { title: string; date: string; description: string; icon: string }[];
  show: boolean;
  enableHoverEffect: boolean;
  cardStyle?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  headingTypography?: TypographySettings;
  bodyTypography?: TypographySettings;
  enableParallax?: boolean;
  enableGrayscale?: boolean;
  enableSepia?: boolean;
  enableBorder?: boolean;
  animation?: string;
}

export interface ProcessConfig {
  title: string;
  subtitle: string;
  items: { title: string; description: string; icon: string }[];
  show: boolean;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  headingTypography?: TypographySettings;
  bodyTypography?: TypographySettings;
  enableParallax?: boolean;
  enableGrayscale?: boolean;
  enableSepia?: boolean;
  enableBorder?: boolean;
  animation?: string;
}

export interface StepsConfig {
  title: string;
  subtitle: string;
  items: { title: string; description: string }[];
  show: boolean;
  enableHoverEffect: boolean;
  cardStyle?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  headingTypography?: TypographySettings;
  bodyTypography?: TypographySettings;
  enableParallax?: boolean;
  enableGrayscale?: boolean;
  enableSepia?: boolean;
  enableBorder?: boolean;
  animation?: string;
}

export interface TeamConfig {
  title: string;
  subtitle: string;
  items: { name: string; role: string; bio: string; avatar: string }[];
  show: boolean;
  enableHoverEffect: boolean;
  cardStyle?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  headingTypography?: TypographySettings;
  bodyTypography?: TypographySettings;
  enableParallax?: boolean;
  enableGrayscale?: boolean;
  enableSepia?: boolean;
  enableBorder?: boolean;
  animation?: string;
}

export interface TwoColumnInfoConfig {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imagePosition: 'left' | 'right' | 'top' | 'bottom';
  buttonText: string;
  buttonLink: string;
  showButton: boolean;
  show: boolean;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  headingTypography?: TypographySettings;
  bodyTypography?: TypographySettings;
  enableParallax?: boolean;
  enableGrayscale?: boolean;
  enableSepia?: boolean;
  enableBorder?: boolean;
  animation?: string;
  enableHoverEffect?: boolean;
}

export interface ManifestoConfig {
  title?: string;
  items: { text: string; highlight: boolean }[];
  show: boolean;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  headingTypography?: TypographySettings;
  enableParallax?: boolean;
  enableGrayscale?: boolean;
  enableSepia?: boolean;
  enableBorder?: boolean;
  animation?: string;
}

export interface ValuePropositionConfig {
  title: string;
  description: string;
  items: { text: string; icon: string }[];
  show: boolean;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  headingTypography?: TypographySettings;
  bodyTypography?: TypographySettings;
  enableParallax?: boolean;
  enableGrayscale?: boolean;
  enableSepia?: boolean;
  enableBorder?: boolean;
  animation?: string;
  enableHoverEffect?: boolean;
}

export interface PhilosophyConfig {
  title: string;
  subtitle: string;
  items: { title: string; content: string; icon: string; backgroundColor?: string; titleColor?: string; textColor?: string; titleFontSize?: string }[];
  show: boolean;
  cardStyle?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  headingTypography?: TypographySettings;
  bodyTypography?: TypographySettings;
  enableParallax?: boolean;
  enableGrayscale?: boolean;
  enableSepia?: boolean;
  enableBorder?: boolean;
  animation?: string;
  enableHoverEffect?: boolean;
}

export interface PullQuotesConfig {
  items: { quote: string; author: string; role?: string; image?: string }[];
  show: boolean;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  headingTypography?: TypographySettings;
  bodyTypography?: TypographySettings;
  enableParallax?: boolean;
  enableGrayscale?: boolean;
  enableSepia?: boolean;
  enableBorder?: boolean;
  animation?: string;
}

export interface ContactFormConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  successMessage: string;
  show: boolean;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  headingTypography?: TypographySettings;
  bodyTypography?: TypographySettings;
  enableParallax?: boolean;
  enableGrayscale?: boolean;
  enableSepia?: boolean;
  enableBorder?: boolean;
  animation?: string;
}

export interface CTAConfig {
  title: string;
  description: string;
  buttonText: string;
  show: boolean;
  enableHoverEffect: boolean;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  headingTypography?: TypographySettings;
  bodyTypography?: TypographySettings;
  enableParallax?: boolean;
  enableGrayscale?: boolean;
  enableSepia?: boolean;
  enableBorder?: boolean;
  animation?: string;
}

export interface FooterConfig {
  companyName: string;
  copyright: string;
  links: { label: string; href: string }[];
  show: boolean;
  backgroundImage?: string;
  backgroundType?: string;
  gradientStart?: string;
  gradientEnd?: string;
  backgroundColor?: string;
  textColor?: string;
  headingTypography?: TypographySettings;
  bodyTypography?: TypographySettings;
  enableParallax?: boolean;
  enableGrayscale?: boolean;
  enableSepia?: boolean;
  enableBorder?: boolean;
  animation?: string;
}

export interface ContentBlock extends TwoColumnInfoConfig {
  id: string;
  type: string;
  content: string;
}

export interface LandingPageConfig {
  theme: Theme;
  primaryColor: string;
  secondaryColor: string;
  buttonTextColor: string;
  backgroundColor: string;
  backgroundType: string;
  gradientStart: string;
  gradientEnd: string;
  surfaceColor: string;
  fontHeading: string;
  fontBody: string;
  borderRadius: BorderRadius;
  enableAnimations: boolean;
  design: DesignConfig;
  sectionOrder: string[];
  navbar: NavbarConfig;
  hero: HeroConfig;
  personalHero: PersonalHeroConfig;
  features: FeaturesConfig;
  gallery: GalleryConfig;
  testimonials: TestimonialsConfig;
  timeline: TimelineConfig;
  process: ProcessConfig;
  steps: StepsConfig;
  team: TeamConfig;
  twoColumnInfo: TwoColumnInfoConfig;
  manifesto: ManifestoConfig;
  valueProposition: ValuePropositionConfig;
  philosophy: PhilosophyConfig;
  pullQuotes: PullQuotesConfig;
  contactForm: ContactFormConfig;
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
  backgroundType: 'solid',
  gradientStart: '#ffffff',
  gradientEnd: '#f3f4f6',
  surfaceColor: '#f3f4f6',
  fontHeading: 'Inter',
  fontBody: 'Inter',
  borderRadius: 'lg',
  enableAnimations: true,
  design: {
      animation: 'slide-up',
      animationDuration: 'normal',
      buttonStyle: 'rounded'
  },
  sectionOrder: ['hero', 'valueProposition', 'philosophy', 'features', 'process', 'manifesto', 'twoColumnInfo', 'steps', 'gallery', 'timeline', 'team', 'testimonials', 'contactForm', 'cta'],
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
    supportedLanguages: ['en', 'ua', 'ru'],
    position: 'fixed'
  },
  hero: {
    title: "Build Faster with AI",
    subtitle: "Generate high-converting landing pages in seconds using the power of Gemini.",
    ctaText: "Get Started Free",
    ctaLink: "#",
    showButton: true,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    show: true,
    enableParallax: false,
    enableHoverEffect: false
  },
  personalHero: {
    name: "Alex Morgan",
    role: "Product Designer",
    bio: "I craft accessible and high-performance digital experiences for the modern web.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    imageStyle: 'circle',
    primaryCtaText: "View Portfolio",
    primaryCtaLink: "#portfolio",
    secondaryCtaText: "Contact Me",
    secondaryCtaLink: "#contact",
    show: false
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
      { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", title: "Modern Workspace", subtitle: "Efficient & Clean" },
      { url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80", title: "Team Collaboration", subtitle: "Stronger Together" },
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
  timeline: {
    title: "Our Journey",
    subtitle: "How we got here.",
    items: [
      { title: "Inception", date: "2020", description: "The idea was born in a small garage.", icon: "" },
      { title: "First Launch", date: "2021", description: "We released our beta version to the public.", icon: "" },
      { title: "Expansion", date: "2023", description: "Reached 1 million users worldwide.", icon: "" },
    ],
    show: true,
    enableHoverEffect: true,
    cardStyle: 'flat'
  },
  process: {
    title: "Our Process",
    subtitle: "From start to finish, we've got you covered.",
    items: [
        { title: "Discovery", description: "We analyze your needs and goals.", icon: "1" },
        { title: "Strategy", description: "We build a roadmap for success.", icon: "2" },
        { title: "Execution", description: "We bring the vision to life.", icon: "3" },
        { title: "Launch", description: "We deploy and monitor performance.", icon: "4" }
    ],
    show: true
  },
  steps: {
    title: "How It Works",
    subtitle: "Simple and effective process.",
    items: [
        { title: "Sign Up", description: "Create your free account in seconds." },
        { title: "Customize", description: "Choose your settings and preferences." },
        { title: "Launch", description: "Publish your site to the world." }
    ],
    show: true,
    enableHoverEffect: true,
    cardStyle: 'flat'
  },
  team: {
    title: "Meet the Team",
    subtitle: "The experts behind the magic.",
    items: [
        { name: "Jane Doe", role: "CEO & Founder", bio: "Visionary leader with 10+ years experience.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80" },
        { name: "John Smith", role: "Head of Engineering", bio: "Full-stack wizard who loves clean code.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
        { name: "Emily Davis", role: "Lead Designer", bio: "Creative soul bringing ideas to life.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80" }
    ],
    show: true,
    enableHoverEffect: true,
    cardStyle: 'hover-lift'
  },
  twoColumnInfo: {
    title: "About Our Mission",
    subtitle: "Driven by Innovation",
    description: "We are committed to delivering the best solutions for our clients. Our approach combines cutting-edge technology with human-centric design to create meaningful experiences.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    imagePosition: 'right',
    buttonText: "Learn More",
    buttonLink: "#",
    showButton: true,
    show: true
  },
  manifesto: {
    title: "Our Beliefs",
    items: [
        { text: "We believe in simplicity.", highlight: false },
        { text: "We innovate with purpose.", highlight: true },
        { text: "We build for the future.", highlight: false }
    ],
    show: true
  },
  valueProposition: {
    title: "Unmatched Value",
    description: "Experience the difference with our premium features designed to scale.",
    items: [
        { text: "24/7 Support", icon: "✓" },
        { text: "99.9% Uptime", icon: "✓" },
        { text: "Unlimited Users", icon: "✓" },
        { text: "Free Updates", icon: "✓" }
    ],
    show: true
  },
  philosophy: {
    title: "Our Philosophy",
    subtitle: "The core principles that guide every decision we make.",
    items: [
        { title: "User First", content: "Every feature starts with the user in mind.", icon: "1", backgroundColor: "", titleColor: "", textColor: "", titleFontSize: "24" },
        { title: "Simplicity", content: "Less is often more when it comes to design.", icon: "2", backgroundColor: "", titleColor: "", textColor: "", titleFontSize: "24" },
        { title: "Transparency", content: "We believe in being open and honest.", icon: "3", backgroundColor: "", titleColor: "", textColor: "", titleFontSize: "24" }
    ],
    show: true
  },
  pullQuotes: {
    items: [
        { quote: "This is a sample pull quote that emphasizes a key message.", author: "Jane Doe", role: "CEO" }
    ],
    show: true
  },
  contactForm: {
      title: "Get in Touch",
      subtitle: "Have questions? We'd love to hear from you.",
      buttonText: "Send Message",
      namePlaceholder: "Your Name",
      emailPlaceholder: "Your Email",
      messagePlaceholder: "Your Message",
      successMessage: "Thanks for reaching out! We'll be in touch shortly.",
      show: true
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
    show: true,
    backgroundImage: undefined,
    backgroundType: 'solid',
    gradientStart: '#ffffff',
    gradientEnd: '#f3f4f6',
    backgroundColor: undefined,
    textColor: undefined
  },
  contentBlocks: []
};
