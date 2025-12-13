// routes/aiCommentary.js - Enhanced Version
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/ai-commentary/:sport/:matchId
 * @desc    Generate enhanced AI commentary with multiple styles
 * @access  Private
 */
router.get('/:sport/:matchId', protect, async (req, res) => {
  try {
    const { sport, matchId } = req.params;
    const { style = 'professional', language = 'english' } = req.query;
    
    // Validate sport type
    if (!['cricket', 'football'].includes(sport)) {
      return res.status(400).json({ 
        error: 'Invalid sport type',
        commentary: 'Please select a valid sport (cricket or football).' 
      });
    }

    // Fetch match details
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
        
        console.log('Cricket matches available:', matches.length);
        console.log('Looking for match ID:', matchId);
        
        match = matches.find(m => String(m.id) === String(matchId));
        
        if (!match) {
          console.log('Match not found. Available IDs:', matches.map(m => m.id));
          return res.status(404).json({ 
            error: 'Match not found',
            commentary: 'This match is no longer available. Please select another match.' 
          });
        }

        const team1Score = match.score?.[0] || {};
        const team2Score = match.score?.[1] || {};
        
        // Different commentary styles
        const stylePrompts = {
          professional: `You are a professional cricket commentator with years of experience. Provide exciting, engaging commentary for this match:

Match: ${match.name || 'Cricket Match'}
Format: ${match.matchType || 'International Match'}
Status: ${match.isLive ? "🔴 LIVE NOW" : "Recently Finished"}

Current Scores:
${team1Score.inning || 'Team 1'}: ${team1Score.r || 0}/${team1Score.w || 0} (${team1Score.o || 0} overs)
${team2Score.inning || 'Team 2'}: ${team2Score.r || 0}/${team2Score.w || 0} (${team2Score.o || 0} overs)

Provide a 4-5 sentence commentary that includes:
1. Current match situation and momentum
2. Key moments or turning points
3. Run rate analysis if relevant
4. What fans should watch for next (if live) or final outcome analysis (if finished)
5. A prediction or insight about the game

Keep it exciting, conversational, and engaging.`,

          casual: `You are a casual, fun cricket fan giving commentary. Be enthusiastic and use everyday language:

Match: ${match.name}
Status: ${match.isLive ? "🔥 HAPPENING RIGHT NOW!" : "Just Finished"}

${team1Score.inning}: ${team1Score.r}/${team1Score.w} (${team1Score.o} overs)
${team2Score.inning}: ${team2Score.r}/${team2Score.w} (${team2Score.o} overs)

Give 3-4 sentences of exciting, casual commentary like you're texting a friend about the game. Use phrases like "wow", "that's insane", "no way", etc.`,

          analytical: `You are a cricket analyst providing deep tactical analysis:

Match: ${match.name}
Format: ${match.matchType}
Status: ${match.isLive ? "In Progress" : "Completed"}

${team1Score.inning}: ${team1Score.r}/${team1Score.w} (${team1Score.o} overs)
${team2Score.inning}: ${team2Score.r}/${team2Score.w} (${team2Score.o} overs)

Provide 4-5 sentences of analytical commentary covering:
1. Run rate and required run rate analysis
2. Key partnerships and their impact
3. Bowling strategy and effectiveness
4. Pitch conditions and how they're affecting play
5. Strategic decisions and their outcomes`,

          dramatic: `You are a dramatic sports narrator building excitement:

Match: ${match.name}
Status: ${match.isLive ? "⚡ LIVE DRAMA UNFOLDING" : "Epic Battle Concluded"}

${team1Score.inning}: ${team1Score.r}/${team1Score.w} (${team1Score.o} overs)
${team2Score.inning}: ${team2Score.r}/${team2Score.w} (${team2Score.o} overs)

Give 3-4 sentences of DRAMATIC commentary. Build suspense, use powerful words, make it feel like an epic showdown!`
        };

        prompt = stylePrompts[style] || stylePrompts.professional;

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
        
        console.log('Football matches available:', matches.length);
        console.log('Looking for match ID:', matchId);
        
        match = matches.find(m => String(m.id || m.idEvent) === String(matchId));
        
        if (!match) {
          console.log('Match not found. Available IDs:', matches.map(m => m.id || m.idEvent));
          return res.status(404).json({ 
            error: 'Match not found',
            commentary: 'This match is no longer available. Please select another match.' 
          });
        }

        // Different commentary styles for football
        const stylePrompts = {
          professional: `You are a professional football commentator. Provide exciting commentary:

Match: ${match.strHomeTeam || 'Home Team'} vs ${match.strAwayTeam || 'Away Team'}
League: ${match.strLeague || 'Football Match'}
Status: ${match.isLive ? "🔴 LIVE NOW" : "Full Time"}
Score: ${match.strHomeTeam} ${match.intHomeScore || 0} - ${match.intAwayScore || 0} ${match.strAwayTeam}

Provide 4-5 sentences covering:
1. Current match situation and what's happening
2. Key moments and goalscorers if applicable
3. Tactical setup and formations
4. What to expect next (if live) or match summary (if finished)
5. Player performances and impact

Keep it exciting and professional.`,

          casual: `You're a passionate football fan watching the game:

${match.strHomeTeam} ${match.intHomeScore} - ${match.intAwayScore} ${match.strAwayTeam}
League: ${match.strLeague}
Status: ${match.isLive ? "🔥 LIVE!" : "Just Ended"}

Give 3-4 sentences like you're texting your mate about the game. Be enthusiastic, use casual language, reactions like "mate!", "what a game!", etc.`,

          analytical: `You are a football tactical analyst:

Match: ${match.strHomeTeam} vs ${match.strAwayTeam}
League: ${match.strLeague}
Score: ${match.intHomeScore} - ${match.intAwayScore}
Status: ${match.isLive ? "In Progress" : "Full Time"}

Provide 4-5 sentences of tactical analysis:
1. Formation and tactical approach of both teams
2. Key battles on the pitch
3. Possession and attacking patterns
4. Defensive organization
5. Strategic adjustments and their impact`,

          dramatic: `You are a dramatic football narrator:

${match.strHomeTeam} ${match.intHomeScore} - ${match.intAwayScore} ${match.strAwayTeam}
${match.strLeague}
${match.isLive ? "⚡ DRAMA UNFOLDING" : "Epic Encounter Complete"}

Give 3-4 sentences of DRAMATIC commentary! Build excitement, use powerful words, make every moment feel epic!`
        };

        prompt = stylePrompts[style] || stylePrompts.professional;

      } catch (error) {
        console.error('Error fetching football match:', error);
        return res.status(500).json({ 
          error: 'Failed to fetch match details',
          commentary: 'Unable to retrieve match information. Please try again.' 
        });
      }
    }

    // Validate Claude API key
    if (!process.env.CLAUDE_API_KEY) {
      console.error('CLAUDE_API_KEY is not configured');
      return res.status(500).json({ 
        error: 'Configuration error',
        commentary: 'AI commentary service is not configured. Please contact the administrator.' 
      });
    }

    // Call Claude API
    console.log(`🤖 Generating ${style} commentary for ${sport} match ${matchId}...`);
    
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.json().catch(() => ({}));
      console.error('Claude API error:', errorData);
      
      if (claudeResponse.status === 401) {
        return res.status(500).json({ 
          error: 'API authentication failed',
          commentary: 'AI commentary service authentication error. Please contact the administrator.' 
        });
      }
      
      if (claudeResponse.status === 429) {
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

    const data = await claudeResponse.json();
    const commentary = data.content?.[0]?.text || 'No commentary available at this moment.';

    console.log(`✅ Generated ${style} commentary successfully`);

    // Success response with metadata
    res.json({ 
      success: true,
      commentary,
      matchId,
      sport,
      isLive: match.isLive || false,
      style,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Commentary error:', error);
    res.status(500).json({ 
      error: 'Server error',
      commentary: 'Unable to generate commentary at this moment. Please try again shortly.' 
    });
  }
});

/**
 * @route   GET /api/ai-commentary/styles
 * @desc    Get available commentary styles
 * @access  Public
 */
router.get('/styles', (req, res) => {
  res.json({
    styles: [
      {
        id: 'professional',
        name: 'Professional',
        description: 'Standard professional sports commentary',
        icon: '🎙️'
      },
      {
        id: 'casual',
        name: 'Casual Fan',
        description: 'Fun, enthusiastic fan commentary',
        icon: '😄'
      },
      {
        id: 'analytical',
        name: 'Tactical Analysis',
        description: 'Deep tactical and strategic analysis',
        icon: '📊'
      },
      {
        id: 'dramatic',
        name: 'Dramatic',
        description: 'Exciting, dramatic narration',
        icon: '⚡'
      }
    ]
  });
});

export default router;