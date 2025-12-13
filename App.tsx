
import React, { useState, useRef, useEffect } from 'react';
import { Download, Sparkles, LayoutTemplate, Type, MessageSquare, Megaphone, Menu, Eye, Code, ChevronRight, Plus, Image as ImageIcon, Settings, Trash2, Globe, Palette, Contrast, Shuffle, Layers, Move, RefreshCw, X, Images, ArrowUp, ArrowDown, AlignJustify, ArrowRight, EyeOff, Link as LinkIcon, Circle, Play, Square, Package, Zap, RotateCcw, Mail, Clock, Users, Columns, ListOrdered, FileText, TrendingUp, Lightbulb, Workflow } from 'lucide-react';
import JSZip from 'jszip';

import { LandingPageConfig, DEFAULT_CONFIG, ContentBlock, Theme, GalleryItem, BorderRadius } from './types';
import { generateLandingPageConfig, translateLandingPageConfig } from './services/geminiService';
import { generateHtml, generateWordPressTheme } from './services/exportService';

import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import Features from './components/landing/Features';
import Gallery from './components/landing/Gallery';
import Testimonials from './components/landing/Testimonials';
import CTA from './components/landing/CTA';
import ContactForm from './components/landing/ContactForm';
import Footer from './components/landing/Footer';
import Timeline from './components/landing/Timeline';
import Team from './components/landing/Team';
import TwoColumnInfo from './components/landing/TwoColumnInfo';
import Steps from './components/landing/Steps';
import Process from './components/landing/Process';
import Manifesto from './components/landing/Manifesto';
import ValueProposition from './components/landing/ValueProposition';
import Philosophy from './components/landing/Philosophy';
import ContentBlockRenderer from './components/landing/ContentBlock';

// Maps section IDs to icons
const getSectionIcon = (id: string, type?: string) => {
  if (id === 'global') return Settings;
  if (id === 'navbar') return Globe;
  if (id === 'footer') return Menu;
  if (id === 'hero') return LayoutTemplate;
  if (id === 'features' || type === 'features') return Sparkles;
  if (id === 'gallery' || type === 'gallery') return Images;
  if (id === 'testimonials' || type === 'testimonials') return MessageSquare;
  if (id === 'timeline' || type === 'timeline') return Clock;
  if (id === 'process' || type === 'process') return Workflow;
  if (id === 'team' || type === 'team') return Users;
  if (id === 'twoColumnInfo' || type === 'two-column-info') return Columns;
  if (id === 'steps' || type === 'steps') return ListOrdered;
  if (id === 'manifesto' || type === 'manifesto') return FileText;
  if (id === 'valueProposition' || type === 'value-proposition') return TrendingUp;
  if (id === 'philosophy' || type === 'philosophy') return Lightbulb;
  if (id === 'cta' || type === 'cta') return Megaphone;
  if (id === 'contactForm') return Mail;
  return AlignJustify;
};

const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'uk', label: 'Ukrainian' },
  { code: 'ru', label: 'Russian' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
];

const AVAILABLE_FONTS = [
  'Inter', 
  'Playfair Display', 
  'Space Mono', 
  'Open Sans', 
  'Montserrat', 
  'Lato', 
  'Roboto', 
  'Oswald', 
  'Poppins', 
  'Raleway', 
  'Merriweather', 
  'Nunito', 
  'Rubik'
];

const THEME_PRESETS: Record<string, Partial<LandingPageConfig>> = {
  light: { backgroundColor: '#ffffff', surfaceColor: '#f3f4f6', primaryColor: '#2563eb', secondaryColor: '#4f46e5', buttonTextColor: '#ffffff' },
  dark: { backgroundColor: '#111827', surfaceColor: '#1f2937', primaryColor: '#3b82f6', secondaryColor: '#6366f1', buttonTextColor: '#ffffff' },
  sepia: { backgroundColor: '#fdf6e3', surfaceColor: '#eee8d5', primaryColor: '#d33682', secondaryColor: '#b58900', buttonTextColor: '#fdf6e3' },
  'high-contrast-light': { backgroundColor: '#ffffff', surfaceColor: '#ffffff', primaryColor: '#000000', secondaryColor: '#000000', buttonTextColor: '#ffffff' },
  'high-contrast-dark': { backgroundColor: '#000000', surfaceColor: '#000000', primaryColor: '#ffffff', secondaryColor: '#ffffff', buttonTextColor: '#000000' },
};

const DISPLAY_THEMES: Theme[] = ['light', 'dark', 'sepia', 'high-contrast-light', 'high-contrast-dark'];

function App() {
  const [config, setConfig] = useState<LandingPageConfig>(DEFAULT_CONFIG);
  const [activeSection, setActiveSection] = useState<string>('global');
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'split'>('split');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [useSingleFont, setUseSingleFont] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [activeImageField, setActiveImageField] = useState<{section: string, index?: number, key: string} | null>(null);

  // Ensure config has design object
  useEffect(() => {
     if (!config.design) {
         setConfig(prev => ({
             ...prev,
             design: { animation: 'slide-up', buttonStyle: 'rounded', animationDuration: 'normal' }
         }));
     } else if (!config.design.animationDuration) {
         setConfig(prev => ({
             ...prev,
             design: { ...prev.design, animationDuration: 'normal' }
         }));
     }
     
     // Ensure defaults if loading from old config
     if (!config.process) {
         setConfig(prev => ({
             ...prev,
             process: {
                title: "Process",
                subtitle: "How we work",
                items: [
                    { title: "Plan", description: "Strategy", icon: "1" },
                    { title: "Build", description: "Development", icon: "2" },
                    { title: "Launch", description: "Go live", icon: "3" }
                ],
                show: true
             }
         }));
     }

     if (!config.contactForm) {
         setConfig(prev => ({
             ...prev,
             contactForm: {
                title: "Get in Touch",
                subtitle: "Have questions? We'd love to hear from you.",
                buttonText: "Send Message",
                namePlaceholder: "Your Name",
                emailPlaceholder: "Your Email",
                messagePlaceholder: "Your Message",
                successMessage: "Thanks for reaching out! We'll be in touch shortly.",
                show: true
             }
         }));
     }

     if (!config.timeline) {
         setConfig(prev => ({
             ...prev,
             timeline: {
                title: "Our Journey",
                subtitle: "Key milestones",
                items: [
                    { title: "Started", date: "2023", description: "Project kick-off", icon: "" }
                ],
                show: true
             }
         }));
     }

     if (!config.team) {
         setConfig(prev => ({
             ...prev,
             team: {
                title: "Our Team",
                subtitle: "The people behind the product",
                items: [
                    { name: "John Doe", role: "Founder", bio: "Leader", avatar: "https://via.placeholder.com/150" }
                ],
                show: true
             }
         }));
     }

     if (!config.twoColumnInfo) {
         setConfig(prev => ({
             ...prev,
             twoColumnInfo: {
                title: "About Us",
                subtitle: "Who we are",
                description: "We are a team of dedicated professionals.",
                image: "https://via.placeholder.com/600x400",
                imagePosition: 'right',
                buttonText: "Learn More",
                buttonLink: "#",
                showButton: true,
                show: true
             }
         }));
     }

     if (!config.steps) {
         setConfig(prev => ({
             ...prev,
             steps: {
                title: "How It Works",
                subtitle: "Three simple steps",
                items: [
                    { title: "Step 1", description: "Register" },
                    { title: "Step 2", description: "Configure" },
                    { title: "Step 3", description: "Launch" }
                ],
                show: true
             }
         }));
     }

     if (!config.manifesto) {
         setConfig(prev => ({
             ...prev,
             manifesto: {
                title: "Manifesto",
                items: [
                    { text: "We believe in bold ideas.", highlight: true },
                    { text: "We execute with precision.", highlight: false }
                ],
                show: true
             }
         }));
     }

     if (!config.valueProposition) {
         setConfig(prev => ({
             ...prev,
             valueProposition: {
                title: "Our Value",
                description: "Why we are the best choice.",
                items: [
                    { text: "Quality", icon: "✓" },
                    { text: "Speed", icon: "✓" }
                ],
                show: true
             }
         }));
     }

     if (!config.philosophy) {
         setConfig(prev => ({
             ...prev,
             philosophy: {
                title: "Philosophy",
                subtitle: "Our Guiding Principles",
                items: [
                    { title: "Principle 1", content: "Details", icon: "1" }
                ],
                show: true
             }
         }));
     }
  }, [config.design, config.process, config.contactForm, config.timeline, config.team, config.twoColumnInfo, config.steps, config.manifesto, config.valueProposition, config.philosophy]);

  const handleReloadPreview = () => {
    setPreviewKey(prev => prev + 1);
    if (previewContainerRef.current) {
        previewContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // AI Handler
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const newConfig = await generateLandingPageConfig(aiPrompt);
      if (newConfig) {
        newConfig.navbar.supportedLanguages = ['en', 'uk', 'ru'];
        // Ensure defaults for design
        if (!newConfig.design) newConfig.design = { animation: 'slide-up', buttonStyle: 'rounded', animationDuration: 'normal' };
        
        // Ensure defaults if missing
        if (!newConfig.contactForm) {
            newConfig.contactForm = {
                title: "Contact Us",
                subtitle: "We'd love to hear from you.",
                buttonText: "Send",
                namePlaceholder: "Name",
                emailPlaceholder: "Email",
                messagePlaceholder: "Message",
                successMessage: "Message sent!",
                show: true
            };
        }
        if (!newConfig.timeline) {
            newConfig.timeline = {
                title: "Timeline",
                subtitle: "Our path",
                items: [{ title: "Start", date: "Now", description: "Beginning", icon: "" }],
                show: true
            };
        }
        if (!newConfig.process) {
            newConfig.process = {
                title: "Process",
                subtitle: "Our Workflow",
                items: [
                    { title: "Plan", description: "Strategy", icon: "1" },
                    { title: "Design", description: "Concept", icon: "2" },
                    { title: "Develop", description: "Build", icon: "3" }
                ],
                show: true
            };
        }
        if (!newConfig.team) {
            newConfig.team = {
                title: "Team",
                subtitle: "Meet us",
                items: [{ name: "Alice", role: "CEO", bio: "Leader", avatar: "https://via.placeholder.com/150" }],
                show: true
            };
        }
        if (!newConfig.twoColumnInfo) {
            newConfig.twoColumnInfo = {
                title: "Info",
                subtitle: "Details",
                description: "More info here.",
                image: "https://via.placeholder.com/600x400",
                imagePosition: 'right',
                buttonText: "More",
                buttonLink: "#",
                showButton: true,
                show: true
            };
        }
        if (!newConfig.steps) {
            newConfig.steps = {
                title: "Steps",
                subtitle: "Process",
                items: [{ title: "One", description: "First" }],
                show: true
            };
        }
        if (!newConfig.manifesto) {
            newConfig.manifesto = {
                title: "Manifesto",
                items: [{ text: "We innovate.", highlight: true }],
                show: true
            };
        }
        if (!newConfig.valueProposition) {
            newConfig.valueProposition = {
                title: "Value Prop",
                description: "Key Benefits",
                items: [{ text: "Benefit 1", icon: "✓" }],
                show: true
            };
        }
        if (!newConfig.philosophy) {
            newConfig.philosophy = {
                title: "Philosophy",
                subtitle: "Principles",
                items: [{ title: "Core Value", content: "Description", icon: "1" }],
                show: true
            };
        }
        
        setConfig(newConfig);
        setCurrentLang('en');
        // Detect if fonts are different
        setUseSingleFont(newConfig.fontHeading === newConfig.fontBody);
        handleReloadPreview();
      } else {
        alert("Could not generate configuration. Please try a different prompt.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLanguageToggle = async () => {
    const langs = config.navbar.supportedLanguages && config.navbar.supportedLanguages.length > 0 
      ? config.navbar.supportedLanguages 
      : ['en', 'uk', 'ru'];
    
    let currentIndex = langs.indexOf(currentLang);
    if (currentIndex === -1) currentIndex = 0;
    const nextLang = langs[(currentIndex + 1) % langs.length];
    
    setIsTranslating(true);
    try {
      const translatedConfig = await translateLandingPageConfig(config, nextLang);
      if (translatedConfig) {
        setConfig(prev => ({
          ...prev,
          ...translatedConfig,
          // Restore structural/visual settings that shouldn't change
          theme: prev.theme,
          primaryColor: prev.primaryColor,
          secondaryColor: prev.secondaryColor,
          buttonTextColor: prev.buttonTextColor,
          backgroundColor: prev.backgroundColor,
          surfaceColor: prev.surfaceColor,
          borderRadius: prev.borderRadius,
          fontHeading: prev.fontHeading,
          fontBody: prev.fontBody,
          backgroundImage: prev.backgroundImage,
          enableAnimations: prev.enableAnimations,
          design: prev.design, // Preserve Design
          sectionOrder: prev.sectionOrder,
          gallery: {
              ...translatedConfig.gallery,
              layout: prev.gallery.layout,
              transition: prev.gallery.transition,
              enableLightbox: prev.gallery.enableLightbox,
              items: translatedConfig.gallery.items ? translatedConfig.gallery.items.map((it: any, i) => ({
                  ...it,
                  url: prev.gallery.items[i]?.url || it.url // Preserve image URL
              })) : prev.gallery.items 
          },
          navbar: {
              ...translatedConfig.navbar,
              logoImage: prev.navbar.logoImage, // Preserve Logo Image
              logoFont: prev.navbar.logoFont,
              logoColor: prev.navbar.logoColor,
              supportedLanguages: prev.navbar.supportedLanguages,
              showLanguageSwitcher: prev.navbar.showLanguageSwitcher,
              showThemeToggle: prev.navbar.showThemeToggle,
              show: prev.navbar.show
          },
          contactForm: {
             ...translatedConfig.contactForm,
             // Ensure style props are kept
             backgroundColor: prev.contactForm?.backgroundColor,
             textColor: prev.contactForm?.textColor,
             backgroundImage: prev.contactForm?.backgroundImage,
             show: prev.contactForm?.show ?? true
          },
          timeline: {
             ...translatedConfig.timeline,
             backgroundColor: prev.timeline?.backgroundColor,
             textColor: prev.timeline?.textColor,
             backgroundImage: prev.timeline?.backgroundImage,
             show: prev.timeline?.show ?? true,
             items: translatedConfig.timeline.items ? translatedConfig.timeline.items.map((it: any, i) => ({
                 ...it,
                 icon: prev.timeline.items[i]?.icon || it.icon
             })) : prev.timeline.items
          },
          process: {
             ...translatedConfig.process,
             backgroundColor: prev.process?.backgroundColor,
             textColor: prev.process?.textColor,
             backgroundImage: prev.process?.backgroundImage,
             show: prev.process?.show ?? true,
             items: translatedConfig.process.items ? translatedConfig.process.items.map((it: any, i) => ({
                 ...it,
                 icon: prev.process.items[i]?.icon || it.icon
             })) : prev.process.items
          },
          team: {
             ...translatedConfig.team,
             backgroundColor: prev.team?.backgroundColor,
             textColor: prev.team?.textColor,
             backgroundImage: prev.team?.backgroundImage,
             show: prev.team?.show ?? true,
             items: translatedConfig.team.items ? translatedConfig.team.items.map((it: any, i) => ({
                 ...it,
                 avatar: prev.team.items[i]?.avatar || it.avatar
             })) : prev.team.items
          },
          steps: {
             ...translatedConfig.steps,
             backgroundColor: prev.steps?.backgroundColor,
             textColor: prev.steps?.textColor,
             backgroundImage: prev.steps?.backgroundImage,
             show: prev.steps?.show ?? true,
             items: translatedConfig.steps.items ? translatedConfig.steps.items.map((it: any, i) => ({
                 ...it,
             })) : prev.steps.items
          },
          twoColumnInfo: {
             ...translatedConfig.twoColumnInfo,
             backgroundColor: prev.twoColumnInfo?.backgroundColor,
             textColor: prev.twoColumnInfo?.textColor,
             backgroundImage: prev.twoColumnInfo?.backgroundImage,
             show: prev.twoColumnInfo?.show ?? true,
             image: prev.twoColumnInfo?.image,
             imagePosition: prev.twoColumnInfo?.imagePosition
          },
          manifesto: {
             ...translatedConfig.manifesto,
             backgroundColor: prev.manifesto?.backgroundColor,
             textColor: prev.manifesto?.textColor,
             backgroundImage: prev.manifesto?.backgroundImage,
             show: prev.manifesto?.show ?? true,
             items: translatedConfig.manifesto.items ? translatedConfig.manifesto.items.map((it: any, i) => ({
                 ...it,
                 highlight: prev.manifesto.items[i]?.highlight // Keep highlight status
             })) : prev.manifesto.items
          },
          valueProposition: {
             ...translatedConfig.valueProposition,
             backgroundColor: prev.valueProposition?.backgroundColor,
             textColor: prev.valueProposition?.textColor,
             backgroundImage: prev.valueProposition?.backgroundImage,
             show: prev.valueProposition?.show ?? true,
             items: translatedConfig.valueProposition.items ? translatedConfig.valueProposition.items.map((it: any, i) => ({
                 ...it,
                 icon: prev.valueProposition.items[i]?.icon // Keep icon
             })) : prev.valueProposition.items
          },
          philosophy: {
             ...translatedConfig.philosophy,
             backgroundColor: prev.philosophy?.backgroundColor,
             textColor: prev.philosophy?.textColor,
             backgroundImage: prev.philosophy?.backgroundImage,
             show: prev.philosophy?.show ?? true,
             items: translatedConfig.philosophy.items ? translatedConfig.philosophy.items.map((it: any, i) => ({
                 ...it,
                 icon: prev.philosophy.items[i]?.icon // Keep icon
             })) : prev.philosophy.items
          },
          contentBlocks: translatedConfig.contentBlocks.map((b, i) => {
              const prevBlock = prev.contentBlocks[i];
              if (!prevBlock) return b;
              return {
                  ...b,
                  // Restore images and structure, only translate text
                  type: prevBlock.type,
                  image: prevBlock.image,
                  images: prevBlock.images,
                  layout: prevBlock.layout,
                  transition: prevBlock.transition,
                  enableLightbox: prevBlock.enableLightbox,
                  items: prevBlock.items ? b.items.map((item: any, idx: number) => ({
                      ...item,
                      icon: prevBlock.items && prevBlock.items[idx] ? prevBlock.items[idx].icon : item.icon,
                      avatar: prevBlock.items && prevBlock.items[idx] ? prevBlock.items[idx].avatar : item.avatar,
                      highlight: prevBlock.items && prevBlock.items[idx] ? prevBlock.items[idx].highlight : item.highlight,
                      image: prevBlock.items && prevBlock.items[idx] ? prevBlock.items[idx].image : item.image
                  })) : undefined,
                  backgroundColor: prevBlock.backgroundColor,
                  textColor: prevBlock.textColor,
                  backgroundImage: prevBlock.backgroundImage,
                  enableParallax: prevBlock.enableParallax,
                  enableHoverEffect: prevBlock.enableHoverEffect,
                  cardStyle: prevBlock.cardStyle
              };
          })
        }));
        setCurrentLang(nextLang);
      } else {
        alert("Translation failed. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred during translation.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleImageUploadTrigger = (section: string, key: string, index?: number) => {
    setActiveImageField({ section, key, index });
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeImageField) {
      // Optimization: Limit file size to 2MB to prevent browser hang on large Base64 strings
      if (file.size > 2 * 1024 * 1024) {
          alert("Image is too large. Please upload an image smaller than 2MB.");
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (activeImageField.section === 'global' && activeImageField.key === 'backgroundImage') {
           setConfig(prev => ({ ...prev, backgroundImage: base64 }));
           return;
        }
        if (activeImageField.index !== undefined) {
           const { section, key, index } = activeImageField;
           if (section.startsWith('block-')) {
               const blockId = section.replace('block-', '');
               const blockIdx = config.contentBlocks.findIndex(b => b.id === blockId);
               if (blockIdx !== -1) {
                    if (key === 'image') {
                         updateNestedArray('contentBlocks', blockIdx, 'image', base64);
                    } else if (key === 'gallery') {
                         setConfig(prev => {
                            const blocks = [...prev.contentBlocks];
                            if (blocks[blockIdx].images) {
                                const imgs = [...blocks[blockIdx].images!];
                                imgs[index] = base64;
                                blocks[blockIdx] = { ...blocks[blockIdx], images: imgs };
                            }
                            return { ...prev, contentBlocks: blocks };
                         });
                    } else if (key === 'items') {
                         // Generic item image upload for block
                         updateNestedArray('contentBlocks', blockIdx, key, base64);
                    }
               }
           } else if (section === 'testimonials' || section === 'team') {
             updateNestedArray(section, index, key, base64);
           } else if (section === 'gallery') {
             setConfig(prev => {
                const newItems = [...prev.gallery.items];
                if (newItems[index]) {
                   newItems[index] = { ...newItems[index], url: base64 };
                }
                return { ...prev, gallery: { ...prev.gallery, items: newItems } };
             });
           }
        } else {
           if (activeImageField.section.startsWith('block-')) {
              const blockId = activeImageField.section.replace('block-', '');
              const blockIdx = config.contentBlocks.findIndex(b => b.id === blockId);
              if (blockIdx !== -1) updateNestedArray('contentBlocks', blockIdx, activeImageField.key, base64);
           } else {
              updateConfig(activeImageField.section, activeImageField.key, base64);
           }
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSectionSelect = (section: string) => {
    setActiveSection(section);
    setActiveTab('content');
  };

  const addNewBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type: type,
      title: type === 'gallery' ? 'Photo Gallery' : type === 'features' ? 'New Features' : type === 'testimonials' ? 'Success Stories' : type === 'timeline' ? 'Our Timeline' : type === 'process' ? 'Process' : type === 'team' ? 'Our Team' : type === 'two-column-info' ? 'Info Section' : type === 'steps' ? 'Steps' : type === 'manifesto' ? 'Manifesto' : type === 'value-proposition' ? 'Value Prop' : type === 'philosophy' ? 'Philosophy' : type === 'cta' ? 'Call to Action' : 'Content Section',
      show: true,
    };
    if (type === 'content') {
        newBlock.content = "Add your content here.";
        newBlock.imagePosition = 'right';
        newBlock.image = "https://via.placeholder.com/600x400";
    } else if (type === 'gallery') {
        newBlock.subtitle = "A collection of images";
        newBlock.layout = 'slider';
        newBlock.enableLightbox = true;
        newBlock.items = [
            { url: "https://via.placeholder.com/800x600", title: "Image 1" },
            { url: "https://via.placeholder.com/800x600", title: "Image 2" }
        ];
    } else if (type === 'features') {
        newBlock.subtitle = "Highlights";
        newBlock.cardStyle = 'hover-lift';
        newBlock.items = [
            { title: "Feature 1", description: "Description", icon: "★" },
            { title: "Feature 2", description: "Description", icon: "★" }
        ];
    } else if (type === 'testimonials') {
        newBlock.cardStyle = 'flat';
        newBlock.items = [
            { name: "User Name", role: "Customer", content: "Great experience!", avatar: "https://via.placeholder.com/100" }
        ];
    } else if (type === 'timeline') {
        newBlock.subtitle = "Milestones";
        newBlock.cardStyle = 'flat';
        newBlock.items = [
            { title: "Phase 1", date: "Q1", description: "Initial phase", icon: "1" },
            { title: "Phase 2", date: "Q2", description: "Development", icon: "2" }
        ];
    } else if (type === 'process') {
        newBlock.subtitle = "Workflow";
        newBlock.items = [
            { title: "Step 1", description: "Start", icon: "1" },
            { title: "Step 2", description: "Work", icon: "2" },
            { title: "Step 3", description: "Finish", icon: "3" }
        ];
    } else if (type === 'team') {
        newBlock.subtitle = "The Experts";
        newBlock.cardStyle = 'hover-lift';
        newBlock.items = [
            { name: "Member 1", role: "Role", bio: "Bio", avatar: "https://via.placeholder.com/150" }
        ];
    } else if (type === 'two-column-info') {
        newBlock.subtitle = "Details";
        newBlock.description = "Add description here.";
        newBlock.image = "https://via.placeholder.com/600x400";
        newBlock.imagePosition = 'left';
        newBlock.buttonText = "Learn More";
        newBlock.buttonLink = "#";
        newBlock.showButton = true;
    } else if (type === 'steps') {
        newBlock.subtitle = "How It Works";
        newBlock.cardStyle = 'flat';
        newBlock.items = [
            { title: "Step 1", description: "Description" },
            { title: "Step 2", description: "Description" },
            { title: "Step 3", description: "Description" }
        ];
    } else if (type === 'manifesto') {
        newBlock.title = "Our Beliefs";
        newBlock.items = [
            { text: "Statement One", highlight: true },
            { text: "Statement Two", highlight: false }
        ];
    } else if (type === 'value-proposition') {
        newBlock.title = "Why Us?";
        newBlock.description = "The main reason to choose us.";
        newBlock.items = [
            { text: "Benefit 1", icon: "✓" },
            { text: "Benefit 2", icon: "✓" }
        ];
    } else if (type === 'philosophy') {
        newBlock.title = "Our Philosophy";
        newBlock.items = [
            { title: "Principle 1", content: "Details", icon: "1" },
            { title: "Principle 2", content: "Details", icon: "2" }
        ];
    } else if (type === 'cta') {
        newBlock.description = "Take action now.";
        newBlock.buttonText = "Click Me";
    }
    setConfig(prev => ({
      ...prev,
      contentBlocks: [...prev.contentBlocks, newBlock],
      sectionOrder: [...prev.sectionOrder, `block-${newBlock.id}`]
    }));
    setActiveSection(`block-${newBlock.id}`);
    setActiveTab('content');
    setShowAddMenu(false);
  };

  const removeSection = (id: string) => {
    if (['hero', 'features', 'gallery', 'testimonials', 'cta', 'contactForm', 'timeline', 'process', 'team', 'twoColumnInfo', 'steps', 'manifesto', 'valueProposition', 'philosophy'].includes(id)) {
        updateConfig(id, 'show', false);
    } else {
        const blockId = id.replace('block-', '');
        setConfig(prev => ({
            ...prev,
            contentBlocks: prev.contentBlocks.filter(b => b.id !== blockId),
            sectionOrder: prev.sectionOrder.filter(sid => sid !== id)
        }));
        setActiveSection('global');
    }
  };

  const moveSection = (index: number, direction: -1 | 1) => {
      setConfig(prev => {
          const newOrder = [...prev.sectionOrder];
          const targetIndex = index + direction;
          if (targetIndex < 0 || targetIndex >= newOrder.length) return prev;
          [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
          return { ...prev, sectionOrder: newOrder };
      });
  };

  const handleOrderChange = (sectionId: string, newPosition: number) => {
    if (isNaN(newPosition) || newPosition < 1) return;
    setConfig(prev => {
        const currentOrder = prev.sectionOrder;
        const currentIndex = currentOrder.indexOf(sectionId);
        if (currentIndex === -1) return prev;
        const newIndex = Math.min(Math.max(0, newPosition - 1), currentOrder.length - 1);
        if (newIndex === currentIndex) return prev;
        const newOrderArray = [...currentOrder];
        newOrderArray.splice(currentIndex, 1);
        newOrderArray.splice(newIndex, 0, sectionId);
        return { ...prev, sectionOrder: newOrderArray };
    });
  };

  const toggleTheme = () => {
     setConfig(c => {
       const modes: Theme[] = DISPLAY_THEMES;
       const currentIdx = modes.indexOf(c.theme);
       const nextTheme = modes[(currentIdx + 1) % modes.length];
       const preset = THEME_PRESETS[nextTheme];
       return { ...c, theme: nextTheme, ...(preset || {}) };
     });
  };

  const randomizeColors = () => {
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setConfig(prev => ({
      ...prev,
      primaryColor: randomColor(),
      secondaryColor: randomColor()
    }));
  };

  const randomizeSectionBackgrounds = () => {
     // Helper for HSL to Hex
     const hslToHex = (h: number, s: number, l: number) => {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
     };

     const baseHue = Math.floor(Math.random() * 360);
     const secondaryHue = (baseHue + 30 + Math.floor(Math.random() * 60)) % 360;

     setConfig(prev => {
        const next = { ...prev };
        const sections = ['navbar', 'hero', 'features', 'gallery', 'testimonials', 'cta', 'contactForm', 'timeline', 'process', 'team', 'twoColumnInfo', 'steps', 'manifesto', 'valueProposition', 'philosophy', 'footer'];
        
        sections.forEach((section, idx) => {
            let h = baseHue;
            let s = Math.floor(Math.random() * 20) + 10; // 10-30%
            let l = 95;

            // Strategy for nice layouts
            if (section === 'footer') {
                h = secondaryHue;
                l = 10 + Math.floor(Math.random() * 10); // Dark
                s = 20;
            } else if (section === 'navbar') {
                l = 100;
            } else if (section === 'cta') {
                h = secondaryHue;
                s = 30;
                l = 90 + Math.floor(Math.random() * 8);
            } else if (idx % 2 === 0) {
                 // Even sections
                 l = 98;
            } else {
                 // Odd sections
                 l = 92 + Math.floor(Math.random() * 6);
                 h = (baseHue + 15) % 360;
            }
            
            // Random chance for completely random color for chaos/variety
            if (Math.random() > 0.9) {
                 h = Math.floor(Math.random() * 360);
                 s = 40;
                 l = 90;
            }

            const hex = hslToHex(h, s, l);
            // @ts-ignore
            if (next[section]) {
                 // @ts-ignore
                next[section] = { ...next[section], backgroundColor: hex };
            }
        });
        return next;
     });
  };

  const updateConfig = (section: string, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof LandingPageConfig] as any),
        [key]: value
      }
    }));
  };

  const addNavbarLink = () => {
      setConfig(prev => ({
          ...prev,
          navbar: {
              ...prev.navbar,
              links: [...prev.navbar.links, { label: "New Link", href: "#" }]
          }
      }));
  };
  
  const updateNavbarLink = (index: number, key: 'label' | 'href', value: string) => {
      setConfig(prev => {
          const newLinks = [...prev.navbar.links];
          newLinks[index] = { ...newLinks[index], [key]: value };
          return {
              ...prev,
              navbar: { ...prev.navbar, links: newLinks }
          };
      });
  };
  
  const removeNavbarLink = (index: number) => {
      setConfig(prev => {
          const newLinks = prev.navbar.links.filter((_, i) => i !== index);
          return {
              ...prev,
              navbar: { ...prev.navbar, links: newLinks }
          };
      });
  };

  const updateNestedArray = (section: 'features' | 'testimonials' | 'timeline' | 'process' | 'team' | 'steps' | 'manifesto' | 'valueProposition' | 'philosophy' | 'footer' | 'contentBlocks', itemIndex: number, field: string, value: any) => {
    setConfig(prev => {
      if (section === 'contentBlocks') {
        const items = [...prev.contentBlocks];
        if (items[itemIndex]) {
            items[itemIndex] = { ...items[itemIndex], [field]: value };
        }
        return { ...prev, contentBlocks: items };
      }
      const prevSection = prev[section];
      if (prevSection && typeof prevSection === 'object' && !Array.isArray(prevSection) && 'items' in prevSection) {
          const sectionData = { ...prevSection };
          // @ts-ignore
          const items = [...sectionData.items];
          if (items[itemIndex]) {
              items[itemIndex] = { ...items[itemIndex], [field]: value };
          }
          // @ts-ignore
          sectionData.items = items;
          return { ...prev, [section]: sectionData };
      }
      return prev;
    });
  };
  
  const updateBlock = (blockId: string, field: string, value: any) => {
      const idx = config.contentBlocks.findIndex(b => b.id === blockId);
      if (idx !== -1) updateNestedArray('contentBlocks', idx, field, value);
  };
  
  const updateBlockItem = (blockId: string, itemIdx: number, field: string, value: any) => {
     setConfig(prev => {
        const blocks = [...prev.contentBlocks];
        const blockIndex = blocks.findIndex(b => b.id === blockId);
        if (blockIndex === -1) return prev;
        const block = { ...blocks[blockIndex] };
        if (block.items) {
            const items = [...block.items];
            items[itemIdx] = { ...items[itemIdx], [field]: value };
            block.items = items;
        }
        blocks[blockIndex] = block;
        return { ...prev, contentBlocks: blocks };
     });
  };
  
  const addBlockItem = (blockId: string) => {
       setConfig(prev => {
        const blocks = [...prev.contentBlocks];
        const blockIndex = blocks.findIndex(b => b.id === blockId);
        if (blockIndex === -1) return prev;
        const block = { ...blocks[blockIndex] };
        if (!block.items) block.items = [];
        if (block.type === 'features') {
            block.items = [...block.items, { title: 'New Feature', description: 'Description', icon: '★' }];
        } else if (block.type === 'testimonials') {
             block.items = [...block.items, { name: 'Name', role: 'Role', content: 'Feedback', avatar: 'https://via.placeholder.com/100' }];
        } else if (block.type === 'timeline') {
             block.items = [...block.items, { title: 'New Step', date: 'Date', description: 'Description', icon: '•' }];
        } else if (block.type === 'process') {
             block.items = [...block.items, { title: 'New Step', description: 'Description', icon: '•' }];
        } else if (block.type === 'team') {
             block.items = [...block.items, { name: 'New Member', role: 'Role', bio: 'Bio', avatar: 'https://via.placeholder.com/150' }];
        } else if (block.type === 'steps') {
             block.items = [...block.items, { title: 'New Step', description: 'Description' }];
        } else if (block.type === 'manifesto') {
             block.items = [...block.items, { text: 'New Statement', highlight: false }];
        } else if (block.type === 'value-proposition') {
             block.items = [...block.items, { text: 'New Benefit', icon: '✓' }];
        } else if (block.type === 'philosophy') {
             block.items = [...block.items, { title: 'Principle', content: 'Description', icon: '1' }];
        }
        blocks[blockIndex] = block;
        return { ...prev, contentBlocks: blocks };
     });
  };
  
  const removeBlockItem = (blockId: string, idx: number) => {
      setConfig(prev => {
        const blocks = [...prev.contentBlocks];
        const blockIndex = blocks.findIndex(b => b.id === blockId);
        if (blockIndex === -1) return prev;
        const block = { ...blocks[blockIndex] };
        if (block.items) {
             block.items = block.items.filter((_, i) => i !== idx);
        }
        blocks[blockIndex] = block;
        return { ...prev, contentBlocks: blocks };
     });
  };
  
  const addSingletonItem = (section: 'features' | 'testimonials' | 'timeline' | 'process' | 'team' | 'steps' | 'manifesto' | 'valueProposition' | 'philosophy') => {
    setConfig(prev => {
        const sectionData = { ...prev[section] };
        const items = [...(sectionData as any).items];
        if (section === 'features') {
            items.push({ title: 'New Feature', description: 'Description', icon: '★' });
        } else if (section === 'timeline') {
            items.push({ title: 'New Event', date: '2024', description: 'Description', icon: '📅' });
        } else if (section === 'process') {
            items.push({ title: 'New Step', description: 'Description', icon: '→' });
        } else if (section === 'team') {
            items.push({ name: 'New Member', role: 'Role', bio: 'Bio', avatar: 'https://via.placeholder.com/150' });
        } else if (section === 'steps') {
            items.push({ title: 'New Step', description: 'Description' });
        } else if (section === 'manifesto') {
            items.push({ text: 'New Statement', highlight: false });
        } else if (section === 'valueProposition') {
            items.push({ text: 'New Benefit', icon: '✓' });
        } else if (section === 'philosophy') {
            items.push({ title: 'Principle', content: 'Description', icon: '1' });
        } else {
            items.push({ name: 'Name', role: 'Role', content: 'Feedback', avatar: 'https://via.placeholder.com/100' });
        }
        (sectionData as any).items = items;
        return { ...prev, [section]: sectionData };
    });
  };

  const removeSingletonItem = (section: 'features' | 'testimonials' | 'timeline' | 'process' | 'team' | 'steps' | 'manifesto' | 'valueProposition' | 'philosophy', index: number) => {
      setConfig(prev => {
          const sectionData = { ...prev[section] };
          (sectionData as any).items = (sectionData as any).items.filter((_: any, i: number) => i !== index);
          return { ...prev, [section]: sectionData };
      });
  };

  const updateSingletonItem = (section: 'features' | 'testimonials' | 'timeline' | 'process' | 'team' | 'steps' | 'manifesto' | 'valueProposition' | 'philosophy', index: number, key: string, value: any) => {
      setConfig(prev => {
          const sectionData = { ...prev[section] };
          const items = [...(sectionData as any).items];
          items[index] = { ...items[index], [key]: value };
          (sectionData as any).items = items;
          return { ...prev, [section]: sectionData };
      });
  };

  const addGalleryItem = () => {
    setConfig(prev => ({
        ...prev,
        gallery: {
            ...prev.gallery,
            items: [...prev.gallery.items, { url: "https://via.placeholder.com/800x600", title: "Title", subtitle: "Subtitle" }]
        }
    }));
  };

  const updateGalleryItem = (index: number, key: keyof GalleryItem, value: any) => {
      setConfig(prev => {
          const newItems = [...prev.gallery.items];
          newItems[index] = { ...newItems[index], [key]: value };
          return { ...prev, gallery: { ...prev.gallery, items: newItems } };
      });
  };

  const removeGalleryItem = (index: number) => {
      setConfig(prev => {
          const newItems = prev.gallery.items.filter((_, i) => i !== index);
          return { ...prev, gallery: { ...prev.gallery, items: newItems } };
      });
  };

  const handleExport = async (format: 'react' | 'html' | 'wordpress' = 'react') => {
    const zip = new JSZip();
    
    // Always include the preview HTML
    const htmlContent = generateHtml(config);
    zip.file("preview.html", htmlContent);
    zip.file("config.json", JSON.stringify(config, null, 2));

    if (format === 'html') {
        zip.file("index.html", htmlContent);
        zip.file("README.md", `# Landing Page (HTML)\n\nOpen index.html in your browser.`);
    } else if (format === 'wordpress') {
        const wpFiles = generateWordPressTheme(config, htmlContent);
        const themeFolder = zip.folder("wordpress-theme");
        if (themeFolder) {
            Object.entries(wpFiles).forEach(([name, content]) => themeFolder.file(name, content));
        }
        zip.file("README.md", `# WordPress Theme\n\n1. Go to your WordPress Admin > Appearance > Themes.\n2. Upload this folder (or zip it) to install the theme.`);
    } else {
        // Default React Export
        zip.file("package.json", JSON.stringify({
          name: "landing-page",
          version: "1.0.0",
          private: true,
          dependencies: {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "react-scripts": "5.0.1",
            "lucide-react": "^0.263.1",
            "web-vitals": "^2.1.4"
          },
          scripts: {
            "start": "react-scripts start",
            "build": "react-scripts build",
            "test": "react-scripts test",
            "eject": "react-scripts eject"
          },
          eslintConfig: {
            "extends": ["react-app", "react-app/jest"]
          }
        }, null, 2));
        
        // src/App.js logic simplified for export (in a real scenario we'd duplicate the component code)
        // For this demo, we'll put the HTML version in public to be useful immediately
        zip.file("public/index.html", htmlContent);
        zip.file("README.md", `# React Project\n\n1. Run 'npm install'\n2. Run 'npm start'`);
        zip.file("src/index.js", `import React from 'react'; import ReactDOM from 'react-dom/client'; const root = ReactDOM.createRoot(document.getElementById('root')); root.render(<div>See public/index.html for static version</div>);`);
    }

    try {
        const content = await zip.generateAsync({ type: "blob" });
        const url = window.URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = `landing-page-${format}.zip`;
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Export failed", err);
    }
    setShowExportModal(false);
  };

  // ... (renderStyleEditor, renderEditor) ...
  const renderStyleEditor = (sectionId: string, blockIndex?: number) => {
    let data: any;
    if (blockIndex !== undefined && blockIndex !== -1) {
      data = config.contentBlocks[blockIndex];
    } else if (sectionId !== 'global') {
      data = config[sectionId as keyof LandingPageConfig];
    }

    if (!data) return <div className="p-4 text-gray-500 text-sm">Select a section to edit styles.</div>;

    const updateStyle = (key: string, value: any) => {
      if (blockIndex !== undefined && blockIndex !== -1) {
        updateNestedArray('contentBlocks', blockIndex, key, value);
      } else {
        updateConfig(sectionId, key, value);
      }
    };

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-900">Colors</h4>
          <div className="grid grid-cols-1 gap-3">
             <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Background</label>
                <div className="flex gap-2 items-center">
                   <div className="h-8 w-8 rounded border border-gray-200 overflow-hidden shrink-0 relative">
                      <input type="color" value={data.backgroundColor || '#ffffff'} onChange={(e) => updateStyle('backgroundColor', e.target.value)} className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0" />
                   </div>
                   <input 
                      type="text" 
                      value={data.backgroundColor || ''} 
                      onChange={(e) => updateStyle('backgroundColor', e.target.value)} 
                      className="flex-1 border p-1.5 rounded text-sm font-mono"
                      placeholder="Default"
                   />
                </div>
             </div>
             <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Text</label>
                <div className="flex gap-2 items-center">
                   <div className="h-8 w-8 rounded border border-gray-200 overflow-hidden shrink-0 relative">
                      <input type="color" value={data.textColor || '#000000'} onChange={(e) => updateStyle('textColor', e.target.value)} className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0" />
                   </div>
                   <input 
                      type="text" 
                      value={data.textColor || ''} 
                      onChange={(e) => updateStyle('textColor', e.target.value)} 
                      className="flex-1 border p-1.5 rounded text-sm font-mono"
                      placeholder="Default"
                   />
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
             <h4 className="text-sm font-bold text-gray-900">Background Image</h4>
             <div className="flex gap-2">
                 <input 
                    className="flex-1 border p-2 rounded text-sm" 
                    value={data.backgroundImage || ''} 
                    onChange={(e) => updateStyle('backgroundImage', e.target.value)}
                    placeholder="Image URL"
                 />
                 <button onClick={() => handleImageUploadTrigger(sectionId, 'backgroundImage', blockIndex)} className="p-2 bg-gray-100 rounded hover:bg-gray-200"><ImageIcon size={18}/></button>
             </div>
        </div>
        
        {/* CARD EFFECTS - MOVED HERE FROM GLOBAL, NOW FOR ALL SECTIONS */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-900">Card Effect</h4>
            <div className="grid grid-cols-2 gap-1">
                {[
                    'flat', 'hover-lift', 'glass', 'tilt', 'border', 'neumorphic', 'float',
                    'glow-border', 'pressed', 'skeuomorphic', 'shadow-stack', 'outline-offset', 'gradient-border'
                ].map((style) => (
                    <button
                        key={style}
                        onClick={() => updateStyle('cardStyle', style)}
                        className={`px-2 py-1.5 text-[10px] border rounded capitalize transition-all ${ (data.cardStyle || 'flat') === style ? 'bg-purple-50 border-purple-500 text-purple-700 font-medium' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        {style.replace('-', ' ')}
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-900">Effects</h4>
            <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Parallax Effect</span>
                <input type="checkbox" checked={data.enableParallax || false} onChange={(e) => updateStyle('enableParallax', e.target.checked)} className="rounded text-blue-600" />
            </label>
            <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Hover Scale Effect</span>
                <input type="checkbox" checked={data.enableHoverEffect || false} onChange={(e) => updateStyle('enableHoverEffect', e.target.checked)} className="rounded text-blue-600" />
            </label>
            <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Grayscale</span>
                <input type="checkbox" checked={data.enableGrayscale || false} onChange={(e) => updateStyle('enableGrayscale', e.target.checked)} className="rounded text-blue-600" />
            </label>
            <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Sepia Filter</span>
                <input type="checkbox" checked={data.enableSepia || false} onChange={(e) => updateStyle('enableSepia', e.target.checked)} className="rounded text-blue-600" />
            </label>
            <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Add Border</span>
                <input type="checkbox" checked={data.enableBorder || false} onChange={(e) => updateStyle('enableBorder', e.target.checked)} className="rounded text-blue-600" />
            </label>
        </div>
      </div>
    );
  };

  const renderEditor = () => {
    let blockIndex = -1;
    let currentBlock: ContentBlock | null = null;
    let currentSectionData: any = null;
    
    if (activeSection.startsWith('block-')) {
      const blockId = activeSection.replace('block-', '');
      blockIndex = config.contentBlocks.findIndex(b => b.id === blockId);
      if (blockIndex !== -1) {
          currentBlock = config.contentBlocks[blockIndex];
          currentSectionData = currentBlock;
      }
    } else if (activeSection !== 'global') {
        currentSectionData = config[activeSection as keyof LandingPageConfig];
    }

    if (activeSection === 'global') {
      return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-gray-900">Theme Mode</label>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                   {DISPLAY_THEMES.map((t) => (
                      <button 
                        key={t}
                        onClick={() => {
                            const preset = THEME_PRESETS[t];
                            setConfig({...config, theme: t as Theme, ...(preset || {})});
                        }}
                        className={`relative px-2 py-2 text-[10px] font-medium rounded-lg capitalize border-2 transition-all flex items-center justify-between ${
                            config.theme === t 
                            ? 'border-blue-600 bg-blue-50 text-blue-700' 
                            : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'
                        }`}
                      >
                         <span className="truncate">{t.replace('high-contrast-', 'HC ').replace('-', ' ')}</span>
                         <div className="w-2 h-2 rounded-full" style={{ backgroundColor: THEME_PRESETS[t].backgroundColor || 'gray', border: '1px solid rgba(0,0,0,0.1)' }}></div>
                      </button>
                   ))}
                </div>
            </div>

            {/* Global colors */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
               <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900">Theme Palette</h4>
                  <button 
                        onClick={randomizeColors}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                        title="Randomize Primary & Secondary Colors"
                    >
                        <Shuffle size={14} />
                        <span>Random</span>
                  </button>
               </div>
               <div className="space-y-3">
                 <div className="flex items-center justify-between">
                   <label className="text-xs font-medium text-gray-500">Primary (Brand)</label>
                   <div className="flex gap-2 items-center">
                     <span className="text-xs font-mono text-gray-400">{config.primaryColor}</span>
                     <input type="color" value={config.primaryColor} onChange={(e) => setConfig({...config, primaryColor: e.target.value})} className="h-6 w-8 rounded cursor-pointer border-0 p-0" />
                   </div>
                 </div>
                 <div className="flex items-center justify-between">
                   <label className="text-xs font-medium text-gray-500">Secondary (Accent)</label>
                   <div className="flex gap-2 items-center">
                     <span className="text-xs font-mono text-gray-400">{config.secondaryColor}</span>
                     <input type="color" value={config.secondaryColor} onChange={(e) => setConfig({...config, secondaryColor: e.target.value})} className="h-6 w-8 rounded cursor-pointer border-0 p-0" />
                   </div>
                 </div>
               </div>
            </div>

             {/* --- DESIGN SYSTEM --- */}
             <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                    <Zap size={18} className="text-purple-600" />
                    <h4 className="text-sm font-bold text-gray-900">Design System</h4>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500">Scroll Animation (Global)</label>
                    <div className="grid grid-cols-3 gap-1">
                        {['none', 'fade', 'slide-up', 'zoom-in', 'reveal', 'slide-left', 'slide-right'].map((anim) => (
                            <button
                                key={anim}
                                onClick={() => setConfig(prev => ({ ...prev, design: { ...prev.design, animation: anim as any } }))}
                                className={`px-2 py-1.5 text-[10px] border rounded capitalize transition-all ${config.design?.animation === anim ? 'bg-purple-50 border-purple-500 text-purple-700 font-medium' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                {anim.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ANIMATION DURATION */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500">Animation Speed</label>
                    <div className="grid grid-cols-3 gap-1">
                        {['fast', 'normal', 'slow'].map((speed) => (
                            <button
                                key={speed}
                                onClick={() => setConfig(prev => ({ ...prev, design: { ...prev.design, animationDuration: speed as any } }))}
                                className={`px-2 py-1.5 text-[10px] border rounded capitalize transition-all ${config.design?.animationDuration === speed ? 'bg-purple-50 border-purple-500 text-purple-700 font-medium' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                {speed}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500">Button Style</label>
                    <div className="grid grid-cols-2 gap-1">
                        {['rounded', 'pill', 'magnetic', 'glow', 'outline', 'soft', 'neumorphic', '3d'].map((style) => (
                            <button
                                key={style}
                                onClick={() => setConfig(prev => ({ ...prev, design: { ...prev.design, buttonStyle: style as any } }))}
                                className={`px-2 py-1.5 text-[10px] border rounded capitalize transition-all ${config.design?.buttonStyle === style ? 'bg-purple-50 border-purple-500 text-purple-700 font-medium' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                {style}
                            </button>
                        ))}
                    </div>
                </div>
            </div>


            {/* Section Backgrounds Palette */}
             <div className="space-y-4 pt-4 border-t border-gray-100">
               <div className="flex items-center justify-between">
                   <h4 className="text-sm font-bold text-gray-900">Section Backgrounds</h4>
                   <button 
                      onClick={randomizeSectionBackgrounds} 
                      className="text-xs flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100"
                      title="Shuffle background colors"
                   >
                       <Shuffle size={12}/> Shuffle
                   </button>
               </div>
               <div className="grid grid-cols-2 gap-3">
                   {['navbar', 'hero', 'features', 'gallery', 'testimonials', 'cta', 'contactForm', 'timeline', 'process', 'team', 'twoColumnInfo', 'steps', 'manifesto', 'valueProposition', 'philosophy', 'footer'].map(section => {
                       // @ts-ignore
                       const currentBg = config[section]?.backgroundColor || '#ffffff';
                       return (
                         <div key={section} className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">{section}</label>
                                <button 
                                    onClick={() => updateConfig(section, 'backgroundColor', undefined)} 
                                    className="text-[10px] text-blue-600 hover:text-blue-800"
                                    title="Reset to default"
                                >
                                    <RefreshCw size={10} />
                                </button>
                            </div>
                            <div className="h-8 w-full rounded border border-gray-200 overflow-hidden relative bg-gray-50">
                               <input 
                                  type="color" 
                                  value={currentBg} 
                                  onChange={(e) => updateConfig(section, 'backgroundColor', e.target.value)}
                                  className="absolute -top-1 -left-1 w-[120%] h-[150%] cursor-pointer p-0 border-0" 
                               />
                            </div>
                         </div>
                       );
                   })}
               </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900">Border Radius</h4>
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                    {(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'] as BorderRadius[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setConfig({ ...config, borderRadius: r })}
                            className={`flex-1 py-1.5 text-[10px] font-medium rounded uppercase transition-all ${config.borderRadius === r ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            {r === 'none' ? <Square size={12} className="mx-auto"/> : r === 'full' ? <Circle size={12} className="mx-auto"/> : r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-4">
               <label className="flex items-center justify-between">
                   <span className="text-sm font-medium text-gray-700">Show Theme Switch</span>
                   <input 
                    type="checkbox" 
                    checked={config.navbar.showThemeToggle} 
                    onChange={(e) => updateConfig('navbar', 'showThemeToggle', e.target.checked)}
                    className="rounded text-blue-600"
                   />
               </label>
            </div>

            {/* FONT SETTINGS */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
               <div className="flex justify-between items-center mb-2">
                   <h4 className="text-sm font-bold text-gray-900">Typography</h4>
                   <label className="flex items-center gap-2 text-xs text-gray-600">
                      <input 
                         type="checkbox" 
                         checked={useSingleFont} 
                         onChange={(e) => {
                             const checked = e.target.checked;
                             setUseSingleFont(checked);
                             if(checked) {
                                 setConfig(prev => ({...prev, fontBody: prev.fontHeading}));
                             }
                         }}
                         className="rounded text-blue-600"
                      />
                      Use single font
                   </label>
               </div>
               
               <div className="space-y-3">
                   <div>
                       <label className="block text-xs font-medium text-gray-500 mb-1">{useSingleFont ? 'Font Family' : 'Heading Font'}</label>
                       <select 
                           value={config.fontHeading} 
                           onChange={(e) => {
                               const val = e.target.value;
                               setConfig(prev => ({
                                   ...prev, 
                                   fontHeading: val,
                                   fontBody: useSingleFont ? val : prev.fontBody
                               }));
                           }}
                           className="w-full border p-2 rounded text-sm bg-white"
                       >
                           {AVAILABLE_FONTS.map(font => (
                               <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                           ))}
                       </select>
                   </div>
                   
                   {!useSingleFont && (
                       <div>
                           <label className="block text-xs font-medium text-gray-500 mb-1">Body Font</label>
                           <select 
                               value={config.fontBody} 
                               onChange={(e) => setConfig({...config, fontBody: e.target.value})}
                               className="w-full border p-2 rounded text-sm bg-white"
                           >
                               {AVAILABLE_FONTS.map(font => (
                                   <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                               ))}
                           </select>
                       </div>
                   )}
               </div>
            </div>

            <div className="block pt-2 border-t border-gray-100 mt-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block pt-2">Global Background Image</label>
              <div className="flex gap-2">
                 <input type="text" className="flex-1 rounded-md border-gray-300 border p-2 text-sm" 
                   value={config.backgroundImage || ''} onChange={(e) => setConfig({...config, backgroundImage: e.target.value})} placeholder="Image URL" />
                 <button onClick={() => handleImageUploadTrigger('global', 'backgroundImage')} className="bg-gray-200 p-2 rounded hover:bg-gray-300">
                    <ImageIcon size={18} />
                 </button>
              </div>
            </div>
             <div className="block pt-2 mt-2">
               <label className="flex items-center space-x-2 pt-2">
                <input type="checkbox" checked={config.enableAnimations} onChange={(e) => setConfig({...config, enableAnimations: e.target.checked})} className="rounded text-blue-600"/>
                <span className="text-sm font-medium text-gray-700">Enable Scroll Animations</span>
              </label>
             </div>
        </div>
      );
    }
    
    // Determine order index
    const orderIndex = config.sectionOrder.indexOf(activeSection);
    
    // Common inputs for features/testimonials/gallery items
    const renderFeaturesInputs = (isBlock: boolean = false) => {
       const items = isBlock ? currentBlock?.items || [] : config.features.items;
       return (
           <div className="space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Section Title</label>
                    <input 
                       className="w-full border p-2 rounded text-sm" 
                       value={isBlock ? currentBlock?.title : config.features.title} 
                       onChange={(e) => isBlock ? updateBlock(currentBlock!.id, 'title', e.target.value) : updateConfig('features', 'title', e.target.value)} 
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                    <textarea 
                       className="w-full border p-2 rounded text-sm" 
                       value={isBlock ? currentBlock?.subtitle : config.features.subtitle} 
                       onChange={(e) => isBlock ? updateBlock(currentBlock!.id, 'subtitle', e.target.value) : updateConfig('features', 'subtitle', e.target.value)} 
                    />
                </div>
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-900">Features List</label>
                    {items.map((item: any, idx: number) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                             <div className="flex justify-between">
                                 <span className="text-xs font-bold text-gray-500">Feature {idx + 1}</span>
                                 <button onClick={() => isBlock ? removeBlockItem(currentBlock!.id, idx) : removeSingletonItem('features', idx)} className="text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                             </div>
                             <div className="flex gap-2">
                                 <input 
                                     className="w-10 text-center border p-1 rounded" 
                                     value={item.icon} 
                                     onChange={(e) => isBlock ? updateBlockItem(currentBlock!.id, idx, 'icon', e.target.value) : updateSingletonItem('features', idx, 'icon', e.target.value)}
                                     placeholder="Icon"
                                 />
                                 <input 
                                     className="flex-1 border p-1 rounded text-sm" 
                                     value={item.title} 
                                     onChange={(e) => isBlock ? updateBlockItem(currentBlock!.id, idx, 'title', e.target.value) : updateSingletonItem('features', idx, 'title', e.target.value)}
                                     placeholder="Title"
                                 />
                             </div>
                             <textarea 
                                 className="w-full border p-1 rounded text-sm" 
                                 value={item.description} 
                                 onChange={(e) => isBlock ? updateBlockItem(currentBlock!.id, idx, 'description', e.target.value) : updateSingletonItem('features', idx, 'description', e.target.value)}
                                 placeholder="Description"
                             />
                        </div>
                    ))}
                    <button onClick={() => isBlock ? addBlockItem(currentBlock!.id) : addSingletonItem('features')} className="text-sm text-blue-600 font-medium flex items-center gap-1"><Plus size={16}/> Add Feature</button>
                </div>
           </div>
       );
    };

    return (
      <div className="flex flex-col h-full">
         <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
            <h3 className="font-bold text-gray-900 capitalize">{activeSection.replace('block-', 'Block ')}</h3>
            
            <div className="flex items-center gap-2">
                {/* SECTION VISIBILITY TOGGLE */}
                {currentSectionData && activeSection !== 'global' && (
                    <button 
                    onClick={() => {
                        if (currentBlock) {
                            updateBlock(currentBlock.id, 'show', !currentBlock.show);
                        } else {
                            updateConfig(activeSection, 'show', !currentSectionData.show);
                        }
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${currentSectionData.show ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-200 text-gray-500'}`}
                    >
                    {currentSectionData.show ? <Eye size={14}/> : <EyeOff size={14}/>}
                    {currentSectionData.show ? 'Visible' : 'Hidden'}
                    </button>
                )}
                
                {/* DELETE SECTION BUTTON */}
                {activeSection !== 'global' && activeSection !== 'navbar' && activeSection !== 'footer' && (
                    <button 
                        onClick={() => {
                            if (window.confirm('Are you sure you want to remove this section?')) {
                                removeSection(activeSection);
                            }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Section"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>
         </div>

         <div className="flex border-b border-gray-200 mb-4 px-4 sticky top-14 bg-white z-10 pt-2">
            <button 
              onClick={() => setActiveTab('content')} 
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'content' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
            >
              Content
            </button>
            <button 
              onClick={() => setActiveTab('style')} 
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'style' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
            >
              Styles & Effects
            </button>
         </div>

         <div className="flex-1 overflow-y-auto px-4 pb-10">
            {activeTab === 'style' ? (
               renderStyleEditor(activeSection, blockIndex !== -1 ? blockIndex : undefined)
            ) : (
               <div className="space-y-4">
                  {/* Position Input */}
                  {orderIndex !== -1 && (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 mb-4 shadow-sm">
                          <span className="text-xs font-bold text-gray-600 uppercase">Position on Page:</span>
                          <input 
                              type="number" 
                              min="1" 
                              max={config.sectionOrder.length}
                              value={orderIndex + 1}
                              onChange={(e) => {
                                 const val = parseInt(e.target.value);
                                 if (!isNaN(val)) handleOrderChange(activeSection, val);
                              }}
                              className="w-16 p-1 border rounded text-center font-bold text-blue-600"
                          />
                          <span className="text-xs text-gray-400">of {config.sectionOrder.length}</span>
                      </div>
                  )}

                  {/* HERO */}
                  {activeSection === 'hero' && (
                     <>
                        <label className="block"><span className="text-xs text-gray-500">Title</span><input className="w-full border p-2 rounded" value={config.hero.title} onChange={(e) => updateConfig('hero', 'title', e.target.value)} /></label>
                        <label className="block"><span className="text-xs text-gray-500">Subtitle</span><textarea className="w-full border p-2 rounded" value={config.hero.subtitle} onChange={(e) => updateConfig('hero', 'subtitle', e.target.value)} /></label>
                        <div className="flex gap-2">
                           <input className="flex-1 border p-2 rounded" value={config.hero.ctaText} onChange={(e) => updateConfig('hero', 'ctaText', e.target.value)} placeholder="CTA Text" />
                           <input className="flex-1 border p-2 rounded" value={config.hero.ctaLink} onChange={(e) => updateConfig('hero', 'ctaLink', e.target.value)} placeholder="CTA Link" />
                        </div>
                        <div className="block mt-2">
                             <label className="text-xs text-gray-500 block mb-1">Hero Image</label>
                             <div className="flex gap-2">
                                <input type="text" className="flex-1 rounded-md border-gray-300 border p-2 text-sm" 
                                value={config.hero.image || ''} onChange={(e) => updateConfig('hero', 'image', e.target.value)} placeholder="Image URL" />
                                <button onClick={() => handleImageUploadTrigger('hero', 'image')} className="bg-gray-200 p-2 rounded hover:bg-gray-300">
                                    <ImageIcon size={18} />
                                </button>
                             </div>
                        </div>
                     </>
                  )}

                  {/* FEATURES */}
                  {(activeSection === 'features' || currentBlock?.type === 'features') && renderFeaturesInputs(!!currentBlock)}

                  {/* PHILOSOPHY */}
                  {(activeSection === 'philosophy' || currentBlock?.type === 'philosophy') && (
                     <div className="space-y-6">
                         <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700">Section Title</label>
                             <input 
                                className="w-full border p-2 rounded text-sm" 
                                value={currentBlock ? currentBlock.title : config.philosophy.title} 
                                onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'title', e.target.value) : updateConfig('philosophy', 'title', e.target.value)} 
                             />
                        </div>
                        <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                             <input 
                                className="w-full border p-2 rounded text-sm" 
                                value={currentBlock ? currentBlock.subtitle : config.philosophy.subtitle} 
                                onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'subtitle', e.target.value) : updateConfig('philosophy', 'subtitle', e.target.value)} 
                             />
                        </div>
                        <div className="space-y-3">
                             <label className="block text-sm font-bold text-gray-900">Principles</label>
                             {(currentBlock ? currentBlock.items || [] : config.philosophy.items).map((item: any, idx: number) => (
                                 <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                                     <div className="flex justify-between items-center">
                                         <span className="text-xs font-bold text-gray-500">Principle {idx + 1}</span>
                                         <button onClick={() => currentBlock ? removeBlockItem(currentBlock.id, idx) : removeSingletonItem('philosophy', idx)} className="text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                                     </div>
                                     <div className="flex gap-2">
                                         <input 
                                             className="w-10 text-center border p-1 rounded" 
                                             value={item.icon || (idx + 1).toString()} 
                                             onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'icon', e.target.value) : updateSingletonItem('philosophy', idx, 'icon', e.target.value)}
                                             placeholder="#"
                                         />
                                         <input 
                                             className="flex-1 border p-1 rounded text-sm" 
                                             value={item.title} 
                                             onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'title', e.target.value) : updateSingletonItem('philosophy', idx, 'title', e.target.value)}
                                             placeholder="Title"
                                         />
                                     </div>
                                     <textarea 
                                         className="w-full border p-1 rounded text-sm" 
                                         value={item.content} 
                                         onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'content', e.target.value) : updateSingletonItem('philosophy', idx, 'content', e.target.value)}
                                         placeholder="Description"
                                     />
                                 </div>
                             ))}
                             <button onClick={() => currentBlock ? addBlockItem(currentBlock.id) : addSingletonItem('philosophy')} className="text-sm text-blue-600 font-medium flex items-center gap-1"><Plus size={16}/> Add Principle</button>
                        </div>
                     </div>
                  )}

                  {/* ... other sections ... */}
                  {/* TIMELINE */}
                  {(activeSection === 'timeline' || currentBlock?.type === 'timeline') && (
                     <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Section Title</label>
                            <input 
                               className="w-full border p-2 rounded text-sm" 
                               value={currentBlock ? currentBlock.title : config.timeline.title} 
                               onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'title', e.target.value) : updateConfig('timeline', 'title', e.target.value)} 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                            <textarea 
                               className="w-full border p-2 rounded text-sm" 
                               value={currentBlock ? currentBlock.subtitle : config.timeline.subtitle} 
                               onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'subtitle', e.target.value) : updateConfig('timeline', 'subtitle', e.target.value)} 
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-gray-900">Events</label>
                            {(currentBlock ? currentBlock.items || [] : config.timeline.items).map((item: any, idx: number) => (
                                <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                                     <div className="flex justify-between items-center">
                                         <span className="text-xs font-bold text-gray-500">Event {idx + 1}</span>
                                         <button onClick={() => currentBlock ? removeBlockItem(currentBlock.id, idx) : removeSingletonItem('timeline', idx)} className="text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                                     </div>
                                     <div className="flex gap-2">
                                         <input 
                                             className="w-16 border p-1 rounded text-sm font-bold text-blue-600" 
                                             value={item.date} 
                                             onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'date', e.target.value) : updateSingletonItem('timeline', idx, 'date', e.target.value)}
                                             placeholder="Date"
                                         />
                                         <input 
                                             className="w-10 text-center border p-1 rounded" 
                                             value={item.icon} 
                                             onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'icon', e.target.value) : updateSingletonItem('timeline', idx, 'icon', e.target.value)}
                                             placeholder="Icon"
                                         />
                                         <input 
                                             className="flex-1 border p-1 rounded text-sm font-medium" 
                                             value={item.title} 
                                             onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'title', e.target.value) : updateSingletonItem('timeline', idx, 'title', e.target.value)}
                                             placeholder="Title"
                                         />
                                     </div>
                                     <textarea 
                                         className="w-full border p-1 rounded text-sm" 
                                         value={item.description} 
                                         onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'description', e.target.value) : updateSingletonItem('timeline', idx, 'description', e.target.value)}
                                         placeholder="Description"
                                     />
                                </div>
                            ))}
                            <button onClick={() => currentBlock ? addBlockItem(currentBlock.id) : addSingletonItem('timeline')} className="text-sm text-blue-600 font-medium flex items-center gap-1"><Plus size={16}/> Add Event</button>
                        </div>
                     </div>
                  )}

                  {/* PROCESS */}
                  {(activeSection === 'process' || currentBlock?.type === 'process') && (
                     <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Section Title</label>
                            <input 
                               className="w-full border p-2 rounded text-sm" 
                               value={currentBlock ? currentBlock.title : config.process.title} 
                               onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'title', e.target.value) : updateConfig('process', 'title', e.target.value)} 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                            <textarea 
                               className="w-full border p-2 rounded text-sm" 
                               value={currentBlock ? currentBlock.subtitle : config.process.subtitle} 
                               onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'subtitle', e.target.value) : updateConfig('process', 'subtitle', e.target.value)} 
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-gray-900">Workflow Steps</label>
                            {(currentBlock ? currentBlock.items || [] : config.process.items).map((item: any, idx: number) => (
                                <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                                     <div className="flex justify-between items-center">
                                         <span className="text-xs font-bold text-gray-500">Step {idx + 1}</span>
                                         <button onClick={() => currentBlock ? removeBlockItem(currentBlock.id, idx) : removeSingletonItem('process', idx)} className="text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                                     </div>
                                     <div className="flex gap-2">
                                         <input 
                                             className="w-10 text-center border p-1 rounded" 
                                             value={item.icon || (idx+1).toString()} 
                                             onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'icon', e.target.value) : updateSingletonItem('process', idx, 'icon', e.target.value)}
                                             placeholder="#"
                                         />
                                         <input 
                                             className="flex-1 border p-1 rounded text-sm font-medium" 
                                             value={item.title} 
                                             onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'title', e.target.value) : updateSingletonItem('process', idx, 'title', e.target.value)}
                                             placeholder="Title"
                                         />
                                     </div>
                                     <textarea 
                                         className="w-full border p-1 rounded text-sm" 
                                         value={item.description} 
                                         onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'description', e.target.value) : updateSingletonItem('process', idx, 'description', e.target.value)}
                                         placeholder="Description"
                                     />
                                </div>
                            ))}
                            <button onClick={() => currentBlock ? addBlockItem(currentBlock.id) : addSingletonItem('process')} className="text-sm text-blue-600 font-medium flex items-center gap-1"><Plus size={16}/> Add Step</button>
                        </div>
                     </div>
                  )}

                  {/* TEAM */}
                  {(activeSection === 'team' || currentBlock?.type === 'team') && (
                     <div className="space-y-6">
                         <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700">Section Title</label>
                             <input 
                                className="w-full border p-2 rounded text-sm" 
                                value={currentBlock ? currentBlock.title : config.team.title} 
                                onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'title', e.target.value) : updateConfig('team', 'title', e.target.value)} 
                             />
                        </div>
                        <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                             <input 
                                className="w-full border p-2 rounded text-sm" 
                                value={currentBlock ? currentBlock.subtitle : config.team.subtitle} 
                                onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'subtitle', e.target.value) : updateConfig('team', 'subtitle', e.target.value)} 
                             />
                        </div>
                        <div className="space-y-3">
                             <label className="block text-sm font-bold text-gray-900">Members</label>
                             {(currentBlock ? currentBlock.items || [] : config.team.items).map((item: any, idx: number) => (
                                 <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                                     <div className="flex justify-between items-start">
                                         <div className="flex gap-2 items-center">
                                              <img src={item.avatar} className="w-8 h-8 rounded-full bg-gray-200 object-cover" alt="avatar"/>
                                              <div className="flex flex-col">
                                                 <input 
                                                    className="border-b border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent text-sm font-bold w-full" 
                                                    value={item.name}
                                                    onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'name', e.target.value) : updateSingletonItem('team', idx, 'name', e.target.value)}
                                                    placeholder="Name"
                                                 />
                                                 <input 
                                                    className="border-b border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent text-xs text-gray-500 w-full" 
                                                    value={item.role}
                                                    onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'role', e.target.value) : updateSingletonItem('team', idx, 'role', e.target.value)}
                                                    placeholder="Role"
                                                 />
                                              </div>
                                         </div>
                                         <button onClick={() => currentBlock ? removeBlockItem(currentBlock.id, idx) : removeSingletonItem('team', idx)} className="text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                                     </div>
                                     <textarea 
                                         className="w-full border p-2 rounded text-sm h-16"
                                         value={item.bio}
                                         onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'bio', e.target.value) : updateSingletonItem('team', idx, 'bio', e.target.value)}
                                         placeholder="Bio"
                                     />
                                     <div className="flex gap-2 items-center">
                                         <input 
                                            className="flex-1 border p-1 rounded text-xs text-gray-500"
                                            value={item.avatar}
                                            onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'avatar', e.target.value) : updateSingletonItem('team', idx, 'avatar', e.target.value)}
                                            placeholder="Avatar URL"
                                         />
                                         <button onClick={() => handleImageUploadTrigger(currentBlock ? `block-${currentBlock.id}` : 'team', 'avatar', idx)} className="bg-gray-200 p-1 rounded"><ImageIcon size={14}/></button>
                                     </div>
                                 </div>
                             ))}
                             <button onClick={() => currentBlock ? addBlockItem(currentBlock.id) : addSingletonItem('team')} className="text-sm text-blue-600 font-medium flex items-center gap-1"><Plus size={16}/> Add Member</button>
                        </div>
                     </div>
                  )}

                  {/* STEPS */}
                  {(activeSection === 'steps' || currentBlock?.type === 'steps') && (
                     <div className="space-y-6">
                         <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700">Section Title</label>
                             <input 
                                className="w-full border p-2 rounded text-sm" 
                                value={currentBlock ? currentBlock.title : config.steps.title} 
                                onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'title', e.target.value) : updateConfig('steps', 'title', e.target.value)} 
                             />
                        </div>
                        <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                             <input 
                                className="w-full border p-2 rounded text-sm" 
                                value={currentBlock ? currentBlock.subtitle : config.steps.subtitle} 
                                onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'subtitle', e.target.value) : updateConfig('steps', 'subtitle', e.target.value)} 
                             />
                        </div>
                        <div className="space-y-3">
                             <label className="block text-sm font-bold text-gray-900">Steps</label>
                             {(currentBlock ? currentBlock.items || [] : config.steps.items).map((item: any, idx: number) => (
                                 <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                                     <div className="flex justify-between items-center">
                                         <span className="text-xs font-bold text-gray-500">Step {idx + 1}</span>
                                         <button onClick={() => currentBlock ? removeBlockItem(currentBlock.id, idx) : removeSingletonItem('steps', idx)} className="text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                                     </div>
                                     <input 
                                         className="w-full border p-2 rounded text-sm" 
                                         value={item.title} 
                                         onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'title', e.target.value) : updateSingletonItem('steps', idx, 'title', e.target.value)}
                                         placeholder="Title"
                                     />
                                     <textarea 
                                         className="w-full border p-2 rounded text-sm h-16"
                                         value={item.description} 
                                         onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'description', e.target.value) : updateSingletonItem('steps', idx, 'description', e.target.value)}
                                         placeholder="Description"
                                     />
                                 </div>
                             ))}
                             <button onClick={() => currentBlock ? addBlockItem(currentBlock.id) : addSingletonItem('steps')} className="text-sm text-blue-600 font-medium flex items-center gap-1"><Plus size={16}/> Add Step</button>
                        </div>
                     </div>
                  )}

                  {/* MANIFESTO */}
                  {(activeSection === 'manifesto' || currentBlock?.type === 'manifesto') && (
                     <div className="space-y-6">
                         <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700">Optional Title</label>
                             <input 
                                className="w-full border p-2 rounded text-sm" 
                                value={currentBlock ? currentBlock.title : config.manifesto.title} 
                                onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'title', e.target.value) : updateConfig('manifesto', 'title', e.target.value)} 
                             />
                        </div>
                        <div className="space-y-3">
                             <label className="block text-sm font-bold text-gray-900">Statements</label>
                             {(currentBlock ? currentBlock.items || [] : config.manifesto.items).map((item: any, idx: number) => (
                                 <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                                     <div className="flex justify-between items-center">
                                         <span className="text-xs font-bold text-gray-500">Line {idx + 1}</span>
                                         <button onClick={() => currentBlock ? removeBlockItem(currentBlock.id, idx) : removeSingletonItem('manifesto', idx)} className="text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                                     </div>
                                     <textarea 
                                         className="w-full border p-2 rounded text-sm h-16" 
                                         value={item.text} 
                                         onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'text', e.target.value) : updateSingletonItem('manifesto', idx, 'text', e.target.value)}
                                         placeholder="Statement text"
                                     />
                                     <label className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                                        <input 
                                            type="checkbox" 
                                            checked={item.highlight || false} 
                                            onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'highlight', e.target.checked) : updateSingletonItem('manifesto', idx, 'highlight', e.target.checked)}
                                            className="rounded text-blue-600" 
                                        />
                                        Highlight Text
                                     </label>
                                 </div>
                             ))}
                             <button onClick={() => currentBlock ? addBlockItem(currentBlock.id) : addSingletonItem('manifesto')} className="text-sm text-blue-600 font-medium flex items-center gap-1"><Plus size={16}/> Add Line</button>
                        </div>
                     </div>
                  )}

                  {/* VALUE PROPOSITION */}
                  {(activeSection === 'valueProposition' || currentBlock?.type === 'value-proposition') && (
                     <div className="space-y-6">
                         <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700">Section Title</label>
                             <input 
                                className="w-full border p-2 rounded text-sm" 
                                value={currentBlock ? currentBlock.title : config.valueProposition.title} 
                                onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'title', e.target.value) : updateConfig('valueProposition', 'title', e.target.value)} 
                             />
                        </div>
                        <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700">Description</label>
                             <textarea 
                                className="w-full border p-2 rounded text-sm h-20" 
                                value={currentBlock ? currentBlock.description : config.valueProposition.description} 
                                onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'description', e.target.value) : updateConfig('valueProposition', 'description', e.target.value)} 
                             />
                        </div>
                        <div className="space-y-3">
                             <label className="block text-sm font-bold text-gray-900">Value Points</label>
                             {(currentBlock ? currentBlock.items || [] : config.valueProposition.items).map((item: any, idx: number) => (
                                 <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                                     <div className="flex justify-between items-center">
                                         <span className="text-xs font-bold text-gray-500">Point {idx + 1}</span>
                                         <button onClick={() => currentBlock ? removeBlockItem(currentBlock.id, idx) : removeSingletonItem('valueProposition', idx)} className="text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                                     </div>
                                     <div className="flex gap-2">
                                         <input 
                                             className="w-12 border p-1 rounded text-sm text-center" 
                                             value={item.icon || '✓'} 
                                             onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'icon', e.target.value) : updateSingletonItem('valueProposition', idx, 'icon', e.target.value)}
                                             placeholder="Icon"
                                         />
                                         <input 
                                             className="flex-1 border p-1 rounded text-sm" 
                                             value={item.text} 
                                             onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'text', e.target.value) : updateSingletonItem('valueProposition', idx, 'text', e.target.value)}
                                             placeholder="Benefit text"
                                         />
                                     </div>
                                 </div>
                             ))}
                             <button onClick={() => currentBlock ? addBlockItem(currentBlock.id) : addSingletonItem('valueProposition')} className="text-sm text-blue-600 font-medium flex items-center gap-1"><Plus size={16}/> Add Point</button>
                        </div>
                     </div>
                  )}

                  {/* TWO COLUMN INFO */}
                  {(activeSection === 'twoColumnInfo' || currentBlock?.type === 'two-column-info') && (
                     <div className="space-y-6">
                        <label className="block"><span className="text-xs text-gray-500">Title</span><input className="w-full border p-2 rounded" value={currentBlock ? currentBlock.title : config.twoColumnInfo.title} onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'title', e.target.value) : updateConfig('twoColumnInfo', 'title', e.target.value)} /></label>
                        <label className="block"><span className="text-xs text-gray-500">Subtitle</span><input className="w-full border p-2 rounded" value={currentBlock ? currentBlock.subtitle : config.twoColumnInfo.subtitle} onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'subtitle', e.target.value) : updateConfig('twoColumnInfo', 'subtitle', e.target.value)} /></label>
                        <label className="block"><span className="text-xs text-gray-500">Content</span><textarea className="w-full border p-2 rounded h-32" value={currentBlock ? currentBlock.description : config.twoColumnInfo.description} onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'description', e.target.value) : updateConfig('twoColumnInfo', 'description', e.target.value)} /></label>
                        
                        <div className="flex gap-2">
                           <input className="flex-1 border p-2 rounded" value={currentBlock ? currentBlock.buttonText : config.twoColumnInfo.buttonText} onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'buttonText', e.target.value) : updateConfig('twoColumnInfo', 'buttonText', e.target.value)} placeholder="Button Text" />
                           <input className="flex-1 border p-2 rounded" value={currentBlock ? (currentBlock.buttonLink || '') : config.twoColumnInfo.buttonLink} onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'buttonLink', e.target.value) : updateConfig('twoColumnInfo', 'buttonLink', e.target.value)} placeholder="Button Link" />
                        </div>
                        
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input 
                                type="checkbox" 
                                checked={currentBlock ? (currentBlock.showButton !== false) : (config.twoColumnInfo.showButton !== false)} 
                                onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'showButton', e.target.checked) : updateConfig('twoColumnInfo', 'showButton', e.target.checked)}
                                className="rounded text-blue-600" 
                            />
                            Show Button
                        </label>

                        <div className="block mt-2">
                             <label className="text-xs text-gray-500 block mb-1">Image</label>
                             <div className="flex gap-2 mb-2">
                                <input type="text" className="flex-1 rounded-md border-gray-300 border p-2 text-sm" 
                                value={currentBlock ? currentBlock.image : config.twoColumnInfo.image || ''} onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'image', e.target.value) : updateConfig('twoColumnInfo', 'image', e.target.value)} placeholder="Image URL" />
                                <button onClick={() => handleImageUploadTrigger(currentBlock ? `block-${currentBlock.id}` : 'twoColumnInfo', 'image')} className="bg-gray-200 p-2 rounded hover:bg-gray-300">
                                    <ImageIcon size={18} />
                                </button>
                             </div>
                             <label className="text-xs text-gray-500 block mb-1">Image Position</label>
                             <div className="flex gap-1 bg-gray-100 p-1 rounded">
                                 {['left', 'right'].map(pos => (
                                     <button 
                                        key={pos}
                                        onClick={() => currentBlock ? updateBlock(currentBlock.id, 'imagePosition', pos) : updateConfig('twoColumnInfo', 'imagePosition', pos)}
                                        className={`flex-1 text-xs py-1 rounded capitalize ${ (currentBlock ? currentBlock.imagePosition : config.twoColumnInfo.imagePosition) === pos ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                                     >
                                        {pos}
                                     </button>
                                 ))}
                             </div>
                        </div>
                     </div>
                  )}

                  {/* NAVBAR */}
                  {activeSection === 'navbar' && (
                     <>
                        <div className="space-y-4 mb-4">
                            <label className="block"><span className="text-xs text-gray-500">Logo Text</span><input className="w-full border p-2 rounded" value={config.navbar.logoText} onChange={(e) => updateConfig('navbar', 'logoText', e.target.value)} /></label>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Logo Font</label>
                                    <select 
                                        value={config.navbar.logoFont || config.fontHeading} 
                                        onChange={(e) => updateConfig('navbar', 'logoFont', e.target.value)}
                                        className="w-full border p-2 rounded text-sm bg-white"
                                    >
                                        <option value="">Default (Heading)</option>
                                        {AVAILABLE_FONTS.map(font => (
                                            <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Logo Color</label>
                                    <div className="flex gap-2 items-center">
                                         <input type="color" className="h-9 w-full p-0 border rounded" value={config.navbar.logoColor || config.primaryColor} onChange={(e) => updateConfig('navbar', 'logoColor', e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="block pt-2 border-t border-gray-100">
                                <label className="text-xs text-gray-500 block mb-1">Logo Image</label>
                                <div className="flex gap-2">
                                    <input type="text" className="flex-1 rounded-md border-gray-300 border p-2 text-sm" 
                                    value={config.navbar.logoImage || ''} onChange={(e) => updateConfig('navbar', 'logoImage', e.target.value)} placeholder="Image URL" />
                                    <button onClick={() => handleImageUploadTrigger('navbar', 'logoImage')} className="bg-gray-200 p-2 rounded hover:bg-gray-300">
                                        <ImageIcon size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                             <h4 className="font-bold text-sm text-gray-900 mb-2">Navigation Links</h4>
                             <div className="space-y-2 mb-3">
                                 {config.navbar.links.map((link, i) => (
                                     <div key={i} className="flex gap-2 items-center bg-gray-50 p-2 rounded border border-gray-200">
                                         <LinkIcon size={14} className="text-gray-400"/>
                                         <div className="flex-1 grid grid-cols-2 gap-2">
                                             <input 
                                                value={link.label} 
                                                onChange={(e) => updateNavbarLink(i, 'label', e.target.value)} 
                                                className="border p-1.5 rounded text-sm w-full" 
                                                placeholder="Label" 
                                             />
                                             <input 
                                                value={link.href} 
                                                onChange={(e) => updateNavbarLink(i, 'href', e.target.value)} 
                                                className="border p-1.5 rounded text-sm w-full" 
                                                placeholder="URL (#id)" 
                                             />
                                         </div>
                                         <button onClick={() => removeNavbarLink(i)} className="text-gray-400 hover:text-red-500 p-1">
                                             <Trash2 size={16} />
                                         </button>
                                     </div>
                                 ))}
                             </div>
                             <button onClick={addNavbarLink} className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                                 <Plus size={16} /> Add Link
                             </button>
                        </div>
                     </>
                  )}
                  
                  {/* FOOTER */}
                  {activeSection === 'footer' && (
                     <>
                        <label className="block"><span className="text-xs text-gray-500">Company Name</span><input className="w-full border p-2 rounded" value={config.footer.companyName} onChange={(e) => updateConfig('footer', 'companyName', e.target.value)} /></label>
                        <label className="block"><span className="text-xs text-gray-500">Copyright</span><input className="w-full border p-2 rounded" value={config.footer.copyright} onChange={(e) => updateConfig('footer', 'copyright', e.target.value)} /></label>
                     </>
                  )}

                  {/* GALLERY */}
                  {(activeSection === 'gallery' || currentBlock?.type === 'gallery') && (
                     <div className="space-y-6">
                        <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700">Section Title</label>
                             <input 
                                className="w-full border p-2 rounded text-sm" 
                                value={currentBlock ? currentBlock.title : config.gallery.title} 
                                onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'title', e.target.value) : updateConfig('gallery', 'title', e.target.value)} 
                             />
                        </div>
                        <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                             <input 
                                className="w-full border p-2 rounded text-sm" 
                                value={currentBlock ? currentBlock.subtitle : config.gallery.subtitle} 
                                onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'subtitle', e.target.value) : updateConfig('gallery', 'subtitle', e.target.value)} 
                             />
                        </div>
                        
                        {/* GALLERY SETTINGS */}
                        <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Layout</label>
                                <select 
                                    className="w-full border p-1 rounded text-sm bg-white"
                                    value={currentBlock ? (currentBlock.layout || 'slider') : (config.gallery.layout || 'slider')}
                                    onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'layout', e.target.value) : updateConfig('gallery', 'layout', e.target.value)}
                                >
                                    <option value="slider">Slider</option>
                                    <option value="carousel">Carousel</option>
                                    <option value="grid">Grid</option>
                                    <option value="masonry">Masonry</option>
                                    <option value="reel">Reel</option>
                                    <option value="collage">Collage</option>
                                    <option value="polaroid">Polaroid</option>
                                    <option value="spotlight">Spotlight</option>
                                    <option value="stack">Stack</option>
                                    <option value="filmstrip">Filmstrip</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Transition</label>
                                <select 
                                    className="w-full border p-1 rounded text-sm bg-white"
                                    value={currentBlock ? (currentBlock.transition || 'slide') : (config.gallery.transition || 'slide')}
                                    onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'transition', e.target.value) : updateConfig('gallery', 'transition', e.target.value)}
                                >
                                    <option value="slide">Slide</option>
                                    <option value="fade">Fade</option>
                                    <option value="zoom">Zoom</option>
                                    <option value="blur">Blur</option>
                                    <option value="flip">Flip</option>
                                    <option value="bounce">Bounce</option>
                                    <option value="ken-burns">Ken Burns</option>
                                    <option value="grayscale">Grayscale</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded border border-gray-200 mt-2">
                            <label className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                <input 
                                    type="checkbox" 
                                    checked={currentBlock ? (currentBlock.enableLightbox !== false) : (config.gallery.enableLightbox !== false)} 
                                    onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'enableLightbox', e.target.checked) : updateConfig('gallery', 'enableLightbox', e.target.checked)}
                                    className="rounded text-blue-600" 
                                />
                                Enable Lightbox (Expand Images)
                            </label>
                        </div>

                        <div className="space-y-3">
                             <label className="block text-sm font-bold text-gray-900">Images</label>
                             {(currentBlock ? currentBlock.items || [] : config.gallery.items).map((item: any, idx: number) => (
                                 <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                                     <div className="flex justify-between items-center">
                                         <div className="w-16 h-10 bg-gray-200 rounded overflow-hidden">
                                             <img src={item.url} className="w-full h-full object-cover" alt="thumb"/>
                                         </div>
                                         <button onClick={() => currentBlock ? removeBlockItem(currentBlock.id, idx) : removeGalleryItem(idx)} className="text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                                     </div>
                                     <div className="flex gap-2">
                                          <input 
                                              className="flex-1 border p-1 rounded text-sm"
                                              value={item.url}
                                              onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'url', e.target.value) : updateGalleryItem(idx, 'url', e.target.value)}
                                              placeholder="Image URL"
                                          />
                                          <button onClick={() => handleImageUploadTrigger(currentBlock ? `block-${currentBlock.id}` : 'gallery', 'gallery', idx)} className="bg-gray-200 p-1 rounded"><ImageIcon size={14}/></button>
                                     </div>
                                     <div className="flex gap-2">
                                        <input 
                                           className="flex-1 border p-1 rounded text-sm"
                                           value={item.title || ''}
                                           onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'title', e.target.value) : updateGalleryItem(idx, 'title', e.target.value)}
                                           placeholder="Caption Title"
                                        />
                                        <input 
                                           className="flex-1 border p-1 rounded text-sm"
                                           value={item.subtitle || ''}
                                           onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'subtitle', e.target.value) : updateGalleryItem(idx, 'subtitle', e.target.value)}
                                           placeholder="Caption Subtitle"
                                        />
                                     </div>
                                     <div className="flex gap-2 items-center">
                                        <input 
                                           className="flex-1 border p-1 rounded text-sm"
                                           value={item.link || ''}
                                           onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'link', e.target.value) : updateGalleryItem(idx, 'link', e.target.value)}
                                           placeholder="Link URL"
                                        />
                                        <label className="flex items-center gap-1 text-xs whitespace-nowrap text-gray-600 bg-white p-1.5 rounded border">
                                            <input 
                                                type="checkbox" 
                                                checked={item.showPlayButton || false} 
                                                onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'showPlayButton', e.target.checked) : updateGalleryItem(idx, 'showPlayButton', e.target.checked)}
                                                className="rounded text-blue-600" 
                                            /> 
                                            Play Btn
                                        </label>
                                     </div>
                                 </div>
                             ))}
                             <button onClick={() => currentBlock ? addBlockItem(currentBlock.id) : addGalleryItem()} className="text-sm text-blue-600 font-medium flex items-center gap-1"><Plus size={16}/> Add Image</button>
                        </div>
                     </div>
                  )}

                  {/* TESTIMONIALS */}
                  {(activeSection === 'testimonials' || currentBlock?.type === 'testimonials') && (
                     <div className="space-y-6">
                         <div className="space-y-2">
                             <label className="block text-sm font-medium text-gray-700">Section Title</label>
                             <input 
                                className="w-full border p-2 rounded text-sm" 
                                value={currentBlock ? currentBlock.title : config.testimonials.title} 
                                onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'title', e.target.value) : updateConfig('testimonials', 'title', e.target.value)} 
                             />
                        </div>
                        <div className="space-y-3">
                             <label className="block text-sm font-bold text-gray-900">Testimonials</label>
                             {(currentBlock ? currentBlock.items || [] : config.testimonials.items).map((item: any, idx: number) => (
                                 <div key={idx} className="p-3 bg-gray-50 rounded border border-gray-200 space-y-2">
                                     <div className="flex justify-between items-start">
                                         <div className="flex gap-2 items-center">
                                              <img src={item.avatar} className="w-8 h-8 rounded-full bg-gray-200 object-cover" alt="avatar"/>
                                              <div className="flex flex-col">
                                                 <input 
                                                    className="border-b border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent text-sm font-bold w-full" 
                                                    value={item.name}
                                                    onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'name', e.target.value) : updateSingletonItem('testimonials', idx, 'name', e.target.value)}
                                                    placeholder="Name"
                                                 />
                                                 <input 
                                                    className="border-b border-transparent hover:border-gray-300 focus:border-blue-500 bg-transparent text-xs text-gray-500 w-full" 
                                                    value={item.role}
                                                    onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'role', e.target.value) : updateSingletonItem('testimonials', idx, 'role', e.target.value)}
                                                    placeholder="Role"
                                                 />
                                              </div>
                                         </div>
                                         <button onClick={() => currentBlock ? removeBlockItem(currentBlock.id, idx) : removeSingletonItem('testimonials', idx)} className="text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                                     </div>
                                     <textarea 
                                         className="w-full border p-2 rounded text-sm h-20"
                                         value={item.content}
                                         onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'content', e.target.value) : updateSingletonItem('testimonials', idx, 'content', e.target.value)}
                                         placeholder="Quote"
                                     />
                                     <div className="flex gap-2 items-center">
                                         <input 
                                            className="flex-1 border p-1 rounded text-xs text-gray-500"
                                            value={item.avatar}
                                            onChange={(e) => currentBlock ? updateBlockItem(currentBlock.id, idx, 'avatar', e.target.value) : updateSingletonItem('testimonials', idx, 'avatar', e.target.value)}
                                            placeholder="Avatar URL"
                                         />
                                         <button onClick={() => handleImageUploadTrigger(currentBlock ? `block-${currentBlock.id}` : 'testimonials', 'avatar', idx)} className="bg-gray-200 p-1 rounded"><ImageIcon size={14}/></button>
                                     </div>
                                 </div>
                             ))}
                             <button onClick={() => currentBlock ? addBlockItem(currentBlock.id) : addSingletonItem('testimonials')} className="text-sm text-blue-600 font-medium flex items-center gap-1"><Plus size={16}/> Add Testimonial</button>
                        </div>
                     </div>
                  )}

                  {/* CONTACT FORM */}
                  {activeSection === 'contactForm' && (
                     <div className="space-y-4">
                        <label className="block"><span className="text-xs text-gray-500">Title</span><input className="w-full border p-2 rounded" value={config.contactForm.title} onChange={(e) => updateConfig('contactForm', 'title', e.target.value)} /></label>
                        <label className="block"><span className="text-xs text-gray-500">Subtitle</span><textarea className="w-full border p-2 rounded" value={config.contactForm.subtitle} onChange={(e) => updateConfig('contactForm', 'subtitle', e.target.value)} /></label>
                        <label className="block"><span className="text-xs text-gray-500">Button Text</span><input className="w-full border p-2 rounded" value={config.contactForm.buttonText} onChange={(e) => updateConfig('contactForm', 'buttonText', e.target.value)} /></label>
                        <div className="grid grid-cols-2 gap-2">
                             <label className="block"><span className="text-xs text-gray-500">Name Placeholder</span><input className="w-full border p-2 rounded" value={config.contactForm.namePlaceholder} onChange={(e) => updateConfig('contactForm', 'namePlaceholder', e.target.value)} /></label>
                             <label className="block"><span className="text-xs text-gray-500">Email Placeholder</span><input className="w-full border p-2 rounded" value={config.contactForm.emailPlaceholder} onChange={(e) => updateConfig('contactForm', 'emailPlaceholder', e.target.value)} /></label>
                        </div>
                        <label className="block"><span className="text-xs text-gray-500">Success Message</span><input className="w-full border p-2 rounded" value={config.contactForm.successMessage} onChange={(e) => updateConfig('contactForm', 'successMessage', e.target.value)} /></label>
                     </div>
                  )}

                  {/* CTA */}
                  {(activeSection === 'cta' || currentBlock?.type === 'cta') && (
                     <div className="space-y-4">
                        <label className="block"><span className="text-xs text-gray-500">Title</span><input className="w-full border p-2 rounded" value={currentBlock ? currentBlock.title : config.cta.title} onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'title', e.target.value) : updateConfig('cta', 'title', e.target.value)} /></label>
                        <label className="block"><span className="text-xs text-gray-500">Description</span><textarea className="w-full border p-2 rounded" value={currentBlock ? currentBlock.description : config.cta.description} onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'description', e.target.value) : updateConfig('cta', 'description', e.target.value)} /></label>
                        <label className="block"><span className="text-xs text-gray-500">Button Text</span><input className="w-full border p-2 rounded" value={currentBlock ? currentBlock.buttonText : config.cta.buttonText} onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'buttonText', e.target.value) : updateConfig('cta', 'buttonText', e.target.value)} /></label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                             <div>
                                <label className="text-xs text-gray-500">Button Color</label>
                                <div className="flex gap-1 items-center">
                                    <input type="color" className="h-6 w-6 border-0 p-0" value={currentBlock ? (currentBlock.buttonColor || config.primaryColor) : (config.cta.buttonColor || config.primaryColor)} onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'buttonColor', e.target.value) : updateConfig('cta', 'buttonColor', e.target.value)} />
                                    <span className="text-xs text-gray-400">Override</span>
                                </div>
                             </div>
                             <div>
                                <label className="text-xs text-gray-500">Text Color</label>
                                <div className="flex gap-1 items-center">
                                    <input type="color" className="h-6 w-6 border-0 p-0" value={currentBlock ? (currentBlock.buttonTextColor || '#ffffff') : (config.cta.buttonTextColor || '#ffffff')} onChange={(e) => currentBlock ? updateBlock(currentBlock.id, 'buttonTextColor', e.target.value) : updateConfig('cta', 'buttonTextColor', e.target.value)} />
                                    <span className="text-xs text-gray-400">Override</span>
                                </div>
                             </div>
                        </div>
                     </div>
                  )}

                  {/* STANDARD CONTENT BLOCK */}
                  {currentBlock && currentBlock.type === 'content' && (
                     <div className="space-y-4">
                        <label className="block"><span className="text-xs text-gray-500">Title</span><input className="w-full border p-2 rounded" value={currentBlock.title} onChange={(e) => updateBlock(currentBlock!.id, 'title', e.target.value)} /></label>
                        <label className="block"><span className="text-xs text-gray-500">Content</span><textarea className="w-full border p-2 rounded h-32" value={currentBlock.content} onChange={(e) => updateBlock(currentBlock!.id, 'content', e.target.value)} /></label>
                        
                        <div className="block mt-2">
                             <label className="text-xs text-gray-500 block mb-1">Image</label>
                             <div className="flex gap-2 mb-2">
                                <input type="text" className="flex-1 rounded-md border-gray-300 border p-2 text-sm" 
                                value={currentBlock.image || ''} onChange={(e) => updateBlock(currentBlock!.id, 'image', e.target.value)} placeholder="Image URL" />
                                <button onClick={() => handleImageUploadTrigger(`block-${currentBlock!.id}`, 'image')} className="bg-gray-200 p-2 rounded hover:bg-gray-300">
                                    <ImageIcon size={18} />
                                </button>
                             </div>
                             <label className="text-xs text-gray-500 block mb-1">Image Position</label>
                             <div className="flex gap-1 bg-gray-100 p-1 rounded">
                                 {['left', 'right', 'bottom'].map(pos => (
                                     <button 
                                        key={pos}
                                        onClick={() => updateBlock(currentBlock!.id, 'imagePosition', pos)}
                                        className={`flex-1 text-xs py-1 rounded capitalize ${currentBlock!.imagePosition === pos ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                                     >
                                        {pos}
                                     </button>
                                 ))}
                             </div>
                        </div>
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col font-sans text-gray-900 overflow-hidden">
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 z-20 sticky top-0 shadow-sm flex-shrink-0">
         <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-blue-600">
                 <LayoutTemplate size={24} />
                 <span className="font-bold text-lg hidden md:inline">LandingGen AI</span>
             </div>
             
             <div className="flex items-center gap-2">
                 <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 ml-4">
                     <button onClick={() => setViewMode('editor')} className={`p-1.5 rounded ${viewMode === 'editor' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'}`} title="Editor Only"><Code size={18}/></button>
                     <button onClick={() => setViewMode('split')} className={`p-1.5 rounded ${viewMode === 'split' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'}`} title="Split View"><AlignJustify size={18} className="rotate-90"/></button>
                     <button onClick={() => setViewMode('preview')} className={`p-1.5 rounded ${viewMode === 'preview' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'}`} title="Preview Only"><Eye size={18}/></button>
                 </div>
                 <button 
                    onClick={handleReloadPreview} 
                    className="p-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-white hover:shadow-sm transition-all"
                    title="Reload Preview (Replay Animations)"
                 >
                    <RefreshCw size={18} />
                 </button>
             </div>
         </div>

         <div className="flex items-center gap-3">
             <div className="relative group">
                 <div className="flex items-center bg-gray-100 rounded-lg p-1 pr-2 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all w-64 md:w-96">
                     <div className="p-2 text-blue-600"><Sparkles size={18} /></div>
                     <input 
                       value={aiPrompt}
                       onChange={(e) => setAiPrompt(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                       placeholder={isGenerating ? "Generating..." : "Describe your landing page..."}
                       className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400"
                       disabled={isGenerating}
                     />
                     {isGenerating && <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full ml-2"></div>}
                 </div>
             </div>
             
             <button onClick={() => setShowExportModal(true)} className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                 <Download size={16} />
                 <span className="hidden sm:inline">Export</span>
             </button>
         </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
          {(viewMode === 'editor' || viewMode === 'split') && (
             <aside className={`${viewMode === 'editor' ? 'w-full max-w-3xl mx-auto' : 'w-[450px]'} bg-white border-r border-gray-200 flex z-10 shadow-xl transition-all duration-300`}>
                {/* Vertical Sidebar Navigation */}
                <div className="w-14 md:w-16 flex flex-col items-center py-4 border-r border-gray-200 gap-4 overflow-y-auto hide-scrollbar bg-gray-50 flex-shrink-0">
                    <button 
                        onClick={() => handleSectionSelect('global')} 
                        className={`p-3 rounded-xl transition-all ${activeSection === 'global' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`}
                        title="Global Settings"
                    >
                        <Settings size={20}/>
                    </button>
                    
                    <div className="w-8 h-px bg-gray-200 my-1"></div>
                    
                    <button 
                         onClick={() => handleSectionSelect('navbar')} 
                         className={`p-3 rounded-xl transition-all ${activeSection === 'navbar' ? 'bg-white text-blue-600 shadow border border-blue-100' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`}
                         title="Navbar"
                    >
                        <LayoutTemplate size={20}/>
                    </button>
                    
                    {config.hero.show && (
                      <button 
                        onClick={() => handleSectionSelect('hero')}
                        className={`p-3 rounded-xl transition-all ${activeSection === 'hero' ? 'bg-white text-blue-600 shadow border border-blue-100' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`}
                        title="Hero Section"
                      >
                         <LayoutTemplate size={20} />
                      </button>
                    )}

                    {config.sectionOrder.map((sectionId) => {
                         if (sectionId === 'hero') return null;
                         const type = sectionId.startsWith('block-') ? config.contentBlocks.find(b => b.id === sectionId.replace('block-',''))?.type : sectionId;
                         const Icon = getSectionIcon(sectionId, type);
                         
                         return (
                            <div key={sectionId} className="relative group flex justify-center w-full">
                                <button 
                                  onClick={() => handleSectionSelect(sectionId)} 
                                  className={`p-3 rounded-xl transition-all ${activeSection === sectionId ? 'bg-white text-blue-600 shadow border border-blue-100' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`}
                                >
                                    <Icon size={20}/>
                                </button>
                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:flex flex-col gap-1 z-50 bg-white p-1 rounded-lg shadow-xl border border-gray-100 w-8">
                                     <button onClick={(e) => { e.stopPropagation(); moveSection(config.sectionOrder.indexOf(sectionId), -1); }} className="p-1 hover:bg-gray-100 rounded text-gray-500 flex justify-center" title="Move Up"><ArrowUp size={14}/></button>
                                     <button onClick={(e) => { e.stopPropagation(); moveSection(config.sectionOrder.indexOf(sectionId), 1); }} className="p-1 hover:bg-gray-100 rounded text-gray-500 flex justify-center" title="Move Down"><ArrowDown size={14}/></button>
                                     <button onClick={(e) => { e.stopPropagation(); removeSection(sectionId); }} className="p-1 hover:bg-red-50 text-red-500 flex justify-center" title="Remove"><X size={14}/></button>
                                </div>
                            </div>
                         );
                    })}
                    
                    <button 
                      onClick={() => handleSectionSelect('footer')}
                      className={`p-3 rounded-xl transition-all ${activeSection === 'footer' ? 'bg-white text-blue-600 shadow border border-blue-100' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`}
                      title="Footer"
                    >
                       <Menu size={20} />
                    </button>

                    <div className="mt-auto pt-4 relative">
                        <button onClick={() => setShowAddMenu(!showAddMenu)} className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col relative">
                    {showAddMenu && (
                         <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 z-50 animate-in fade-in slide-in-from-bottom-5">
                             <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold text-gray-500 uppercase">Add Section</span>
                                <button onClick={() => setShowAddMenu(false)} className="text-gray-400 hover:text-gray-600"><X size={16}/></button>
                             </div>
                             <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => addNewBlock('content')} className="text-left px-3 py-2 hover:bg-gray-50 rounded border border-gray-100 text-sm flex items-center gap-2"><AlignJustify size={16} className="text-gray-400"/> Content</button>
                                <button onClick={() => addNewBlock('features')} className="text-left px-3 py-2 hover:bg-gray-50 rounded border border-gray-100 text-sm flex items-center gap-2"><Sparkles size={16} className="text-yellow-500"/> Features</button>
                                <button onClick={() => addNewBlock('gallery')} className="text-left px-3 py-2 hover:bg-gray-50 rounded border border-gray-100 text-sm flex items-center gap-2"><Images size={16} className="text-blue-500"/> Gallery</button>
                                <button onClick={() => addNewBlock('testimonials')} className="text-left px-3 py-2 hover:bg-gray-50 rounded border border-gray-100 text-sm flex items-center gap-2"><MessageSquare size={16} className="text-green-500"/> Reviews</button>
                                <button onClick={() => addNewBlock('timeline')} className="text-left px-3 py-2 hover:bg-gray-50 rounded border border-gray-100 text-sm flex items-center gap-2"><Clock size={16} className="text-purple-500"/> Timeline</button>
                                <button onClick={() => addNewBlock('process')} className="text-left px-3 py-2 hover:bg-gray-50 rounded border border-gray-100 text-sm flex items-center gap-2"><Workflow size={16} className="text-cyan-500"/> Process</button>
                                <button onClick={() => addNewBlock('team')} className="text-left px-3 py-2 hover:bg-gray-50 rounded border border-gray-100 text-sm flex items-center gap-2"><Users size={16} className="text-orange-500"/> Team</button>
                                <button onClick={() => addNewBlock('two-column-info')} className="text-left px-3 py-2 hover:bg-gray-50 rounded border border-gray-100 text-sm flex items-center gap-2"><Columns size={16} className="text-teal-500"/> Two Col</button>
                                <button onClick={() => addNewBlock('steps')} className="text-left px-3 py-2 hover:bg-gray-50 rounded border border-gray-100 text-sm flex items-center gap-2"><ListOrdered size={16} className="text-indigo-500"/> Steps</button>
                                <button onClick={() => addNewBlock('manifesto')} className="text-left px-3 py-2 hover:bg-gray-50 rounded border border-gray-100 text-sm flex items-center gap-2"><FileText size={16} className="text-rose-500"/> Manifesto</button>
                                <button onClick={() => addNewBlock('value-proposition')} className="text-left px-3 py-2 hover:bg-gray-50 rounded border border-gray-100 text-sm flex items-center gap-2"><TrendingUp size={16} className="text-emerald-500"/> Value Prop</button>
                                <button onClick={() => addNewBlock('philosophy')} className="text-left px-3 py-2 hover:bg-gray-50 rounded border border-gray-100 text-sm flex items-center gap-2"><Lightbulb size={16} className="text-amber-500"/> Philosophy</button>
                                <button onClick={() => addNewBlock('cta')} className="text-left px-3 py-2 hover:bg-gray-50 rounded border border-gray-100 text-sm flex items-center gap-2"><Megaphone size={16} className="text-red-500"/> CTA</button>
                             </div>
                         </div>
                    )}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden relative h-full">
                        {renderEditor()}
                    </div>
                </div>
             </aside>
          )}

          {(viewMode === 'preview' || viewMode === 'split') && (
             <div ref={previewContainerRef} className="flex-1 bg-gray-100 overflow-y-auto relative p-4 md:p-8 perspective-1000">
                <div 
                   key={previewKey}
                   className={`bg-white shadow-2xl mx-auto transition-all duration-500 ease-out origin-top min-h-screen ${viewMode === 'split' ? 'max-w-[1000px] scale-[0.95]' : 'max-w-full'}`}
                   style={{ 
                       fontFamily: config.fontBody,
                   }}
                >
                    <Navbar 
                       data={config.navbar} 
                       theme={config.theme} 
                       primaryColor={config.primaryColor}
                       fontHeading={config.fontHeading}
                       currentLang={currentLang}
                       onToggleLanguage={handleLanguageToggle}
                       onToggleTheme={toggleTheme}
                       onSelect={() => handleSectionSelect('navbar')}
                    />

                    {config.sectionOrder.map((sectionId) => {
                        if (sectionId === 'hero') {
                             return <Hero key="hero" data={config.hero} theme={config.theme} primaryColor={config.primaryColor} secondaryColor={config.secondaryColor} buttonTextColor={config.buttonTextColor} fontHeading={config.fontHeading} fontBody={config.fontBody} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('hero')} />;
                        }
                        if (sectionId === 'features') {
                             return <Features key="features" data={config.features} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} secondaryColor={config.secondaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('features')} />;
                        }
                        if (sectionId === 'gallery') {
                             return <Gallery key="gallery" data={config.gallery} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('gallery')} />;
                        }
                        if (sectionId === 'testimonials') {
                             return <Testimonials key="testimonials" data={config.testimonials} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('testimonials')} />;
                        }
                        if (sectionId === 'timeline') {
                             return <Timeline key="timeline" data={config.timeline} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} secondaryColor={config.secondaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('timeline')} />;
                        }
                        if (sectionId === 'process') {
                             return <Process key="process" data={config.process} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} secondaryColor={config.secondaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('process')} />;
                        }
                        if (sectionId === 'team') {
                             return <Team key="team" data={config.team} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('team')} />;
                        }
                        if (sectionId === 'twoColumnInfo') {
                             return <TwoColumnInfo key="twoColumnInfo" data={config.twoColumnInfo} theme={config.theme} primaryColor={config.primaryColor} fontHeading={config.fontHeading} fontBody={config.fontBody} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('twoColumnInfo')} />;
                        }
                        if (sectionId === 'steps') {
                             return <Steps key="steps" data={config.steps} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('steps')} />;
                        }
                        if (sectionId === 'manifesto') {
                             return <Manifesto key="manifesto" data={config.manifesto} theme={config.theme} fontHeading={config.fontHeading} primaryColor={config.primaryColor} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('manifesto')} />;
                        }
                        if (sectionId === 'valueProposition') {
                             return <ValueProposition key="valueProposition" data={config.valueProposition} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('valueProposition')} />;
                        }
                        if (sectionId === 'philosophy') {
                             return <Philosophy key="philosophy" data={config.philosophy} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('philosophy')} />;
                        }
                        if (sectionId === 'cta') {
                             return <CTA key="cta" data={config.cta} theme={config.theme} primaryColor={config.primaryColor} buttonTextColor={config.buttonTextColor} fontHeading={config.fontHeading} fontBody={config.fontBody} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('cta')} />;
                        }
                        if (sectionId === 'contactForm') {
                            return <ContactForm key="contact" data={config.contactForm} theme={config.theme} primaryColor={config.primaryColor} fontHeading={config.fontHeading} fontBody={config.fontBody} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('contactForm')} />;
                        }
                        if (sectionId.startsWith('block-')) {
                             const blockId = sectionId.replace('block-', '');
                             const block = config.contentBlocks.find(b => b.id === blockId);
                             if (block) {
                                 if (block.type === 'two-column-info') {
                                     const adapterConfig: any = {
                                         ...block,
                                         buttonLink: block.buttonLink || (block.buttonText ? '#' : ''), 
                                         showButton: block.showButton ?? !!block.buttonText,
                                     };
                                     return <TwoColumnInfo key={blockId} data={adapterConfig} theme={config.theme} primaryColor={config.primaryColor} fontHeading={config.fontHeading} fontBody={config.fontBody} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect(sectionId)} />;
                                 }
                                 if (block.type === 'steps') {
                                     const adapterConfig: any = {
                                         ...block,
                                         items: block.items || []
                                     };
                                     return <Steps key={blockId} data={adapterConfig} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect(sectionId)} />;
                                 }
                                 if (block.type === 'manifesto') {
                                     const adapterConfig: any = {
                                         ...block,
                                         items: block.items || []
                                     };
                                     return <Manifesto key={blockId} data={adapterConfig} theme={config.theme} fontHeading={config.fontHeading} primaryColor={config.primaryColor} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect(sectionId)} />;
                                 }
                                 if (block.type === 'value-proposition') {
                                     const adapterConfig: any = {
                                         ...block,
                                         items: block.items || []
                                     };
                                     return <ValueProposition key={blockId} data={adapterConfig} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect(sectionId)} />;
                                 }
                                 if (block.type === 'philosophy') {
                                     const adapterConfig: any = {
                                         ...block,
                                         items: block.items || []
                                     };
                                     return <Philosophy key={blockId} data={adapterConfig} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect(sectionId)} />;
                                 }
                                 if (block.type === 'process') {
                                     const adapterConfig: any = {
                                         ...block,
                                         items: block.items || []
                                     };
                                     return <Process key={blockId} data={adapterConfig} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} secondaryColor={config.secondaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect(sectionId)} />;
                                 }
                                 return <ContentBlockRenderer key={blockId} data={block} theme={config.theme} primaryColor={config.primaryColor} fontHeading={config.fontHeading} fontBody={config.fontBody} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect(sectionId)} />;
                             }
                        }
                        return null;
                    })}
                    
                    <Footer 
                       data={config.footer} 
                       theme={config.theme} 
                       fontHeading={config.fontHeading} 
                       fontBody={config.fontBody} 
                       secondaryColor={config.secondaryColor}
                       enableAnimations={config.enableAnimations}
                       design={config.design}
                       onSelect={() => handleSectionSelect('footer')}
                    />
                </div>
             </div>
          )}
      </main>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
      
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
               <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold">Export Website</h3>
                   <button onClick={() => setShowExportModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20}/></button>
               </div>
               <div className="space-y-3">
                   <button onClick={() => handleExport('react')} className="w-full flex items-center gap-3 p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group">
                       <div className="bg-blue-100 p-2 rounded text-blue-600 group-hover:bg-blue-200"><Code size={20}/></div>
                       <div>
                           <div className="font-bold">React Project</div>
                           <div className="text-xs text-gray-500">Full source code with React & Tailwind</div>
                       </div>
                   </button>
                   <button onClick={() => handleExport('html')} className="w-full flex items-center gap-3 p-4 border rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-left group">
                       <div className="bg-orange-100 p-2 rounded text-orange-600 group-hover:bg-orange-200"><LayoutTemplate size={20}/></div>
                       <div>
                           <div className="font-bold">Static HTML</div>
                           <div className="text-xs text-gray-500">Single index.html file with inline styles</div>
                       </div>
                   </button>
                   <button onClick={() => handleExport('wordpress')} className="w-full flex items-center gap-3 p-4 border rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group">
                       <div className="bg-indigo-100 p-2 rounded text-indigo-600 group-hover:bg-indigo-200"><Package size={20}/></div>
                       <div>
                           <div className="font-bold">WordPress Theme</div>
                           <div className="text-xs text-gray-500">Installable ZIP theme</div>
                       </div>
                   </button>
               </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default App;
