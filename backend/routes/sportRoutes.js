// backend/routes/sportRoutes.js
import express from 'express';
import {
  deleteSport,
  getAllSports,
  createSport
} from '../controllers/sportController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
const router = express.Router();

// Mock Cricket Data
const getMockCricketMatches = () => ({
  success: true,
  isLive: true,
  data: [
    {
      id: "cricket-1",
      name: "India vs Australia - 3rd Test Match",
      isLive: true,
      matchType: "Test",
      score: [
        { inning: "India", r: 328, w: 8, o: 90 },
        { inning: "Australia", r: 145, w: 3, o: 42 }
      ]
    },
    {
      id: "cricket-2",
      name: "England vs Pakistan - T20 International",
      isLive: false,
      matchType: "T20",
      score: [
        { inning: "England", r: 185, w: 6, o: 20 },
        { inning: "Pakistan", r: 178, w: 8, o: 20 }
      ]
    },
    {
      id: "cricket-3",
      name: "South Africa vs New Zealand - ODI Series",
      isLive: true,
      matchType: "ODI",
      score: [
        { inning: "South Africa", r: 287, w: 7, o: 50 },
        { inning: "New Zealand", r: 156, w: 4, o: 28 }
      ]
    },
    {
      id: "cricket-4",
      name: "West Indies vs Bangladesh - Test",
      isLive: false,
      matchType: "Test",
      score: [
        { inning: "West Indies", r: 412, w: 10, o: 110 },
        { inning: "Bangladesh", r: 389, w: 9, o: 105 }
      ]
    }
  ]
});

// Mock Football Data
const getMockFootballMatches = () => ({
  success: true,
  isLive: true,
  data: [
    {
      id: "football-1",
      idEvent: "football-1",
      strHomeTeam: "Manchester United",
      strAwayTeam: "Liverpool",
      strLeague: "Premier League",
      intHomeScore: 2,
      intAwayScore: 2,
      isLive: true,
      strStatus: "In Play"
    },
    {
      id: "football-2",
      idEvent: "football-2",
      strHomeTeam: "Real Madrid",
      strAwayTeam: "Barcelona",
      strLeague: "La Liga",
      intHomeScore: 3,
      intAwayScore: 1,
      isLive: false,
      strStatus: "Full Time"
    },
    {
      id: "football-3",
      idEvent: "football-3",
      strHomeTeam: "Bayern Munich",
      strAwayTeam: "Borussia Dortmund",
      strLeague: "Bundesliga",
      intHomeScore: 1,
      intAwayScore: 1,
      isLive: true,
      strStatus: "In Play"
    },
    {
      id: "football-4",
      idEvent: "football-4",
      strHomeTeam: "PSG",
      strAwayTeam: "Marseille",
      strLeague: "Ligue 1",
      intHomeScore: 4,
      intAwayScore: 0,
      isLive: false,
      strStatus: "Full Time"
    },
    {
      id: "football-5",
      idEvent: "football-5",
      strHomeTeam: "Juventus",
      strAwayTeam: "AC Milan",
      strLeague: "Serie A",
      intHomeScore: 2,
      intAwayScore: 1,
      isLive: true,
      strStatus: "In Play"
    }
  ]
});

// Get live cricket matches
router.get('/cricket/live', protect, async (req, res) => {
  try {
    console.log('📊 Fetching cricket matches (using mock data)...');
    
    // Return mock data for testing
    const mockData = getMockCricketMatches();
    console.log(`✅ Returning ${mockData.data.length} cricket matches`);
    
    res.json(mockData);
  } catch (error) {
    console.error('❌ Error fetching cricket scores:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching cricket scores',
      data: [],
      isLive: false
    });
  }
});

// Get live football matches
router.get('/football/live', protect, async (req, res) => {
  try {
    console.log('⚽ Fetching football matches (using mock data)...');
    
    // Return mock data for testing
    const mockData = getMockFootballMatches();
    console.log(`✅ Returning ${mockData.data.length} football matches`);
    
    res.json(mockData);
  } catch (error) {
    console.error('❌ Error fetching football scores:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching football scores',
      data: [],
      isLive: false
    });
  }
});

router.route('/').get(getAllSports).post(protect, authorize('admin'), createSport);
router.route('/:id').delete(protect, authorize('admin'), deleteSport);

export default router;