export interface AIPrompt {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  answer: string;
  prompt: string;
}

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

export interface GenerationConfig {
  temperature: number;
  maxOutputTokens: number;
  topP?: number;
  topK?: number;
}

export interface SafetySetting {
  category: string;
  threshold: string;
}