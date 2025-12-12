
import { GoogleGenAI, Type } from "@google/genai";
import { LandingPageConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
                description: "Order of sections ids. Must include 'hero', 'features', 'gallery', 'testimonials', 'cta'." 
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
          required: ["theme", "hero", "features", "gallery", "testimonials", "cta", "footer"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text) as LandingPageConfig;
    
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
        data.sectionOrder = ['hero', 'features', 'gallery', 'testimonials', 'cta'];
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
    
    data.testimonials.items = data.testimonials.items.map((item, index) => ({
      ...item,
      avatar: `https://picsum.photos/100/100?random=${index + 10}`
    }));
    
    data.hero.image = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80";

    return data;
  } catch (error) {
    console.error("Failed to generate content", error);
    return null;
  }
};

export const translateLandingPageConfig = async (config: LandingPageConfig, targetLang: string): Promise<LandingPageConfig | null> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Translate the following JSON configuration to ${targetLang}. 
        Only translate the text content (titles, descriptions, button labels, links labels, captions). 
        Do NOT change colors, fonts, or layout settings. 
        Do NOT change image URLs. 
        Keep the "sectionOrder" array exactly the same.
        
        Input JSON:
        ${JSON.stringify(config)}
        `,
        config: {
            responseMimeType: "application/json",
        }
    });
    
    const text = response.text;
    if(!text) return null;
    return JSON.parse(text) as LandingPageConfig;
  } catch (error) {
      console.error("Failed to translate", error);
      return null;
  }
}
