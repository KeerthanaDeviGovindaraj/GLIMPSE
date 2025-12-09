// components/Predictions/PredictionsTab.jsx
import React, { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp,
  RefreshCw,
  Sparkles,
  AlertCircle,
  BarChart3,
  Trophy,
  Activity
} from 'lucide-react';
import PredictionCard, { PredictionComparisonCard, PredictionAccuracyCard } from './PredictionCard';
import PredictionFilters, { CompactPredictionFilters, FilterSummary } from './PredictionFilters';

const PredictionsTab = ({ matches = [], variant = 'default' }) => {
  const [predictions, setPredictions] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    sport: 'all',
    confidence: 'all',
    status: 'all',
    timeframe: 'all'
  });
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, detailed

  useEffect(() => {
    generatePredictions(matches);
  }, [matches]);

  useEffect(() => {
    applyFilters();
  }, [predictions, activeFilters]);

  const generatePredictions = (matchData) => {
    setLoading(true);
    
    // Simulate AI prediction generation
    const mockPredictions = matchData.map((match, index) => {
      const confidence = Math.floor(Math.random() * 40) + 60; // 60-100%
      const probability = Math.floor(Math.random() * 30) + 55; // 55-85%
      const winner = Math.random() > 0.5 ? match.team1 : match.team2;
      
      const factors = [
        `${winner} has won 3 of last 5 encounters`,
        `Current form: ${winner} is on a 4-match winning streak`,
        `Home advantage: ${match.team1} playing at home`,
        `Key player availability: ${winner} has full squad`,
        `Historical data suggests ${probability}% win rate`
      ];

      return {
        id: `pred-${index}`,
        match: match,
        winner: winner,
        probability: probability,
        confidence: confidence,
        factors: factors.slice(0, Math.floor(Math.random() * 3) + 2),
        status: match.status === 'finished' 
          ? (Math.random() > 0.3 ? 'correct' : 'incorrect')
          : 'pending',
        timestamp: new Date().toISOString()
      };
    });

    setTimeout(() => {
      setPredictions(mockPredictions);
      setLoading(false);
    }, 500);
  };

  const applyFilters = () => {
    let filtered = [...predictions];

    // Sport filter
    if (activeFilters.sport !== 'all') {
      filtered = filtered.filter(p => p.match.sport === activeFilters.sport);
    }

    // Confidence filter
    if (activeFilters.confidence !== 'all') {
      if (activeFilters.confidence === 'high') {
        filtered = filtered.filter(p => p.confidence >= 80);
      } else if (activeFilters.confidence === 'medium') {
        filtered = filtered.filter(p => p.confidence >= 60 && p.confidence < 80);
      } else if (activeFilters.confidence === 'low') {
        filtered = filtered.filter(p => p.confidence < 60);
      }
    }

    // Status filter
    if (activeFilters.status !== 'all') {
      filtered = filtered.filter(p => p.status === activeFilters.status);
    }

    // Minimum confidence filter
    if (activeFilters.minConfidence) {
      filtered = filtered.filter(p => p.confidence >= activeFilters.minConfidence);
    }

    // Sort
    const sortBy = activeFilters.sortBy || 'confidence';
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return b.confidence - a.confidence;
        case 'date':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'accuracy':
          return (b.status === 'correct' ? 1 : 0) - (a.status === 'correct' ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredPredictions(filtered);
  };

  const handleRefresh = () => {
    generatePredictions(matches);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  const getAccuracyStats = () => {
    const finished = predictions.filter(p => p.status !== 'pending');
    const correct = finished.filter(p => p.status === 'correct').length;
    const incorrect = finished.filter(p => p.status === 'incorrect').length;
    const accuracy = finished.length > 0 
      ? Math.round((correct / finished.length) * 100)
      : 0;

    return { correct, incorrect, accuracy, total: finished.length };
  };

  if (matches.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No matches available for predictions</p>
        </div>
      </div>
    );
  }

  const stats = getAccuracyStats();

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        <CompactPredictionFilters 
          onFilterChange={(filter) => handleFilterChange({ ...activeFilters, status: filter })}
          activeFilter={activeFilters.status}
        />
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredPredictions.map(prediction => (
            <PredictionCard 
              key={prediction.id} 
              prediction={prediction} 
              variant="compact"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600/20 p-3 rounded-xl">
              <Sparkles className="w-8 h-8 text-purple-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Predictions</h2>
              <p className="text-gray-400">Powered by advanced machine learning</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="font-medium">Refresh</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-500">{predictions.length}</div>
            <div className="text-gray-400 text-xs mt-1">Total Predictions</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {predictions.filter(p => p.status === 'pending').length}
            </div>
            <div className="text-gray-400 text-xs mt-1">Pending</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.correct}</div>
            <div className="text-gray-400 text-xs mt-1">Correct</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.accuracy}%</div>
            <div className="text-gray-400 text-xs mt-1">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Accuracy Card */}
      {stats.total > 0 && (
        <PredictionAccuracyCard stats={stats} />
      )}

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex gap-2">
            {['grid', 'list', 'detailed'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  viewMode === mode
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="text-gray-400 text-sm">
          {filteredPredictions.length} of {predictions.length} predictions
        </div>
      </div>

      {/* Filter Summary */}
      <FilterSummary 
        filters={activeFilters}
        onClear={() => setActiveFilters({
          sport: 'all',
          confidence: 'all',
          status: 'all',
          timeframe: 'all'
        })}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <PredictionFilters 
            onFilterChange={handleFilterChange}
            activeFilters={activeFilters}
          />
        </div>

        {/* Predictions Grid/List */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-400">Generating predictions...</p>
              </div>
            </div>
          ) : filteredPredictions.length === 0 ? (
            <div className="flex items-center justify-center py-12 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">No predictions match your filters</p>
                <button
                  onClick={() => setActiveFilters({
                    sport: 'all',
                    confidence: 'all',
                    status: 'all',
                    timeframe: 'all'
                  })}
                  className="text-purple-500 hover:text-purple-400 text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 gap-6">
                  {filteredPredictions.map(prediction => (
                    <PredictionCard 
                      key={prediction.id} 
                      prediction={prediction}
                      variant="default"
                    />
                  ))}
                </div>
              )}

              {viewMode === 'list' && (
                <div className="space-y-3">
                  {filteredPredictions.map(prediction => (
                    <PredictionCard 
                      key={prediction.id} 
                      prediction={prediction}
                      variant="compact"
                      showDetails={false}
                    />
                  ))}
                </div>
              )}

              {viewMode === 'detailed' && (
                <div className="space-y-6">
                  {filteredPredictions.map(prediction => (
                    <PredictionCard 
                      key={prediction.id} 
                      prediction={prediction}
                      variant="default"
                      showConfidence={true}
                      showDetails={true}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* AI Disclaimer */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-200">
            <strong>Disclaimer:</strong> AI predictions are based on historical data and statistical analysis. 
            Results are not guaranteed and should be used for informational purposes only.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionsTab;