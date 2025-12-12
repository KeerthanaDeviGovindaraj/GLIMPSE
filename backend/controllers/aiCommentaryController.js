import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ==================== GENERATE AI COMMENTARY ====================
export const generateAICommentary = async (req, res) => {
  try {
    const { matchData, commentaryType = 'general' } = req.body;

    // Build prompt based on match data
    let prompt = buildCommentaryPrompt(matchData, commentaryType);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const commentary = message.content[0].text;

    res.json({
      success: true,
      commentary: commentary,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('AI Commentary Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI commentary'
    });
  }
};

// ==================== BUILD COMMENTARY PROMPT ====================
function buildCommentaryPrompt(matchData, type) {
  const { sport, teams, score, status, matchType, venue } = matchData;

  if (sport === 'cricket') {
    return `You are an enthusiastic cricket commentator. Generate exciting commentary for this match:

Match: ${teams[0]} vs ${teams[1]}
Type: ${matchType}
Venue: ${venue}
Status: ${status}
Current Score: 
- ${teams[0]}: ${score[0]?.r}/${score[0]?.w} (${score[0]?.o} overs)
- ${teams[1]}: ${score[1]?.r}/${score[1]?.w} (${score[1]?.o} overs)

Commentary Type: ${type}

Generate a ${type === 'exciting' ? 'thrilling and energetic' : type === 'analysis' ? 'analytical and insightful' : 'balanced'} commentary (2-3 sentences) about the current state of the match. Focus on the momentum, key players, and what to expect next.`;
  } 
  
  else if (sport === 'football') {
    return `You are a passionate football commentator. Generate exciting commentary for this match:

Match: ${teams.home.name} vs ${teams.away.name}
League: ${matchData.league?.name}
Status: ${status.long} (${status.elapsed}')
Score: ${score.home} - ${score.away}
Half-time: ${matchData.halftime?.home} - ${matchData.halftime?.away}

Commentary Type: ${type}

Generate a ${type === 'exciting' ? 'energetic and dramatic' : type === 'analysis' ? 'tactical and analytical' : 'balanced'} commentary (2-3 sentences) about the current match situation. Mention the scoreline, game flow, and what could happen next.`;
  }

  return 'Generate commentary for this sports match.';
}

// ==================== AUTO-GENERATE COMMENTARY FOR MATCH ====================
export const autoGenerateMatchCommentary = async (req, res) => {
  try {
    const { matchId, sport } = req.params;
    
    // Fetch match details from your sports API
    let matchData;
    
    if (sport === 'cricket') {
      // Fetch from cricket API
      const response = await axios.get(`https://api.cricapi.com/v1/match_info`, {
        params: {
          apikey: process.env.CRICKET_API_KEY,
          id: matchId
        }
      });
      matchData = response.data.data;
    }
    
    // Generate commentary
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: buildCommentaryPrompt({ ...matchData, sport }, 'general')
        }
      ]
    });

    const commentary = message.content[0].text;

    res.json({
      success: true,
      matchId,
      commentary,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('Auto Commentary Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate auto commentary'
    });
  }
};