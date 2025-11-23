const express = require('express');
const router = express.Router();
const Match = require('../models/Match');

router.get('/live', async (req, res) => {
  try {
    const matches = await Match.find({ status: 'Live' });

    if (matches.length === 0) {
      return res.status(200).json({
        success: true,
        count: 4,
        data: [
          { 
            _id: '674175c5d8f9a1b2c3d4e5f6',
            sport: 'Football', league: 'Premier League',
            home: { name: 'Manchester United', score: 2, logo: '⚽' }, 
            away: { name: 'Liverpool', score: 1, logo: '⚽' }, 
            status: 'Live', minute: 67, possession: { home: 58, away: 42 },
            stats: { shots: [12, 8], corners: [6, 4], fouls: [8, 11] }
          },
          { 
            _id: '674175c5d8f9a1b2c3d4e5f7',
            sport: 'Basketball', league: 'NBA',
            home: { name: 'Lakers', score: 98, logo: '🏀' }, 
            away: { name: 'Warriors', score: 95, logo: '🏀' }, 
            status: 'Live', quarter: 'Q4 - 4:32',
            stats: { threePointers: [12, 15], rebounds: [42, 38], assists: [24, 28] }
          },
          { 
            _id: '674175c5d8f9a1b2c3d4e5f8',
            sport: 'Cricket', league: 'ODI',
            home: { name: 'India', score: '245/6', logo: '🏏' }, 
            away: { name: 'Australia', score: '180/4', logo: '🏏' }, 
            status: 'Live', over: '45.3',
            stats: { boundaries: [28, 22], sixes: [8, 5], runRate: [5.4, 6.2] }
          },
          { 
            _id: '674175c5d8f9a1b2c3d4e5f9',
            sport: 'Tennis', league: 'Wimbledon',
            home: { name: 'Djokovic', score: '6-4, 5-4', logo: '🎾' }, 
            away: { name: 'Federer', score: '4-6, 4-5', logo: '🎾' }, 
            status: 'Live', set: 'Set 2',
            stats: { aces: [12, 15], winners: [28, 32], unforced: [18, 22] }
          }
        ]
      });
    }

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }
    res.status(200).json({ success: true, data: match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;