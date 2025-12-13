// routes/aiCommentary.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/ai-commentary/test/:sport
 * @desc    Test AI commentary with mock data using Gemini
 * @access  Private
 */
router.get('/test/:sport', protect, async (req, res) => {
  try {
    const { sport } = req.params;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Configuration error',
        commentary: 'AI commentary service is not configured.' 
      });
    }

    let prompt = '';
    
    if (sport === 'cricket') {
      prompt = `You are a professional cricket commentator. Generate exciting commentary for this thrilling match scenario:

India vs Australia - T20 International
Status: 🔴 LIVE NOW
Current Scores:
India: 156/4 (18.3 overs)
Australia: Yet to bat

The match is at a crucial stage. India is building a competitive total with some aggressive batting in the death overs. Provide 3-4 sentences of exciting commentary about this situation.`;
    } else {
      prompt = `You are a professional football commentator. Generate exciting commentary for this intense match scenario:

Manchester United vs Liverpool - Premier League
Status: 🔴 LIVE (78')
Score: Manchester United 2 - 2 Liverpool

It's a thrilling encounter with both teams level. The tension is palpable as we head into the final minutes. Provide 3-4 sentences of exciting commentary about this situation.`;
    }

    // Use Gemini 2.5 Flash - same as your friend's chatbot
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json().catch(() => ({}));
      console.error('Gemini API error:', errorData);
      return res.status(500).json({ 
        error: 'AI service error',
        commentary: 'AI commentary is temporarily unavailable.' 
      });
    }

    const data = await geminiResponse.json();
    const commentary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No commentary available.';

    res.json({ 
      success: true,
      commentary,
      sport,
      mode: 'test',
      aiProvider: 'gemini-2.5-flash'
    });

  } catch (error) {
    console.error('Test commentary error:', error);
    res.status(500).json({ 
      error: 'Server error',
      commentary: 'Unable to generate commentary.' 
    });
  }
});

/**
 * @route   GET /api/ai-commentary/:sport/:matchId
 * @desc    Generate AI commentary for a specific match using Gemini
 * @access  Private
 */
router.get('/:sport/:matchId', protect, async (req, res) => {
  try {
    const { sport, matchId } = req.params;

    if (!['cricket', 'football'].includes(sport)) {
      return res.status(400).json({ 
        error: 'Invalid sport type',
        commentary: 'Please select a valid sport (cricket or football).' 
      });
    }

    let match;
    let prompt = "";
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:4000';

    if (sport === 'cricket') {
      try {
        const cricketResponse = await fetch(`${baseUrl}/api/sports/cricket/live`, {
          headers: { Authorization: req.headers.authorization }
        });

        if (!cricketResponse.ok) {
          throw new Error('Failed to fetch cricket matches');
        }

        const cricketData = await cricketResponse.json();
        const matches = cricketData.data || [];
        match = matches.find(m => String(m.id) === String(matchId));

        if (!match) {
          return res.status(404).json({ 
            error: 'Match not found',
            commentary: 'This match is no longer available. Please select another match.' 
          });
        }

        const team1Score = match.score?.[0] || {};
        const team2Score = match.score?.[1] || {};

        prompt = `You are a professional cricket commentator with years of experience. Provide exciting, engaging commentary for this match:

Match: ${match.name || 'Cricket Match'}
Format: ${match.matchType || 'International Match'}
Status: ${match.isLive ? "🔴 LIVE NOW" : "Recently Finished"}

Current Scores:
${team1Score.inning || 'Team 1'}: ${team1Score.r || 0}/${team1Score.w || 0} (${team1Score.o || 0} overs)
${team2Score.inning || 'Team 2'}: ${team2Score.r || 0}/${team2Score.w || 0} (${team2Score.o || 0} overs)

Provide a 3-4 sentence commentary that includes:
1. Current match situation and momentum
2. Key moments or turning points in the match
3. What fans should watch for next (if live) or the final outcome analysis (if finished)

Keep it exciting, conversational, and engaging - like a real sports commentator speaking to passionate cricket fans.`;

      } catch (error) {
        console.error('Error fetching cricket match:', error);
        return res.status(500).json({ 
          error: 'Failed to fetch match details',
          commentary: 'Unable to retrieve match information. Please try again.' 
        });
      }

    } else if (sport === 'football') {
      try {
        const footballResponse = await fetch(`${baseUrl}/api/sports/football/live`, {
          headers: { Authorization: req.headers.authorization }
        });

        if (!footballResponse.ok) {
          throw new Error('Failed to fetch football matches');
        }

        const footballData = await footballResponse.json();
        const matches = footballData.data || [];
        match = matches.find(m => String(m.id || m.idEvent) === String(matchId));

        if (!match) {
          return res.status(404).json({ 
            error: 'Match not found',
            commentary: 'This match is no longer available. Please select another match.' 
          });
        }

        prompt = `You are a professional football commentator with years of experience. Provide exciting, engaging commentary for this match:

Match: ${match.strHomeTeam || 'Home Team'} vs ${match.strAwayTeam || 'Away Team'}
League: ${match.strLeague || 'Football Match'}
Status: ${match.isLive ? "🔴 LIVE NOW" : "Full Time"}
Score: ${match.strHomeTeam} ${match.intHomeScore || 0} - ${match.intAwayScore || 0} ${match.strAwayTeam}

Provide a 3-4 sentence commentary that includes:
1. Current match situation and what's happening on the pitch
2. Key talking points about the scoreline and match flow
3. What to expect in the remaining time (if live) or final match summary (if finished)

Keep it exciting, conversational, and engaging - like a real sports commentator speaking to passionate football fans.`;

      } catch (error) {
        console.error('Error fetching football match:', error);
        return res.status(500).json({ 
          error: 'Failed to fetch match details',
          commentary: 'Unable to retrieve match information. Please try again.' 
        });
      }
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return res.status(500).json({ 
        error: 'Configuration error',
        commentary: 'AI commentary service is not configured. Please contact the administrator.' 
      });
    }

    // Use Gemini 2.5 Flash - same as your friend's chatbot
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json().catch(() => ({}));
      console.error('Gemini API error:', errorData);

      if (geminiResponse.status === 401) {
        return res.status(500).json({ 
          error: 'API authentication failed',
          commentary: 'AI commentary service authentication error. Please contact the administrator.' 
        });
      }

      if (geminiResponse.status === 429) {
        return res.status(429).json({ 
          error: 'Rate limit exceeded',
          commentary: 'AI commentary service is busy. Please try again in a moment.' 
        });
      }

      return res.status(500).json({ 
        error: 'AI service error',
        commentary: 'AI commentary is temporarily unavailable. Please try again later.' 
      });
    }

    const data = await geminiResponse.json();
    const commentary = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No commentary available at this moment.';

    res.json({ 
      success: true,
      commentary,
      matchId,
      sport,
      isLive: match.isLive || false,
      aiProvider: 'gemini-2.5-flash'
    });

  } catch (error) {
    console.error('AI Commentary error:', error);
    res.status(500).json({ 
      error: 'Server error',
      commentary: 'Unable to generate commentary at this moment. Please try again shortly.' 
    });
  }
});

export default router;