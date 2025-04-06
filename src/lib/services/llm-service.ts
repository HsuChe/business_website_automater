import { Lead, WebsiteTemplate } from '../types';
import { z } from 'zod';

// LLM provider types
export type LLMProvider = 'openai' | 'openrouter' | 'google';

// LLM model types
export type LLMModel = 
  | 'gpt-4-turbo' 
  | 'gpt-3.5-turbo' 
  | 'claude-3-opus' 
  | 'claude-3-sonnet' 
  | 'gemini-pro' 
  | 'gemini-ultra';

// LLM configuration
export interface LLMConfig {
  provider: 'openrouter' | 'google';
  model: string;
  apiKey: string;
  maxTokens?: number;
  temperature?: number;
  siteUrl?: string;
  siteName?: string;
}

// LLM response
export interface LLMResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  error?: string;
}

// LLM service class
export class LLMService {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  async listModels(): Promise<LLMModel[]> {
    if (this.config.provider === 'openrouter') {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch OpenRouter models');
      }

      const data = await response.json();
      return data.data.map((model: any) => ({
        id: model.id,
        name: model.name,
        provider: 'openrouter',
        contextLength: model.context_length,
        pricing: {
          prompt: model.pricing.prompt,
          completion: model.pricing.completion,
          image: model.pricing.image,
          request: model.pricing.request,
        },
      }));
    } else if (this.config.provider === 'google') {
      // For Gemini, we'll return the available models statically since they're fixed
      return [
        {
          id: 'gemini-pro',
          name: 'Gemini Pro',
          provider: 'google',
          contextLength: 32768,
          pricing: {
            prompt: '0.000001',
            completion: '0.000001',
          },
        },
        {
          id: 'gemini-pro-vision',
          name: 'Gemini Pro Vision',
          provider: 'google',
          contextLength: 32768,
          pricing: {
            prompt: '0.000001',
            completion: '0.000001',
          },
        },
      ];
    }
    return [];
  }

  async generateContent(prompt: string, options: {
    responseFormat?: 'text' | 'json';
    jsonSchema?: Record<string, any>;
  } = {}): Promise<string> {
    if (this.config.provider === 'openrouter') {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          'HTTP-Referer': this.config.siteUrl || '',
          'X-Title': this.config.siteName || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [{ role: 'user', content: prompt }],
          ...(options.responseFormat === 'json' && {
            response_format: {
              type: 'json_schema',
              schema: options.jsonSchema,
            },
          }),
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content with OpenRouter');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } else if (this.config.provider === 'google') {
      const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            maxOutputTokens: this.config.maxTokens,
            temperature: this.config.temperature,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content with Gemini');
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    }

    throw new Error('Unsupported LLM provider');
  }

  async validateApiKey(): Promise<boolean> {
    try {
      await this.listModels();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Generate website content based on lead information
  async generateWebsiteContent(lead: Lead, template: WebsiteTemplate): Promise<LLMResponse> {
    const prompt = this.buildWebsitePrompt(lead, template);
    
    try {
      switch (this.config.provider) {
        case 'openai':
          return await this.callOpenAI(prompt);
        case 'openrouter':
          return await this.callOpenRouter(prompt);
        case 'google':
          return await this.callGoogleAI(prompt);
        default:
          throw new Error(`Unsupported LLM provider: ${this.config.provider}`);
      }
    } catch (error) {
      console.error('Error generating website content:', error);
      return {
        text: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Generate email content based on lead information
  async generateEmailContent(lead: Lead, template: string): Promise<LLMResponse> {
    const prompt = this.buildEmailPrompt(lead, template);
    
    try {
      switch (this.config.provider) {
        case 'openai':
          return await this.callOpenAI(prompt);
        case 'openrouter':
          return await this.callOpenRouter(prompt);
        case 'google':
          return await this.callGoogleAI(prompt);
        default:
          throw new Error(`Unsupported LLM provider: ${this.config.provider}`);
      }
    } catch (error) {
      console.error('Error generating email content:', error);
      return {
        text: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Build website generation prompt
  private buildWebsitePrompt(lead: Lead, template: WebsiteTemplate): string {
    return `
      Generate a professional website content for a ${lead.industry} business.
      
      Company Information:
      - Name: ${lead.company}
      - Industry: ${lead.industry}
      - Description: ${lead.description || 'No description provided'}
      
      Template Information:
      - Template Name: ${template.name}
      - Template Description: ${template.description}
      
      Please generate:
      1. A compelling homepage headline and subheadline
      2. A brief company description (2-3 sentences)
      3. 3-4 key service/product offerings with descriptions
      4. A call-to-action section
      5. A brief "About Us" section
      6. Contact information section
      
      Format the response as JSON with the following structure:
      {
        "headline": "string",
        "subheadline": "string",
        "description": "string",
        "services": [
          {
            "title": "string",
            "description": "string"
          }
        ],
        "callToAction": {
          "text": "string",
          "buttonText": "string"
        },
        "aboutUs": "string",
        "contact": {
          "email": "string",
          "phone": "string",
          "address": "string"
        }
      }
    `;
  }

  // Build email generation prompt
  private buildEmailPrompt(lead: Lead, template: string): string {
    return `
      Generate a personalized email for a ${lead.industry} business lead.
      
      Lead Information:
      - Name: ${lead.name}
      - Company: ${lead.company}
      - Industry: ${lead.industry}
      - Description: ${lead.description || 'No description provided'}
      
      Template:
      ${template}
      
      Please generate a personalized email that:
      1. Addresses the lead by name
      2. References their company and industry
      3. Mentions specific details from their description
      4. Includes a clear call-to-action
      5. Maintains a professional tone
      
      Format the response as JSON with the following structure:
      {
        "subject": "string",
        "body": "string"
      }
    `;
  }

  // Call OpenAI API
  private async callOpenAI(prompt: string): Promise<LLMResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { role: 'system', content: 'You are a professional website and email content generator.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: this.config.maxTokens || 2000,
        temperature: this.config.temperature || 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      usage: data.usage
    };
  }

  // Call OpenRouter API
  private async callOpenRouter(prompt: string): Promise<LLMResponse> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { role: 'system', content: 'You are a professional website and email content generator.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: this.config.maxTokens || 2000,
        temperature: this.config.temperature || 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenRouter API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      usage: data.usage
    };
  }

  // Call Google AI Studio API
  private async callGoogleAI(prompt: string): Promise<LLMResponse> {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: 'You are a professional website and email content generator.' },
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: this.config.temperature || 0.7,
          maxOutputTokens: this.config.maxTokens || 2000
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Google AI Studio API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      text: data.candidates[0].content.parts[0].text,
      usage: {
        promptTokens: 0, // Google doesn't provide token counts
        completionTokens: 0,
        totalTokens: 0
      }
    };
  }
} 