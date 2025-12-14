
import React, { useState, useRef, useEffect } from 'react';
import { Download, Sparkles, LayoutTemplate, Type, MessageSquare, Megaphone, Menu, Eye, Code, ChevronRight, Plus, Image as ImageIcon, Settings, Trash2, Globe, Palette, Contrast, Shuffle, Layers, Move, RefreshCw, X, Images, ArrowUp, ArrowDown, AlignJustify, ArrowRight, EyeOff, Link as LinkIcon, Circle, Play, Square, Package, Zap, RotateCcw, Mail, Clock, Users, Columns, ListOrdered, FileText, TrendingUp, Lightbulb, Workflow, Quote, Paperclip, CheckSquare, Minus, Maximize2, Minimize2, Disc, Folder, Save, Upload, FileJson, MoveVertical, MoveHorizontal, CaseUpper, CaseLower, PenTool } from 'lucide-react';
import JSZip from 'jszip';

import { LandingPageConfig, DEFAULT_CONFIG, ContentBlock, Theme, GalleryItem, BorderRadius, TypographySettings } from './types';
import { generateLandingPageConfig, translateLandingPageConfig } from './services/geminiService';
import { generateHtml, generateWordPressTheme, generateCss, generateJs } from './services/exportService';

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
import PullQuotes from './components/landing/PullQuotes';
import ContentBlockRenderer from './components/landing/ContentBlock';
import PreviewFrame from './components/PreviewFrame';

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
  if (id === 'valueProposition' || type === 'valueProposition') return TrendingUp;
  if (id === 'philosophy' || type === 'philosophy') return Lightbulb;
  if (id === 'pullQuotes' || type === 'pull-quotes') return Quote;
  if (id === 'cta' || type === 'cta') return Megaphone;
  if (id === 'contactForm') return Mail;
  return AlignJustify;
};

const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ua', label: 'Ukrainian' },
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

const AI_AVAILABLE_BLOCKS = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'features', label: 'Features' },
    { id: 'valueProposition', label: 'Value Prop' },
    { id: 'twoColumnInfo', label: 'Two Column Info' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'team', label: 'Team' },
    { id: 'process', label: 'Process' },
    { id: 'steps', label: 'Steps' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'manifesto', label: 'Manifesto' },
    { id: 'philosophy', label: 'Philosophy' },
    { id: 'pullQuotes', label: 'Pull Quotes' },
    { id: 'contactForm', label: 'Contact Form' },
    { id: 'cta', label: 'Call to Action' },
];

const THEME_PRESETS: Record<string, Partial<LandingPageConfig>> = {
  light: { backgroundColor: '#ffffff', surfaceColor: '#f3f4f6', primaryColor: '#2563eb', secondaryColor: '#4f46e5', buttonTextColor: '#ffffff' },
  dark: { backgroundColor: '#111827', surfaceColor: '#1f2937', primaryColor: '#3b82f6', secondaryColor: '#6366f1', buttonTextColor: '#ffffff' },
  sepia: { backgroundColor: '#fdf6e3', surfaceColor: '#eee8d5', primaryColor: '#d33682', secondaryColor: '#b58900', buttonTextColor: '#fdf6e3' },
  'high-contrast-light': { backgroundColor: '#ffffff', surfaceColor: '#ffffff', primaryColor: '#000000', secondaryColor: '#000000', buttonTextColor: '#ffffff' },
  'high-contrast-dark': { backgroundColor: '#000000', surfaceColor: '#000000', primaryColor: '#ffffff', secondaryColor: '#ffffff', buttonTextColor: '#000000' },
  midnight: { backgroundColor: '#0f172a', surfaceColor: '#1e293b', primaryColor: '#38bdf8', secondaryColor: '#0ea5e9', buttonTextColor: '#ffffff' },
  ocean: { backgroundColor: '#0f172a', surfaceColor: '#1e293b', primaryColor: '#0ea5e9', secondaryColor: '#0284c7', buttonTextColor: '#ffffff' },
  forest: { backgroundColor: '#052e16', surfaceColor: '#064e3b', primaryColor: '#22c55e', secondaryColor: '#16a34a', buttonTextColor: '#ffffff' },
  wine: { backgroundColor: '#4a044e', surfaceColor: '#701a75', primaryColor: '#f0abfc', secondaryColor: '#e879f9', buttonTextColor: '#4a044e' },
  cyberpunk: { backgroundColor: '#09090b', surfaceColor: '#18181b', primaryColor: '#f472b6', secondaryColor: '#22d3ee', buttonTextColor: '#000000' },
  luxury: { backgroundColor: '#000000', surfaceColor: '#1c1917', primaryColor: '#fbbf24', secondaryColor: '#d97706', buttonTextColor: '#000000' },
  retro: { backgroundColor: '#fef3c7', surfaceColor: '#fde68a', primaryColor: '#d97706', secondaryColor: '#92400e', buttonTextColor: '#ffffff' },
  lavender: { backgroundColor: '#f3e8ff', surfaceColor: '#e9d5ff', primaryColor: '#a855f7', secondaryColor: '#9333ea', buttonTextColor: '#ffffff' },
  sunset: { backgroundColor: '#fff7ed', surfaceColor: '#ffedd5', primaryColor: '#f97316', secondaryColor: '#ea580c', buttonTextColor: '#ffffff' },
  dracula: { backgroundColor: '#282a36', surfaceColor: '#44475a', primaryColor: '#ff79c6', secondaryColor: '#bd93f9', buttonTextColor: '#282a36' },
  nord: { backgroundColor: '#2e3440', surfaceColor: '#3b4252', primaryColor: '#88c0d0', secondaryColor: '#81a1c1', buttonTextColor: '#2e3440' },
  coffee: { backgroundColor: '#3E2723', surfaceColor: '#4E342E', primaryColor: '#D7CCC8', secondaryColor: '#A1887F', buttonTextColor: '#3E2723' },
  navy: { backgroundColor: '#0a192f', surfaceColor: '#112240', primaryColor: '#64ffda', secondaryColor: '#57cbff', buttonTextColor: '#0a192f' },
  hacker: { backgroundColor: '#000000', surfaceColor: '#111111', primaryColor: '#00ff00', secondaryColor: '#003300', buttonTextColor: '#000000' },
  dim: { backgroundColor: '#1c2128', surfaceColor: '#2d333b', primaryColor: '#539bf5', secondaryColor: '#444c56', buttonTextColor: '#ffffff' }
};

interface SavedProject {
    id: string;
    name: string;
    date: string;
    config: LandingPageConfig;
}

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
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
   
  // AI Block Selection State
  const [showAiBlockMenu, setShowAiBlockMenu] = useState(false);
  const [selectedAiBlocks, setSelectedAiBlocks] = useState<string[]>([]);
  const [generationMode, setGenerationMode] = useState<'short' | 'medium' | 'long'>('medium');
  const [generationLanguage, setGenerationLanguage] = useState<string>('en');
  const [showModeMenu, setShowModeMenu] = useState(false);
   
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textFileInputRef = useRef<HTMLInputElement>(null);
  const projectImportInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [activeImageField, setActiveImageField] = useState<{section: string, index?: number, key: string} | null>(null);

  // Load Saved Projects from LocalStorage on mount
  useEffect(() => {
      const saved = localStorage.getItem('landing-gen-projects');
      if (saved) {
          try {
              setSavedProjects(JSON.parse(saved));
          } catch (e) {
              console.error("Failed to load projects", e);
          }
      }
  }, []);

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
  }, [config.design]);

  const handleReloadPreview = () => {
    setPreviewKey(prev => prev + 1);
    // Scrolling top handled by iframe logic or forced remount via key
  };

  const saveProject = () => {
      const name = prompt("Enter project name:", config.navbar.logoText || "My Landing Page");
      if (!name) return;

      const newProject: SavedProject = {
          id: Date.now().toString(),
          name,
          date: new Date().toLocaleDateString(),
          config: config
      };

      const updatedProjects = [newProject, ...savedProjects];
      setSavedProjects(updatedProjects);
      localStorage.setItem('landing-gen-projects', JSON.stringify(updatedProjects));
      alert("Project saved successfully!");
  };

  const loadProject = (project: SavedProject) => {
      if (window.confirm(`Load project "${project.name}"? Unsaved changes will be lost.`)) {
          setConfig(project.config);
          setShowProjectModal(false);
          handleReloadPreview();
      }
  };

  const deleteProject = (id: string) => {
      if (window.confirm("Are you sure you want to delete this project?")) {
          const updatedProjects = savedProjects.filter(p => p.id !== id);
          setSavedProjects(updatedProjects);
          localStorage.setItem('landing-gen-projects', JSON.stringify(updatedProjects));
      }
  };

  const exportProjectJson = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `project-${config.navbar.logoText.replace(/\s+/g, '-').toLowerCase()}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

  const handleImportProjectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const json = JSON.parse(event.target?.result as string);
              if (json.hero && json.navbar) {
                  setConfig(json);
                  setShowProjectModal(false);
                  handleReloadPreview();
              } else {
                  alert("Invalid project file.");
              }
          } catch (e) {
              alert("Error parsing JSON file.");
          }
      };
      reader.readAsText(file);
      e.target.value = '';
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const selectedLangLabel = AVAILABLE_LANGUAGES.find(l => l.code === generationLanguage)?.label || 'English';
      const newConfig = await generateLandingPageConfig(aiPrompt, selectedAiBlocks, generationMode, selectedLangLabel);
      if (newConfig) {
        newConfig.navbar.supportedLanguages = ['en', 'ua', 'ru'];
        if (!newConfig.design) newConfig.design = { animation: 'slide-up', buttonStyle: 'rounded', animationDuration: 'normal' };
        
        setConfig(newConfig);
        setCurrentLang('en');
        setUseSingleFont(newConfig.fontHeading === newConfig.fontBody);
        handleReloadPreview();
        setShowAiBlockMenu(false);
        setShowModeMenu(false);
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

  const addAiBlock = (id: string) => { setSelectedAiBlocks(prev => [...prev, id]); };
  const removeAiBlock = (id: string) => { const index = selectedAiBlocks.lastIndexOf(id); if (index > -1) setSelectedAiBlocks(prev => [...prev.slice(0, index), ...prev.slice(index + 1)]); };

  const updateConfig = (section: string, key: string, value: any) => { setConfig((prev: any) => ({ ...prev, [section]: { ...prev[section], [key]: value } })); };
  const updateNestedArray = (arrayName: 'contentBlocks', index: number, key: string, value: any) => { setConfig((prev: any) => { const newArray = [...prev[arrayName]]; newArray[index] = { ...newArray[index], [key]: value }; return { ...prev, [arrayName]: newArray }; }); };
  const updateBlock = (id: string, key: string, value: any) => { setConfig(prev => ({ ...prev, contentBlocks: prev.contentBlocks.map(b => b.id === id ? { ...b, [key]: value } : b) })); };
  const updateBlockItem = (blockId: string, index: number, key: string, value: any) => { setConfig(prev => ({ ...prev, contentBlocks: prev.contentBlocks.map(b => { if (b.id !== blockId) return b; const newItems = [...(b.items || [])]; newItems[index] = { ...newItems[index], [key]: value }; return { ...b, items: newItems }; }) })); };
  const removeBlockItem = (blockId: string, index: number) => { setConfig(prev => ({ ...prev, contentBlocks: prev.contentBlocks.map(b => { if (b.id !== blockId) return b; const newItems = [...(b.items || [])]; newItems.splice(index, 1); return { ...b, items: newItems }; }) })); };
  const addBlockItem = (blockId: string) => { setConfig(prev => ({ ...prev, contentBlocks: prev.contentBlocks.map(b => { if (b.id !== blockId) return b; const newItem = { title: 'New Item', description: 'Description', text: 'Item Text' }; return { ...b, items: [...(b.items || []), newItem] }; }) })); };
  const updateSingletonItem = (section: string, index: number, key: string, value: any) => { setConfig((prev: any) => { const newItems = [...prev[section].items]; newItems[index] = { ...newItems[index], [key]: value }; return { ...prev, [section]: { ...prev[section], items: newItems } }; }); };
  const removeSingletonItem = (section: string, index: number) => { setConfig((prev: any) => { const newItems = [...prev[section].items]; newItems.splice(index, 1); return { ...prev, [section]: { ...prev[section], items: newItems } }; }); };
  const addSingletonItem = (section: string) => { 
      setConfig((prev: any) => { 
          let newItem: any = { title: 'New Item', description: 'Description', text: 'Text', name: 'Name', role: 'Role', content: 'Content', quote: 'Quote', author: 'Author' };
          
          if (section === 'philosophy') {
              newItem = { title: 'New Principle', content: 'Content goes here.', icon: '1', backgroundColor: '#f3f4f6', titleColor: '#000000', textColor: '#4b5563', titleFontSize: '24' };
          }
          
          return { ...prev, [section]: { ...prev[section], items: [...prev[section].items, newItem] } }; 
      }); 
  };
  const updateNavbarLink = (index: number, key: string, value: string) => { setConfig(prev => { const newLinks = [...prev.navbar.links]; newLinks[index] = { ...newLinks[index], [key]: value }; return { ...prev, navbar: { ...prev.navbar, links: newLinks } }; }); };
  const removeNavbarLink = (index: number) => { setConfig(prev => { const newLinks = [...prev.navbar.links]; newLinks.splice(index, 1); return { ...prev, navbar: { ...prev.navbar, links: newLinks } }; }); };
  const addNavbarLink = () => { setConfig(prev => ({ ...prev, navbar: { ...prev.navbar, links: [...prev.navbar.links, { label: 'New Link', href: '#' }] } })); };
  const updateGalleryItem = (index: number, key: string, value: any) => updateSingletonItem('gallery', index, key, value);
  const removeGalleryItem = (index: number) => removeSingletonItem('gallery', index);
  const addGalleryItem = () => setConfig(prev => ({ ...prev, gallery: { ...prev.gallery, items: [...prev.gallery.items, { url: "https://via.placeholder.com/600x400", title: "New Image" }] } }));
  const handleImageUploadTrigger = (section: string, key: string, index?: number) => { setActiveImageField({ section, key, index }); fileInputRef.current?.click(); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file || !activeImageField) return; const reader = new FileReader(); reader.onloadend = () => { const base64 = reader.result as string; const { section, key, index } = activeImageField; if (section.startsWith('block-')) { const blockId = section.replace('block-', ''); if (index !== undefined) { updateBlockItem(blockId, index, key, base64); } else { updateBlock(blockId, key, base64); } } else if (index !== undefined) { updateSingletonItem(section, index, key, base64); } else { updateConfig(section, key, base64); } }; reader.readAsDataURL(file); e.target.value = ''; };
  const handleTextFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = (event) => { const text = event.target?.result as string; setAiPrompt(text); }; reader.readAsText(file); e.target.value = ''; };
  const randomizeColors = () => { const colors = ['#2563eb', '#4f46e5', '#db2777', '#dc2626', '#d97706', '#059669', '#0891b2', '#7c3aed']; const primary = colors[Math.floor(Math.random() * colors.length)]; let secondary = colors[Math.floor(Math.random() * colors.length)]; while(secondary === primary) secondary = colors[Math.floor(Math.random() * colors.length)]; setConfig(prev => ({ ...prev, primaryColor: primary, secondaryColor: secondary })); };
  const randomizeSectionBackgrounds = () => { const bgs = ['#ffffff', '#f8fafc', '#f3f4f6', '#f0f9ff', '#f5f3ff', '#fff1f2', '#fff7ed', '#f0fdf4']; const sections = ['navbar', 'hero', 'features', 'gallery', 'testimonials', 'cta', 'contactForm', 'timeline', 'process', 'team', 'twoColumnInfo', 'steps', 'manifesto', 'valueProposition', 'philosophy', 'footer']; setConfig(prev => { const next = { ...prev }; sections.forEach(sec => { // @ts-ignore
  if(next[sec]) next[sec] = { ...next[sec], backgroundColor: bgs[Math.floor(Math.random() * bgs.length)] }; }); return next; }); };
  const handleSectionSelect = (id: string) => { setActiveSection(id); setActiveTab('content'); };
  const moveSection = (index: number, direction: number) => { if (index + direction < 0 || index + direction >= config.sectionOrder.length) return; const newOrder = [...config.sectionOrder]; const temp = newOrder[index]; newOrder[index] = newOrder[index + direction]; newOrder[index + direction] = temp; setConfig(prev => ({ ...prev, sectionOrder: newOrder })); };
  const handleOrderChange = (sectionId: string, newPosition: number) => { const currentIndex = config.sectionOrder.indexOf(sectionId); if (currentIndex === -1) return; const newOrder = [...config.sectionOrder]; newOrder.splice(currentIndex, 1); newOrder.splice(newPosition - 1, 0, sectionId); setConfig(prev => ({ ...prev, sectionOrder: newOrder })); };
  const removeSection = (id: string) => { if (id.startsWith('block-')) { const blockId = id.replace('block-', ''); setConfig(prev => ({ ...prev, contentBlocks: prev.contentBlocks.filter(b => b.id !== blockId), sectionOrder: prev.sectionOrder.filter(s => s !== id) })); } else { updateConfig(id, 'show', false); } setActiveSection('global'); };
  const addNewBlock = (type: string) => { const newId = Math.random().toString(36).substr(2, 9); const newBlock: ContentBlock = { id: newId, 
  // @ts-ignore
  type: type, title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`, show: true, items: [], description: "New description...", content: "Add your content here." }; if (type === 'features') newBlock.items = [{title: 'Feature', description: 'Desc', icon: '★'}]; if (type === 'gallery') newBlock.items = [{url: 'https://via.placeholder.com/400', title: 'Image'}]; if (type === 'testimonials') newBlock.items = [{name: 'Name', role: 'Role', content: 'Content', avatar: 'https://via.placeholder.com/100'}]; if (type === 'timeline') newBlock.items = [{title: 'Event', date: '2023', description: 'Desc'}]; if (type === 'process') newBlock.items = [{title: 'Step', description: 'Desc', icon: '1'}]; if (type === 'team') newBlock.items = [{name: 'Name', role: 'Role', bio: 'Bio', avatar: 'https://via.placeholder.com/150'}]; if (type === 'steps') newBlock.items = [{title: 'Step', description: 'Desc'}]; if (type === 'manifesto') newBlock.items = [{text: 'Statement', highlight: false}]; if (type === 'value-proposition') newBlock.items = [{text: 'Value', icon: '✓'}]; if (type === 'philosophy') newBlock.items = [{title: 'Principle', content: 'Content', icon: '1'}]; if (type === 'pull-quotes') newBlock.items = [{quote: 'Quote', author: 'Author', role: 'Role'}]; setConfig(prev => ({ ...prev, contentBlocks: [...prev.contentBlocks, newBlock], sectionOrder: [...prev.sectionOrder, `block-${newId}`] })); setActiveSection(`block-${newId}`); setShowAddMenu(false); };
  const handleLanguageToggle = async () => { if (isTranslating) return; const supported = config.navbar.supportedLanguages && config.navbar.supportedLanguages.length > 0 ? config.navbar.supportedLanguages : ['en', 'ua', 'ru']; const currentIndex = supported.indexOf(currentLang); const nextIndex = (currentIndex + 1) % supported.length; const nextLang = supported[nextIndex]; setIsTranslating(true); const translated = await translateLandingPageConfig(config, nextLang); if (translated) { setConfig(translated); setCurrentLang(nextLang); } setIsTranslating(false); };
   
  const toggleTheme = () => { 
      // Simple toggle logic: if it's broadly "dark", switch to light, otherwise switch to dark.
      // This prevents cycling through 20 themes on the frontend toggle.
      const isDarkTheme = ['dark', 'midnight', 'high-contrast-dark', 'ocean', 'forest', 'wine', 'cyberpunk', 'luxury', 'navy', 'hacker', 'dim', 'dracula', 'nord', 'coffee'].includes(config.theme);
      const nextTheme = isDarkTheme ? 'light' : 'dark';
      setConfig(prev => ({ ...prev, theme: nextTheme, ...(THEME_PRESETS[nextTheme] || {}) })); 
  };

  const handleExport = async (format: 'react' | 'html' | 'wordpress') => { const zip = new JSZip(); if (format === 'html') { const css = generateCss(config); zip.file("css/style.css", css); const js = generateJs(); zip.file("js/script.js", js); const mainHtml = generateHtml(config, true, currentLang); zip.file("index.html", mainHtml); const supported = config.navbar.supportedLanguages || ['en']; for (const lang of supported) { if (lang === currentLang) { const html = generateHtml(config, true, lang); zip.file(`index-${lang}.html`, html); } else { try { const translatedConfig = await translateLandingPageConfig(config, lang); if (translatedConfig) { const html = generateHtml(translatedConfig, true, lang); zip.file(`index-${lang}.html`, html); } } catch (e) { console.error(`Failed to generate HTML for ${lang}`, e); } } } } else if (format === 'wordpress') { const html = generateHtml(config, true, currentLang); const wpFiles = generateWordPressTheme(config, html); Object.entries(wpFiles).forEach(([name, content]) => { zip.file(name, content); }); zip.file("screenshot.png", ""); } else if (format === 'react') { zip.file("package.json", `
{ "name": "landing-page", "version": "1.0.0", "dependencies": { "react": "^18.2.0", "react-dom": "^18.2.0", "lucide-react": "^0.263.1", "framer-motion": "^10.16.4" }, "scripts": { "start": "react-scripts start", "build": "react-scripts build" } }`); zip.file("src/landing-page-config.json", JSON.stringify(config, null, 2)); zip.file("src/App.tsx", "/* Import config from landing-page-config.json and use components to render. Full source export coming soon. */"); zip.file("public/index.html", generateHtml(config, false)); } const blob = await zip.generateAsync({type:"blob"}); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `landing-page-${format}.zip`; a.click(); URL.revokeObjectURL(url); setShowExportModal(false); };

  // --- NEW TYPOGRAPHY CONTROL UI ---
  const renderTypographyControl = (label: string, prefix: 'heading' | 'body', currentData: any, updateFunc: (key: string, val: any) => void) => {
      const keyName = `${prefix}Typography`;
      const settings: TypographySettings = currentData[keyName] || {};
      
      const update = (k: keyof TypographySettings, v: any) => {
          updateFunc(keyName, { ...settings, [k]: v });
      };

      return (
          <div className="space-y-4 pt-2 pb-4 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-2 mb-2">
                  <Type size={14} className="text-gray-400" />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</span>
              </div>

              {/* Level 1: Base */}
              <div className="grid grid-cols-2 gap-2">
                  <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Font Family</label>
                      <select 
                          className="w-full border p-1 rounded text-xs bg-white"
                          value={settings.fontFamily || ''}
                          onChange={(e) => update('fontFamily', e.target.value)}
                      >
                          <option value="">Default</option>
                          {AVAILABLE_FONTS.map(f => <option key={f} value={f} style={{fontFamily: f}}>{f}</option>)}
                      </select>
                  </div>
                  <div>
                      <label className="text-[10px] text-gray-400 block mb-1">Weight</label>
                      <select 
                          className="w-full border p-1 rounded text-xs bg-white"
                          value={settings.fontWeight || ''}
                          onChange={(e) => update('fontWeight', e.target.value)}
                      >
                          <option value="">Default</option>
                          <option value="100">Thin (100)</option>
                          <option value="300">Light (300)</option>
                          <option value="400">Regular (400)</option>
                          <option value="500">Medium (500)</option>
                          <option value="600">SemiBold (600)</option>
                          <option value="700">Bold (700)</option>
                          <option value="900">Black (900)</option>
                      </select>
                  </div>
              </div>

              {/* Size */}
              <div>
                  <div className="flex justify-between mb-1">
                      <label className="text-[10px] text-gray-400">Size (px)</label>
                      <span className="text-[10px] text-blue-600 font-mono">{settings.fontSize || 'Auto'}</span>
                  </div>
                  <input 
                      type="range" min="12" max="128" step="1" 
                      value={settings.fontSize || (prefix === 'heading' ? 36 : 16)} 
                      onChange={(e) => update('fontSize', e.target.value)}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
              </div>

              {/* Level 2: Spacing */}
              <div className="grid grid-cols-2 gap-3">
                  <div>
                      <div className="flex justify-between mb-1">
                          <label className="text-[10px] text-gray-400 flex items-center gap-1"><MoveVertical size={10}/> Line Height</label>
                          <span className="text-[10px] text-gray-500 font-mono">{settings.lineHeight || '-'}</span>
                      </div>
                      <input 
                          type="range" min="0.8" max="2.5" step="0.1" 
                          value={settings.lineHeight || 1.2} 
                          onChange={(e) => update('lineHeight', e.target.value)}
                          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                  </div>
                  <div>
                      <div className="flex justify-between mb-1">
                          <label className="text-[10px] text-gray-400 flex items-center gap-1"><MoveHorizontal size={10}/> Spacing</label>
                          <span className="text-[10px] text-gray-500 font-mono">{settings.letterSpacing || '-'}</span>
                      </div>
                      <input 
                          type="range" min="-0.1" max="0.5" step="0.01" 
                          value={settings.letterSpacing || 0} 
                          onChange={(e) => update('letterSpacing', e.target.value)}
                          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                  </div>
              </div>

              {/* Level 3: Decor */}
              <div className="flex items-center justify-between">
                  <div className="flex gap-1 bg-gray-100 p-1 rounded-md">
                      <button onClick={() => update('textTransform', 'uppercase')} className={`p-1 rounded ${settings.textTransform === 'uppercase' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`} title="Uppercase"><CaseUpper size={14}/></button>
                      <button onClick={() => update('textTransform', 'lowercase')} className={`p-1 rounded ${settings.textTransform === 'lowercase' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`} title="Lowercase"><CaseLower size={14}/></button>
                      <button onClick={() => update('textTransform', 'none')} className={`p-1 rounded ${settings.textTransform === 'none' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`} title="Normal">Aa</button>
                  </div>
                  <div className="flex items-center gap-2">
                      <label className="text-[10px] text-gray-400">Color</label>
                      <input 
                          type="color" 
                          value={settings.color || '#000000'} 
                          onChange={(e) => update('color', e.target.value)}
                          className="w-6 h-6 rounded border-0 p-0 cursor-pointer"
                      />
                  </div>
              </div>
          </div>
      );
  };

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
        {/* NEW TYPOGRAPHY SECTION */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Type size={16} className="text-blue-600" /> Typography Override
            </h4>
            {renderTypographyControl("Heading Styles (H1-H3)", "heading", data, updateStyle)}
            {renderTypographyControl("Body Text (P)", "body", data, updateStyle)}
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-900">Background</h4>
          
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-3">
              <button 
                  onClick={() => updateStyle('backgroundType', 'solid')}
                  className={`flex-1 py-1.5 text-[10px] font-medium rounded uppercase transition-all flex items-center justify-center gap-1 ${(data.backgroundType || 'solid') === 'solid' ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:text-gray-900'}`}
              >
                  <Square size={12}/> Solid
              </button>
              <button 
                  onClick={() => updateStyle('backgroundType', 'gradient')}
                  className={`flex-1 py-1.5 text-[10px] font-medium rounded uppercase transition-all flex items-center justify-center gap-1 ${data.backgroundType === 'gradient' ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:text-gray-900'}`}
              >
                  <Disc size={12}/> Radial
              </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
             {(data.backgroundType === 'gradient') ? (
                 <>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Center Color</label>
                        <div className="flex gap-2 items-center">
                           <div className="h-8 w-8 rounded border border-gray-200 overflow-hidden shrink-0 relative">
                              <input type="color" value={data.gradientStart || '#ffffff'} onChange={(e) => updateStyle('gradientStart', e.target.value)} className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0" />
                           </div>
                           <input 
                              type="text" 
                              value={data.gradientStart || ''} 
                              onChange={(e) => updateStyle('gradientStart', e.target.value)} 
                              className="flex-1 border p-1.5 rounded text-sm font-mono"
                              placeholder="#ffffff"
                           />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Outer Color</label>
                        <div className="flex gap-2 items-center">
                           <div className="h-8 w-8 rounded border border-gray-200 overflow-hidden shrink-0 relative">
                              <input type="color" value={data.gradientEnd || '#f3f4f6'} onChange={(e) => updateStyle('gradientEnd', e.target.value)} className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0" />
                           </div>
                           <input 
                              type="text" 
                              value={data.gradientEnd || ''} 
                              onChange={(e) => updateStyle('gradientEnd', e.target.value)} 
                              className="flex-1 border p-1.5 rounded text-sm font-mono"
                              placeholder="#f3f4f6"
                           />
                        </div>
                    </div>
                 </>
             ) : (
                 <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Solid Color</label>
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
             )}
             
             <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Text Color</label>
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
    if (activeSection === 'global') {
        return (
            <div className="p-6 space-y-8 pb-20">
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Palette size={18}/> Theme</h3>
                    
                    {/* Updated Theme Switcher */}
                    <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Select Preset</label>
                        <select 
                            value={config.theme} 
                            onChange={(e) => {
                                const t = e.target.value as Theme;
                                setConfig(prev => ({ ...prev, theme: t, ...(THEME_PRESETS[t] || {}) }));
                            }}
                            className="w-full border rounded-lg p-2 bg-white"
                        >
                            {Object.keys(THEME_PRESETS).map(t => (
                                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace(/-/g, ' ')}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Primary Color</label>
                            <div className="flex gap-2">
                                <input type="color" value={config.primaryColor} onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))} className="h-8 w-8 rounded cursor-pointer border-0" />
                                <input type="text" value={config.primaryColor} onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))} className="flex-1 border rounded px-2 text-sm font-mono" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Secondary Color</label>
                            <div className="flex gap-2">
                                <input type="color" value={config.secondaryColor} onChange={(e) => setConfig(prev => ({ ...prev, secondaryColor: e.target.value }))} className="h-8 w-8 rounded cursor-pointer border-0" />
                                <input type="text" value={config.secondaryColor} onChange={(e) => setConfig(prev => ({ ...prev, secondaryColor: e.target.value }))} className="flex-1 border rounded px-2 text-sm font-mono" />
                            </div>
                        </div>
                    </div>
                    <button onClick={randomizeColors} className="mt-3 text-xs flex items-center gap-1 text-blue-600 hover:underline"><Shuffle size={12}/> Randomize Colors</button>
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Type size={18}/> Typography</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Heading Font</label>
                            <select 
                                value={config.fontHeading} 
                                onChange={(e) => setConfig(prev => ({ ...prev, fontHeading: e.target.value, fontBody: useSingleFont ? e.target.value : prev.fontBody }))}
                                className="w-full border rounded-lg p-2"
                            >
                                {AVAILABLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={useSingleFont} onChange={(e) => setUseSingleFont(e.target.checked)} id="singleFont" className="rounded text-blue-600"/>
                            <label htmlFor="singleFont" className="text-sm text-gray-600">Use same font for body</label>
                        </div>
                        {!useSingleFont && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Body Font</label>
                                <select 
                                    value={config.fontBody} 
                                    onChange={(e) => setConfig(prev => ({ ...prev, fontBody: e.target.value }))}
                                    className="w-full border rounded-lg p-2"
                                >
                                    {AVAILABLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                </div>
                
                <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><LayoutTemplate size={18}/> Global Style</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
                            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                                {['none', 'sm', 'md', 'lg', 'full'].map((r) => (
                                    <button 
                                        key={r}
                                        onClick={() => setConfig(prev => ({ ...prev, borderRadius: r as BorderRadius }))}
                                        className={`flex-1 py-1 text-xs font-medium rounded capitalize ${config.borderRadius === r ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Enable Animations</span>
                            <input 
                                type="checkbox" 
                                checked={config.enableAnimations} 
                                onChange={(e) => setConfig(prev => ({ ...prev, enableAnimations: e.target.checked }))} 
                                className="rounded text-blue-600"
                            />
                        </div>
                        <button onClick={randomizeSectionBackgrounds} className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 flex items-center justify-center gap-2"><Shuffle size={14}/> Randomize Section Backgrounds</button>
                    </div>
                </div>
            </div>
        );
    }

    let data: any;
    let type: string = activeSection;
    let blockIndex = -1;

    if (activeSection.startsWith('block-')) {
        const blockId = activeSection.replace('block-', '');
        blockIndex = config.contentBlocks.findIndex(b => b.id === blockId);
        data = config.contentBlocks[blockIndex];
        type = data?.type;
    } else {
        // @ts-ignore
        data = config[activeSection];
    }

    if (!data) return <div className="p-6 text-gray-500">Section not found</div>;

    const updateField = (key: string, value: any) => {
        if (blockIndex !== -1) {
            updateBlock(data.id, key, value);
        } else {
            updateConfig(activeSection, key, value);
        }
    };

    const handleImageUpload = (key: string) => {
         handleImageUploadTrigger(activeSection, key, blockIndex !== -1 ? undefined : undefined); 
    };

    // Helper to get friendly name for the badge
    const getHeaderLabel = () => {
        if (activeSection === 'global') return 'Global Settings';
        if (type === 'hero') return 'Hero Section';
        if (type === 'navbar') return 'Navigation Bar';
        if (type === 'footer') return 'Footer';
        if (type === 'features') return 'Features';
        if (type === 'gallery') return 'Gallery';
        if (type === 'testimonials') return 'Testimonials';
        if (type === 'cta') return 'Call to Action';
        if (type === 'contactForm') return 'Contact Form';
        
        // For dynamic blocks, try to use title or type
        if (data.title && data.title.length < 25) return data.title;
        return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1').trim(); // readable camelCase
    };

    return (
        <div>
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 pt-4 pb-0 flex gap-4 items-center">
                <button onClick={() => setActiveTab('content')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'content' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Content</button>
                <button onClick={() => setActiveTab('style')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'style' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Style</button>
                
                <div className="flex-1 flex justify-center pb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 shadow-sm max-w-[150px] truncate">
                        {getHeaderLabel()}
                    </span>
                </div>

                <div className="flex items-center gap-2 pb-2">
                      <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer" title="Toggle Visibility">
                          <input type="checkbox" checked={data.show} onChange={(e) => updateField('show', e.target.checked)} className="rounded text-blue-600 w-4 h-4" />
                      </label>
                      {activeSection !== 'navbar' && activeSection !== 'footer' && activeSection !== 'hero' && (
                          <button onClick={() => removeSection(activeSection)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Remove Section"><Trash2 size={16} /></button>
                      )}
                </div>
            </div>

            <div className="p-6 pb-20">
                {activeTab === 'style' ? renderStyleEditor(activeSection, blockIndex) : (
                    <div className="space-y-6">
                        {/* Navbar Specific Fields */}
                        {type === 'navbar' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Logo Text</label>
                                    <input 
                                        type="text" 
                                        value={data.logoText || ''} 
                                        onChange={(e) => updateField('logoText', e.target.value)} 
                                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                
                                <div className="border-t pt-4 mt-4">
                                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Positioning</label>
                                    <div className="flex bg-gray-100 p-1 rounded-lg">
                                        {['fixed', 'absolute', 'relative'].map((pos) => (
                                            <button
                                                key={pos}
                                                onClick={() => updateField('position', pos)}
                                                className={`flex-1 py-1.5 text-xs font-medium rounded capitalize transition-all ${ (data.position || 'fixed') === pos ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:text-gray-900'}`}
                                            >
                                                {pos}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        {(data.position || 'fixed') === 'fixed' && 'Always sticks to top.'}
                                        {(data.position) === 'absolute' && 'Overlays content, scrolls away.'}
                                        {(data.position) === 'relative' && 'Pushes content down, scrolls away.'}
                                    </p>
                                </div>

                                <div className="mt-4">
                                     <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Logo Image</label>
                                     <div className="flex gap-2">
                                         <input 
                                             type="text" 
                                             value={data.logoImage || ''} 
                                             onChange={(e) => updateField('logoImage', e.target.value)} 
                                             placeholder="Image URL (optional)"
                                             className="flex-1 border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                         />
                                         <button onClick={() => handleImageUploadTrigger(activeSection, 'logoImage')} className="p-2 bg-gray-100 rounded hover:bg-gray-200"><ImageIcon size={20}/></button>
                                     </div>
                                </div>
                                
                                <div className="border-t pt-6 mt-6 space-y-5">
                                    <h4 className="font-bold text-sm uppercase text-gray-500">Функциональные кнопки</h4>
                                    
                                    {/* Переключатель Темы (Кнопками) */}
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-xs font-bold text-gray-700">Переключатель Темы (Moon/Sun)</label>
                                            <span className={`text-[10px] font-bold ${data.hideThemeToggle ? 'text-red-500' : 'text-green-600'}`}>
                                                {data.hideThemeToggle ? 'СКРЫТО' : 'ВИДИМО'}
                                            </span>
                                        </div>
                                        <div className="flex bg-gray-100 p-1 rounded-lg">
                                            <button 
                                                onClick={() => updateField('hideThemeToggle', false)}
                                                className={`flex-1 py-2 text-xs font-bold rounded transition-all flex items-center justify-center gap-2 ${!data.hideThemeToggle ? 'bg-white text-green-600 shadow' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                <Eye size={14}/> Показать
                                            </button>
                                            <button 
                                                onClick={() => updateField('hideThemeToggle', true)}
                                                className={`flex-1 py-2 text-xs font-bold rounded transition-all flex items-center justify-center gap-2 ${data.hideThemeToggle ? 'bg-white text-red-500 shadow' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                <EyeOff size={14}/> Скрыть
                                            </button>
                                        </div>
                                    </div>

                                    {/* Переключатель Языка (Кнопками) */}
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-xs font-bold text-gray-700">Переключатель Языка</label>
                                            <span className={`text-[10px] font-bold ${data.hideLangToggle ? 'text-red-500' : 'text-green-600'}`}>
                                                {data.hideLangToggle ? 'СКРЫТО' : 'ВИДИМО'}
                                            </span>
                                        </div>
                                        <div className="flex bg-gray-100 p-1 rounded-lg">
                                            <button 
                                                onClick={() => updateField('hideLangToggle', false)}
                                                className={`flex-1 py-2 text-xs font-bold rounded transition-all flex items-center justify-center gap-2 ${!data.hideLangToggle ? 'bg-white text-green-600 shadow' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                <Eye size={14}/> Показать
                                            </button>
                                            <button 
                                                onClick={() => updateField('hideLangToggle', true)}
                                                className={`flex-1 py-2 text-xs font-bold rounded transition-all flex items-center justify-center gap-2 ${data.hideLangToggle ? 'bg-white text-red-500 shadow' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                <EyeOff size={14}/> Скрыть
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-6 mt-6">
                                    <h4 className="font-bold text-sm uppercase text-gray-500 mb-3">Доступные языки</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {AVAILABLE_LANGUAGES.map(lang => (
                                            <label key={lang.code} className={`flex items-center gap-2 text-sm p-2 border rounded cursor-pointer transition-colors ${(data.supportedLanguages || ['en', 'ua', 'ru']).includes(lang.code) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'hover:bg-gray-50'}`}>
                                                <input 
                                                    type="checkbox"
                                                    checked={(data.supportedLanguages || ['en', 'ua', 'ru']).includes(lang.code)}
                                                    onChange={(e) => {
                                                        const current = data.supportedLanguages || ['en', 'ua', 'ru'];
                                                        let next;
                                                        if (e.target.checked) {
                                                            next = [...current, lang.code];
                                                        } else {
                                                            if (current.length <= 1) return;
                                                            next = current.filter((c: string) => c !== lang.code);
                                                        }
                                                        updateField('supportedLanguages', next);
                                                    }}
                                                    className="rounded text-blue-600"
                                                />
                                                <span className="font-medium">{lang.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Footer Specific Fields */}
                        {type === 'footer' && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Company Name</label>
                                    <input 
                                        type="text" 
                                        value={data.companyName || ''} 
                                        onChange={(e) => updateField('companyName', e.target.value)} 
                                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Copyright Text</label>
                                    <input 
                                        type="text" 
                                        value={data.copyright || ''} 
                                        onChange={(e) => updateField('copyright', e.target.value)} 
                                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </>
                        )}

                        {/* Gallery Specific Settings */}
                        {type === 'gallery' && (
                            <div className="border-t pt-6 mt-6">
                                <h4 className="font-bold text-sm uppercase text-gray-500 mb-4">Gallery Settings</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Layout</label>
                                        <select 
                                            value={data.layout || 'slider'} 
                                            onChange={(e) => updateField('layout', e.target.value)}
                                            className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="slider">Slider</option>
                                            <option value="grid">Grid</option>
                                            <option value="masonry">Masonry</option>
                                            <option value="carousel">Carousel</option>
                                            <option value="reel">Reel</option>
                                            <option value="collage">Collage</option>
                                            <option value="polaroid">Polaroid</option>
                                            <option value="spotlight">Spotlight</option>
                                            <option value="filmstrip">Filmstrip</option>
                                            <option value="stack">Stack</option>
                                        </select>
                                    </div>
                                    <div>
                                         <label className="block text-xs font-bold text-gray-500 mb-1">Transition</label>
                                         <select 
                                            value={data.transition || 'slide'} 
                                            onChange={(e) => updateField('transition', e.target.value)}
                                            className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={data.layout === 'grid' || data.layout === 'masonry' || data.layout === 'collage' || data.layout === 'polaroid'}
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
                                    <div className="col-span-2">
                                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={data.enableLightbox !== false} 
                                                onChange={(e) => updateField('enableLightbox', e.target.checked)} 
                                                className="rounded text-blue-600"
                                            />
                                            Enable Lightbox (Click to expand)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Common Text Fields */}
                        {data.title !== undefined && (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Title</label>
                                {type === 'hero' ? (
                                    <textarea 
                                        value={data.title} 
                                        onChange={(e) => updateField('title', e.target.value)} 
                                        rows={3}
                                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                                        placeholder="Enter title (press Enter for new line)"
                                    />
                                ) : (
                                    <input 
                                        type="text" 
                                        value={data.title} 
                                        onChange={(e) => updateField('title', e.target.value)} 
                                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                )}
                            </div>
                        )}
                        {data.subtitle !== undefined && (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Subtitle</label>
                                <textarea 
                                    value={data.subtitle} 
                                    onChange={(e) => updateField('subtitle', e.target.value)} 
                                    rows={2}
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                                />
                            </div>
                        )}
                        {data.description !== undefined && (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Description</label>
                                <textarea 
                                    value={data.description} 
                                    onChange={(e) => updateField('description', e.target.value)} 
                                    rows={3}
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        )}
                         {data.content !== undefined && (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Content</label>
                                <textarea 
                                    value={data.content} 
                                    onChange={(e) => updateField('content', e.target.value)} 
                                    rows={5}
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        )}
                        
                        {/* Image Fields for certain sections */}
                        {(type === 'hero' || type === 'twoColumnInfo' || type === 'content') && data.image !== undefined && (
                            <div>
                                 <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Image</label>
                                 <div className="flex gap-2">
                                     <input 
                                         type="text" 
                                         value={data.image} 
                                         onChange={(e) => updateField('image', e.target.value)} 
                                         className="flex-1 border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                      />
                                      <button onClick={() => handleImageUploadTrigger(activeSection, 'image', blockIndex !== -1 ? undefined : undefined)} className="p-2 bg-gray-100 rounded hover:bg-gray-200"><ImageIcon size={20}/></button>
                                 </div>
                                 {data.imagePosition && (
                                     <div className="mt-2 flex gap-2">
                                         {['left', 'right', 'bottom'].map(pos => (
                                             <button 
                                                 key={pos}
                                                 onClick={() => updateField('imagePosition', pos)}
                                                 className={`px-3 py-1 text-xs rounded border capitalize ${data.imagePosition === pos ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-200'}`}
                                              >
                                                  {pos}
                                              </button>
                                         ))}
                                     </div>
                                 )}
                            </div>
                        )}

                        {/* Items Editor */}
                        {data.items && Array.isArray(data.items) && (
                            <div className="border-t pt-6 mt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-sm uppercase text-gray-500">Items ({data.items.length})</h4>
                                    <button onClick={() => blockIndex !== -1 ? addBlockItem(data.id) : addSingletonItem(activeSection)} className="text-xs flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"><Plus size={14}/> Add Item</button>
                                </div>
                                <div className="space-y-4">
                                    {data.items.map((item: any, idx: number) => (
                                        <div key={idx} className="border rounded-lg p-3 bg-gray-50 relative group">
                                            <button onClick={() => blockIndex !== -1 ? removeBlockItem(data.id, idx) : removeSingletonItem(activeSection, idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                                            <div className="grid grid-cols-1 gap-3">
                                                {Object.keys(item).map((k) => {
                                                    if (k === 'icon' || k === 'avatar' || k === 'url' || k === 'image') {
                                                        return (
                                                            <div key={k}>
                                                                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">{k}</label>
                                                                <div className="flex gap-2">
                                                                     <input 
                                                                         value={item[k]} 
                                                                         onChange={(e) => blockIndex !== -1 ? updateBlockItem(data.id, idx, k, e.target.value) : updateSingletonItem(activeSection, idx, k, e.target.value)}
                                                                         className="flex-1 border p-1.5 rounded text-sm"
                                                                      />
                                                                      <button onClick={() => handleImageUploadTrigger(activeSection, k, idx)} className="p-1.5 bg-white border rounded hover:bg-gray-50"><ImageIcon size={14}/></button>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    if (typeof item[k] === 'boolean') {
                                                        return (
                                                            <label key={k} className="flex items-center gap-2 text-sm">
                                                                <input 
                                                                   type="checkbox"
                                                                   checked={item[k]}
                                                                   onChange={(e) => blockIndex !== -1 ? updateBlockItem(data.id, idx, k, e.target.checked) : updateSingletonItem(activeSection, idx, k, e.target.checked)}
                                                                   className="rounded text-blue-600"
                                                                />
                                                                <span className="capitalize">{k}</span>
                                                            </label>
                                                        )
                                                    }
                                                    if (k === 'description' || k === 'content' || k === 'bio' || k === 'quote') {
                                                        return (
                                                            <div key={k}>
                                                                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">{k}</label>
                                                                <textarea 
                                                                    value={item[k]}
                                                                    onChange={(e) => blockIndex !== -1 ? updateBlockItem(data.id, idx, k, e.target.value) : updateSingletonItem(activeSection, idx, k, e.target.value)}
                                                                    className="w-full border p-1.5 rounded text-sm"
                                                                    rows={2}
                                                                />
                                                            </div>
                                                        )
                                                    }
                                                    // Color Picker Logic
                                                    if (k.toLowerCase().includes('color') || k === 'backgroundColor') {
                                                        return (
                                                            <div key={k}>
                                                                <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">{k.replace(/([A-Z])/g, ' $1').trim()}</label>
                                                                <div className="flex gap-2 items-center">
                                                                    <div className="h-8 w-8 rounded border border-gray-200 overflow-hidden shrink-0 relative">
                                                                        <input 
                                                                            type="color" 
                                                                            value={item[k] || '#ffffff'} 
                                                                            onChange={(e) => blockIndex !== -1 ? updateBlockItem(data.id, idx, k, e.target.value) : updateSingletonItem(activeSection, idx, k, e.target.value)}
                                                                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0" 
                                                                        />
                                                                    </div>
                                                                    <input 
                                                                        type="text"
                                                                        value={item[k] || ''}
                                                                        onChange={(e) => blockIndex !== -1 ? updateBlockItem(data.id, idx, k, e.target.value) : updateSingletonItem(activeSection, idx, k, e.target.value)}
                                                                        className="flex-1 border p-1.5 rounded text-sm font-mono"
                                                                        placeholder="#ffffff"
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    
                                                    // Font Size Logic
                                                    if (k.toLowerCase().includes('fontsize')) {
                                                        return (
                                                            <div key={k}>
                                                                <div className="flex justify-between mb-1">
                                                                    <label className="text-[10px] uppercase font-bold text-gray-400">{k.replace(/([A-Z])/g, ' $1').trim()}</label>
                                                                    <span className="text-[10px] text-blue-600 font-mono">{item[k] || '24'}px</span>
                                                                </div>
                                                                <input 
                                                                    type="range" min="12" max="128" step="1" 
                                                                    value={item[k] || 24} 
                                                                    onChange={(e) => blockIndex !== -1 ? updateBlockItem(data.id, idx, k, e.target.value) : updateSingletonItem(activeSection, idx, k, e.target.value)}
                                                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                                />
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <div key={k}>
                                                            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">{k}</label>
                                                            <input 
                                                                value={item[k]}
                                                                onChange={(e) => blockIndex !== -1 ? updateBlockItem(data.id, idx, k, e.target.value) : updateSingletonItem(activeSection, idx, k, e.target.value)}
                                                                className="w-full border p-1.5 rounded text-sm"
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                         {/* Navbar specific - Links */}
                         {type === 'navbar' && (
                            <div className="border-t pt-6 mt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-sm uppercase text-gray-500">Links</h4>
                                    <button onClick={addNavbarLink} className="text-xs flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"><Plus size={14}/> Add Link</button>
                                </div>
                                <div className="space-y-2">
                                    {data.links.map((link: any, idx: number) => (
                                        <div key={idx} className="flex gap-2 items-center">
                                            <input value={link.label} onChange={(e) => updateNavbarLink(idx, 'label', e.target.value)} className="flex-1 border p-2 rounded text-sm" placeholder="Label" />
                                            <input value={link.href} onChange={(e) => updateNavbarLink(idx, 'href', e.target.value)} className="flex-1 border p-2 rounded text-sm" placeholder="#" />
                                            <button onClick={() => removeNavbarLink(idx)} className="text-red-400 hover:text-red-600"><X size={16}/></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                         )}
                         
                         {/* Footer specific - Links */}
                         {type === 'footer' && (
                            <div className="border-t pt-6 mt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-sm uppercase text-gray-500">Links</h4>
                                    <button onClick={() => setConfig(prev => ({...prev, footer: {...prev.footer, links: [...prev.footer.links, {label: 'New Link', href: '#'}]}}))} className="text-xs flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"><Plus size={14}/> Add Link</button>
                                </div>
                                <div className="space-y-2">
                                    {data.links.map((link: any, idx: number) => (
                                        <div key={idx} className="flex gap-2 items-center">
                                            <input value={link.label} onChange={(e) => {
                                                const newLinks = [...data.links];
                                                newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                                                updateField('links', newLinks);
                                            }} className="flex-1 border p-2 rounded text-sm" placeholder="Label" />
                                            <input value={link.href} onChange={(e) => {
                                                const newLinks = [...data.links];
                                                newLinks[idx] = { ...newLinks[idx], href: e.target.value };
                                                updateField('links', newLinks);
                                            }} className="flex-1 border p-2 rounded text-sm" placeholder="#" />
                                            <button onClick={() => {
                                                const newLinks = [...data.links];
                                                newLinks.splice(idx, 1);
                                                updateField('links', newLinks);
                                            }} className="text-red-400 hover:text-red-600"><X size={16}/></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                         )}

                         {/* Button Fields */}
                         {(data.buttonText !== undefined || data.ctaText !== undefined) && (
                             <div className="border-t pt-6 mt-6">
                                  <h4 className="font-bold text-sm uppercase text-gray-500 mb-4">Action Button</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                      <div>
                                          <label className="block text-xs font-bold text-gray-500 mb-1">Label</label>
                                          <input 
                                            value={data.buttonText || data.ctaText} 
                                            onChange={(e) => updateField(data.buttonText !== undefined ? 'buttonText' : 'ctaText', e.target.value)} 
                                            className="w-full border p-2 rounded text-sm"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-xs font-bold text-gray-500 mb-1">Link</label>
                                          <input 
                                            value={data.buttonLink || data.ctaLink || '#'} 
                                            onChange={(e) => updateField(data.buttonLink !== undefined ? 'buttonLink' : 'ctaLink', e.target.value)} 
                                            className="w-full border p-2 rounded text-sm"
                                          />
                                      </div>
                                      {data.showButton !== undefined && (
                                          <div className="col-span-2">
                                              <label className="flex items-center gap-2 text-sm">
                                                  <input type="checkbox" checked={data.showButton} onChange={(e) => updateField('showButton', e.target.checked)} className="rounded text-blue-600"/>
                                                  Show Button
                                              </label>
                                          </div>
                                      )}
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
                 <button onClick={handleReloadPreview} className="p-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-white hover:shadow-sm transition-all"><RefreshCw size={18} /></button>
             </div>
         </div>
         <div className="flex items-center gap-3">
             <button onClick={() => setShowProjectModal(true)} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 px-4 py-2 rounded-lg font-medium text-sm transition-colors"><Folder size={16} /><span className="hidden sm:inline">Projects</span></button>
             <button onClick={() => setShowExportModal(true)} className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"><Download size={16} /><span className="hidden sm:inline">Export</span></button>
         </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
          {(viewMode === 'editor' || viewMode === 'split') && (
             <aside className={`${viewMode === 'editor' ? 'w-full max-w-3xl mx-auto' : 'w-[450px]'} bg-white border-r border-gray-200 flex z-10 shadow-xl transition-all duration-300`}>
                <div className="w-14 md:w-16 flex flex-col items-center py-4 border-r border-gray-200 gap-4 overflow-y-auto hide-scrollbar bg-gray-50 flex-shrink-0">
                    <button onClick={() => handleSectionSelect('global')} className={`p-3 rounded-xl transition-all ${activeSection === 'global' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`} title="Global Settings"><Settings size={20}/></button>
                    <button onClick={() => handleSectionSelect('navbar')} className={`p-3 rounded-xl transition-all ${activeSection === 'navbar' ? 'bg-white text-blue-600 shadow border border-blue-100' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`} title="Navigation Bar"><Globe size={20}/></button>
                    <button onClick={() => handleSectionSelect('footer')} className={`p-3 rounded-xl transition-all ${activeSection === 'footer' ? 'bg-white text-blue-600 shadow border border-blue-100' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`} title="Footer"><Menu size={20}/></button>
                    
                    <div className="w-8 h-px bg-gray-200 my-1"></div>
                    
                    {/* ... Navigation buttons ... */}
                    {config.sectionOrder.map((sectionId) => {
                         if (sectionId === 'hero') return null;
                         const type = sectionId.startsWith('block-') ? config.contentBlocks.find(b => b.id === sectionId.replace('block-',''))?.type : sectionId;
                         const Icon = getSectionIcon(sectionId, type);
                         return (<div key={sectionId}><button onClick={() => handleSectionSelect(sectionId)} className={`p-3 rounded-xl transition-all ${activeSection === sectionId ? 'bg-white text-blue-600 shadow border border-blue-100' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`} title={type}><Icon size={20}/></button></div>);
                    })}
                    <div className="mt-auto pt-4 relative"><button onClick={() => setShowAddMenu(!showAddMenu)} className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"><Plus size={20} /></button></div>
                    {showAddMenu && (
                         <div className="absolute left-16 bottom-4 bg-white shadow-2xl rounded-xl border border-gray-200 p-2 w-64 z-50 grid grid-cols-1 gap-1 max-h-[400px] overflow-y-auto">
                             <h4 className="text-xs font-bold text-gray-500 uppercase px-2 py-1">Add Section</h4>
                             {AI_AVAILABLE_BLOCKS.map(block => (
                                   <button 
                                      key={block.id}
                                      onClick={() => {
                                           if (block.id === 'hero' || block.id === 'navbar' || block.id === 'footer') {
                                               updateConfig(block.id, 'show', true);
                                               setActiveSection(block.id);
                                               setShowAddMenu(false);
                                           } else {
                                               addNewBlock(block.id === 'twoColumnInfo' ? 'two-column-info' : block.id === 'pullQuotes' ? 'pull-quotes' : block.id === 'valueProposition' ? 'value-proposition' : block.id);
                                           }
                                      }}
                                      className="text-left px-3 py-2 hover:bg-gray-50 rounded text-sm font-medium text-gray-700"
                                   >
                                      {block.label}
                                   </button>
                             ))}
                             <div className="h-px bg-gray-100 my-1"></div>
                             <button onClick={() => addNewBlock('content')} className="text-left px-3 py-2 hover:bg-gray-50 rounded text-sm font-medium text-gray-700">Generic Content Block</button>
                         </div>
                    )}
                </div>
                <div className="flex-1 overflow-hidden flex flex-col relative">
                    {/* ... Add Menu ... */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden relative h-full">
                        {renderEditor()}
                    </div>
                </div>
             </aside>
          )}
          {/* ... Preview Section ... */}
          {(viewMode === 'preview' || viewMode === 'split') && (
             <div ref={previewContainerRef} className="flex-1 bg-gray-100 overflow-hidden relative">
                <PreviewFrame key={previewKey}>
                  <div className={`bg-white shadow-2xl mx-auto transition-all duration-500 ease-out origin-top min-h-screen ${viewMode === 'split' ? 'max-w-[1000px] scale-[0.95] mt-4 mb-4' : 'max-w-full'}`} style={{ fontFamily: config.fontBody }}>
                      {/* Render components here normally */}
                      <Navbar 
                          data={{
                              ...config.navbar,
                          }} 
                          theme={config.theme} 
                          primaryColor={config.primaryColor} 
                          fontHeading={config.fontHeading} 
                          currentLang={currentLang} 
                          // If toggle hidden, pass undefined to effectively disable the button
                          onToggleLanguage={config.navbar.hideLangToggle ? undefined : handleLanguageToggle} 
                          onToggleTheme={config.navbar.hideThemeToggle ? undefined : toggleTheme} 
                          onSelect={() => handleSectionSelect('navbar')} 
                      />
                      {config.sectionOrder.map((sectionId) => {
                          // ... Mapping logic (same as before) ...
                          if (sectionId === 'hero') return <Hero key="hero" id="hero" data={config.hero} theme={config.theme} primaryColor={config.primaryColor} secondaryColor={config.secondaryColor} buttonTextColor={config.buttonTextColor} fontHeading={config.fontHeading} fontBody={config.fontBody} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('hero')} />;
                          if (sectionId === 'features') return <Features key="features" id="features" data={config.features} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} secondaryColor={config.secondaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('features')} />;
                          if (sectionId === 'gallery') return <Gallery key="gallery" id="gallery" data={config.gallery} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('gallery')} />;
                          if (sectionId === 'testimonials') return <Testimonials key="testimonials" id="testimonials" data={config.testimonials} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('testimonials')} />;
                          if (sectionId === 'cta') return <CTA key="cta" id="cta" data={config.cta} theme={config.theme} primaryColor={config.primaryColor} buttonTextColor={config.buttonTextColor} fontHeading={config.fontHeading} fontBody={config.fontBody} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('cta')} />;
                          if (sectionId === 'contactForm') return <ContactForm key="contactForm" id="contactForm" data={config.contactForm} theme={config.theme} primaryColor={config.primaryColor} fontHeading={config.fontHeading} fontBody={config.fontBody} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('contactForm')} />;
                          if (sectionId === 'timeline') return <Timeline key="timeline" id="timeline" data={config.timeline} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} secondaryColor={config.secondaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('timeline')} />;
                          if (sectionId === 'team') return <Team key="team" id="team" data={config.team} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('team')} />;
                          if (sectionId === 'twoColumnInfo') return <TwoColumnInfo key="twoColumnInfo" id="twoColumnInfo" data={config.twoColumnInfo} theme={config.theme} primaryColor={config.primaryColor} fontHeading={config.fontHeading} fontBody={config.fontBody} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('twoColumnInfo')} />;
                          if (sectionId === 'steps') return <Steps key="steps" id="steps" data={config.steps} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('steps')} />;
                          if (sectionId === 'process') return <Process key="process" id="process" data={config.process} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} secondaryColor={config.secondaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('process')} />;
                          if (sectionId === 'manifesto') return <Manifesto key="manifesto" id="manifesto" data={config.manifesto} theme={config.theme} fontHeading={config.fontHeading} primaryColor={config.primaryColor} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('manifesto')} />;
                          if (sectionId === 'valueProposition') return <ValueProposition key="valueProposition" id="valueProposition" data={config.valueProposition} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('valueProposition')} />;
                          if (sectionId === 'philosophy') return <Philosophy key="philosophy" id="philosophy" data={config.philosophy} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('philosophy')} />;
                          if (sectionId === 'pullQuotes') return <PullQuotes key="pullQuotes" id="pullQuotes" data={config.pullQuotes || {show: false, items: []}} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} primaryColor={config.primaryColor} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('pullQuotes')} />;
                          
                          if (sectionId.startsWith('block-')) {
                               const blockId = sectionId.replace('block-', '');
                               const block = config.contentBlocks.find(b => b.id === blockId);
                               if(block) return <ContentBlockRenderer key={blockId} id={sectionId} data={block} theme={config.theme} primaryColor={config.primaryColor} fontHeading={config.fontHeading} fontBody={config.fontBody} borderRadius={config.borderRadius} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect(sectionId)} />;
                          }
                          return null;
                      })}
                      <Footer data={config.footer} theme={config.theme} fontHeading={config.fontHeading} fontBody={config.fontBody} secondaryColor={config.secondaryColor} enableAnimations={config.enableAnimations} design={config.design} onSelect={() => handleSectionSelect('footer')} />
                  </div>
                </PreviewFrame>
             </div>
          )}
      </main>
      
      {/* ... Modals (Project, Export) ... */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col">
               <div className="flex justify-between items-center mb-6 flex-shrink-0">
                   <div><h3 className="text-xl font-bold">Project Manager</h3></div>
                   <button onClick={() => setShowProjectModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20}/></button>
               </div>
               <div className="flex-1 overflow-y-auto mb-6 pr-2">
                   {savedProjects.map((project) => (
                       <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-300 hover:shadow-sm transition-all bg-white group mb-2">
                           <div onClick={() => loadProject(project)} className="cursor-pointer flex-1"><div className="font-bold text-gray-800">{project.name}</div></div>
                           <div className="flex items-center gap-2"><button onClick={() => deleteProject(project.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"><Trash2 size={18} /></button></div>
                       </div>
                   ))}
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
                   <button onClick={saveProject} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium text-sm transition-colors"><Save size={16} /> Save Current</button>
                   <div className="relative">
                        <button onClick={() => projectImportInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-medium text-sm transition-colors"><Upload size={16} /> Import JSON</button>
                        <input type="file" ref={projectImportInputRef} onChange={handleImportProjectFile} accept=".json" className="hidden" />
                   </div>
               </div>
           </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
               <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold">Export Website</h3>
                   <button onClick={() => setShowExportModal(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20}/></button>
               </div>
               <div className="space-y-3">
                   <button onClick={() => handleExport('html')} className="w-full flex items-center justify-between p-4 border rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all group">
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center"><Globe size={20}/></div>
                           <div className="text-left">
                               <div className="font-bold">HTML/CSS Bundle</div>
                               <div className="text-xs text-gray-500">Ready to deploy static site</div>
                           </div>
                       </div>
                       <ChevronRight className="text-gray-300 group-hover:text-blue-500" />
                   </button>
                   <button onClick={() => handleExport('react')} className="w-full flex items-center justify-between p-4 border rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all group">
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><Code size={20}/></div>
                           <div className="text-left">
                               <div className="font-bold">React Project</div>
                               <div className="text-xs text-gray-500">Create React App compatible</div>
                           </div>
                       </div>
                       <ChevronRight className="text-gray-300 group-hover:text-blue-500" />
                   </button>
                   <button onClick={() => handleExport('wordpress')} className="w-full flex items-center justify-between p-4 border rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all group">
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-gray-800 text-white rounded-lg flex items-center justify-center"><FileText size={20}/></div>
                           <div className="text-left">
                               <div className="font-bold">WordPress Theme</div>
                               <div className="text-xs text-gray-500">Custom theme zip</div>
                           </div>
                       </div>
                       <ChevronRight className="text-gray-300 group-hover:text-blue-500" />
                   </button>
                   <button onClick={exportProjectJson} className="w-full flex items-center justify-between p-4 border rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all group">
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center"><FileJson size={20}/></div>
                           <div className="text-left">
                               <div className="font-bold">Project JSON</div>
                               <div className="text-xs text-gray-500">Save configuration file</div>
                           </div>
                       </div>
                       <ChevronRight className="text-gray-300 group-hover:text-blue-500" />
                   </button>
               </div>
           </div>
        </div>
      )}

      {/* Image Upload Input (Hidden) */}
      <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
      />
    </div>
  );
}

export default App;
