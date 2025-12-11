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
  const [activeTab, setActiveTab] = useState("cricket");
  const [cricketScores, setCricketScores] = useState([]);
  const [footballScores, setFootballScores] = useState([]);
  const [scoresLoading, setScoresLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [stats, setStats] = useState({
    totalMatches: 0,
    liveMatches: 0,
    totalComments: 0,
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const liveCount = [...cricketScores, ...footballScores].filter(
      (match) => match.status?.toLowerCase() === "live" || match.status?.short === "LIVE"
    ).length;

    setStats({
      totalMatches: cricketScores.length + footballScores.length,
      liveMatches: liveCount,
      totalComments: commentaries.length,
    });
  }, [cricketScores, footballScores, commentaries]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchCommentaries();
    fetchSportsScores();

    const interval = setInterval(fetchSportsScores, 30000);
    return () => clearInterval(interval);
  }, [token, navigate]);

  const fetchCommentaries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/commentaries`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) setCommentaries(data);
    } catch (error) {
      console.error("Error fetching commentaries:", error);
    }
  };

  const fetchSportsScores = async () => {
    setScoresLoading(true);
    try {
      const cricketResponse = await fetch(`${API_BASE_URL}/api/sports/cricket/live`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cricketData = await cricketResponse.json();
      if (cricketData.success) setCricketScores(cricketData.data);

      const footballResponse = await fetch(`${API_BASE_URL}/api/sports/football/live`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const footballData = await footballResponse.json();
      if (footballData.success) setFootballScores(footballData.data);

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching sports scores:", error);
    } finally {
      setScoresLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/commentaries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: newComment }),
      });

      if (response.ok) {
        setNewComment("");
        fetchCommentaries();
        setSuccessMessage("Comment posted successfully! 🎉");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error posting commentary:", error);
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
          <p className="empty-title">No Live Cricket Matches</p>
          <p className="empty-subtitle">Check back soon for live updates!</p>
        </div>
      );
    }

    return cricketScores.map((match) => (
      <div key={match.id} className="score-card cricket-card">
        <div className="match-header">
          <h3>{match.name}</h3>
          <span className={`match-status ${match.status.toLowerCase()}`}>
            {match.status}
          </span>
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
          <div className="match-info">Match details updating soon</div>
        )}
      </div>
    ));
  };

  const renderFootballScores = () => {
    if (footballScores.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">⚽</div>
          <p className="empty-title">No Live Football Matches</p>
          <p className="empty-subtitle">Matches will appear here when they start</p>
        </div>
      );
    }

    return footballScores.map((match) => (
      <div key={match.id} className="score-card football-card">
        <div className="match-header">
          <div className="league-info">
            <img src={match.league.logo} alt={match.league.name} className="league-logo" />
            <span>{match.league.name}</span>
          </div>
          <span className={`match-status ${match.status.short.toLowerCase()}`}>
            {match.status.short === "LIVE"
              ? `${match.status.elapsed}'`
              : match.status.long}
          </span>
        </div>

        <div className="football-match">
          <div className="team">
            <img src={match.teams.home.logo} alt={match.teams.home.name} className="team-logo" />
            <span className="team-name">{match.teams.home.name}</span>
            <span className="team-score">{match.goals.home ?? "-"}</span>
          </div>

          <div className="vs">VS</div>

          <div className="team">
            <span className="team-score">{match.goals.away ?? "-"}</span>
            <span className="team-name">{match.teams.away.name}</span>
            <img src={match.teams.away.logo} alt={match.teams.away.name} className="team-logo" />
          </div>
        </div>

        {match.score && match.score.halftime && match.score.halftime.home !== null && (
          <div className="halftime-score">
            HT: {match.score.halftime.home} - {match.score.halftime.away}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="commentary-container">
      <header className="commentary-header">
        <h1>🏏 Live Sports Commentary</h1>

        <div className="user-info">
          <span>Welcome, {user?.username}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-icon">🏏</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalMatches}</div>
            <div className="stat-label">Total Matches</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon live-indicator">🔴</div>
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
            <div className="stat-value">Live</div>
            <div className="stat-label">Auto-Refresh</div>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="scores-section">
          <div className="scores-header">
            <h2>Live Scores</h2>
            <button onClick={fetchSportsScores} className="refresh-btn" disabled={scoresLoading}>
              🔄 {scoresLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div style={{
            fontSize: "0.85rem",
            color: "rgba(255, 255, 255, 0.6)",
            marginTop: "10px",
            marginBottom: "15px",
          }}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>

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
                    <span className="timestamp">{new Date(item.createdAt).toLocaleString()}</span>
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