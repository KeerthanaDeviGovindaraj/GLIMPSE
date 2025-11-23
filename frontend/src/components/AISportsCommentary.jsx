import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Trophy, Clock, TrendingUp, Play, Pause, RefreshCw, Download, Zap, BarChart3, Target, Activity, MessageSquare, Brain, Sparkles, Timer, AlertCircle } from 'lucide-react';
import { commentaryAPI, matchAPI, predictionAPI, analysisAPI } from '../services/api';

const AISportsCommentary = () => {
  // State for matches - will be loaded from backend
  const [liveMatches, setLiveMatches] = useState([
    { 
      id: 1, sport: 'Football', league: 'Premier League',
      home: { name: 'Manchester United', score: 2, logo: '⚽' }, 
      away: { name: 'Liverpool', score: 1, logo: '⚽' }, 
      status: 'Live', minute: 67, possession: { home: 58, away: 42 },
      stats: { shots: [12, 8], corners: [6, 4], fouls: [8, 11] }
    },
    { 
      id: 2, sport: 'Basketball', league: 'NBA',
      home: { name: 'Lakers', score: 98, logo: '🏀' }, 
      away: { name: 'Warriors', score: 95, logo: '🏀' }, 
      status: 'Live', quarter: 'Q4 - 4:32',
      stats: { threePointers: [12, 15], rebounds: [42, 38], assists: [24, 28] }
    },
    { 
      id: 3, sport: 'Cricket', league: 'ODI',
      home: { name: 'India', score: '245/6', logo: '🏏' }, 
      away: { name: 'Australia', score: '180/4', logo: '🏏' }, 
      status: 'Live', over: '45.3',
      stats: { boundaries: [28, 22], sixes: [8, 5], runRate: [5.4, 6.2] }
    },
    { 
      id: 4, sport: 'Tennis', league: 'Wimbledon',
      home: { name: 'Djokovic', score: '6-4, 5-4', logo: '🎾' }, 
      away: { name: 'Federer', score: '4-6, 4-5', logo: '🎾' }, 
      status: 'Live', set: 'Set 2',
      stats: { aces: [12, 15], winners: [28, 32], unforced: [18, 22] }
    }
  ]);

  const [selectedMatch, setSelectedMatch] = useState(liveMatches[0]);
  const [activeTab, setActiveTab] = useState('commentary');
  const [commentary, setCommentary] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [analysis, setAnalysis] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [aiFeature, setAiFeature] = useState('commentary');
  const [error, setError] = useState(null);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const commentaryEndRef = useRef(null);

  // Load live matches from backend on mount
  useEffect(() => {
    loadLiveMatches();
  }, []);

  // Load existing commentary when match changes
  useEffect(() => {
    if (selectedMatch?.id) {
      loadMatchCommentary();
    }
  }, [selectedMatch]);

  useEffect(() => {
    commentaryEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commentary]);

  useEffect(() => {
    let interval;
    if (autoUpdate && aiFeature === 'commentary') {
      interval = setInterval(() => {
        generateAIContent('auto');
      }, 15000);
    }
    return () => clearInterval(interval);
  }, [autoUpdate, selectedMatch, aiFeature]);

  // Load live matches from backend
  const loadLiveMatches = async () => {
    setLoadingMatches(true);
    try {
      const result = await matchAPI.getLive();
      if (result.data && result.data.length > 0) {
        setLiveMatches(result.data);
        setSelectedMatch(result.data[0]);
      }
      setError(null);
    } catch (err) {
      console.error('Error loading matches:', err);
      setError('Using demo data - backend not connected');
      // Keep using hardcoded demo data
    } finally {
      setLoadingMatches(false);
    }
  };

  // Load commentary for selected match
  const loadMatchCommentary = async () => {
    try {
      const result = await commentaryAPI.getMatchCommentary(selectedMatch.id);
      if (result.data) {
        setCommentary(result.data.map(c => ({
          minute: c.minute,
          text: c.text,
          type: c.type,
          timestamp: c.createdAt,
          sentiment: c.sentiment
        })));
      }
    } catch (err) {
      console.error('Error loading commentary:', err);
      // Keep existing commentary or show empty
    }
  };

  // Generate AI content based on selected feature
  const generateAIContent = async (trigger = 'manual') => {
    if (isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      let result;
      
      switch(aiFeature) {
        case 'commentary':
          result = await commentaryAPI.generate(selectedMatch.id, customPrompt);
          const newCommentary = {
            minute: result.data.minute,
            text: result.data.text,
            type: result.data.type,
            timestamp: result.data.createdAt || new Date().toISOString(),
            sentiment: result.data.sentiment
          };
          setCommentary(prev => [...prev, newCommentary]);
          break;
          
        case 'prediction':
          result = await predictionAPI.generate(selectedMatch.id);
          setPredictions(prev => [...prev, {
            text: result.data.text,
            timestamp: result.data.createdAt || new Date().toISOString(),
            confidence: result.data.confidence
          }]);
          break;
          
        case 'analysis':
          result = await analysisAPI.generate(selectedMatch.id);
          setAnalysis(result.data.text);
          break;
          
        case 'insights':
          // You can add insights API call here
          result = await analysisAPI.generate(selectedMatch.id);
          setAnalysis(result.data.text);
          break;
      }

      setCustomPrompt('');

    } catch (error) {
      console.error('Error generating content:', error);
      setError(error.response?.data?.message || 'Failed to generate content. Using demo mode.');
      
      // Fallback for demo/offline mode
      const fallback = {
        minute: selectedMatch.minute || Math.floor(Math.random() * 90),
        text: `[DEMO MODE] The match continues with high intensity. ${selectedMatch.home.name} are pushing forward with determination. The atmosphere is electric!`,
        type: 'general',
        timestamp: new Date().toISOString(),
        sentiment: 'neutral'
      };
      
      if (aiFeature === 'commentary') {
        setCommentary(prev => [...prev, fallback]);
      } else if (aiFeature === 'prediction') {
        setPredictions(prev => [...prev, {
          text: `[DEMO] Based on current performance, ${selectedMatch.home.name} has a 65% chance of winning this match.`,
          timestamp: new Date().toISOString(),
          confidence: 65
        }]);
      } else if (aiFeature === 'analysis') {
        setAnalysis(`[DEMO] Tactical Analysis: ${selectedMatch.home.name} are dominating possession but need to be more clinical in front of goal. Their defensive organization has been solid.`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const detectCommentaryType = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('goal') || lower.includes('score')) return 'goal';
    if (lower.includes('save') || lower.includes('keeper')) return 'save';
    if (lower.includes('foul') || lower.includes('card')) return 'foul';
    if (lower.includes('corner') || lower.includes('free kick')) return 'setpiece';
    if (lower.includes('substitution') || lower.includes('change')) return 'sub';
    return 'general';
  };

  const detectSentiment = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('goal') || lower.includes('brilliant') || lower.includes('spectacular')) return 'exciting';
    if (lower.includes('miss') || lower.includes('unlucky') || lower.includes('unfortunate')) return 'disappointing';
    return 'neutral';
  };

  const getTypeStyle = (type) => {
    const styles = {
      goal: { border: '#e50914', bg: 'rgba(229, 9, 20, 0.15)', icon: '⚽' },
      save: { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', icon: '🧤' },
      foul: { border: '#eab308', bg: 'rgba(234, 179, 8, 0.15)', icon: '⚠️' },
      setpiece: { border: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', icon: '🎯' },
      sub: { border: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', icon: '🔄' },
      general: { border: '#6b7280', bg: 'rgba(107, 114, 128, 0.15)', icon: '📋' }
    };
    return styles[type] || styles.general;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000000', position: 'relative', overflow: 'hidden' }}>
      
      {/* Animated Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 20% 0%, rgba(229, 9, 20, 0.15), transparent 50%), radial-gradient(ellipse at 80% 0%, rgba(229, 9, 20, 0.15), transparent 50%)'
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(229, 9, 20, 0.05) 25%, rgba(229, 9, 20, 0.05) 26%, transparent 27%, transparent 74%, rgba(229, 9, 20, 0.05) 75%, rgba(229, 9, 20, 0.05) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(229, 9, 20, 0.05) 25%, rgba(229, 9, 20, 0.05) 26%, transparent 27%, transparent 74%, rgba(229, 9, 20, 0.05) 75%, rgba(229, 9, 20, 0.05) 76%, transparent 77%)',
          backgroundSize: '100px 100px',
          opacity: 0.3,
          animation: 'fieldMove 30s linear infinite'
        }} />
      </div>

      <style>{`
        @keyframes fieldMove { 0% { transform: translate(0, 0); } 100% { transform: translate(100px, 100px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1600px', margin: '0 auto', padding: '1.5rem' }}>
        
        {/* Error Banner */}
        {error && (
          <div style={{
            padding: '1rem',
            background: 'rgba(234, 179, 8, 0.1)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '12px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <AlertCircle size={20} style={{ color: '#eab308' }} />
            <span style={{ color: '#eab308', fontSize: '0.875rem' }}>{error}</span>
          </div>
        )}

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.98), rgba(13, 13, 13, 0.98))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(229, 9, 20, 0.2)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 10px 40px rgba(229, 9, 20, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '60px', height: '60px',
                background: 'linear-gradient(135deg, #e50914, #ff1f2a)',
                borderRadius: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(229, 9, 20, 0.5)'
              }}>
                <Sparkles style={{ width: '32px', height: '32px', color: '#ffffff' }} />
              </div>
              <div>
                <h1 style={{
                  fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0,
                  background: 'linear-gradient(135deg, #ffffff, #e50914)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                }}>
                  InsightOS AI Commentary
                </h1>
                <p style={{ margin: 0, color: '#737373', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={14} /> Real-time AI-powered sports analysis & predictions
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div style={{ padding: '0.5rem 1rem', background: 'rgba(229, 9, 20, 0.2)', borderRadius: '8px', border: '1px solid rgba(229, 9, 20, 0.3)' }}>
                <span style={{ fontSize: '0.75rem', color: '#737373', marginRight: '0.5rem' }}>LIVE MATCHES</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e50914' }}>{liveMatches.length}</span>
              </div>
              <button onClick={() => setAutoUpdate(!autoUpdate)} style={{
                padding: '0.5rem 1rem', borderRadius: '8px', border: 'none',
                background: autoUpdate ? 'linear-gradient(135deg, #e50914, #c40812)' : 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem'
              }}>
                {autoUpdate ? <><Pause size={16} /> LIVE</> : <><Play size={16} /> START</>}
              </button>
              <button onClick={loadLiveMatches} disabled={loadingMatches} style={{
                padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(229, 9, 20, 0.3)',
                background: 'rgba(255, 255, 255, 0.05)', color: '#ffffff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem'
              }}>
                <RefreshCw size={16} style={{ animation: loadingMatches ? 'spin 1s linear infinite' : 'none' }} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Live Matches Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {liveMatches.map(match => (
            <button
              key={match.id}
              onClick={() => setSelectedMatch(match)}
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                border: selectedMatch.id === match.id ? '2px solid #e50914' : '1px solid rgba(255, 255, 255, 0.1)',
                background: selectedMatch.id === match.id 
                  ? 'linear-gradient(135deg, rgba(229, 9, 20, 0.2), rgba(229, 9, 20, 0.05))' 
                  : 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(13, 13, 13, 0.95))',
                backdropFilter: 'blur(20px)',
                color: '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s',
                animation: 'slideIn 0.5s ease-out'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#737373' }}>{match.sport}</span>
                  <span style={{ fontSize: '0.7rem', color: '#4a4a4a', marginLeft: '0.5rem' }}>• {match.league}</span>
                </div>
                <span style={{
                  padding: '0.25rem 0.75rem', background: '#e50914', color: '#ffffff',
                  fontSize: '0.7rem', borderRadius: '999px', fontWeight: 700,
                  animation: 'pulse 2s ease-in-out infinite', display: 'flex', alignItems: 'center', gap: '0.25rem'
                }}>
                  <span style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '50%' }} />
                  {match.status}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{match.home.logo}</span>
                    <span>{match.home.name}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{match.away.logo}</span>
                    <span>{match.away.name}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#e50914', lineHeight: 1 }}>{match.home.score}</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#e50914', lineHeight: 1 }}>{match.away.score}</div>
                </div>
              </div>

              <div style={{ padding: '0.75rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#737373' }}>
                  <Timer size={14} />
                  <span>{match.minute ? `${match.minute}'` : match.quarter || match.over || match.set}</span>
                  {match.possession && (
                    <>
                      <span style={{ margin: '0 0.5rem', color: '#333' }}>|</span>
                      <Activity size={14} />
                      <span>Possession: {match.possession.home}% - {match.possession.away}%</span>
                    </>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          
          {/* Left Panel */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(13, 13, 13, 0.95))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(229, 9, 20, 0.2)',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.5rem' }}>
              {[
                { id: 'commentary', label: 'Commentary', icon: MessageSquare },
                { id: 'prediction', label: 'Predictions', icon: Target },
                { id: 'analysis', label: 'Analysis', icon: Brain },
                { id: 'insights', label: 'Insights', icon: Sparkles }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => { setActiveTab(tab.id); setAiFeature(tab.id); }} style={{
                    flex: 1, padding: '0.75rem', borderRadius: '8px', border: 'none',
                    background: activeTab === tab.id ? 'rgba(229, 9, 20, 0.2)' : 'transparent',
                    color: activeTab === tab.id ? '#e50914' : '#737373',
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'all 0.3s'
                  }}>
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div style={{ height: '600px', overflowY: 'auto', padding: '1.5rem' }}>
              
              {activeTab === 'commentary' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {commentary.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                      <MessageSquare style={{ width: '64px', height: '64px', color: '#333', margin: '0 auto 1rem' }} />
                      <p style={{ color: '#737373', fontSize: '1.125rem', margin: 0 }}>No commentary yet</p>
                      <p style={{ color: '#4a4a4a', fontSize: '0.875rem', margin: '0.5rem 0 0' }}>Click Generate to start</p>
                    </div>
                  ) : (
                    commentary.map((item, idx) => {
                      const style = getTypeStyle(item.type);
                      return (
                        <div key={idx} style={{
                          padding: '1.25rem', borderRadius: '12px',
                          background: style.bg,
                          border: `1px solid ${style.border}`,
                          borderLeft: `4px solid ${style.border}`,
                          animation: 'slideIn 0.5s ease-out'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <span style={{ fontSize: '1.25rem' }}>{style.icon}</span>
                              <span style={{
                                padding: '0.25rem 0.75rem', background: 'rgba(0, 0, 0, 0.3)',
                                borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700
                              }}>
                                {item.minute}'
                              </span>
                              <span style={{
                                padding: '0.25rem 0.75rem', background: 'rgba(229, 9, 20, 0.2)',
                                borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600,
                                color: '#e50914', textTransform: 'uppercase'
                              }}>
                                {item.type}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#737373' }}>
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p style={{ margin: 0, color: '#ffffff', lineHeight: 1.7, fontWeight: 500 }}>{item.text}</p>
                        </div>
                      );
                    })
                  )}
                  
                  {isGenerating && (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
                      background: 'rgba(229, 9, 20, 0.1)', border: '1px solid rgba(229, 9, 20, 0.3)', borderRadius: '12px'
                    }}>
                      <RefreshCw style={{ animation: 'spin 1s linear infinite', marginRight: '0.75rem', color: '#e50914' }} />
                      <span style={{ color: '#e50914', fontWeight: 600 }}>AI is generating commentary...</span>
                    </div>
                  )}
                  
                  <div ref={commentaryEndRef} />
                </div>
              )}

              {activeTab === 'prediction' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ padding: '1.5rem', background: 'rgba(229, 9, 20, 0.1)', border: '1px solid rgba(229, 9, 20, 0.3)', borderRadius: '12px' }}>
                    <h3 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem' }}>
                      <Target style={{ color: '#e50914' }} />
                      Match Predictions
                    </h3>
                    {predictions.length === 0 ? (
                      <p style={{ color: '#737373', margin: 0 }}>Click generate to get AI predictions</p>
                    ) : (
                      predictions.map((pred, idx) => (
                        <div key={idx} style={{ padding: '1rem', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', marginTop: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', color: '#737373' }}>
                              {new Date(pred.timestamp).toLocaleTimeString()}
                            </span>
                            <span style={{
                              padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.2)',
                              color: '#10b981', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700
                            }}>
                              {pred.confidence}% Confidence
                            </span>
                          </div>
                          <p style={{ color: '#ffffff', margin: 0, lineHeight: 1.6 }}>{pred.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'analysis' && (
                <div style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '12px' }}>
                  <h3 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem' }}>
                    <Brain style={{ color: '#3b82f6' }} />
                    Tactical Analysis
                  </h3>
                  {analysis ? (
                    <p style={{ color: '#ffffff', margin: 0, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{analysis}</p>
                  ) : (
                    <p style={{ color: '#737373', margin: 0 }}>Click generate to get tactical analysis</p>
                  )}
                </div>
              )}

              {activeTab === 'insights' && (
                <div style={{ padding: '1.5rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px' }}>
                  <h3 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem' }}>
                    <Sparkles style={{ color: '#8b5cf6' }} />
                    AI Insights
                  </h3>
                  <p style={{ color: '#737373', margin: 0 }}>Click generate to get key insights</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{
              background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.98), rgba(13, 13, 13, 0.98))',
              backdropFilter: 'blur(20px)', border: '1px solid rgba(229, 9, 20, 0.2)',
              borderRadius: '16px', padding: '1.5rem'
            }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 size={20} style={{ color: '#e50914' }} />
                Match Statistics
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(selectedMatch.stats).map(([key, values]) => (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', color: '#737373', textTransform: 'capitalize' }}>
                      <span>{Array.isArray(values) ? values[0] : values}</span>
                      <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span>{Array.isArray(values) ? values[1] : ''}</span>
                    </div>
                    {Array.isArray(values) && (
                      <div style={{ display: 'flex', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${(values[0] / (values[0] + values[1])) * 100}%`, background: '#e50914' }} />
                        <div style={{ width: `${(values[1] / (values[0] + values[1])) * 100}%`, background: '#737373' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.98), rgba(13, 13, 13, 0.98))',
              backdropFilter: 'blur(20px)', border: '1px solid rgba(229, 9, 20, 0.2)',
              borderRadius: '16px', padding: '1.5rem', flex: 1
            }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={20} style={{ color: '#e50914' }} />
                AI Control
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Describe a moment or ask for specific analysis..."
                  disabled={isGenerating}
                  style={{
                    padding: '1rem', borderRadius: '12px', border: '1px solid rgba(229, 9, 20, 0.2)',
                    background: 'rgba(13, 18, 32, 0.55)', color: '#ffffff', fontSize: '0.875rem',
                    resize: 'vertical', minHeight: '100px', fontFamily: 'Inter, sans-serif', outline: 'none'
                  }}
                />

                <button
                  onClick={() => generateAIContent('manual')}
                  disabled={isGenerating}
                  style={{
                    padding: '1rem', borderRadius: '12px', border: 'none',
                    background: isGenerating ? 'rgba(115, 115, 115, 0.3)' : 'linear-gradient(135deg, #e50914, #c40812)',
                    color: '#ffffff', cursor: isGenerating ? 'not-allowed' : 'pointer',
                    fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '0.5rem', transition: 'all 0.3s',
                    boxShadow: isGenerating ? 'none' : '0 10px 40px rgba(229, 9, 20, 0.4)'
                  }}
                >
                  <Bot size={20} />
                  {isGenerating ? 'Generating...' : `Generate ${aiFeature.charAt(0).toUpperCase() + aiFeature.slice(1)}`}
                </button>

                <label style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px', cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={autoUpdate}
                    onChange={(e) => setAutoUpdate(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#e50914' }}
                  />
                  <span style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 500 }}>
                    Auto-generate every 15 seconds
                  </span>
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    onClick={() => {
                      const text = commentary.map(c => `[${c.minute}']\n${c.text}\n`).join('\n');
                      const blob = new Blob([text], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `commentary-${selectedMatch.home.name}-vs-${selectedMatch.away.name}.txt`;
                      a.click();
                    }}
                    style={{
                      padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(229, 9, 20, 0.3)',
                      background: 'rgba(255, 255, 255, 0.05)', color: '#ffffff', cursor: 'pointer',
                      fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '0.5rem'
                    }}
                  >
                    <Download size={16} />
                    Export
                  </button>
                  
                  <button
                    onClick={() => {
                      if (window.confirm('Clear all data?')) {
                        setCommentary([]);
                        setPredictions([]);
                        setAnalysis('');
                      }
                    }}
                    style={{
                      padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(229, 9, 20, 0.3)',
                      background: 'rgba(255, 255, 255, 0.05)', color: '#ffffff', cursor: 'pointer',
                      fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '0.5rem'
                    }}
                  >
                    <RefreshCw size={16} />
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISportsCommentary;