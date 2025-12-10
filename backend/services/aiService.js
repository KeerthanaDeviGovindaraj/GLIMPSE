// services/aiService.js
const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    this.model = 'gpt-4';
  }

  async generateCommentary(context, options = {}) {
    try {
      const prompt = this.buildCommentaryPrompt(context);
      
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: options.model || this.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert sports commentator providing engaging, insightful commentary.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        commentary: response.data.choices[0].message.content,
        tokens: response.data.usage.total_tokens
      };
    } catch (error) {
      console.error('Error generating AI commentary:', error);
      throw error;
    }
  }

  buildCommentaryPrompt(context) {
    const { event, score, time, players, situation } = context;
    
    return `Generate engaging sports commentary for the following situation:
    Event: ${event}
    Score: ${score}
    Time: ${time}
    Players involved: ${players}
    Situation: ${situation}
    
    Provide exciting, professional commentary in 2-3 sentences.`;
  }

  async analyzeSentiment(text) {
    try {
      // Sentiment analysis logic
      return {
        sentiment: 'positive',
        score: 0.8,
        confidence: 0.9
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw error;
    }
  }

  async summarizeText(text, maxLength = 100) {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `Summarize this text in ${maxLength} words or less: ${text}`
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        summary: response.data.choices[0].message.content
      };
    } catch (error) {
      console.error('Error summarizing text:', error);
      throw error;
    }
  }
}

module.exports = new AIService();