module.exports = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4',
    maxTokens: 500,
    temperature: 0.7
  },
  claude: {
    apiKey: process.env.CLAUDE_API_KEY,
    model: 'claude-3-sonnet-20240229',
    maxTokens: 500
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-pro'
  }
};