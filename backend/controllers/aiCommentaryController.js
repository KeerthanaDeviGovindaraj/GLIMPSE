import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ==================== GENERATE AI COMMENTARY ====================
export const generateAICommentary = async (req, res) => {
  try {
    const { matchData, commentaryType = 'general' } = req.body;

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY is not configured');
      return res.status(500).json({
        success: false,
        error: 'AI service not configured'
      });
    }

    // Build prompt based on match data
    let prompt = buildCommentaryPrompt(matchData, commentaryType);

    console.log('🤖 Generating commentary with Gemini...');
    console.log('Commentary type:', commentaryType);
    console.log('Sport:', matchData.sport);

    // Get Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content
    const result = await model.generateContent({
      contents: [{ 
        role: 'user', 
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500,
      },
    });

    const response = await result.response;
    const commentary = response.text();

    if (!commentary) {
      throw new Error('Empty commentary generated');
    }

    console.log('✅ Commentary generated successfully');

    res.json({
      success: true,
      commentary: commentary,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('❌ AI Commentary Error:', error.message);
    console.error('Full error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI commentary',
      details: error.message
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

    console.log(`🎯 Auto-generating commentary for ${sport} match ${matchId}`);

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY is not configured');
      return res.status(500).json({
        success: false,
        error: 'AI service not configured'
      });
    }

    // Fetch match details from your sports API
    let matchData;
    
    if (sport === 'cricket') {
      // Fetch from cricket API
      const response = await fetch(`https://api.cricapi.com/v1/match_info?apikey=${process.env.CRICKET_API_KEY}&id=${matchId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch cricket match data');
      }
      
      const data = await response.json();
      matchData = data.data;
    } else if (sport === 'football') {
      // Add football API fetch here if needed
      throw new Error('Football auto-commentary not implemented yet');
    }

    if (!matchData) {
      throw new Error('Match data not found');
    }

    // Build prompt
    const prompt = buildCommentaryPrompt({ ...matchData, sport }, 'general');

    // Get Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate commentary
    const result = await model.generateContent({
      contents: [{ 
        role: 'user', 
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500,
      },
    });

    const response = await result.response;
    const commentary = response.text();

    if (!commentary) {
      throw new Error('Empty commentary generated');
    }

    console.log('✅ Auto-commentary generated successfully');

    res.json({
      success: true,
      matchId,
      sport,
      commentary,
      generatedAt: new Date()
    });

  } catch (error) {
    console.error('❌ Auto Commentary Error:', error.message);
    console.error('Full error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate auto commentary',
      details: error.message
    });
  }
};