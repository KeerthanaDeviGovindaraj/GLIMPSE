import axios from 'axios';

// ==================== CRICKET API ====================
export const getLiveCricketMatches = async (req, res) => {
  try {
    const response = await axios.get('https://api.cricapi.com/v1/currentMatches', {
      params: {
        apikey: process.env.CRICKET_API_KEY,
        offset: 0
      }
    });

    const matches = response.data.data.map(match => ({
      id: match.id,
      name: match.name,
      matchType: match.matchType,
      status: match.status,
      venue: match.venue,
      date: match.date,
      teams: [match.teams[0], match.teams[1]],
      score: match.score ? [
        {
          inning: match.teams[0],
          r: match.score[0]?.r || 0,
          w: match.score[0]?.w || 0,
          o: match.score[0]?.o || 0
        },
        {
          inning: match.teams[1],
          r: match.score[1]?.r || 0,
          w: match.score[1]?.w || 0,
          o: match.score[1]?.o || 0
        }
      ] : []
    }));

    res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error('Cricket API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cricket matches'
    });
  }
};

// ==================== FOOTBALL API ====================
export const getLiveFootballMatches = async (req, res) => {
  try {
    const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
      params: {
        live: 'all' // Get all live matches
      },
      headers: {
        'X-RapidAPI-Key': process.env.FOOTBALL_API_KEY,
        'X-RapidAPI-Host': process.env.RAPID_API_HOST
      }
    });

    const matches = response.data.response.map(match => ({
      id: match.fixture.id,
      league: {
        name: match.league.name,
        logo: match.league.logo,
        country: match.league.country
      },
      teams: {
        home: {
          name: match.teams.home.name,
          logo: match.teams.home.logo
        },
        away: {
          name: match.teams.away.name,
          logo: match.teams.away.logo
        }
      },
      goals: {
        home: match.goals.home,
        away: match.goals.away
      },
      score: {
        halftime: {
          home: match.score.halftime.home,
          away: match.score.halftime.away
        }
      },
      status: {
        short: match.fixture.status.short,
        long: match.fixture.status.long,
        elapsed: match.fixture.status.elapsed
      }
    }));

    res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error('Football API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch football matches'
    });
  }
};

// ==================== GET SPECIFIC MATCH DETAILS ====================
export const getCricketMatchDetails = async (req, res) => {
  try {
    const { matchId } = req.params;
    
    const response = await axios.get(`https://api.cricapi.com/v1/match_info`, {
      params: {
        apikey: process.env.CRICKET_API_KEY,
        id: matchId
      }
    });

    res.json({
      success: true,
      data: response.data.data
    });
  } catch (error) {
    console.error('Cricket Match Details Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch match details'
    });
  }
};