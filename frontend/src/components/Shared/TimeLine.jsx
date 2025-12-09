// components/TimeLine.jsx
import React from 'react';
import { Clock, CheckCircle, Circle, AlertCircle } from 'lucide-react';

const TimeLine = ({ matches = [] }) => {
  // Group matches by time/status
  const groupedMatches = {
    live: matches.filter(m => m.isLive),
    upcoming: matches.filter(m => m.status === 'upcoming'),
    finished: matches.filter(m => m.status === 'finished')
  };

  const TimelineItem = ({ match, status }) => {
    const getStatusConfig = () => {
      switch (status) {
        case 'live':
          return {
            icon: <AlertCircle className="w-5 h-5 text-red-500" />,
            color: 'border-red-500 bg-red-500/10',
            dotColor: 'bg-red-500',
            textColor: 'text-red-500'
          };
        case 'upcoming':
          return {
            icon: <Clock className="w-5 h-5 text-blue-500" />,
            color: 'border-blue-500 bg-blue-500/10',
            dotColor: 'bg-blue-500',
            textColor: 'text-blue-500'
          };
        case 'finished':
          return {
            icon: <CheckCircle className="w-5 h-5 text-gray-500" />,
            color: 'border-gray-500 bg-gray-500/10',
            dotColor: 'bg-gray-500',
            textColor: 'text-gray-500'
          };
        default:
          return {
            icon: <Circle className="w-5 h-5 text-gray-500" />,
            color: 'border-gray-500 bg-gray-500/10',
            dotColor: 'bg-gray-500',
            textColor: 'text-gray-500'
          };
      }
    };

    const config = getStatusConfig();

    return (
      <div className="flex gap-4 group">
        {/* Timeline Line */}
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full border-2 ${config.color} flex items-center justify-center`}>
            {config.icon}
          </div>
          <div className={`w-0.5 h-full ${config.dotColor} opacity-30`}></div>
        </div>

        {/* Content */}
        <div className="flex-1 pb-8">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 hover:border-red-600/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-white font-semibold">
                  {match.team1} vs {match.team2}
                </h4>
                <p className="text-gray-400 text-sm">
                  {match.league} • {match.sport}
                </p>
              </div>
              {match.isLive && (
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`text-2xl font-bold ${match.isLive ? 'text-red-500' : 'text-gray-400'}`}>
                  {match.score1} - {match.score2}
                </div>
                <div className={`text-sm ${config.textColor} font-medium`}>
                  {match.time}
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full ${config.color} ${config.textColor} font-semibold`}>
                {status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-red-500" />
        <h3 className="text-xl font-bold text-white">Match Timeline</h3>
      </div>

      <div className="space-y-1">
        {/* Live Matches */}
        {groupedMatches.live.length > 0 && (
          <div>
            <h4 className="text-red-500 font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Live Now ({groupedMatches.live.length})
            </h4>
            {groupedMatches.live.map(match => (
              <TimelineItem key={match._id} match={match} status="live" />
            ))}
          </div>
        )}

        {/* Upcoming Matches */}
        {groupedMatches.upcoming.length > 0 && (
          <div>
            <h4 className="text-blue-500 font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Upcoming ({groupedMatches.upcoming.length})
            </h4>
            {groupedMatches.upcoming.map(match => (
              <TimelineItem key={match._id} match={match} status="upcoming" />
            ))}
          </div>
        )}

        {/* Finished Matches */}
        {groupedMatches.finished.length > 0 && (
          <div>
            <h4 className="text-gray-500 font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Finished ({groupedMatches.finished.length})
            </h4>
            {groupedMatches.finished.slice(0, 5).map(match => (
              <TimelineItem key={match._id} match={match} status="finished" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {matches.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No matches to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Compact horizontal timeline
export const CompactTimeLine = ({ matches = [] }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
      <h3 className="text-white font-semibold mb-4">Today's Matches</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {matches.map(match => (
          <div
            key={match._id}
            className="min-w-[200px] bg-gray-900/50 border border-gray-700 rounded-lg p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">{match.time}</span>
              {match.isLive && (
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </div>
            <div className="text-sm text-white font-medium mb-1">
              {match.team1} vs {match.team2}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{match.league}</span>
              <span className={`text-sm font-bold ${match.isLive ? 'text-red-500' : 'text-gray-400'}`}>
                {match.score1} - {match.score2}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeLine;