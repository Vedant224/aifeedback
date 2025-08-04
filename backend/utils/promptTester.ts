import aiService from '../services/aiService.js';
import logger from './logger.js';
import { performance } from 'perf_hooks'; 

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

export async function testPrompt(prompt: string): Promise<PromptTestResult> {
  logger.info('---- PROMPT TEST ----');
  logger.info(`Prompt: "${prompt}"`);
  
  try {
    const startTime = performance.now();
    
    const response = await aiService.generateAiResponse(prompt);
    
    const executionTimeMs = performance.now() - startTime;
    logger.info(`Response time: ${executionTimeMs.toFixed(2)}ms`);
    
    logger.info('\nResponse:');
    logger.info(response);
    
    logger.info('\nValidation:');
    
    const lengthCheck = response.length > 20;
    logger.info(`- Length check (>20 chars): ${lengthCheck ? '✅' : '❌'} (${response.length} chars)`);
    
    const disclaimerCheck = !/(as an ai|as a language model|i cannot|i don't have enough)/i.test(response);
    logger.info(`- No disclaimer patterns: ${disclaimerCheck ? '✅' : '❌'}`);
    
    const feedbackKeywords = ['feedback', 'track', 'category', 'prioritize', 'bug', 'feature'];
    const keywordCheck = feedbackKeywords.some(kw => response.toLowerCase().includes(kw));
    logger.info(`- Contains feedback keywords: ${keywordCheck ? '✅' : '❌'}`);
    
    logger.info('---- END TEST ----\n');
    
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
    throw error;
  }
}
