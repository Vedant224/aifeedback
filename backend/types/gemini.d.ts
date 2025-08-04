declare module '@google/generative-ai' {
  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(options: { model: string }): GenerativeModel;
  }

  export interface GenerativeModel {
    generateContent(options: {
      contents: Array<{
        role: string;
        parts: Array<{
          text: string;
        }>;
      }>;
      generationConfig?: {
        temperature?: number;
        maxOutputTokens?: number;
        topP?: number;
        topK?: number;
      };
      safetySettings?: Array<{
        category: string;
        threshold: string;
      }>;
    }): Promise<{
      response: {
        text(): string;
      };
    }>;
  }
}