// components/Predictions/PredictionCard.jsx
import React from 'react';
import { 
  Target, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Percent,
  Trophy,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

const PredictionCard = ({ 
  prediction, 
  variant = 'default',
  showConfidence = true,
  showDetails = true,
  onClick
}) => {
  const {
    id,
    match,
    winner,
    probability,
    confidence,
    factors,
    status = 'pending', // pending, correct, incorrect
    timestamp
  } = prediction;

  const getConfidenceColor = (conf) => {
    if (conf >= 80) return { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30' };
    if (conf >= 60) return { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/30' };
    return { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30' };
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'correct':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'text-green-500',
          bg: 'bg-green-500/10',
          border: 'border-green-500/30'
        };
      case 'incorrect':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          color: 'text-red-500',
          bg: 'bg-red-500/10',
          border: 'border-red-500/30'
        };
      default:
        return {
          icon: <Clock className="w-5 h-5" />,
          color: 'text-blue-500',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30'
        };
    }
  };

  const confidenceColors = getConfidenceColor(confidence);
  const statusConfig = getStatusConfig();

  // Compact variant
  if (variant === 'compact') {
    return (
      <div 
        onClick={onClick}
        className={`bg-gray-800/50 border ${confidenceColors.border} rounded-lg p-4 hover:bg-gray-800 transition-all cursor-pointer`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className={`w-4 h-4 ${confidenceColors.text}`} />
            <span className="text-white font-semibold text-sm">{winner}</span>
          </div>
          <span className={`${confidenceColors.text} text-sm font-bold`}>
            {confidence}%
          </span>
        </div>
        <div className="text-gray-400 text-xs">
          {match.team1} vs {match.team2}
        </div>
      </div>
    );
  }

  // Mini variant
  if (variant === 'mini') {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
        <div className="flex items-center gap-3">
          <div className={`${confidenceColors.bg} p-2 rounded-lg`}>
            <Target className={`w-4 h-4 ${confidenceColors.text}`} />
          </div>
          <div>
            <div className="text-white text-sm font-medium">{winner}</div>
            <div className="text-gray-500 text-xs">{match.team1} vs {match.team2}</div>
          </div>
        </div>
        <div className={`${confidenceColors.bg} px-2 py-1 rounded ${confidenceColors.text} text-xs font-bold`}>
          {confidence}%
        </div>
      </div>
    );
  }

  // Default variant - full card
  return (
    <div 
      onClick={onClick}
      className={`bg-gradient-to-br from-gray-800 to-gray-900 border-2 ${confidenceColors.border} rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer group`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`${confidenceColors.bg} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
            <Target className={`w-6 h-6 ${confidenceColors.text}`} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">AI Prediction</h3>
            <p className="text-gray-400 text-sm">{match.league} • {match.sport}</p>
          </div>
        </div>
        {status !== 'pending' && (
          <div className={`${statusConfig.bg} border ${statusConfig.border} p-2 rounded-lg`}>
            <span className={statusConfig.color}>{statusConfig.icon}</span>
          </div>
        )}
      </div>

      {/* Match Info */}
      <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
        <div className="text-center mb-3">
          <h4 className="text-white font-semibold text-xl">
            {match.team1} <span className="text-gray-500 mx-2">vs</span> {match.team2}
          </h4>
          {match.time && (
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mt-2">
              <Clock className="w-4 h-4" />
              <span>{match.time}</span>
            </div>
          )}
        </div>
      </div>

      {/* Prediction Result */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <div>
              <div className="text-gray-400 text-xs mb-1">Predicted Winner</div>
              <div className="text-white font-bold text-xl">{winner}</div>
            </div>
          </div>
          {probability && (
            <div className="text-right">
              <div className="text-gray-400 text-xs mb-1">Win Probability</div>
              <div className="text-yellow-500 font-bold text-xl">{probability}%</div>
            </div>
          )}
        </div>
      </div>

      {/* Confidence Level */}
      {showConfidence && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Confidence Level</span>
            <span className={`${confidenceColors.text} font-bold`}>{confidence}%</span>
          </div>
          <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                confidence >= 80 ? 'bg-green-500' : 
                confidence >= 60 ? 'bg-yellow-500' : 
                'bg-red-500'
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
      )}

      {/* Key Factors */}
      {showDetails && factors && factors.length > 0 && (
        <div className="border-t border-gray-700 pt-4">
          <h5 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-500" />
            Key Factors
          </h5>
          <div className="space-y-2">
            {factors.slice(0, 3).map((factor, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-700 mt-4 pt-4 flex items-center justify-between">
        <div className="text-gray-500 text-xs">
          {timestamp && new Date(timestamp).toLocaleString()}
        </div>
        <button className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors">
          View Details →
        </button>
      </div>
    </div>
  );
};

// Prediction Comparison Card
export const PredictionComparisonCard = ({ predictions }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-white font-semibold mb-4">Prediction Comparison</h3>
      <div className="space-y-4">
        {predictions.map((pred, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div>
                <div className="text-white font-medium">{pred.winner}</div>
                <div className="text-gray-500 text-xs">{pred.source}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-500 font-bold">{pred.confidence}%</div>
              <div className="text-gray-500 text-xs">confidence</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Prediction Accuracy Stats
export const PredictionAccuracyCard = ({ stats }) => {
  return (
    <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="w-6 h-6 text-green-500" />
        <h3 className="text-white font-semibold">Prediction Accuracy</h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-500">{stats.correct}</div>
          <div className="text-gray-400 text-xs mt-1">Correct</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-500">{stats.incorrect}</div>
          <div className="text-gray-400 text-xs mt-1">Incorrect</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-500">{stats.accuracy}%</div>
          <div className="text-gray-400 text-xs mt-1">Accuracy</div>
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;