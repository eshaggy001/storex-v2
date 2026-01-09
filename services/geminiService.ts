
import { GoogleGenAI, Type } from "@google/genai";
import { Product, StoreInfo } from "../types";

// Always use the named parameter for API key from environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CATEGORIES = ["Apparel", "Food & Beverage", "Beauty & Personal Care", "Electronics", "Services", "Other"];

/**
 * Analyzes product image using Gemini 3 Flash for quick visual suggestions.
 */
export async function analyzeProductImage(base64Image: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          { text: `Analyze this product image. 
            Suggest:
            1. A professional product name.
            2. A category from: ${CATEGORIES.join(', ')}.
            3. Detect potential variant options (e.g., Size, Color, Flavor, Material). Suggest names and possible values.
            Return only JSON.` 
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING, enum: CATEGORIES },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                values: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        },
        required: ["name", "category"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return { name: "New Product", category: "Other", options: [] };
  }
}

/**
 * Generates structured product improvements using Gemini 3 Pro for higher reasoning quality.
 */
export async function generateProductImprovements(product: Product) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      {
        parts: [
          { text: `Suggest structured improvements for this retail product.
            Context:
            Name: ${product.name}
            Category: ${product.category}
            Options: ${product.options?.map(o => `${o.name} (${o.values.join(', ')})`).join('; ') || 'None'}
            Description: ${product.description}
            
            Provide an optimized Description, SEO Title, SEO Description, Product Type, and relevant tags.
            Return only JSON.` 
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          seoTitle: { type: Type.STRING },
          seoDescription: { type: Type.STRING },
          productType: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["description", "seoTitle", "seoDescription", "productType", "tags"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    throw new Error("Failed to generate improvements");
  }
}

/**
 * Processes assistant commands using Gemini 3 Pro for complex intent extraction.
 */
export async function processAssistantCommand(
  message: string,
  currentProducts: Product[],
  currentStore: StoreInfo,
  imageData?: string
) {
  const parts: any[] = [{ text: `
      You are the Storex AI Retail Assistant. Help merchants manage products using Shopify-like multi-option variant structures.
      
      Extraction Rules:
      1. Extract Category: ${CATEGORIES.join(', ')}.
      2. Extract Options (max 2): e.g., Option 1 Name (Size), Values (S,M,L); Option 2 Name (Color), Values (Black,White).
      3. Suggest relevant options based on category if the user is unsure.
      4. Handle basic info: name, price, stock, delivery options.
      
      Interaction Context: 
      Current Store: ${currentStore.name}
      Products in Catalog: ${currentProducts.length}
    ` }];

  if (imageData) {
    parts.push({ inlineData: { data: imageData, mimeType: 'image/jpeg' } });
  }
  
  parts.push({ text: message });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ parts }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          action: { type: Type.STRING, enum: ['ADD_PRODUCT', 'UPDATE_PRODUCT', 'UPDATE_ORDER', 'CHAT_ONLY'] },
          textResponse: { type: Type.STRING },
          productData: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              price: { type: Type.NUMBER },
              category: { type: Type.STRING, enum: CATEGORIES },
              options: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    values: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                }
              }
            }
          }
        },
        required: ["action", "textResponse"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return { action: 'CHAT_ONLY', textResponse: "I'm having trouble processing those details. Could you repeat them?" };
  }
}
