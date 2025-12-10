import Sport from '../models/Sport.js';

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

// @desc    Get live cricket scores
// @route   GET /api/sports/cricket/live
// @access  Private
exports.getLiveCricketScores = async (req, res) => {
  try {
    // Mock data - Replace with actual API call to cricket API
    const mockCricketScores = [
      {
        id: '1',
        name: 'India vs Australia',
        matchType: 'ODI',
        status: 'LIVE',
        venue: 'Melbourne Cricket Ground',
        score: [
          { inning: 'India', r: 245, w: 6, o: 50 },
          { inning: 'Australia', r: 180, w: 4, o: 45 }
        ]
      },
      {
        id: '2',
        name: 'England vs New Zealand',
        matchType: 'T20',
        status: 'LIVE',
        venue: 'Lord\'s',
        score: [
          { inning: 'England', r: 178, w: 7, o: 20 },
          { inning: 'New Zealand', r: 145, w: 5, o: 18 }
        ]
      }
    ];

    res.status(200).json({
      success: true,
      data: mockCricketScores
    });
  } catch (error) {
    console.error('Error fetching cricket scores:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cricket scores',
      error: error.message
    });
  }
};

// @desc    Get live football scores
// @route   GET /api/sports/football/live
// @access  Private
exports.getLiveFootballScores = async (req, res) => {
  try {
    // Mock data - Replace with actual API call to football API
    const mockFootballScores = [
      {
        id: '1',
        league: {
          name: 'Premier League',
          logo: 'https://media.api-sports.io/football/leagues/39.png'
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
          long: '2nd Half',
          elapsed: 67
        }
      },
      {
        id: '2',
        league: {
          name: 'La Liga',
          logo: 'https://media.api-sports.io/football/leagues/140.png'
        },
        teams: {
          home: {
            name: 'Real Madrid',
            logo: 'https://media.api-sports.io/football/teams/541.png'
          },
          away: {
            name: 'Barcelona',
            logo: 'https://media.api-sports.io/football/teams/529.png'
          }
        },
        goals: {
          home: 1,
          away: 1
        },
        score: {
          halftime: {
            home: 0,
            away: 1
          }
        },
        status: {
          short: 'LIVE',
          long: '2nd Half',
          elapsed: 82
        }
      }
    ];

    res.status(200).json({
      success: true,
      data: mockFootballScores
    });
  } catch (error) {
    console.error('Error fetching football scores:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching football scores',
      error: error.message
    });
  }
};