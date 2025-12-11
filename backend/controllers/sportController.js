// Mock data controller for testing

export const getLiveCricketMatches = async (req, res) => {
  try {
    const mockMatches = [
      {
        id: '1',
        name: 'India vs Australia',
        matchType: 'ODI',
        status: 'Live',
        venue: 'Melbourne Cricket Ground',
        teams: ['India', 'Australia'],
        score: [
          { inning: 'India', r: 245, w: 6, o: 50 },
          { inning: 'Australia', r: 180, w: 4, o: 45 }
        ]
      },
      {
        id: '2',
        name: 'England vs Pakistan',
        matchType: 'T20',
        status: 'Live',
        venue: 'Lord\'s Cricket Ground',
        teams: ['England', 'Pakistan'],
        score: [
          { inning: 'England', r: 165, w: 8, o: 20 },
          { inning: 'Pakistan', r: 142, w: 5, o: 18 }
        ]
      }
    ];

    res.json({
      success: true,
      data: mockMatches
    });
  } catch (error) {
    console.error('Cricket API Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cricket matches'
    });
  }
};

export const getLiveFootballMatches = async (req, res) => {
  try {
    const mockMatches = [
      {
        id: '101',
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
      },
      {
        id: '102',
        league: {
          name: 'La Liga',
          logo: 'https://media.api-sports.io/football/leagues/140.png',
          country: 'Spain'
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
          home: 3,
          away: 3
        },
        score: {
          halftime: {
            home: 2,
            away: 1
          }
        },
        status: {
          short: 'LIVE',
          long: 'In Play',
          elapsed: 82
        }
      }
    ];

    res.json({
      success: true,
      data: mockMatches
    });
  } catch (error) {
    console.error('Football API Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch football matches'
    });
  }
};