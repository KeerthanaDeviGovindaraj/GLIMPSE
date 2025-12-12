// controllers/sportController.js - Smart: Shows Live OR Recent Matches
import axios from 'axios';

// TheSportsDB API
const THESPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json';
const API_KEY = process.env.THESPORTSDB_API_KEY || '3';

// CricAPI for Cricket
const CRICKET_API_KEY = process.env.CRICKET_API_KEY;
const CRICKET_API_URL = 'https://api.cricapi.com/v1/currentMatches';

// Get Live OR Recent Cricket Matches
export const getLiveCricketMatches = async (req, res) => {
  try {
    if (!CRICKET_API_KEY) {
      console.log('⚠️ Cricket API key not configured');
      return res.json({ 
        success: true, 
        data: [], 
        message: 'API key not configured',
        isLive: false
      });
    }

    const response = await axios.get(CRICKET_API_URL, {
      params: { apikey: CRICKET_API_KEY, offset: 0 },
      timeout: 10000
    });

    if (response.data?.data) {
      // First try to get LIVE matches
      const liveMatches = response.data.data.filter(m => m.matchStarted && !m.matchEnded);
      
      if (liveMatches.length > 0) {
        console.log(`✅ Found ${liveMatches.length} LIVE cricket matches`);
        return res.json({ 
          success: true, 
          data: liveMatches, 
          message: `${liveMatches.length} live matches`,
          isLive: true
        });
      }
      
      // If no live matches, get recent completed matches
      const recentMatches = response.data.data
        .filter(m => m.matchEnded)
        .slice(0, 5); // Get last 5 completed
      
      if (recentMatches.length > 0) {
        console.log(`📊 No live cricket matches, showing ${recentMatches.length} recent results`);
        return res.json({ 
          success: true, 
          data: recentMatches, 
          message: `${recentMatches.length} recent matches`,
          isLive: false
        });
      }
    }
    
    // No matches at all
    res.json({ 
      success: true, 
      data: [], 
      message: 'No matches available',
      isLive: false
    });
    
  } catch (error) {
    console.error('❌ Cricket API error:', error.message);
    res.json({ 
      success: true, 
      data: [], 
      message: 'Failed to fetch matches',
      isLive: false
    });
  }
};

// Get Live OR Recent Football Matches
export const getLiveFootballMatches = async (req, res) => {
  try {
    console.log('⚽ Fetching football matches from TheSportsDB...');
    
    // Major league IDs
    const leagueIds = [
      '4328', // Premier League
      '4335', // La Liga
      '4331', // Serie A
      '4332', // Bundesliga
      '4346', // Ligue 1
    ];

    let liveMatches = [];
    let recentMatches = [];

    // Check each league for LIVE matches
    for (const leagueId of leagueIds) {
      try {
        // Try to get live scores first
        const liveResponse = await axios.get(
          `${THESPORTSDB_BASE}/${API_KEY}/livescore.php?l=${leagueId}`,
          { timeout: 5000 }
        );

        if (liveResponse.data?.events) {
          liveMatches = [...liveMatches, ...liveResponse.data.events];
        }
      } catch (err) {
        console.log(`⚠️ League ${leagueId} live fetch failed:`, err.message);
      }
    }

    // If we have LIVE matches, return them!
    if (liveMatches.length > 0) {
      console.log(`✅ Found ${liveMatches.length} LIVE football matches`);
      
      const mappedLive = liveMatches.map(match => ({
        id: match.idEvent,
        strEvent: match.strEvent,
        strHomeTeam: match.strHomeTeam,
        strAwayTeam: match.strAwayTeam,
        intHomeScore: match.intHomeScore || '0',
        intAwayScore: match.intAwayScore || '0',
        strStatus: 'LIVE',
        strProgress: match.strProgress || '0\'',
        strLeague: match.strLeague,
        strHomeTeamBadge: match.strHomeTeamBadge || 'https://www.thesportsdb.com/images/media/team/badge/default.png',
        strAwayTeamBadge: match.strAwayTeamBadge || 'https://www.thesportsdb.com/images/media/team/badge/default.png',
        strLeagueBadge: match.strLeagueBadge || 'https://www.thesportsdb.com/images/media/league/badge/default.png',
        isLive: true
      }));

      return res.json({
        success: true,
        data: mappedLive,
        message: `${mappedLive.length} live matches`,
        isLive: true
      });
    }

    // No live matches - fetch RECENT results instead
    console.log('📊 No live matches, fetching recent results...');
    
    for (const leagueId of leagueIds) {
      try {
        // Get last 5 events for this league
        const recentResponse = await axios.get(
          `${THESPORTSDB_BASE}/${API_KEY}/eventspastleague.php?id=${leagueId}`,
          { timeout: 5000 }
        );

        if (recentResponse.data?.events) {
          // Get the 5 most recent completed matches
          const last5 = recentResponse.data.events.slice(0, 5);
          recentMatches = [...recentMatches, ...last5];
        }
      } catch (err) {
        console.log(`⚠️ League ${leagueId} recent fetch failed:`, err.message);
      }
    }

    // If we have recent matches, return them
    if (recentMatches.length > 0) {
      console.log(`📊 Showing ${recentMatches.length} recent football results`);
      
      // Sort by date (most recent first)
      recentMatches.sort((a, b) => {
        const dateA = new Date(a.dateEvent + ' ' + a.strTime);
        const dateB = new Date(b.dateEvent + ' ' + b.strTime);
        return dateB - dateA;
      });
      
      const mappedRecent = recentMatches.slice(0, 10).map(match => ({
        id: match.idEvent,
        strEvent: match.strEvent,
        strHomeTeam: match.strHomeTeam,
        strAwayTeam: match.strAwayTeam,
        intHomeScore: match.intHomeScore || '0',
        intAwayScore: match.intAwayScore || '0',
        strStatus: 'FT', // Full Time
        strProgress: 'FT',
        strLeague: match.strLeague,
        strHomeTeamBadge: match.strHomeTeamBadge || match.strThumb || 'https://www.thesportsdb.com/images/media/team/badge/default.png',
        strAwayTeamBadge: match.strAwayTeamBadge || 'https://www.thesportsdb.com/images/media/team/badge/default.png',
        strLeagueBadge: match.strLeagueBadge || 'https://www.thesportsdb.com/images/media/league/badge/default.png',
        dateEvent: match.dateEvent,
        strTime: match.strTime,
        isLive: false
      }));

      return res.json({
        success: true,
        data: mappedRecent,
        message: `${mappedRecent.length} recent results`,
        isLive: false
      });
    }

    // No matches at all (very rare!)
    console.log('⚠️ No live or recent matches found');
    res.json({
      success: true,
      data: [],
      message: 'No matches available',
      isLive: false
    });

  } catch (error) {
    console.error('❌ Football API error:', error.message);
    res.json({
      success: true,
      data: [],
      message: 'Failed to fetch matches',
      isLive: false
    });
  }
};