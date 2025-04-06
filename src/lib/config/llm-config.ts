import { LLMConfig } from '../services/llm-service';

// Default LLM configurations
export const defaultLLMConfigs: Record<string, LLMConfig> = {
  openai: {
    provider: 'openai',
    model: 'gpt-4-turbo',
    apiKey: process.env.OPENAI_API_KEY || '',
    maxTokens: 2000,
    temperature: 0.7
  },
  openrouter: {
    provider: 'openrouter',
    model: 'claude-3-opus',
    apiKey: process.env.OPENROUTER_API_KEY || '',
    maxTokens: 2000,
    temperature: 0.7
  },
  google: {
    provider: 'google',
    model: 'gemini-pro',
    apiKey: process.env.GOOGLE_AI_API_KEY || '',
    maxTokens: 2000,
    temperature: 0.7
  }
};

// Get LLM configuration by provider
export function getLLMConfig(provider: string): LLMConfig {
  const config = defaultLLMConfigs[provider];
  if (!config) {
    throw new Error(`No configuration found for provider: ${provider}`);
  }
  return config;
}

// Validate LLM configuration
export function validateLLMConfig(config: LLMConfig): boolean {
  if (!config.apiKey) {
    console.error(`Missing API key for provider: ${config.provider}`);
    return false;
  }
  return true;
} 