// components/Commentary/CommentaryTab.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Radio, 
  Clock,
  Filter,
  ArrowDown,
  RefreshCw
} from 'lucide-react';
import CommentaryCard, { LiveCommentaryCard, MiniCommentaryCard } from './CommentaryCard';
import CommentaryFilters, { CompactCommentaryFilters, FilterStats } from './CommentaryFilters';

const CommentaryTab = ({ match, variant = 'default' }) => {
  const [commentaries, setCommentaries] = useState([]);
  const [filteredCommentaries, setFilteredCommentaries] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState('timeline'); // timeline, feed, compact
  const commentaryEndRef = useRef(null);

  useEffect(() => {
    if (match) {
      generateCommentaries(match);
    }
  }, [match]);

  useEffect(() => {
    applyFilters();
  }, [commentaries, activeFilters]);

  useEffect(() => {
    if (isAutoScroll && commentaryEndRef.current) {
      commentaryEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredCommentaries, isAutoScroll]);

  const generateCommentaries = (matchData) => {
    const { team1, team2, score1, score2, sport, time } = matchData;
    
    const mockCommentaries = [
      {
        id: 1,
        time: '0',
        type: 'default',
        text: `Match kicks off! ${team1} vs ${team2} at the stadium.`,
        team: null,
        importance: 'normal'
      },
      {
        id: 2,
        time: '5',
        type: 'analysis',
        text: `${team1} showing aggressive early pressure, controlling possession in the opening minutes.`,
        team: team1,
        importance: 'normal'
      },
      {
        id: 3,
        time: '12',
        type: 'highlight',
        text: `Great save! The goalkeeper denies ${team2} with an incredible reflex save.`,
        team: team2,
        importance: 'high'
      },
      {
        id: 4,
        time: '23',
        type: 'goal',
        text: `⚽ GOAL! ${team1} takes the lead! Brilliant finish from the striker. ${team1} 1-0 ${team2}`,
        team: team1,
        player: 'Player #10',
        importance: 'high'
      },
      {
        id: 5,
        time: '28',
        type: 'card',
        text: `🟨 Yellow card shown to ${team2} defender for a tactical foul.`,
        team: team2,
        player: 'Player #5',
        importance: 'normal'
      },
      {
        id: 6,
        time: '35',
        type: 'substitution',
        text: `🔄 ${team1} making an early substitution due to injury.`,
        team: team1,
        player: 'Player #7 → Player #14',
        importance: 'normal'
      },
      {
        id: 7,
        time: '42',
        type: 'alert',
        text: `Close call! ${team2} hits the crossbar! Almost an equalizer.`,
        team: team2,
        importance: 'high'
      },
      {
        id: 8,
        time: '45',
        type: 'default',
        text: `⏱️ Half-time approaching. ${team1} leads ${score1}-${score2}.`,
        importance: 'normal'
      },
      {
        id: 9,
        time: '52',
        type: 'goal',
        text: `⚽ GOAL! ${team2} equalizes! What a strike! ${team1} ${score1}-${score1} ${team2}`,
        team: team2,
        player: 'Player #9',
        importance: 'high'
      },
      {
        id: 10,
        time: '67',
        type: 'highlight',
        text: `${team1} creating multiple chances now. The pressure is building!`,
        team: team1,
        importance: 'high'
      },
      {
        id: 11,
        time: '73',
        type: 'substitution',
        text: `🔄 Fresh legs for ${team2}. Tactical change by the manager.`,
        team: team2,
        player: 'Player #11 → Player #18',
        importance: 'normal'
      },
      {
        id: 12,
        time: '85',
        type: 'alert',
        text: `🚨 Late drama! Both teams pushing for a winner in the final minutes!`,
        importance: 'high'
      }
    ];

    setCommentaries(mockCommentaries);
  };

  const applyFilters = () => {
    if (activeFilters.length === 0) {
      setFilteredCommentaries(commentaries);
      return;
    }

    const filtered = commentaries.filter(c => activeFilters.includes(c.type));
    setFilteredCommentaries(filtered);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  const handleRefresh = () => {
    if (match) {
      generateCommentaries(match);
    }
  };

  const getFilterStats = () => {
    return {
      goal: commentaries.filter(c => c.type === 'goal').length,
      card: commentaries.filter(c => c.type === 'card').length,
      substitution: commentaries.filter(c => c.type === 'substitution').length,
      highlight: commentaries.filter(c => c.type === 'highlight').length
    };
  };

  if (!match) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Select a match to view commentary</p>
        </div>
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        <CompactCommentaryFilters 
          onFilterChange={(filter) => handleFilterChange(filter === 'all' ? [] : [filter])}
          activeFilter={activeFilters.length === 0 ? 'all' : activeFilters[0]}
        />
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredCommentaries.map(commentary => (
            <MiniCommentaryCard key={commentary.id} commentary={commentary} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600/20 p-2 rounded-lg">
              <MessageSquare className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Live Commentary</h2>
              <p className="text-gray-400 text-sm">
                {match.team1} vs {match.team2}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {match.isLive && (
              <div className="flex items-center gap-2 bg-red-600/20 border border-red-600/30 px-3 py-1.5 rounded-full">
                <Radio className="w-4 h-4 text-red-500" />
                <span className="text-red-500 text-sm font-semibold">LIVE</span>
              </div>
            )}
            <button
              onClick={handleRefresh}
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
              title="Refresh commentary"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <FilterStats stats={getFilterStats()} />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            {activeFilters.length > 0 && (
              <span className="bg-white text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            {['timeline', 'feed', 'compact'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  viewMode === mode
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-800/50 text-gray-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsAutoScroll(!isAutoScroll)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isAutoScroll
              ? 'bg-green-600/20 text-green-500 border border-green-600/30'
              : 'bg-gray-700 text-gray-400'
          }`}
        >
          <ArrowDown className={`w-4 h-4 ${isAutoScroll ? 'animate-bounce' : ''}`} />
          <span className="text-sm font-medium">Auto-scroll</span>
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <CommentaryFilters 
          onFilterChange={handleFilterChange}
          activeFilters={activeFilters}
        />
      )}

      {/* Commentary Feed */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        {filteredCommentaries.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No commentary matches your filters</p>
            <button
              onClick={() => setActiveFilters([])}
              className="mt-4 text-red-500 hover:text-red-400 text-sm font-medium"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredCommentaries.map((commentary, index) => {
              const isLatest = index === filteredCommentaries.length - 1 && match.isLive;
              
              if (viewMode === 'timeline') {
                return isLatest ? (
                  <LiveCommentaryCard key={commentary.id} commentary={commentary} />
                ) : (
                  <CommentaryCard 
                    key={commentary.id} 
                    commentary={commentary} 
                    variant="timeline"
                  />
                );
              }

              if (viewMode === 'compact') {
                return (
                  <CommentaryCard 
                    key={commentary.id} 
                    commentary={commentary} 
                    variant="compact"
                  />
                );
              }

              // Default feed view
              return (
                <CommentaryCard key={commentary.id} commentary={commentary} />
              );
            })}
            <div ref={commentaryEndRef} />
          </div>
        )}
      </div>

      {/* Match Status Footer */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-white font-medium">{match.time || '0:00'}</span>
          </div>
          <div className="text-gray-400 text-sm">
            {commentaries.length} total events
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentaryTab;