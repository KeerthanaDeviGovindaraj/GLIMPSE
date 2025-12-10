// services/llmService.js
const axios = require('axios');
const cacheService = require('./cacheService');

class LLMService {
  constructor() {
    this.providers = {
      openai: {
        baseURL: 'https://api.openai.com/v1',
        apiKey: process.env.OPENAI_API_KEY,
        models: ['gpt-4', 'gpt-3.5-turbo']
      },
      anthropic: {
        baseURL: 'https://api.anthropic.com/v1',
        apiKey: process.env.ANTHROPIC_API_KEY,
        models: ['claude-3-opus', 'claude-3-sonnet']
      }
    };
    
    this.defaultProvider = 'openai';
    this.defaultModel = 'gpt-3.5-turbo';
  }

  async generateText(prompt, options = {}) {
    try {
      const cacheKey = `llm:${this.hashString(prompt)}`;
      const cached = cacheService.get(cacheKey);
      
      if (cached && !options.noCache) {
        console.log('📦 Using cached LLM response');
        return cached;
      }

      const provider = options.provider || this.defaultProvider;
      const model = options.model || this.defaultModel;

      let response;
      
      if (provider === 'openai') {
        response = await this.callOpenAI(prompt, model, options);
      } else if (provider === 'anthropic') {
        response = await this.callAnthropic(prompt, model, options);
      }

      // Cache the response
      if (response && !options.noCache) {
        cacheService.set(cacheKey, response, 3600); // Cache for 1 hour
      }

      return response;
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
    }
  }

  async callOpenAI(prompt, model, options) {
    const config = this.providers.openai;
    
    const response = await axios.post(
      `${config.baseURL}/chat/completions`,
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: options.systemPrompt || 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
        top_p: options.topP || 1,
        frequency_penalty: options.frequencyPenalty || 0,
        presence_penalty: options.presencePenalty || 0
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      text: response.data.choices[0].message.content,
      model: model,
      provider: 'openai',
      tokens: response.data.usage.total_tokens,
      finishReason: response.data.choices[0].finish_reason
    };
  }

  async callAnthropic(prompt, model, options) {
    const config = this.providers.anthropic;
    
    const response = await axios.post(
      `${config.baseURL}/messages`,
      {
        model: model,
        max_tokens: options.maxTokens || 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      text: response.data.content[0].text,
      model: model,
      provider: 'anthropic',
      tokens: response.data.usage.input_tokens + response.data.usage.output_tokens,
      finishReason: response.data.stop_reason
    };
  }

  async streamText(prompt, options = {}, onChunk) {
    try {
      const provider = options.provider || this.defaultProvider;
      
      if (provider === 'openai') {
        return await this.streamOpenAI(prompt, options, onChunk);
      }
      
      throw new Error(`Streaming not implemented for provider: ${provider}`);
    } catch (error) {
      console.error('Error streaming text:', error);
      throw error;
    }
  }

  async streamOpenAI(prompt, options, onChunk) {
    const config = this.providers.openai;
    
    const response = await axios.post(
      `${config.baseURL}/chat/completions`,
      {
        model: options.model || this.defaultModel,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: true
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        responseType: 'stream'
      }
    );

    return new Promise((resolve, reject) => {
      let fullText = '';
      
      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.includes('[DONE]')) {
            resolve(fullText);
            return;
          }
          
          if (line.startsWith('data: ')) {
            try {
              const json = JSON.parse(line.substring(6));
              const content = json.choices[0]?.delta?.content || '';
              fullText += content;
              onChunk(content);
            } catch (e) {
              // Skip parsing errors
            }
          }
        }
      });

      response.data.on('error', reject);
    });
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }
}

module.exports = new LLMService();