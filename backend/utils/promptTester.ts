import aiService from '../services/aiService.js';
import logger from './logger.js';
import { performance } from 'perf_hooks'; // Node.js built-in performance API

// Define a type for the test result
interface PromptTestResult {
  prompt: string;
  responseLength: number;
  executionTimeMs: number;
  validations: {
    lengthCheck: boolean;
    disclaimerCheck: boolean;
    keywordCheck: boolean;
  };
}

// This utility can be used to test prompts and responses in production environments
export async function testPrompt(prompt: string): Promise<PromptTestResult> {
  logger.info('---- PROMPT TEST ----');
  logger.info(`Prompt: "${prompt}"`);
  
  try {
    // Replace console.time with performance API
    const startTime = performance.now();
    
    const response = await aiService.generateAiResponse(prompt);
    
    // Calculate and log execution time
    const executionTimeMs = performance.now() - startTime;
    logger.info(`Response time: ${executionTimeMs.toFixed(2)}ms`);
    
    logger.info('\nResponse:');
    logger.info(response);
    
    // Basic validation checks
    logger.info('\nValidation:');
    
    // Length check
    const lengthCheck = response.length > 20;
    logger.info(`- Length check (>20 chars): ${lengthCheck ? '✅' : '❌'} (${response.length} chars)`);
    
    // Disclaimer check
    const disclaimerCheck = !/(as an ai|as a language model|i cannot|i don't have enough)/i.test(response);
    logger.info(`- No disclaimer patterns: ${disclaimerCheck ? '✅' : '❌'}`);
    
    // Feedback keywords check
    const feedbackKeywords = ['feedback', 'track', 'category', 'prioritize', 'bug', 'feature'];
    const keywordCheck = feedbackKeywords.some(kw => response.toLowerCase().includes(kw));
    logger.info(`- Contains feedback keywords: ${keywordCheck ? '✅' : '❌'}`);
    
    logger.info('---- END TEST ----\n');
    
    // Return performance metrics for monitoring
    return {
      prompt,
      responseLength: response.length,
      executionTimeMs,
      validations: {
        lengthCheck,
        disclaimerCheck,
        keywordCheck
      }
    };
  } catch (error) {
    logger.error('Test failed:', error);
    // In case of error, still return a result object with error information
    throw error; // Re-throw to allow proper error handling
  }
}

// Example usage in production:
// const result = await testPrompt("How do I categorize my feedback?");
// monitoringService.recordPromptTest(result);