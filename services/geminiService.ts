
import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageFile, GeneratedImageData } from '../types';

export async function editImageWithPrompt(imageFile: ImageFile, prompt: string): Promise<GeneratedImageData | null> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const imagePart = {
    inlineData: {
      data: imageFile.base64.split(',')[1], // remove the data URI prefix
      mimeType: imageFile.mimeType,
    },
  };

  const textPart = {
    text: prompt,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract the base64 image data from the response
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return {
            base64: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
        };
      }
    }
    return null;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate image. Please check your prompt and API key.");
  }
}
