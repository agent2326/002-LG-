
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
  cardStyle?: 'flat' | 'hover-lift' | 'glass' | 'tilt' | 'border' | 'neumorphic' | 'float' | 'glow-border' | 'pressed' | 'skeuomorphic' | 'shadow-stack' | 'outline-offset' | 'gradient-border';
  // Animation override per section
  animation?: 'fade' | 'slide-up' | 'zoom-in' | 'reveal' | 'none' | 'slide-left' | 'slide-right';
  show: boolean;
}

export interface DesignConfig {
  animation: 'fade' | 'slide-up' | 'zoom-in' | 'reveal' | 'none' | 'slide-left' | 'slide-right';
  animationDuration?: 'fast' | 'normal' | 'slow';
  buttonStyle: 'rounded' | 'pill' | 'magnetic' | 'glow' | 'outline' | 'soft' | 'neumorphic' | '3d';
  // Global card style default
  cardStyle?: 'flat' | 'hover-lift' | 'glass' | 'tilt' | 'border' | 'neumorphic' | 'float' | 'glow-border' | 'pressed' | 'skeuomorphic' | 'shadow-stack' | 'outline-offset' | 'gradient-border';
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
  layout?: 'slider' | 'grid' | 'masonry' | 'carousel' | 'reel' | 'collage' | 'polaroid' | 'spotlight' | 'stack' | 'filmstrip';
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

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

export interface TeamConfig extends SectionStyle {
  title: string;
  subtitle: string;
  items: TeamMember[];
}

export interface StepItem {
  title: string;
  description: string;
}

export interface StepsConfig extends SectionStyle {
  title: string;
  subtitle: string;
  items: StepItem[];
}

export interface TimelineItem {
  title: string;
  date: string;
  description: string;
  icon?: string;
}

export interface TimelineConfig extends SectionStyle {
  title: string;
  subtitle: string;
  items: TimelineItem[];
}

export interface ProcessItem {
  title: string;
  description: string;
  icon?: string;
}

export interface ProcessConfig extends SectionStyle {
  title: string;
  subtitle: string;
  items: ProcessItem[];
}

export interface TwoColumnInfoConfig extends SectionStyle {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  imagePosition: 'left' | 'right';
  buttonText: string;
  buttonLink: string;
  showButton: boolean;
}

export interface ManifestoItem {
  text: string;
  highlight: boolean;
}

export interface ManifestoConfig extends SectionStyle {
  title?: string;
  items: ManifestoItem[];
}

export interface ValueItem {
  text: string;
  icon?: string;
}

export interface ValuePropositionConfig extends SectionStyle {
  title: string;
  description: string;
  items: ValueItem[];
}

export interface PhilosophyItem {
  title: string;
  content: string;
  icon?: string;
}

export interface PhilosophyConfig extends SectionStyle {
  title: string;
  subtitle: string;
  items: PhilosophyItem[];
}

export interface PullQuoteItem {
  quote: string;
  author: string;
  role?: string;
  image?: string;
}

export interface PullQuotesConfig extends SectionStyle {
  items: PullQuoteItem[];
}

export interface CTAConfig extends SectionStyle {
  title: string;
  description: string;
  buttonText: string;
  buttonColor?: string;
  buttonTextColor?: string;
}

export interface ContactFormConfig extends SectionStyle {
  title: string;
  subtitle: string;
  buttonText: string;
  emailPlaceholder: string;
  namePlaceholder: string;
  messagePlaceholder: string;
  successMessage: string;
}

export interface FooterConfig extends SectionStyle {
  copyright: string;
  companyName: string;
  links: { label: string; href: string }[];
}

export interface ContentBlock extends SectionStyle {
  id: string;
  type: 'content' | 'gallery' | 'features' | 'testimonials' | 'cta' | 'timeline' | 'team' | 'two-column-info' | 'steps' | 'manifesto' | 'value-proposition' | 'philosophy' | 'pull-quotes' | 'process';
  title: string;
  subtitle?: string;
  content?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  showButton?: boolean;
  buttonColor?: string;
  buttonTextColor?: string;
  image?: string;
  imagePosition?: 'left' | 'right' | 'bottom';
  images?: string[];
  items?: any[];
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
  timeline: TimelineConfig;
  steps: StepsConfig;
  process: ProcessConfig;
  team: TeamConfig;
  twoColumnInfo: TwoColumnInfoConfig;
  manifesto: ManifestoConfig;
  valueProposition: ValuePropositionConfig;
  philosophy: PhilosophyConfig;
  pullQuotes?: PullQuotesConfig;
  cta: CTAConfig;
  contactForm: ContactFormConfig;
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
        { title: "User First", content: "Every feature starts with the user in mind.", icon: "1" },
        { title: "Simplicity", content: "Less is often more when it comes to design.", icon: "2" },
        { title: "Transparency", content: "We believe in being open and honest.", icon: "3" }
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
    show: true
  },
  contentBlocks: []
};
