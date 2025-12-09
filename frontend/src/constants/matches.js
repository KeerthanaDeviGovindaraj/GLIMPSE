export const MATCH_STATUS = {
  UPCOMING: 'upcoming',
  LIVE: 'live',
  FINISHED: 'finished'
};

export const MATCH_STATUS_LABELS = {
  [MATCH_STATUS.UPCOMING]: 'Upcoming',
  [MATCH_STATUS.LIVE]: 'Live',
  [MATCH_STATUS.FINISHED]: 'Finished'
};

export const MATCH_STATUS_COLORS = {
  [MATCH_STATUS.UPCOMING]: '#3b82f6',  // Blue
  [MATCH_STATUS.LIVE]: '#ef4444',      // Red
  [MATCH_STATUS.FINISHED]: '#6b7280'   // Gray
};

export const LEAGUES = {
  football: [
    'Premier League',
    'La Liga',
    'Serie A',
    'Bundesliga',
    'Ligue 1',
    'Champions League'
  ],
  basketball: [
    'NBA',
    'EuroLeague',
    'NCAA',
    'FIBA'
  ],
  cricket: [
    'IPL',
    'Test Series',
    'ODI',
    'T20 World Cup',
    'The Ashes'
  ],
  tennis: [
    'Wimbledon',
    'US Open',
    'French Open',
    'Australian Open',
    'ATP Tour'
  ],
  rugby: [
    'Six Nations',
    'Rugby Championship',
    'Super Rugby',
    'Rugby World Cup'
  ]
};

export const COMMENTARY_TYPES = {
  GOAL: 'goal',
  CARD: 'card',
  SUBSTITUTION: 'substitution',
  HIGHLIGHT: 'highlight',
  ALERT: 'alert',
  ANALYSIS: 'analysis',
  DEFAULT: 'default'
};

export const COMMENTARY_LABELS = {
  [COMMENTARY_TYPES.GOAL]: 'GOAL',
  [COMMENTARY_TYPES.CARD]: 'CARD',
  [COMMENTARY_TYPES.SUBSTITUTION]: 'SUB',
  [COMMENTARY_TYPES.HIGHLIGHT]: 'HIGHLIGHT',
  [COMMENTARY_TYPES.ALERT]: 'ALERT',
  [COMMENTARY_TYPES.ANALYSIS]: 'ANALYSIS',
  [COMMENTARY_TYPES.DEFAULT]: 'COMMENT'
};

// Match time helpers
export const formatMatchTime = (time) => {
  if (!time) return '0:00';
  if (typeof time === 'string' && time.includes(':')) return time;
  return `${time}'`;
};

export const getMatchStatusBadgeClass = (status) => {
  const baseClass = 'px-3 py-1 rounded-full text-xs font-semibold';
  const statusClasses = {
    [MATCH_STATUS.LIVE]: 'bg-red-600/20 text-red-500 border border-red-600/30',
    [MATCH_STATUS.UPCOMING]: 'bg-blue-600/20 text-blue-500 border border-blue-600/30',
    [MATCH_STATUS.FINISHED]: 'bg-gray-600/20 text-gray-400 border border-gray-600/30'
  };
  return `${baseClass} ${statusClasses[status] || statusClasses[MATCH_STATUS.UPCOMING]}`;
};