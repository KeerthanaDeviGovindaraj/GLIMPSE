// src/App.js - Standalone Version (No imports needed)
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch matches from backend
  useEffect(() => {
    fetchMatches();
    
    // Refresh every 5 seconds
    const interval = setInterval(fetchMatches, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/matches');
      const data = await response.json();
      
      if (data.success) {
        setMatches(data.data || []);
      }
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to connect to backend');
      setLoading(false);
    }
  };

  const liveMatches = matches.filter(m => m.isLive);
  const upcomingMatches = matches.filter(m => m.status === 'upcoming');
  const finishedMatches = matches.filter(m => m.status === 'finished');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading InsightOS...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Connection Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <p className="text-gray-500 text-sm mb-6">
            Make sure your backend server is running on http://localhost:5000
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-red-900/30 bg-gradient-to-r from-gray-900 to-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="bg-red-600 p-3 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  InsightOS <span className="text-red-500">Live Scores</span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">Real-time sports scores & updates</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="bg-red-600/20 border border-red-600/30 px-4 py-2 rounded-lg flex items-center gap-2">
                <span className="text-gray-400 text-sm">LIVE</span>
                <span className="text-red-500 font-bold text-lg">{liveMatches.length}</span>
              </div>
              <button 
                onClick={fetchMatches}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 border border-red-600/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-red-500">{liveMatches.length}</div>
            <div className="text-gray-400 text-sm">Live Now</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{matches.length}</div>
            <div className="text-gray-400 text-sm">Total Matches</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-500">{upcomingMatches.length}</div>
            <div className="text-gray-400 text-sm">Upcoming</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-gray-400">{finishedMatches.length}</div>
            <div className="text-gray-400 text-sm">Finished</div>
          </div>
        </div>
      </div>

      {/* Live Matches */}
      <div className="container mx-auto px-6 pb-8">
        <h2 className="text-2xl font-bold text-white mb-6">🔴 Live Matches</h2>

        {liveMatches.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <div className="text-6xl mb-4">⚽</div>
            <p className="text-gray-400 text-lg">No live matches at the moment</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for live updates</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveMatches.map(match => (
              <div 
                key={match._id}
                className="bg-gray-800/50 border border-red-600/50 rounded-xl p-6 hover:border-red-600 hover:shadow-xl hover:shadow-red-600/10 transition-all cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {match.sport === 'football' && '⚽'}
                      {match.sport === 'basketball' && '🏀'}
                      {match.sport === 'cricket' && '🏏'}
                      {match.sport === 'tennis' && '🎾'}
                      {match.sport === 'rugby' && '🏉'}
                    </span>
                    <div>
                      <span className="text-gray-400 text-sm font-medium capitalize">{match.sport}</span>
                      <div className="text-gray-500 text-xs">{match.league}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-red-600/20 px-3 py-1 rounded-full border border-red-600/30">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-red-500 text-xs font-semibold">LIVE</span>
                  </div>
                </div>

                {/* Teams */}
                <div className="space-y-4 mb-4">
                  {/* Team 1 */}
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {match.team1.substring(0, 3).toUpperCase()}
                      </div>
                      <span className="text-white font-semibold">{match.team1}</span>
                    </div>
                    <span className="text-red-500 text-3xl font-bold">{match.score1}</span>
                  </div>

                  {/* Team 2 */}
                  <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {match.team2.substring(0, 3).toUpperCase()}
                      </div>
                      <span className="text-white font-semibold">{match.team2}</span>
                    </div>
                    <span className="text-red-500 text-3xl font-bold">{match.score2}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-gray-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                      <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2"/>
                    </svg>
                    <span>{match.time || match.status}</span>
                  </div>
                  {match.venue && (
                    <div className="text-gray-500 text-xs">{match.venue}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Matches */}
      <div className="container mx-auto px-6 pb-12">
        <h2 className="text-2xl font-bold text-white mb-6">📋 All Matches</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {matches.map(match => (
            <div 
              key={match._id}
              className={`bg-gray-800/50 border rounded-xl p-4 flex items-center justify-between hover:bg-gray-800 transition-all ${
                match.isLive ? 'border-red-600/50' : 'border-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">
                  {match.sport === 'football' && '⚽'}
                  {match.sport === 'basketball' && '🏀'}
                  {match.sport === 'cricket' && '🏏'}
                  {match.sport === 'tennis' && '🎾'}
                  {match.sport === 'rugby' && '🏉'}
                </span>
                <div>
                  <div className="text-white font-semibold">
                    {match.team1} vs {match.team2}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {match.league} • {match.sport}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${match.isLive ? 'text-red-500' : 'text-gray-400'}`}>
                    {match.score1} - {match.score2}
                  </div>
                  <div className="text-gray-500 text-xs">{match.time}</div>
                </div>

                <div>
                  {match.isLive ? (
                    <span className="bg-red-600/20 text-red-500 px-3 py-1 rounded-full text-xs font-semibold border border-red-600/30">
                      LIVE
                    </span>
                  ) : match.status === 'upcoming' ? (
                    <span className="bg-blue-600/20 text-blue-500 px-3 py-1 rounded-full text-xs font-semibold border border-blue-600/30">
                      UPCOMING
                    </span>
                  ) : (
                    <span className="bg-gray-600/20 text-gray-400 px-3 py-1 rounded-full text-xs font-semibold border border-gray-600/30">
                      FINISHED
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;