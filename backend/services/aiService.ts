import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger.js';
import Feedback from '../models/Feedback.js';

// Enum for feedback status if not already defined
enum FeedbackStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in-progress',
  RESOLVED = 'resolved'
}

// Define interfaces to avoid 'any' types
interface FeedbackItem {
  _id: any;
  text?: string;
  status?: string;
  category?: string;
  rating?: number;
  createdAt: Date;
  user?: {
    name?: string;
    email?: string;
  };
}

interface StatusCount {
  [key: string]: number;
}

interface CategoryCount {
  [key: string]: number;
}

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
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
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

const getSystemPrompt = async (): Promise<string> =>{
  // Fetch actual feedback data to provide context
  try {
    const recentFeedback = await Feedback.find({})
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();
    
    if (!recentFeedback || recentFeedback.length === 0) {
      return `
      You are a helpful AI assistant for a feedback tracking system. Your role is to:
      1. Answer questions about how to use the feedback system
      2. Provide suggestions for categorizing and prioritizing feedback
      3. Help users understand features and workflows
      4. Be concise and specific in your responses
      
      NOTE: There is currently no feedback data in the system to analyze.
      
      The feedback system has the following features:
      - Submit feedback items (bugs, features, improvements)
      - Track status (open, in-progress, resolved)
      - Upvote important feedback
      - Categorize feedback by type
      `;
    }
    
    // Format feedback data as context - safely accessing properties
    const feedbackContext = recentFeedback.map((f: FeedbackItem, index) => 
      `Feedback #${index + 1}:
       - ID: ${f._id?.toString() || 'Unknown'}
       - Status: ${f.status || 'open'}
       - Category: ${f.category || 'Not specified'}
       - Text: "${f.text || 'No description provided'}"
       - Created: ${new Date(f.createdAt).toISOString()}`
    ).join('\n\n');
    
    // Summary statistics - with proper type annotations
    const statusCounts: StatusCount = {};
    recentFeedback.forEach((f: FeedbackItem) => {
      const status = f.status || 'open';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    const categoryCounts: CategoryCount = {};
    recentFeedback.forEach((f: FeedbackItem) => {
      const category = f.category || 'uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Calculate average rating only if the field exists in your model
    let avgRating = 'No ratings available';
    const feedbackWithRatings = recentFeedback.filter((f: FeedbackItem) => typeof f.rating === 'number');
    
    if (feedbackWithRatings.length > 0) {
      const sum = feedbackWithRatings.reduce((acc, f: FeedbackItem) => acc + (f.rating || 0), 0);
      avgRating = (sum / feedbackWithRatings.length).toFixed(1);
    }
    
    return `
    You are a helpful AI assistant for a feedback tracking system. Your role is to:
    1. Answer questions about the feedback data in the system
    2. Analyze trends and patterns in the feedback
    3. Provide insights based on the feedback content
    4. Be specific and reference actual feedback when answering questions
    
    FEEDBACK DATA SUMMARY:
    - Total feedback entries: ${recentFeedback.length}
    - Status distribution: ${JSON.stringify(statusCounts)}
    - Category distribution: ${JSON.stringify(categoryCounts)}
    - Average rating: ${avgRating}
    
    RECENT FEEDBACK ENTRIES:
    ${feedbackContext}
    
    When answering questions about feedback, use this actual data to provide specific insights and examples.
    `;
    
  } catch (error) {
    logger.error('Error fetching feedback data for AI context:', error);
    return `
    You are a helpful AI assistant for a feedback tracking system. Your role is to:
    1. Answer questions about how to use the feedback system
    2. Provide suggestions for categorizing and prioritizing feedback
    3. Help users understand features and workflows
    4. Be concise and specific in your responses
    
    NOTE: Unable to access feedback data at this time.
    `;
  }
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
    
    return { isValid: true };
  }
  
  static validateResponse(response: string): ValidationResult {
    const helpfulnessValidation = this.validateHelpfulness(response);
    if (!helpfulnessValidation.isValid) {
      return helpfulnessValidation;
    }
    
    return { isValid: true };
  }
}

export const generateAiResponse = async (prompt: string): Promise<string> => {
  try {
    const client = GeminiClient.getInstance();
    const model = client.getModel();
    
    // Get system prompt with feedback data context
    const systemPrompt = await getSystemPrompt();
    const fullPrompt = `${systemPrompt}\n\nUser question: ${prompt}`;
    
    logger.info(`Generating AI response for prompt: "${prompt.substring(0, 30)}..."`);
    
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 500,
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
      
      const validationResult = ResponseValidator.validateResponse(response);
      
      if (!validationResult.isValid) {
        logger.warn(`AI response validation failed: ${validationResult.reason}. Retrying with refined prompt.`);
        
        try {
          const refinedPrompt = `
          ${systemPrompt}
          
          IMPORTANT: Your response MUST be helpful and at least 50 characters long. Reference specific feedback data when possible.
          
          User question: ${prompt}
          `;
          
          const refinedResult = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: refinedPrompt }] }],
            generationConfig: {
              temperature: 0.1, 
              maxOutputTokens: 500,
            }
          });
          
          return refinedResult.response.text();
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
    
    // Improved fallback response
    return `I understand you're asking about "${prompt}". Based on the feedback data in the system, I should be able to answer this, but I'm having technical difficulties. Try asking about specific feedback categories, overall sentiment, or recent feedback trends.`;
  }
};

export default {
  generateAiResponse
};