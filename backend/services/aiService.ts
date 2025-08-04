import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger.js';

// Singleton instance for the Gemini client
class GeminiClient {
  private static instance: GeminiClient;
  private genAI: GoogleGenerativeAI;
  private model: any; 
  
  private constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  }
  
  public static getInstance(): GeminiClient {
    if (!GeminiClient.instance) {
      GeminiClient.instance = new GeminiClient();
    }
    
    return GeminiClient.instance;
  }
  
  public getModel(): any {
    return this.model;
  }
}

const getSystemPrompt = (): string => {
  return `
  You are a helpful AI assistant for a feedback tracking system. Your role is to:
  1. Answer questions about how to use the feedback system
  2. Provide suggestions for categorizing and prioritizing feedback
  3. Help users understand features and workflows
  4. Be concise and specific in your responses
  5. Only discuss topics related to feedback tracking and management
  
  The feedback system has the following features:
  - Submit feedback items (bugs, features, improvements)
  - Track status (open, in-progress, resolved)
  - Upvote important feedback
  - Categorize feedback by type
  `;
};

interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

class ResponseValidator {
  static validateHelpfulness(response: string): ValidationResult {
    const minLength = 20;
    if (response.length < minLength) {
      return { 
        isValid: false, 
        reason: `Response too short (${response.length} chars). Minimum ${minLength} required.` 
      };
    }
    
    const nonHelpfulPatterns = [
      /I cannot answer|I don't have enough information|I'm not able to provide/i,
      /As an AI|As a language model/i,
    ];
    
    for (const pattern of nonHelpfulPatterns) {
      if (pattern.test(response) && response.length < 100) {
        return { 
          isValid: false, 
          reason: 'Response contains refusal or disclaimer without providing useful information' 
        };
      }
    }
    
    return { isValid: true };
  }
  
  static validateRelevance(response: string, prompt: string): ValidationResult {
    const feedbackKeywords = [
      'feedback', 'suggestion', 'improvement', 'feature', 'bug', 'issue',
      'track', 'status', 'priority', 'category', 'report', 'user experience'
    ];
    
    const hasKeyword = feedbackKeywords.some(keyword => 
      response.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (!hasKeyword && prompt.length > 15) {
      return { 
        isValid: false, 
        reason: "Response doesn't contain any feedback-related keywords" 
      };
    }
    
    return { isValid: true };
  }
  
  static validateResponse(response: string, prompt: string): ValidationResult {
    const helpfulnessValidation = this.validateHelpfulness(response);
    if (!helpfulnessValidation.isValid) {
      return helpfulnessValidation;
    }
    
    const relevanceValidation = this.validateRelevance(response, prompt);
    if (!relevanceValidation.isValid) {
      return relevanceValidation;
    }
    
    return { isValid: true };
  }
}

export const generateAiResponse = async (prompt: string): Promise<string> => {
  try {
    const client = GeminiClient.getInstance();
    const model = client.getModel();
    
    const fullPrompt = `${getSystemPrompt()}\n\nUser question: ${prompt}`;
    
    logger.info(`Generating AI response for prompt: "${prompt.substring(0, 30)}..."`);
    
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 300,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      });
      
      const response = result.response.text();
      
      const validationResult = ResponseValidator.validateResponse(response, prompt);
      
      if (!validationResult.isValid) {
        logger.warn(`AI response validation failed: ${validationResult.reason}. Retrying with refined prompt.`);
        
        try {
          const refinedPrompt = `
          ${getSystemPrompt()}
          
          IMPORTANT: Your response MUST be specifically about feedback tracking systems and be at least 50 characters long.
          
          User question: ${prompt}
          `;
          
          const refinedResult = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: refinedPrompt }] }],
            generationConfig: {
              temperature: 0.1, 
              maxOutputTokens: 300,
            }
          });
          
          const refinedAnswer = refinedResult.response.text();
          
          const secondValidation = ResponseValidator.validateResponse(refinedAnswer, prompt);
          if (!secondValidation.isValid) {
            logger.warn(`Second AI response validation failed: ${secondValidation.reason}. Using fallback response.`);
            return `I understand you're asking about "${prompt}". This appears to be related to ${prompt.includes('feedback') ? 'feedback management' : 'our system features'}. Could you please provide more details so I can give you a more specific answer about our feedback tracking system?`;
          }
          
          return refinedAnswer;
        } catch (refinedError) {
          logger.error('Error in refined AI response generation:', refinedError);
          throw refinedError;
        }
      }
      
      return response;
    } catch (generateError) {
      logger.error('Error in initial AI response generation:', generateError);
      throw generateError;
    }
  } catch (error) {
    logger.error('Error generating AI response:', error);
    
    return `I understand you're asking about "${prompt}". This appears to be related to feedback tracking, but I couldn't generate a specific response. Please try rephrasing your question.`;
  }
};

export default {
  generateAiResponse
};