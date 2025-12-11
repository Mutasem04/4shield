import { GoogleGenAI, Type, FunctionDeclaration, Tool } from "@google/genai";
import { dataService } from './dataService';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// 1. Define the Function Tool
const searchChaletsTool: FunctionDeclaration = {
  name: "searchChalets",
  description: "Search for chalets in Jordan based on location (Governorate/City), price range in JD, or guest capacity.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: {
        type: Type.STRING,
        description: "The location or Governorate in Jordan to search in (e.g., 'Amman', 'Dead Sea', 'Wadi Rum', 'Aqaba', 'Ajloun').",
      },
      minPrice: {
        type: Type.NUMBER,
        description: "Minimum price per night in JD.",
      },
      maxPrice: {
        type: Type.NUMBER,
        description: "Maximum price per night in JD.",
      },
      guests: {
        type: Type.NUMBER,
        description: "Number of guests required.",
      },
    },
  },
};

const tools: Tool[] = [
  {
    functionDeclarations: [searchChaletsTool],
  },
];

export const getGeminiResponse = async (userMessage: string, chatHistory: { role: string, text: string }[]) => {
  if (!apiKey) {
    return "I'm sorry, my AI brain is missing its API key. Please check the configuration.";
  }

  try {
    const systemInstruction = `
      You are Reva, an elite AI Concierge for "Reva Chalet", the premier luxury booking platform in Jordan.
      You have access to real-time chalet data in all Jordanian Governorates using the 'searchChalets' tool.
      
      Guidelines:
      1. ALWAYS use the 'searchChalets' tool if the user asks for recommendations, availability, or specific types of chalets (e.g., "Find me a place in Dead Sea" or "Something near Petra").
      2. If you find chalets, present them beautifully with Name, Location (e.g., Aqaba, Amman), and Price in JD (Jordanian Dinar).
      3. If no chalets match, apologize and suggest popular Jordanian destinations like Wadi Rum or Ajloun.
      4. Keep the tone sophisticated, warm, and professional.
      5. Answer general questions about tourism in Jordan (e.g., visiting Petra, weather in Aqaba) directly.
    `;

    // Map history to the format expected by the SDK
    const history = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add current message
    const contents = [
      ...history,
      { role: 'user', parts: [{ text: userMessage }] }
    ];

    const model = 'gemini-2.5-flash';

    // 1. First API Call: Send prompt + tools
    const result = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        tools,
      }
    });

    const response = result.candidates?.[0]?.content;
    const parts = response?.parts || [];

    // 2. Check for Function Calls
    // The SDK might return a text part AND a function call part, or just one.
    // We need to handle the function call if present.
    
    let finalResponseText = "";

    // Check if the model wants to call a function
    const functionCallPart = parts.find(p => p.functionCall);

    if (functionCallPart && functionCallPart.functionCall) {
      const { name, args } = functionCallPart.functionCall;
      
      if (name === 'searchChalets') {
        // Execute the tool logic
        console.log("AI Calling Tool:", name, args);
        const chaletResults = await dataService.searchChalets(args as any);
        
        // Create the function response part
        const functionResponsePart = {
          functionResponse: {
            name: name,
            response: {
              name: name,
              content: { chalets: chaletResults } // Pass the real data back
            }
          }
        };

        // 3. Second API Call: Send history + function call + function result
        // We must reconstruct the conversation flow:
        // User -> Model (calls function) -> User (provides function output) -> Model (final answer)
        
        const nextContents = [
          ...contents,
          { role: 'model', parts: parts }, // The model's decision to call the function
          { role: 'user', parts: [functionResponsePart] } // The result of the function
        ];

        const finalResult = await ai.models.generateContent({
          model,
          contents: nextContents,
          config: { systemInstruction } // Keep system instruction
        });

        finalResponseText = finalResult.text || "I found some options but couldn't describe them.";
      }
    } else {
      // No function call, just text
      finalResponseText = result.text || "";
    }

    return finalResponseText || "I'm having trouble connecting to the mountains right now. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I apologize, but I'm currently experiencing high traffic. Please try again later.";
  }
};