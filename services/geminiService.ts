
import { GoogleGenAI, Type } from "@google/genai";
import { Product, StoreInfo } from "../types";

// Optional API key - app will use mock responses if not available
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const CATEGORIES = ["Apparel", "Food & Beverage", "Beauty & Personal Care", "Electronics", "Services", "Other"];

/**
 * Analyzes product image using Gemini 3 Flash for quick visual suggestions.
 */
export async function analyzeProductImage(base64Image: string) {
  // Return mock response if API not available
  if (!ai) {
    return { name: "New Product", category: "Other", options: [] };
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
          {
            text: `Analyze this product image. 
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
  // Return mock response if API not available
  if (!ai) {
    return {
      description: product.description || 'Premium quality product',
      seoTitle: `${product.name} - Shop Now`,
      seoDescription: `Buy ${product.name} at great prices. ${product.category} category.`,
      productType: product.category,
      tags: [product.category, 'featured']
    };
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      {
        parts: [
          {
            text: `Suggest structured improvements for this retail product.
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
 * Optimizes a specific product field using AI.
 */
export async function optimizeProductField(product: Partial<Product>, field: string) {
  if (!ai) {
    if (field === 'name') return `Premium ${product.category || 'Product'}`;
    if (field === 'description') return `Experience the best of ${product.name || 'this item'} with our professional quality design.`;
    return "";
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          {
            text: `Optimize the '${field}' for this product. 
            Product Name: ${product.name}
            Category: ${product.category}
            Current Description: ${product.description}
            
            Return only the optimized text for the '${field}' field. No JSON, just the string.`
          }
        ]
      }
    ]
  });

  return response.text.trim().replace(/^"/, '').replace(/"$/, '');
}

/**
 * Processes assistant commands using Gemini 3 Pro for complex intent extraction.
 */
export async function processAssistantCommand(
  message: string,
  currentProducts: Product[],
  currentStore: StoreInfo,
  imageData?: string,
  currentView?: string
) {
  // Return mock response if API not available
  if (!ai) {
    return {
      action: 'CHAT_ONLY',
      textResponse: "AI Assistant is currently in demo mode. Set VITE_GEMINI_API_KEY environment variable to enable full AI features. How can I help you?"
    };
  }

  const parts: any[] = [{
    text: `
      You are the Storex AI Retail Assistant. Help merchants manage products, orders, and their personal settings.
      
      Extraction Rules:
      1. Extract Category: ${CATEGORIES.join(', ')}.
      2. Extract Options (max 2): e.g., Option 1 Name (Size), Values (S,M,L); Option 2 Name (Color), Values (Black,White).
      3. Suggest relevant options based on category if the user is unsure.
      4. Handle basic info: name, price, stock, delivery options.
      
      Interaction Context: 
      Current Store: ${currentStore.name}
      Current View: ${currentView || 'unknown'}
      Products in Catalog: ${currentProducts.length}

      Specific Behavior for Profile View:
      If Current View is 'profile':
      - DO NOT recommend business actions or selling optimizations.
      - DO NOT suggest token purchases or plan upgrades.
      - DO explain why identity verification (DAN) is important (it enables secure payouts).
      - Answer questions about security, passwords, and account status.
      - Tone: Informational, non-pushy, trust-focused.
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
