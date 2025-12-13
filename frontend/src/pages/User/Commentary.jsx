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

  const [activeMatchId, setActiveMatchId] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // AI commentary state
  const [aiCommentary, setAiCommentary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [commentaryStyle, setCommentaryStyle] = useState("professional");

  const [cricketIsLive, setCricketIsLive] = useState(false);
  const [footballIsLive, setFootballIsLive] = useState(false);

  const [stats, setStats] = useState({
    totalMatches: 0,
    liveMatches: 0,
    totalComments: 0,
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

  // Update stats
  useEffect(() => {
    const allMatches = [...cricketScores, ...footballScores];
    const actuallyLiveCount = allMatches.filter(match => match.isLive === true).length;
    setStats({
      totalMatches: allMatches.length,
      liveMatches: actuallyLiveCount,
      totalComments: commentaries.length,
    });
  }, [cricketScores, footballScores, commentaries]);

  // Initial fetch
  useEffect(() => {
    fetchCommentaries();
    fetchSportsScores();
    const interval = setInterval(fetchSportsScores, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch fan commentaries
  const fetchCommentaries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/commentaries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch commentaries");
      const data = await response.json();
      setCommentaries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching commentaries:", error);
      setErrorMessage("Failed to load comments");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // Fetch cricket and football scores
  const fetchSportsScores = async () => {
    setScoresLoading(true);
    setErrorMessage("");
    try {
      const cricketResponse = await fetch(`${API_BASE_URL}/api/sports/cricket/live`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cricketData = await cricketResponse.json();
      setCricketScores(cricketData.data || []);
      setCricketIsLive(cricketData.isLive || false);

      const footballResponse = await fetch(`${API_BASE_URL}/api/sports/football/live`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const footballData = await footballResponse.json();
      setFootballScores(footballData.data || []);
      setFootballIsLive(footballData.isLive || false);

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching sports scores:", error);
      setErrorMessage("Failed to load scores");
    } finally {
      setScoresLoading(false);
    }
  };

  // Fetch AI commentary for selected match
  const fetchAiCommentary = async (sport, matchId) => {
    if (!token || !matchId) return;

    setAiLoading(true);
    setAiCommentary(""); // Clear previous commentary
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ai-commentary/${sport}/${matchId}?style=${commentaryStyle}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch AI commentary");
      }
      
      const data = await response.json();
      setAiCommentary(data.commentary || "No commentary available.");
    } catch (error) {
      console.error("Error fetching AI commentary:", error);
      setAiCommentary(
        error.message.includes("authentication") 
          ? "AI commentary service is not configured. Please contact support."
          : error.message.includes("Rate limit")
          ? "AI commentary service is busy. Please try again in a moment."
          : "AI commentary unavailable at the moment. Please try again."
      );
    } finally {
      setAiLoading(false);
    }
  };

  // Handle selecting a match for AI commentary
  const handleMatchClick = (match) => {
    const matchId = match.id || match.idEvent;
    setActiveMatchId(matchId);
    setSelectedMatch(match);
    fetchAiCommentary(activeTab, matchId);
  };

  // Post fan comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/commentaries`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ comment: newComment }),
      });
      if (!response.ok) throw new Error("Failed to post comment");
      setNewComment("");
      fetchCommentaries();
      setSuccessMessage("Comment posted successfully! 🎉");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error posting commentary:", error);
      setErrorMessage("Failed to post comment.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Render cricket scores
  const renderCricketScores = () => {
    if (cricketScores.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">🏏</div>
          <div className="empty-title">No Cricket Matches</div>
          <div className="empty-subtitle">Check back soon for live updates</div>
        </div>
      );
    }

    return cricketScores.map((match) => {
      const isLive = match.isLive === true;
      return (
        <div 
          key={match.id} 
          className={`score-card cricket-card ${activeMatchId === match.id ? 'active' : ''}`}
          onClick={() => handleMatchClick(match)}
        >
          <div className="match-header">
            <h3>{match.name}</h3>
            {isLive ? (
              <span className="match-status live">🔴 LIVE</span>
            ) : (
              <span className="match-status finished">FT</span>
            )}
          </div>
          {match.score && match.score.length > 0 ? (
            <div className="scores">
              {match.score.map((teamScore, i) => (
                <div key={i} className="team-score">
                  <span className="team-name">{teamScore.inning}</span>
                  <span className="score-value">
                    {teamScore.r}/{teamScore.w} ({teamScore.o})
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="match-info">Match details updating...</div>
          )}
        </div>
      );
    });
  };

  // Render football scores
  const renderFootballScores = () => {
    if (footballScores.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">⚽</div>
          <div className="empty-title">No Football Matches</div>
          <div className="empty-subtitle">Check back soon for live updates</div>
        </div>
      );
    }

    return footballScores.map((match) => {
      const matchId = match.id || match.idEvent || Math.random();
      const isLive = match.isLive === true;
      
      return (
        <div 
          key={matchId} 
          className={`score-card football-card ${activeMatchId === matchId ? 'active' : ''}`}
          onClick={() => handleMatchClick(match)}
        >
          <div className="match-header">
            <div className="league-info">
              <span>{match.strLeague || 'Football Match'}</span>
            </div>
            {isLive ? (
              <span className="match-status live">🔴 LIVE</span>
            ) : (
              <span className="match-status finished">FT</span>
            )}
          </div>
          <div className="football-match">
            <div className="team">
              <span className="team-name">{match.strHomeTeam}</span>
              <span className="team-score">{match.intHomeScore || 0}</span>
            </div>
            <div className="vs">VS</div>
            <div className="team">
              <span className="team-name">{match.strAwayTeam}</span>
              <span className="team-score">{match.intAwayScore || 0}</span>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="commentary-container">
      <header className="commentary-header">
        <h1>Sports Commentary</h1>
        <div className="user-info">
          <span>Welcome, {user?.firstName || user?.email.split('@')[0]}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {errorMessage && <div className="error-banner">⚠️ {errorMessage}</div>}
      {successMessage && <div className="success-message">✓ {successMessage}</div>}

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-icon">🏆</span>
          <div className="stat-info">
            <div className="stat-value">{stats.totalMatches}</div>
            <div className="stat-label">Matches</div>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon live-indicator">🔴</span>
          <div className="stat-info">
            <div className="stat-value">{stats.liveMatches}</div>
            <div className="stat-label">Live</div>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon">💬</span>
          <div className="stat-info">
            <div className="stat-value">{stats.totalComments}</div>
            <div className="stat-label">Comments</div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="scores-section">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === "cricket" ? "active" : ""}`}
              onClick={() => setActiveTab("cricket")}
            >
              🏏 Cricket
            </button>
            <button 
              className={`tab ${activeTab === "football" ? "active" : ""}`}
              onClick={() => setActiveTab("football")}
            >
              ⚽ Football
            </button>
          </div>
          <div className="scores-container">
            {scoresLoading ? (
              <div className="loading">Loading matches...</div>
            ) : (
              activeTab === "cricket" ? renderCricketScores() : renderFootballScores()
            )}
          </div>
        </div>

        <div className="commentary-section">
          <div className="ai-commentary">
            <div className="ai-header">
              <h3>🤖 AI Commentary</h3>
              <div className="style-selector">
                <select 
                  value={commentaryStyle} 
                  onChange={(e) => {
                    setCommentaryStyle(e.target.value);
                    if (selectedMatch) {
                      setActiveMatchId(selectedMatch.id || selectedMatch.idEvent);
                      fetchAiCommentary(activeTab, selectedMatch.id || selectedMatch.idEvent);
                    }
                  }}
                  className="style-dropdown"
                >
                  <option value="professional">🎙️ Professional</option>
                  <option value="casual">😄 Casual Fan</option>
                  <option value="analytical">📊 Analytical</option>
                  <option value="dramatic">⚡ Dramatic</option>
                </select>
              </div>
            </div>
            {!selectedMatch ? (
              <p className="placeholder-text">
                👆 Click on any match above to get AI-powered commentary
              </p>
            ) : aiLoading ? (
              <div className="loading-commentary">
                <div className="spinner"></div>
                <p>Generating {commentaryStyle} commentary...</p>
              </div>
            ) : (
              <div className="commentary-content">
                <p>{aiCommentary}</p>
              </div>
            )}
          </div>

          <div className="add-comment-section">
            <h3>Fan Commentaries</h3>
            <form onSubmit={handleSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                maxLength={500}
                rows={3}
              />
              <div className="character-count">{newComment.length}/500</div>
              <button type="submit" disabled={loading || !newComment.trim()}>
                {loading ? "Posting..." : "Post"}
              </button>
            </form>
          </div>

          <div className="commentaries-list">
            {commentaries.length === 0 ? (
              <p>No comments yet. Be the first!</p>
            ) : (
              commentaries.map(c => (
                <div key={c._id} className="commentary-card">
                  <div className="commentary-header-info">
                    <strong className="username">{c.username}</strong>
                    <span className="timestamp">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="commentary-text">{c.comment}</p>
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