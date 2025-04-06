import { NextApiRequest, NextApiResponse } from 'next';
import { LLMService } from '../../lib/services/llm-service';
import { LLMConfig } from '../../lib/services/llm-service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { provider, config, prompt } = req.body;

    if (!provider || !config || !prompt) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Create LLM service with the provided config
    const llmService = new LLMService(config as LLMConfig);

    // Test the connection with a simple prompt
    let response;
    switch (provider) {
      case 'openai':
        response = await llmService['callOpenAI'](prompt);
        break;
      case 'openrouter':
        response = await llmService['callOpenRouter'](prompt);
        break;
      case 'google':
        response = await llmService['callGoogleAI'](prompt);
        break;
      default:
        return res.status(400).json({ message: `Unsupported provider: ${provider}` });
    }

    return res.status(200).json({
      success: true,
      response: response.text,
      usage: response.usage,
    });
  } catch (error) {
    console.error('Error testing LLM connection:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
} 