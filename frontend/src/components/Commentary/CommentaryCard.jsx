// components/Commentary/CommentaryCard.jsx
import React from 'react';
import { 
  MessageSquare, 
  Target, 
  AlertCircle, 
  Clock,
  Flag,
  TrendingUp,
  Zap,
  User
} from 'lucide-react';

const CommentaryCard = ({ 
  commentary, 
  showTimestamp = true,
  variant = 'default'
}) => {
  const {
    id,
    time,
    type,
    text,
    team,
    player,
    importance = 'normal'
  } = commentary;

  const getTypeConfig = () => {
    switch (type) {
      case 'goal':
        return {
          icon: <Target className="w-5 h-5" />,
          color: 'from-green-500/20 to-green-600/10',
          border: 'border-green-500/40',
          iconBg: 'bg-green-500/20',
          iconColor: 'text-green-500',
          label: 'GOAL'
        };
      case 'card':
        return {
          icon: <Flag className="w-5 h-5" />,
          color: 'from-yellow-500/20 to-yellow-600/10',
          border: 'border-yellow-500/40',
          iconBg: 'bg-yellow-500/20',
          iconColor: 'text-yellow-500',
          label: 'CARD'
        };
      case 'substitution':
        return {
          icon: <User className="w-5 h-5" />,
          color: 'from-blue-500/20 to-blue-600/10',
          border: 'border-blue-500/40',
          iconBg: 'bg-blue-500/20',
          iconColor: 'text-blue-500',
          label: 'SUB'
        };
      case 'highlight':
        return {
          icon: <Zap className="w-5 h-5" />,
          color: 'from-purple-500/20 to-purple-600/10',
          border: 'border-purple-500/40',
          iconBg: 'bg-purple-500/20',
          iconColor: 'text-purple-500',
          label: 'HIGHLIGHT'
        };
      case 'alert':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          color: 'from-red-500/20 to-red-600/10',
          border: 'border-red-500/40',
          iconBg: 'bg-red-500/20',
          iconColor: 'text-red-500',
          label: 'ALERT'
        };
      case 'analysis':
        return {
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'from-indigo-500/20 to-indigo-600/10',
          border: 'border-indigo-500/40',
          iconBg: 'bg-indigo-500/20',
          iconColor: 'text-indigo-500',
          label: 'ANALYSIS'
        };
      default:
        return {
          icon: <MessageSquare className="w-5 h-5" />,
          color: 'from-gray-500/20 to-gray-600/10',
          border: 'border-gray-500/40',
          iconBg: 'bg-gray-500/20',
          iconColor: 'text-gray-400',
          label: 'COMMENT'
        };
    }
  };

  const config = getTypeConfig();

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r ${config.color} border ${config.border} rounded-lg p-3 hover:shadow-lg transition-all`}>
        <div className="flex items-start gap-3">
          <div className={`${config.iconBg} p-2 rounded-lg flex-shrink-0`}>
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {showTimestamp && time && (
                <span className={`${config.iconColor} text-xs font-bold`}>{time}'</span>
              )}
              {team && (
                <span className="text-white text-xs font-medium">{team}</span>
              )}
            </div>
            <p className="text-gray-300 text-sm">{text}</p>
          </div>
        </div>
      </div>
    );
  }

  // Timeline variant
  if (variant === 'timeline') {
    return (
      <div className="flex gap-4">
        {/* Timeline dot */}
        <div className="flex flex-col items-center">
          <div className={`${config.iconBg} border-2 ${config.border} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
            <span className={`${config.iconColor} text-xs font-bold`}>
              {time}'
            </span>
          </div>
          <div className={`w-0.5 h-full ${config.border} flex-1 min-h-[20px]`}></div>
        </div>

        {/* Content */}
        <div className={`flex-1 bg-gradient-to-r ${config.color} border ${config.border} rounded-lg p-4 mb-4`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {config.icon}
              <span className={`${config.iconColor} text-xs font-semibold px-2 py-1 rounded ${config.iconBg}`}>
                {config.label}
              </span>
            </div>
            {showTimestamp && (
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <Clock className="w-3 h-3" />
                <span>{time}'</span>
              </div>
            )}
          </div>
          {team && (
            <div className="text-white font-semibold text-sm mb-1">{team}</div>
          )}
          {player && (
            <div className="text-gray-400 text-xs mb-2">Player: {player}</div>
          )}
          <p className="text-gray-300">{text}</p>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-gradient-to-r ${config.color} border ${config.border} rounded-xl p-5 hover:shadow-xl transition-all ${
      importance === 'high' ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-yellow-500/50' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`${config.iconBg} p-2.5 rounded-lg`}>
            {config.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`${config.iconColor} text-sm font-semibold`}>
                {config.label}
              </span>
              {importance === 'high' && (
                <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-0.5 rounded-full font-semibold">
                  KEY MOMENT
                </span>
              )}
            </div>
            {team && (
              <div className="text-white font-medium text-sm mt-1">{team}</div>
            )}
          </div>
        </div>
        {showTimestamp && time && (
          <div className={`${config.iconBg} px-3 py-1 rounded-full`}>
            <span className={`${config.iconColor} text-sm font-bold`}>{time}'</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        {player && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-sm">{player}</span>
          </div>
        )}
        <p className="text-gray-200 leading-relaxed">{text}</p>
      </div>
    </div>
  );
};

// Live Commentary Card with pulsing indicator
export const LiveCommentaryCard = ({ commentary }) => {
  return (
    <div className="relative">
      <div className="absolute -top-2 -right-2 z-10">
        <div className="relative">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </div>
      </div>
      <CommentaryCard commentary={commentary} variant="default" />
    </div>
  );
};

// Mini Commentary Card for sidebar
export const MiniCommentaryCard = ({ commentary }) => {
  const { time, type, text } = commentary;
  
  const getTypeColor = () => {
    switch (type) {
      case 'goal': return 'text-green-500';
      case 'card': return 'text-yellow-500';
      case 'alert': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 transition-colors">
      <div className="flex items-start gap-2">
        <span className={`${getTypeColor()} text-xs font-bold min-w-[30px]`}>
          {time}'
        </span>
        <p className="text-gray-300 text-xs line-clamp-2">{text}</p>
      </div>
    </div>
  );
};

export default CommentaryCard;