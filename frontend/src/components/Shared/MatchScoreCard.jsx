// components/MatchScoreCard.jsx
import React from 'react';
import { Clock, MapPin, TrendingUp } from 'lucide-react';
import LiveIndicator from './LiveIndicator';

const MatchScoreCard = ({ match, onClick, showDetails = true }) => {
  const { 
    sport, 
    league, 
    team1, 
    team2, 
    score1, 
    score2, 
    status, 
    time, 
    isLive,
    venue 
  } = match;

  // Get team initials
  const getTeamInitials = (teamName) => {
    return teamName
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 3)
      .toUpperCase();
  };

  // Get sport icon/emoji
  const getSportIcon = (sportType) => {
    const icons = {
      football: '⚽',
      basketball: '🏀',
      cricket: '🏏',
      tennis: '🎾',
      rugby: '🏉'
    };
    return icons[sportType] || '⚽';
  };

  // Determine winning team
  const getWinningTeam = () => {
    if (score1 > score2) return 'team1';
    if (score2 > score1) return 'team2';
    return null;
  };

  const winningTeam = getWinningTeam();

  return (
    <div 
      onClick={onClick}
      className={`bg-gray-800/50 border ${
        isLive ? 'border-red-600/50 shadow-lg shadow-red-600/10' : 'border-gray-700/50'
      } rounded-xl p-5 hover:border-red-600/50 transition-all cursor-pointer group`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getSportIcon(sport)}</span>
          <div>
            <span className="text-gray-400 text-sm font-medium capitalize">{sport}</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">{league}</span>
            </div>
          </div>
        </div>
        <LiveIndicator isLive={isLive} size="sm" />
      </div>

      {/* Teams and Scores */}
      <div className="space-y-3 mb-4">
        {/* Team 1 */}
        <div className={`flex items-center justify-between p-3 rounded-lg ${
          winningTeam === 'team1' ? 'bg-green-900/20 border border-green-700/30' : 'bg-gray-900/30'
        }`}>
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
              winningTeam === 'team1' ? 'bg-green-600' : 'bg-red-600'
            }`}>
              {getTeamInitials(team1)}
            </div>
            <span className="text-white font-semibold group-hover:text-red-400 transition-colors">
              {team1}
            </span>
            {winningTeam === 'team1' && (
              <TrendingUp className="w-4 h-4 text-green-500" />
            )}
          </div>
          <span className={`text-3xl font-bold ${
            isLive ? 'text-red-500' : 'text-gray-400'
          }`}>
            {score1}
          </span>
        </div>

        {/* Team 2 */}
        <div className={`flex items-center justify-between p-3 rounded-lg ${
          winningTeam === 'team2' ? 'bg-green-900/20 border border-green-700/30' : 'bg-gray-900/30'
        }`}>
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
              winningTeam === 'team2' ? 'bg-green-600' : 'bg-blue-600'
            }`}>
              {getTeamInitials(team2)}
            </div>
            <span className="text-white font-semibold group-hover:text-red-400 transition-colors">
              {team2}
            </span>
            {winningTeam === 'team2' && (
              <TrendingUp className="w-4 h-4 text-green-500" />
            )}
          </div>
          <span className={`text-3xl font-bold ${
            isLive ? 'text-red-500' : 'text-gray-400'
          }`}>
            {score2}
          </span>
        </div>
      </div>

      {/* Footer */}
      {showDetails && (
        <div className="pt-3 border-t border-gray-700/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>{time || status}</span>
            </div>
            {venue && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span className="truncate max-w-[150px]">{venue}</span>
              </div>
            )}
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            status === 'live' ? 'bg-red-600/20 text-red-500' :
            status === 'finished' ? 'bg-gray-600/20 text-gray-400' :
            'bg-blue-600/20 text-blue-400'
          }`}>
            {status.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
};

export default MatchScoreCard;