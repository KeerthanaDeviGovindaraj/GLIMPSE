const axios = require('axios');

class LLMService {
  constructor() {
    this.provider = process.env.LLM_PROVIDER || 'anthropic';
    this.anthropicKey = process.env.ANTHROPIC_API_KEY;
    this.openaiKey = process.env.OPENAI_API_KEY;
  }

  async generateCommentary(matchContext, customPrompt = null) {
    const systemPrompt = `You are an expert sports commentator. Generate exciting, vivid live sports commentary.`;
    const userPrompt = customPrompt || `Generate live commentary for: ${matchContext}. Make it exciting!`;
    return await this.callLLM(systemPrompt, userPrompt, 200);
  }

  async generatePrediction(matchContext) {
    const systemPrompt = `You are a sports analytics expert.`;
    const userPrompt = `Predict the outcome for: ${matchContext}. Include confidence percentage (e.g., 75%) and key factors.`;
    const response = await this.callLLM(systemPrompt, userPrompt, 400);
    const confidenceMatch = response.match(/(\d{1,3})%/);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 75;
    return { text: response, confidence };
  }

  async generateAnalysis(matchContext, analysisType = 'tactical') {
    const systemPrompt = `You are a professional sports analyst.`;
    const userPrompt = `Provide ${analysisType} analysis for: ${matchContext}. Be detailed and insightful.`;
    return await this.callLLM(systemPrompt, userPrompt, 500);
  }

  async callLLM(systemPrompt, userPrompt, maxTokens = 300) {
    if (this.provider === 'anthropic') {
      return await this.callAnthropicAPI(systemPrompt, userPrompt, maxTokens);
    } else if (this.provider === 'openai') {
      return await this.callOpenAI(systemPrompt, userPrompt, maxTokens);
    }
    throw new Error('Invalid LLM provider');
  }

  async callAnthropicAPI(systemPrompt, userPrompt, maxTokens) {
    if (!this.anthropicKey) {
      throw new Error('ANTHROPIC_API_KEY not set in .env file');
    }

    console.log('🤖 Calling Anthropic Claude API...');

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.anthropicKey,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    console.log('✅ Claude Response received');
    return response.data.content[0].text;
  }

  async callOpenAI(systemPrompt, userPrompt, maxTokens) {
    if (!this.openaiKey) {
      throw new Error('OPENAI_API_KEY not set');
    }

    console.log('🤖 Calling OpenAI...');

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        max_tokens: maxTokens,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiKey}`
        }
      }
    );

    console.log('✅ OpenAI Response received');
    return response.data.choices[0].message.content;
  }
}

module.exports = new LLMService();