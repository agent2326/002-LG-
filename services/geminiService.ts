
import { GoogleGenAI, Type } from "@google/genai";
import { LandingPageConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to strip markdown code blocks if present
const cleanResponseText = (text: string): string => {
  let cleaned = text.trim();
  // Remove markdown JSON wrapping if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned;
};

// Helper to identify and mask base64 images to save tokens during translation
const maskImages = (obj: any, map: Map<string, string>) => {
  if (typeof obj === 'string') {
    if (obj.startsWith('data:image')) {
      const key = `__IMG_${Math.random().toString(36).substr(2, 9)}__`;
      map.set(key, obj);
      return key;
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => maskImages(item, map));
  }
  if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {};
    for (const k in obj) {
      newObj[k] = maskImages(obj[k], map);
    }
    return newObj;
  }
  return obj;
};

// Helper to restore masked images
const restoreImages = (obj: any, map: Map<string, string>) => {
  if (typeof obj === 'string') {
    if (obj.startsWith('__IMG_') && map.has(obj)) {
      return map.get(obj);
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => restoreImages(item, map));
  }
  if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {};
    for (const k in obj) {
      newObj[k] = restoreImages(obj[k], map);
    }
    return newObj;
  }
  return obj;
};

export const generateLandingPageConfig = async (topic: string): Promise<LandingPageConfig | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a landing page configuration for a product or service about: "${topic}". 
      Ensure the tone is professional and marketing-oriented. 
      Select a suitable primary color, secondary color, surface color, and a high-contrast button text color (hex codes).
      Choose complementary fonts for headings and body text from this list: 'Inter', 'Playfair Display', 'Space Mono', 'Open Sans', 'Montserrat', 'Lato', 'Roboto', 'Oswald', 'Poppins', 'Raleway', 'Merriweather', 'Nunito', 'Rubik'.
      Select a border radius style (none, sm, md, lg, xl, 2xl, full).
      Include a hero image description for a placeholder.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theme: { type: Type.STRING, enum: ["light", "dark", "midnight", "sepia", "high-contrast-dark", "high-contrast-light"] },
            primaryColor: { type: Type.STRING, description: "Hex color code" },
            secondaryColor: { type: Type.STRING, description: "Hex color code" },
            surfaceColor: { type: Type.STRING, description: "Hex color code for cards/backgrounds" },
            backgroundColor: { type: Type.STRING, description: "Hex color code for main background" },
            buttonTextColor: { type: Type.STRING, description: "Hex color code for text on buttons" },
            fontHeading: { type: Type.STRING },
            fontBody: { type: Type.STRING },
            borderRadius: { type: Type.STRING, enum: ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'] },
            enableAnimations: { type: Type.BOOLEAN },
            sectionOrder: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Order of sections ids. Must include 'hero', 'features', 'gallery', 'timeline', 'process', 'team', 'twoColumnInfo', 'steps', 'manifesto', 'valueProposition', 'philosophy', 'testimonials', 'contactForm', 'cta', 'footer'." 
            },
            navbar: {
              type: Type.OBJECT,
              properties: {
                logoText: { type: Type.STRING },
                links: {
                  type: Type.ARRAY,
                  items: {
                     type: Type.OBJECT,
                     properties: { label: {type: Type.STRING}, href: {type: Type.STRING} }
                  }
                },
                showLanguageSwitcher: { type: Type.BOOLEAN },
                showThemeToggle: { type: Type.BOOLEAN },
                show: { type: Type.BOOLEAN }
              }
            },
            hero: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                ctaText: { type: Type.STRING },
                ctaLink: { type: Type.STRING },
                show: { type: Type.BOOLEAN },
              },
              required: ["title", "subtitle", "ctaText", "ctaLink", "show"]
            },
            features: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                show: { type: Type.BOOLEAN },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      icon: { type: Type.STRING, description: "A single emoji representing the feature" }
                    },
                    required: ["title", "description", "icon"]
                  }
                }
              },
              required: ["title", "subtitle", "items", "show"]
            },
            timeline: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                show: { type: Type.BOOLEAN },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      date: { type: Type.STRING },
                      description: { type: Type.STRING },
                      icon: { type: Type.STRING, description: "Number or simple text" }
                    },
                    required: ["title", "date", "description"]
                  }
                }
              },
              required: ["title", "items", "show"]
            },
            process: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    subtitle: { type: Type.STRING },
                    show: { type: Type.BOOLEAN },
                    items: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                description: { type: Type.STRING },
                                icon: { type: Type.STRING }
                            },
                            required: ["title", "description"]
                        }
                    }
                },
                required: ["title", "items", "show"]
            },
            steps: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                show: { type: Type.BOOLEAN },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ["title", "description"]
                  }
                }
              },
              required: ["title", "items", "show"]
            },
            team: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                show: { type: Type.BOOLEAN },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      role: { type: Type.STRING },
                      bio: { type: Type.STRING },
                      avatar: { type: Type.STRING }
                    },
                    required: ["name", "role", "bio"]
                  }
                }
              },
              required: ["title", "items", "show"]
            },
            twoColumnInfo: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                description: { type: Type.STRING },
                image: { type: Type.STRING },
                imagePosition: { type: Type.STRING, enum: ['left', 'right'] },
                buttonText: { type: Type.STRING },
                buttonLink: { type: Type.STRING },
                showButton: { type: Type.BOOLEAN },
                show: { type: Type.BOOLEAN }
              },
              required: ["title", "description", "imagePosition", "show"]
            },
            manifesto: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    show: { type: Type.BOOLEAN },
                    items: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                text: { type: Type.STRING },
                                highlight: { type: Type.BOOLEAN }
                            },
                            required: ["text", "highlight"]
                        }
                    }
                },
                required: ["title", "items", "show"]
            },
            valueProposition: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    show: { type: Type.BOOLEAN },
                    items: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                text: { type: Type.STRING },
                                icon: { type: Type.STRING }
                            },
                            required: ["text"]
                        }
                    }
                },
                required: ["title", "description", "items", "show"]
            },
            philosophy: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    subtitle: { type: Type.STRING },
                    show: { type: Type.BOOLEAN },
                    items: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                content: { type: Type.STRING },
                                icon: { type: Type.STRING }
                            },
                            required: ["title", "content"]
                        }
                    }
                },
                required: ["title", "items", "show"]
            },
            pullQuotes: {
                type: Type.OBJECT,
                properties: {
                    show: { type: Type.BOOLEAN },
                    items: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                quote: { type: Type.STRING },
                                author: { type: Type.STRING },
                                role: { type: Type.STRING },
                                image: { type: Type.STRING }
                            },
                            required: ["quote", "author", "role"]
                        }
                    }
                },
                required: ["items", "show"]
            },
            gallery: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                show: { type: Type.BOOLEAN },
                items: {
                  type: Type.ARRAY,
                  items: { 
                     type: Type.OBJECT,
                     properties: {
                         url: { type: Type.STRING },
                         title: { type: Type.STRING },
                         subtitle: { type: Type.STRING },
                         link: { type: Type.STRING },
                         showPlayButton: { type: Type.BOOLEAN }
                     },
                     required: ["url"]
                  }
                }
              },
              required: ["title", "subtitle", "items", "show"]
            },
            testimonials: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                show: { type: Type.BOOLEAN },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      role: { type: Type.STRING },
                      content: { type: Type.STRING },
                      avatar: { type: Type.STRING }
                    },
                    required: ["name", "role", "content"]
                  }
                }
              },
              required: ["title", "items", "show"]
            },
            contactForm: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                buttonText: { type: Type.STRING },
                namePlaceholder: { type: Type.STRING },
                emailPlaceholder: { type: Type.STRING },
                messagePlaceholder: { type: Type.STRING },
                successMessage: { type: Type.STRING },
                show: { type: Type.BOOLEAN }
              },
              required: ["title", "subtitle", "buttonText", "show"]
            },
            cta: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                buttonText: { type: Type.STRING },
                show: { type: Type.BOOLEAN }
              },
              required: ["title", "description", "buttonText", "show"]
            },
            footer: {
              type: Type.OBJECT,
              properties: {
                companyName: { type: Type.STRING },
                copyright: { type: Type.STRING },
                show: { type: Type.BOOLEAN },
                links: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      href: { type: Type.STRING }
                    },
                    required: ["label", "href"]
                  }
                }
              },
              required: ["companyName", "copyright", "links", "show"]
            }
          },
          required: ["theme", "hero", "features", "timeline", "process", "team", "steps", "twoColumnInfo", "manifesto", "valueProposition", "philosophy", "gallery", "testimonials", "contactForm", "cta", "footer"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");

    const cleanedText = cleanResponseText(text);
    const data = JSON.parse(cleanedText) as LandingPageConfig;
    
    // Post-process defaults
    data.contentBlocks = [];
    if (!data.primaryColor) data.primaryColor = '#2563eb';
    if (!data.secondaryColor) data.secondaryColor = '#4f46e5';
    if (!data.surfaceColor) data.surfaceColor = '#f3f4f6';
    if (!data.backgroundColor) data.backgroundColor = '#ffffff';
    if (!data.buttonTextColor) data.buttonTextColor = '#ffffff';
    if (!data.fontHeading) data.fontHeading = 'Inter';
    if (!data.fontBody) data.fontBody = 'Inter';
    if (!data.borderRadius) data.borderRadius = 'lg';
    if (data.enableAnimations === undefined) data.enableAnimations = true;
    if (!data.sectionOrder || data.sectionOrder.length === 0) {
        data.sectionOrder = ['hero', 'features', 'twoColumnInfo', 'steps', 'gallery', 'timeline', 'process', 'team', 'testimonials', 'contactForm', 'cta'];
    }

    if (!data.navbar) {
       data.navbar = { 
         logoText: data.footer.companyName, 
         links: [], 
         show: true, 
         showLanguageSwitcher: true, 
         showThemeToggle: true, 
         supportedLanguages: ['en', 'uk', 'ru'] 
       };
    }
    
    if (!data.navbar.supportedLanguages) {
        data.navbar.supportedLanguages = ['en', 'uk', 'ru'];
    }
    
    if (!data.contactForm) {
        data.contactForm = {
            title: "Contact Us",
            subtitle: "Send us a message",
            buttonText: "Send",
            namePlaceholder: "Name",
            emailPlaceholder: "Email",
            messagePlaceholder: "Message",
            successMessage: "Thank you!",
            show: true
        };
    }

    if (!data.timeline) {
        data.timeline = {
            title: "Timeline",
            subtitle: "Our journey",
            items: [
                { title: "Start", date: "2023", description: "Inception", icon: "" }
            ],
            show: true
        };
    }

    if (!data.process) {
        data.process = {
            title: "Process",
            subtitle: "Our Workflow",
            items: [
                { title: "Plan", description: "Strategy", icon: "1" },
                { title: "Build", description: "Development", icon: "2" }
            ],
            show: true
        };
    }

    if (!data.team) {
        data.team = {
            title: "Our Team",
            subtitle: "Meet the experts",
            items: [
                { name: "John Doe", role: "CEO", bio: "Leader with vision.", avatar: "https://via.placeholder.com/150" }
            ],
            show: true
        };
    }

    if (!data.twoColumnInfo) {
        data.twoColumnInfo = {
            title: "About Us",
            subtitle: "Our Story",
            description: "We are passionate about creating amazing experiences.",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
            imagePosition: "right",
            buttonText: "Learn More",
            buttonLink: "#",
            showButton: true,
            show: true
        };
    }

    if (!data.steps) {
        data.steps = {
            title: "How It Works",
            subtitle: "Three easy steps",
            items: [
                { title: "Step 1", description: "Sign up" },
                { title: "Step 2", description: "Configure" },
                { title: "Step 3", description: "Launch" }
            ],
            show: true
        };
    }

    if (!data.manifesto) {
        data.manifesto = {
            title: "Manifesto",
            items: [
                { text: "We dream big.", highlight: true },
                { text: "We work hard.", highlight: false }
            ],
            show: true
        };
    }

    if (!data.valueProposition) {
        data.valueProposition = {
            title: "Value Proposition",
            description: "Why choose us.",
            items: [
                { text: "Reliability", icon: "✓" },
                { text: "Speed", icon: "✓" }
            ],
            show: true
        };
    }

    if (!data.philosophy) {
        data.philosophy = {
            title: "Our Philosophy",
            subtitle: "Guiding Principles",
            show: true,
            items: [
                { title: "Simplicity", content: "We believe in clear and concise solutions.", icon: "1" }
            ]
        };
    }

    if (!data.pullQuotes) {
        data.pullQuotes = {
            show: true,
            items: [
                { quote: "This product changed everything.", author: "Happy Customer", role: "Director" }
            ]
        };
    }
    
    // Handle gallery format migration from older prompts
    // @ts-ignore
    if (data.gallery.images && Array.isArray(data.gallery.images) && typeof data.gallery.images[0] === 'string') {
        // @ts-ignore
        data.gallery.items = data.gallery.images.map(url => ({ url, title: 'Image' }));
    } else if (!data.gallery.items || data.gallery.items.length === 0) {
        data.gallery.items = [
            { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", title: "Modern Workspace", subtitle: "Efficient & Clean" },
            { url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80", title: "Team Collaboration", subtitle: "Stronger Together" },
            { url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80", title: "Design", subtitle: "Creative Solutions" }
        ];
    }
    
    if (data.testimonials.items) {
      data.testimonials.items = data.testimonials.items.map((item, index) => ({
        ...item,
        avatar: item.avatar || `https://picsum.photos/100/100?random=${index + 10}`
      }));
    }
    
    if (!data.hero.image) {
      data.hero.image = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80";
    }

    return data;
  } catch (error) {
    console.error("Failed to generate content", error);
    return null;
  }
};

export const translateLandingPageConfig = async (config: LandingPageConfig, targetLang: string): Promise<LandingPageConfig | null> => {
  try {
    // 1. Mask heavy images (base64) to prevent token overflow and model confusion
    const imageMap = new Map<string, string>();
    const maskedConfig = maskImages(JSON.parse(JSON.stringify(config)), imageMap);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Translate the following JSON configuration to ${targetLang}. 
        Only translate the text content (titles, descriptions, button labels, links labels, captions, content, placeholders). 
        Do NOT change keys, colors, fonts, or boolean settings. 
        Keep the structure exactly the same.
        
        Input JSON:
        ${JSON.stringify(maskedConfig)}
        `,
        config: {
            responseMimeType: "application/json",
        }
    });
    
    const text = response.text;
    if(!text) throw new Error("No translation text returned");

    const cleanedText = cleanResponseText(text);
    const translatedConfig = JSON.parse(cleanedText) as LandingPageConfig;

    // 2. Restore images
    const restoredConfig = restoreImages(translatedConfig, imageMap);
    
    return restoredConfig as LandingPageConfig;
  } catch (error) {
      console.error("Failed to translate", error);
      return null;
  }
}
