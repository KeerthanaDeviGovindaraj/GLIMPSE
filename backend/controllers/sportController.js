// backend/controllers/sportsController.js - Real Live Data
import axios from 'axios';
import Sport from '../models/Sport.js';

// ==================== CRICKET - REAL LIVE DATA ====================
export const getLiveCricketMatches = async (req, res) => {
  try {
    const CRICKET_API_KEY = process.env.CRICKET_API_KEY;
    
    if (!CRICKET_API_KEY) {
      console.log('⚠️ Cricket API key not configured, returning mock data');
      
      return res.json({
        success: true,
        data: [
          {
            id: 'mock-1',
            name: 'India vs Australia',
            matchType: 'ODI',
            status: 'Live',
            venue: 'Melbourne Cricket Ground',
            teams: ['India', 'Australia'],
            score: [
              { inning: 'India', r: 245, w: 6, o: 50 },
              { inning: 'Australia', r: 180, w: 4, o: 45 }
            ]
          }
        ]
      });
    }

    console.log('🏏 Fetching REAL cricket data from CricAPI...');
    
    const response = await axios.get('https://api.cricapi.com/v1/currentMatches', {
      params: {
        apikey: CRICKET_API_KEY,
        offset: 0
      },
      timeout: 10000
    });

    if (!response.data?.data) {
      throw new Error('Invalid API response');
    }

    const allMatches = response.data.data;
    
    // First: Try to get LIVE matches
    let liveMatches = allMatches.filter(m => m.matchStarted && !m.matchEnded);
    
    if (liveMatches.length > 0) {
      console.log(`✅ Found ${liveMatches.length} LIVE cricket matches!`);
      
      const transformed = liveMatches.slice(0, 10).map(match => ({
        id: match.id,
        name: match.name,
        matchType: match.matchType,
        status: 'Live',
        venue: match.venue || 'TBA',
        teams: [
          match.teamInfo?.[0]?.name || match.teams?.[0] || 'Team 1',
          match.teamInfo?.[1]?.name || match.teams?.[1] || 'Team 2'
        ],
        score: match.score?.map((s, idx) => ({
          inning: match.teamInfo?.[idx]?.name || match.teams?.[idx] || s.inning,
          r: s.r || 0,
          w: s.w || 0,
          o: parseFloat(s.o || 0)
        })) || []
      }));

      return res.json({
        success: true,
        data: transformed
      });
    }

    // Second: Get recent completed matches
    const recentMatches = allMatches.filter(m => m.matchEnded).slice(0, 5);
    
    if (recentMatches.length > 0) {
      console.log(`📊 No live cricket, showing ${recentMatches.length} recent results`);
      
      const transformed = recentMatches.map(match => ({
        id: match.id,
        name: match.name,
        matchType: match.matchType,
        status: 'Completed',
        venue: match.venue || 'TBA',
        teams: [
          match.teamInfo?.[0]?.name || match.teams?.[0] || 'Team 1',
          match.teamInfo?.[1]?.name || match.teams?.[1] || 'Team 2'
        ],
        score: match.score?.map((s, idx) => ({
          inning: match.teamInfo?.[idx]?.name || match.teams?.[idx] || s.inning,
          r: s.r || 0,
          w: s.w || 0,
          o: parseFloat(s.o || 0)
        })) || []
      }));

      return res.json({
        success: true,
        data: transformed
      });
    }

    // No matches available
    console.log('⚠️ No cricket matches available');
    res.json({
      success: true,
      data: []
    });

  } catch (error) {
    console.error('❌ Cricket API error:', error.message);
    res.json({
      success: true,
      data: []
    });
  }
};

// ==================== FOOTBALL - REAL LIVE DATA ====================
export const getLiveFootballMatches = async (req, res) => {
  try {
    const FOOTBALL_API_KEY = process.env.FOOTBALL_API_KEY;
    const RAPID_API_HOST = process.env.RAPID_API_HOST || 'api-football-v1.p.rapidapi.com';

    if (!FOOTBALL_API_KEY) {
      console.log('⚠️ Football API key not configured, returning mock data');
      
      return res.json({
        success: true,
        data: [
          {
            id: 'mock-101',
            league: {
              name: 'Premier League',
              logo: 'https://media.api-sports.io/football/leagues/39.png',
              country: 'England'
            },
            teams: {
              home: {
                name: 'Manchester United',
                logo: 'https://media.api-sports.io/football/teams/33.png'
              },
              away: {
                name: 'Liverpool',
                logo: 'https://media.api-sports.io/football/teams/40.png'
              }
            },
            goals: {
              home: 2,
              away: 1
            },
            score: {
              halftime: {
                home: 1,
                away: 0
              }
            },
            status: {
              short: 'LIVE',
              long: 'In Play',
              elapsed: 67
            }
          }
        ]
      });
    }

    console.log('⚽ Fetching REAL football data from API-Football...');

    // Get ALL live matches
    const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
      params: {
        live: 'all' // Get all currently live matches
      },
      headers: {
        'X-RapidAPI-Key': FOOTBALL_API_KEY,
        'X-RapidAPI-Host': RAPID_API_HOST
      },
      timeout: 10000
    });

    if (!response.data?.response) {
      throw new Error('Invalid API response');
    }

    let matches = response.data.response;

    // If no live matches, get today's matches
    if (matches.length === 0) {
      console.log('📊 No live football, fetching today\'s matches...');
      
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      const todayResponse = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
        params: {
          date: today,
          league: '39,140,135', // Premier League, La Liga, Serie A
          season: new Date().getFullYear()
        },
        headers: {
          'X-RapidAPI-Key': FOOTBALL_API_KEY,
          'X-RapidAPI-Host': RAPID_API_HOST
        },
        timeout: 10000
      });

      matches = todayResponse.data?.response || [];
      console.log(`📊 Found ${matches.length} matches today`);
    } else {
      console.log(`✅ Found ${matches.length} LIVE football matches!`);
    }

    // Transform to frontend format and remove duplicates
    const transformedMatches = matches
      .filter(match => match.fixture?.id) // Ensure valid match
      .map(match => ({
        id: match.fixture.id.toString(),
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
            home: match.score?.halftime?.home,
            away: match.score?.halftime?.away
          }
        },
        status: {
          short: match.fixture.status.short,
          long: match.fixture.status.long,
          elapsed: match.fixture.status.elapsed || 0
        }
      }));

    // Remove duplicates by ID
    const uniqueMatches = transformedMatches.filter((match, index, self) =>
      index === self.findIndex((m) => m.id === match.id)
    );

    console.log(`✅ Returning ${uniqueMatches.length} unique football matches`);

    res.json({
      success: true,
      data: uniqueMatches
    });

  } catch (error) {
    console.error('❌ Football API error:', error.message);
    
    // Return mock data on error
    res.json({
      success: true,
      data: [
        {
          id: 'fallback-1',
          league: {
            name: 'Premier League',
            logo: 'https://media.api-sports.io/football/leagues/39.png',
            country: 'England'
          },
          teams: {
            home: {
              name: 'Manchester United',
              logo: 'https://media.api-sports.io/football/teams/33.png'
            },
            away: {
              name: 'Liverpool',
              logo: 'https://media.api-sports.io/football/teams/40.png'
            }
          },
          goals: {
            home: 2,
            away: 1
          },
          score: {
            halftime: {
              home: 1,
              away: 0
            }
          },
          status: {
            short: 'LIVE',
            long: 'In Play',
            elapsed: 67
          }
        }
      ]
    });
  }
};

// @desc    Get all sports
// @route   GET /api/sports
// @access  Public
export const getSports = async (req, res) => {
  try {
    const sports = await Sport.find({});
    res.json(sports);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a sport
// @route   POST /api/sports
// @access  Admin
export const createSport = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const sport = new Sport({ name });
    const createdSport = await sport.save();
    res.status(201).json(createdSport);
  } catch (error) {
    res.status(400).json({ message: 'Error creating sport', error: error.message });
  }
};

// @desc    Delete a sport
// @route   DELETE /api/sports/:id
// @access  Admin
export const deleteSport = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);

    if (sport) {
      await sport.deleteOne();
      res.json({ message: 'Sport removed' });
    } else {
      res.status(404).json({ message: 'Sport not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all sports
// @route   GET /api/sports
// @access  Public
export const getAllSports = async (req, res) => {
  try {
    const sports = await Sport.find({}).sort({ name: 1 });
    res.json(sports);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};