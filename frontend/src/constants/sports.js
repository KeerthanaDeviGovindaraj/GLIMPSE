export const SPORTS = [
  {
    id: 'football',
    name: 'Football',
    icon: '⚽',
    color: '#10b981',
    leagues: ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1']
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: '🏀',
    color: '#f97316',
    leagues: ['NBA', 'EuroLeague', 'NCAA']
  },
  {
    id: 'cricket',
    name: 'Cricket',
    icon: '🏏',
    color: '#3b82f6',
    leagues: ['IPL', 'Test Series', 'ODI', 'T20']
  },
  {
    id: 'tennis',
    name: 'Tennis',
    icon: '🎾',
    color: '#eab308',
    leagues: ['Wimbledon', 'US Open', 'French Open', 'Australian Open']
  },
  {
    id: 'rugby',
    name: 'Rugby',
    icon: '🏉',
    color: '#8b5cf6',
    leagues: ['Six Nations', 'Rugby Championship', 'Super Rugby']
  }
];

export const getSportById = (sportId) => {
  return SPORTS.find(sport => sport.id === sportId);
};

export const getSportColor = (sportId) => {
  const sport = getSportById(sportId);
  return sport ? sport.color : COLORS.primary.red;
};

export const getSportIcon = (sportId) => {
  const sport = getSportById(sportId);
  return sport ? sport.icon : '🏆';
};
