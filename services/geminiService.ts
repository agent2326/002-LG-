import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LandingPageConfig, DEFAULT_CONFIG } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const landingPageSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    theme: { type: Type.STRING },
    primaryColor: { type: Type.STRING },
    secondaryColor: { type: Type.STRING },
    buttonTextColor: { type: Type.STRING },
    backgroundColor: { type: Type.STRING },
    surfaceColor: { type: Type.STRING },
    fontHeading: { type: Type.STRING },
    fontBody: { type: Type.STRING },
    borderRadius: { type: Type.STRING },
    sectionOrder: { type: Type.ARRAY, items: { type: Type.STRING } },
    navbar: {
      type: Type.OBJECT,
      properties: {
        logoText: { type: Type.STRING },
        links: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              href: { type: Type.STRING }
            }
          }
        },
        show: { type: Type.BOOLEAN },
        showLanguageSwitcher: { type: Type.BOOLEAN },
        showThemeToggle: { type: Type.BOOLEAN }
      }
    },
    hero: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        ctaText: { type: Type.STRING },
        ctaLink: { type: Type.STRING },
        showButton: { type: Type.BOOLEAN },
        image: { type: Type.STRING },
        show: { type: Type.BOOLEAN }
      }
    },
    personalHero: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          bio: { type: Type.STRING },
          image: { type: Type.STRING },
          imageStyle: { type: Type.STRING, enum: ['circle', 'rounded', 'square'] },
          primaryCtaText: { type: Type.STRING },
          primaryCtaLink: { type: Type.STRING },
          secondaryCtaText: { type: Type.STRING },
          secondaryCtaLink: { type: Type.STRING },
          show: { type: Type.BOOLEAN },
        },
    },
    features: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              icon: { type: Type.STRING }
            }
          }
        },
        show: { type: Type.BOOLEAN }
      }
    },
    gallery: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        subtitle: { type: Type.STRING },
        items: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    url: { type: Type.STRING },
                    title: { type: Type.STRING },
                    subtitle: { type: Type.STRING }
                }
            }
        },
        show: { type: Type.BOOLEAN }
      }
    },
    testimonials: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                content: { type: Type.STRING },
                avatar: { type: Type.STRING }
              }
            }
          },
          show: { type: Type.BOOLEAN }
        }
    },
    cta: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          buttonText: { type: Type.STRING },
          show: { type: Type.BOOLEAN }
        }
    },
    contactForm: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          buttonText: { type: Type.STRING },
          show: { type: Type.BOOLEAN }
        }
    },
    footer: {
        type: Type.OBJECT,
        properties: {
          companyName: { type: Type.STRING },
          copyright: { type: Type.STRING },
          links: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                href: { type: Type.STRING }
              }
            }
          },
          show: { type: Type.BOOLEAN }
        }
    }
  }
};

export const generateLandingPageConfig = async (
  prompt: string, 
  selectedBlocks: string[], 
  mode: string, 
  language: string
): Promise<LandingPageConfig | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a landing page configuration JSON based on this prompt: "${prompt}". 
      Language: ${language}. 
      Mode: ${mode} (affects length of text).
      Include these sections if possible: ${selectedBlocks.join(', ')}.
      Return ONLY JSON matching the schema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: landingPageSchema
      }
    });

    const jsonText = response.text;
    if (!jsonText) return null;
    
    const generatedConfig = JSON.parse(jsonText);
    
    // Merge with default config to ensure all fields exist
    return {
        ...DEFAULT_CONFIG,
        ...generatedConfig,
        // Ensure nested objects are merged correctly if partial
        navbar: { ...DEFAULT_CONFIG.navbar, ...(generatedConfig.navbar || {}) },
        hero: { ...DEFAULT_CONFIG.hero, ...(generatedConfig.hero || {}) },
        personalHero: { ...DEFAULT_CONFIG.personalHero, ...(generatedConfig.personalHero || {}) },
        features: { ...DEFAULT_CONFIG.features, ...(generatedConfig.features || {}) },
        gallery: { ...DEFAULT_CONFIG.gallery, ...(generatedConfig.gallery || {}) },
        testimonials: { ...DEFAULT_CONFIG.testimonials, ...(generatedConfig.testimonials || {}) },
        cta: { ...DEFAULT_CONFIG.cta, ...(generatedConfig.cta || {}) },
        contactForm: { ...DEFAULT_CONFIG.contactForm, ...(generatedConfig.contactForm || {}) },
        footer: { ...DEFAULT_CONFIG.footer, ...(generatedConfig.footer || {}) },
        design: { ...DEFAULT_CONFIG.design, ...(generatedConfig.design || {}) },
        sectionOrder: generatedConfig.sectionOrder || DEFAULT_CONFIG.sectionOrder
    };
  } catch (error) {
    console.error("Gemini generation error:", error);
    return null;
  }
};

export const translateLandingPageConfig = async (
    config: LandingPageConfig, 
    targetLang: string
): Promise<LandingPageConfig | null> => {
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Translate the following JSON content to ${targetLang}. Preserve the structure keys exactly. Only translate values that are user-visible text (titles, descriptions, labels). JSON: ${JSON.stringify(config)}`,
            config: {
                responseMimeType: "application/json"
            }
        });
        
        const jsonText = response.text;
        if (!jsonText) return null;
        return JSON.parse(jsonText);
     } catch (error) {
         console.error("Translation error:", error);
         return null;
     }
}