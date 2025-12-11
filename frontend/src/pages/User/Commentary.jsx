import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import "./Commentary.css";

const Commentary = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [commentaries, setCommentaries] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState("cricket");
  const [cricketScores, setCricketScores] = useState([]);
  const [footballScores, setFootballScores] = useState([]);
  const [scoresLoading, setScoresLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Track if matches are actually LIVE
  const [cricketIsLive, setCricketIsLive] = useState(false);
  const [footballIsLive, setFootballIsLive] = useState(false);

  const [stats, setStats] = useState({
    totalMatches: 0,
    liveMatches: 0,
    totalComments: 0,
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  // Calculate stats - only count ACTUALLY live matches
  useEffect(() => {
    const allMatches = [...cricketScores, ...footballScores];
    
    // Only count matches that are actually live (not recent/completed)
    const actuallyLiveCount = allMatches.filter(match => match.isLive === true).length;

    setStats({
      totalMatches: allMatches.length,
      liveMatches: actuallyLiveCount,
      totalComments: commentaries.length,
    });
  }, [cricketScores, footballScores, commentaries]);

  // Initial data fetch
  useEffect(() => {
    fetchCommentaries();
    fetchSportsScores();

    const interval = setInterval(fetchSportsScores, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCommentaries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/commentaries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch commentaries');
      }

      const data = await response.json();
      setCommentaries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching commentaries:", error);
      setErrorMessage("Failed to load comments");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const fetchSportsScores = async () => {
    setScoresLoading(true);
    setErrorMessage("");
    
    try {
      // Fetch Cricket
      const cricketResponse = await fetch(`${API_BASE_URL}/api/sports/cricket/live`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!cricketResponse.ok) {
        throw new Error('Cricket API failed');
      }
      
      const cricketData = await cricketResponse.json();
      console.log('🏏 Cricket response:', cricketData);
      
      if (cricketData.success) {
        setCricketScores(cricketData.data || []);
        setCricketIsLive(cricketData.isLive || false);
      }

      // Fetch Football
      const footballResponse = await fetch(`${API_BASE_URL}/api/sports/football/live`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!footballResponse.ok) {
        throw new Error('Football API failed');
      }
      
      const footballData = await footballResponse.json();
      console.log('⚽ Football response:', footballData);
      
      if (footballData.success) {
        setFootballScores(footballData.data || []);
        setFootballIsLive(footballData.isLive || false);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error("❌ Error fetching sports scores:", error);
      setErrorMessage("Failed to load scores. Please check your connection.");
    } finally {
      setScoresLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    setErrorMessage("");
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/commentaries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: newComment }),
      });

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }

      setNewComment("");
      fetchCommentaries();
      setSuccessMessage("Comment posted successfully! 🎉");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error posting commentary:", error);
      setErrorMessage("Failed to post comment. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const renderCricketScores = () => {
    if (cricketScores.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">🏏</div>
          <p className="empty-title">No Cricket Matches</p>
          <p className="empty-subtitle">Check back during match times!</p>
        </div>
      );
    }

    return cricketScores.map((match) => {
      const isMatchLive = match.isLive === true;
      
      return (
        <div key={match.id} className="score-card cricket-card">
          <div className="match-header">
            <h3>{match.name}</h3>
            {isMatchLive ? (
              <span className="match-status live">
                LIVE
              </span>
            ) : (
              <span className="match-status finished">
                FT
              </span>
            )}
          </div>

          <div className="match-type">{match.matchType}</div>
          {match.venue && <div className="venue">📍 {match.venue}</div>}

          {match.score && match.score.length > 0 ? (
            <div className="scores">
              {match.score.map((teamScore, i) => (
                <div key={i} className="team-score">
                  <span className="team-name">{teamScore.inning}</span>
                  <span className="score-value">
                    {teamScore.r}/{teamScore.w} ({teamScore.o} overs)
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="match-info">Match details updating</div>
          )}
        </div>
      );
    });
  };

  const renderFootballScores = () => {
    if (footballScores.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">⚽</div>
          <p className="empty-title">No Football Matches</p>
          <p className="empty-subtitle">Check back during match times!</p>
        </div>
      );
    }

    return footballScores.map((match) => {
      const matchId = match.id || match.idEvent || Math.random();
      const leagueName = match.strLeague || 'Football Match';
      const leagueLogo = match.strLeagueBadge || 'https://via.placeholder.com/30';
      
      const homeTeamName = match.strHomeTeam || 'Home';
      const homeTeamLogo = match.strHomeTeamBadge || 'https://via.placeholder.com/30';
      const homeScore = match.intHomeScore || '0';
      
      const awayTeamName = match.strAwayTeam || 'Away';
      const awayTeamLogo = match.strAwayTeamBadge || 'https://via.placeholder.com/30';
      const awayScore = match.intAwayScore || '0';
      
      const isMatchLive = match.isLive === true;
      const matchProgress = match.strProgress || 'FT';
      
      return (
        <div key={matchId} className="score-card football-card">
          <div className="match-header">
            <div className="league-info">
              <img 
                src={leagueLogo} 
                alt={leagueName} 
                className="league-logo"
                onError={(e) => e.target.src = 'https://via.placeholder.com/30'}
              />
              <span>{leagueName}</span>
            </div>
            {isMatchLive ? (
              <span className="match-status live">
                {matchProgress}
              </span>
            ) : (
              <span className="match-status finished">
                FT
              </span>
            )}
          </div>

          <div className="football-match">
            <div className="team">
              <img 
                src={homeTeamLogo} 
                alt={homeTeamName} 
                className="team-logo"
                onError={(e) => e.target.src = 'https://via.placeholder.com/30'}
              />
              <span className="team-name">{homeTeamName}</span>
              <span className="team-score">{homeScore}</span>
            </div>

            <div className="vs">VS</div>

            <div className="team">
              <span className="team-score">{awayScore}</span>
              <span className="team-name">{awayTeamName}</span>
              <img 
                src={awayTeamLogo} 
                alt={awayTeamName} 
                className="team-logo"
                onError={(e) => e.target.src = 'https://via.placeholder.com/30'}
              />
            </div>
          </div>

          {match.dateEvent && !isMatchLive && (
            <div className="match-date">
              📅 {new Date(match.dateEvent).toLocaleDateString()}
            </div>
          )}
        </div>
      );
    });
  };

  // Info message based on what's showing
  const getInfoMessage = () => {
    const hasLiveMatches = cricketIsLive || footballIsLive;
    const hasRecentMatches = (cricketScores.length > 0 && !cricketIsLive) || 
                             (footballScores.length > 0 && !footballIsLive);
    
    if (hasLiveMatches) {
      return null; // No message needed for live matches
    }
    
    if (hasRecentMatches) {
      return "ℹ️ No live matches right now. Showing recent results.";
    }
    
    return null;
  };

  const infoMessage = getInfoMessage();

  return (
    <div className="commentary-container">
      <header className="commentary-header">
        <h1>🏏 Live Sports Commentary</h1>

        <div className="user-info">
          <span>Welcome, {user?.username || user?.email?.split('@')[0] || 'User'}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Info Banner - Only show when not live */}
      {infoMessage && (
        <div className="info-banner">
          {infoMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="error-banner">
          ⚠️ {errorMessage}
        </div>
      )}

      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-icon">🏏</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalMatches}</div>
            <div className="stat-label">Total Matches</div>
          </div>
        </div>

        <div className="stat-item">
          <div className={`stat-icon ${stats.liveMatches > 0 ? 'live-indicator' : ''}`}>
            {stats.liveMatches > 0 ? '🔴' : '⚪'}
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.liveMatches}</div>
            <div className="stat-label">Live Now</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">💬</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalComments}</div>
            <div className="stat-label">Comments</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <div className="stat-value">30s</div>
            <div className="stat-label">Auto-Refresh</div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="scores-section">
          <div className="scores-header">
            <h2>
              {(activeTab === 'cricket' && cricketIsLive) || (activeTab === 'football' && footballIsLive)
                ? 'Live Scores'
                : 'Recent Results'}
            </h2>
            <button 
              onClick={fetchSportsScores} 
              className="refresh-btn" 
              disabled={scoresLoading}
            >
              🔄 {scoresLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>

          <div className="tabs">
            <button
              className={`tab ${activeTab === "cricket" ? "active" : ""}`}
              onClick={() => setActiveTab("cricket")}
            >
              🏏 Cricket ({cricketScores.length})
            </button>
            <button
              className={`tab ${activeTab === "football" ? "active" : ""}`}
              onClick={() => setActiveTab("football")}
            >
              ⚽ Football ({footballScores.length})
            </button>
          </div>

          <div className="scores-container">
            {scoresLoading && <div className="loading">Loading scores...</div>}
            {!scoresLoading && activeTab === "cricket" && renderCricketScores()}
            {!scoresLoading && activeTab === "football" && renderFootballScores()}
          </div>
        </div>

        <div className="commentary-section">
          <div className="add-comment-section">
            <h3>Share Your Commentary</h3>
            <form onSubmit={handleSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows="3"
                placeholder="What's your take on the match?"
                disabled={loading}
                maxLength={500}
              />
              <div className="character-count">{newComment.length}/500 characters</div>
              <button type="submit" disabled={loading || !newComment.trim()}>
                {loading ? "Posting..." : "📝 Post Commentary"}
              </button>
            </form>

            {successMessage && <div className="success-message">{successMessage}</div>}
          </div>

          <div className="commentaries-list">
            <h3>Fan Commentaries</h3>

            {commentaries.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <p className="empty-title">No Comments Yet</p>
                <p className="empty-subtitle">Be the first to share your thoughts!</p>
              </div>
            ) : (
              commentaries.map((item) => (
                <div key={item._id} className="commentary-card">
                  <div className="commentary-header-info">
                    <span className="username">👤 {item.username}</span>
                    <span className="timestamp">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="commentary-text">{item.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Commentary;