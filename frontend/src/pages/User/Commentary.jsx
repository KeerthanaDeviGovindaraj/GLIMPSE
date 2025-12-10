import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Commentary.css';

const Commentary = () => {
  const navigate = useNavigate();
  const [commentaries, setCommentaries] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('cricket');
  const [cricketScores, setCricketScores] = useState([]);
  const [footballScores, setFootballScores] = useState([]);
  const [scoresLoading, setScoresLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedUser) {
      navigate('/login');
      return;
    }
    setUser(loggedUser);
    fetchCommentaries();
    fetchSportsScores();

    // Auto-refresh scores every 30 seconds
    const interval = setInterval(() => {
      fetchSportsScores();
    }, 30000);

    return () => clearInterval(interval);
  }, [navigate]);

  const fetchCommentaries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/commentaries`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setCommentaries(data);
      }
    } catch (error) {
      console.error('Error fetching commentaries:', error);
    }
  };

  const fetchSportsScores = async () => {
    setScoresLoading(true);
    try {
      // Fetch cricket scores
      const cricketResponse = await fetch(`${API_BASE_URL}/api/sports/cricket/live`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const cricketData = await cricketResponse.json();
      if (cricketData.success) {
        setCricketScores(cricketData.data);
      }

      // Fetch football scores
      const footballResponse = await fetch(`${API_BASE_URL}/api/sports/football/live`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const footballData = await footballResponse.json();
      if (footballData.success) {
        setFootballScores(footballData.data);
      }
    } catch (error) {
      console.error('Error fetching sports scores:', error);
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ comment: newComment })
      });

      if (response.ok) {
        setNewComment('');
        fetchCommentaries();
      }
    } catch (error) {
      console.error('Error posting commentary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const renderCricketScores = () => {
    if (cricketScores.length === 0) {
      return <p className="no-matches">No live cricket matches at the moment</p>;
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
            {match.score.map((teamScore, idx) => (
              <div key={idx} className="team-score">
                <span className="team-name">{teamScore.inning}</span>
                <span className="score-value">
                  {teamScore.r}/{teamScore.w} ({teamScore.o} overs)
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="match-info">Match details will be updated soon</div>
        )}
      </div>
    ));
  };

  const renderFootballScores = () => {
    if (footballScores.length === 0) {
      return <p className="no-matches">No football matches scheduled today</p>;
    }

    return footballScores.map((match) => (
      <div key={match.id} className="score-card football-card">
        <div className="match-header">
          <div className="league-info">
            <img src={match.league.logo} alt={match.league.name} className="league-logo" />
            <span>{match.league.name}</span>
          </div>
          <span className={`match-status ${match.status.short.toLowerCase()}`}>
            {match.status.short === 'LIVE' ? `${match.status.elapsed}'` : match.status.long}
          </span>
        </div>

        <div className="football-match">
          <div className="team">
            <img src={match.teams.home.logo} alt={match.teams.home.name} className="team-logo" />
            <span className="team-name">{match.teams.home.name}</span>
            <span className="team-score">{match.goals.home ?? '-'}</span>
          </div>
          
          <div className="vs">VS</div>
          
          <div className="team">
            <span className="team-score">{match.goals.away ?? '-'}</span>
            <span className="team-name">{match.teams.away.name}</span>
            <img src={match.teams.away.logo} alt={match.teams.away.name} className="team-logo" />
          </div>
        </div>

        {match.score.halftime.home !== null && (
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

      <div className="main-content">
        {/* Live Scores Section */}
        <div className="scores-section">
          <div className="scores-header">
            <h2>Live Scores</h2>
            <button 
              onClick={fetchSportsScores} 
              className="refresh-btn"
              disabled={scoresLoading}
            >
              🔄 {scoresLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'cricket' ? 'active' : ''}`}
              onClick={() => setActiveTab('cricket')}
            >
              🏏 Cricket
            </button>
            <button 
              className={`tab ${activeTab === 'football' ? 'active' : ''}`}
              onClick={() => setActiveTab('football')}
            >
              ⚽ Football
            </button>
          </div>

          <div className="scores-container">
            {scoresLoading && <div className="loading">Loading scores...</div>}
            {!scoresLoading && activeTab === 'cricket' && renderCricketScores()}
            {!scoresLoading && activeTab === 'football' && renderFootballScores()}
          </div>
        </div>

        {/* Commentary Section */}
        <div className="commentary-section">
          <div className="add-comment-section">
            <h3>Share Your Commentary</h3>
            <form onSubmit={handleSubmit}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What's your take on the game?"
                rows="3"
                disabled={loading}
              />
              <button type="submit" disabled={loading || !newComment.trim()}>
                {loading ? 'Posting...' : '📝 Post Commentary'}
              </button>
            </form>
          </div>

          <div className="commentaries-list">
            <h3>Fan Commentaries</h3>
            {commentaries.length === 0 ? (
              <p className="no-comments">No commentaries yet. Be the first!</p>
            ) : (
              commentaries.map((commentary) => (
                <div key={commentary._id} className="commentary-card">
                  <div className="commentary-header-info">
                    <span className="username">👤 {commentary.username}</span>
                    <span className="timestamp">
                      {new Date(commentary.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="commentary-text">{commentary.comment}</p>
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