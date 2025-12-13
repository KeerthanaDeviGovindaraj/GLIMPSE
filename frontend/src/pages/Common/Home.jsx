import React, { useState, useEffect, useRef } from "react";
import { FaFutbol, FaMicrophone, FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Home.css";
// ✨ NEW: Chatbot imports
import ChatbotIcon from '../../components/ChatbotIcon';
import ChatForm from '../../components/ChatForm';
import ChatMessage from '../../components/ChatMessage';
// ✨ NEW: Import predefined Q&A
import { predefinedQA } from '../../components/predefinedQA';

const features = [
    { icon: <FaMicrophone />, title: "Real-time Commentary", desc: "Get instant AI-powered commentary for live matches with insightful analytics." },
    { icon: <FaFutbol />, title: "Fan Interaction", desc: "Engage with other fans and AI to discuss match highlights and predictions." },
    { icon: <FaChartBar />, title: "Performance Insights", desc: "Track team and player statistics with visually appealing, real-time dashboards." }
];

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    // ✨ NEW: Chatbot state
    const [chatHistory, setChatHistory] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const chatEndRef = useRef(null);
    const chatBodyRef = useRef(null);

    // ✨ NEW: Generate bot response function
    const generateBotResponse = async (history) => {
        const API_KEY = import.meta.env.VITE_API_KEY;
        const API_URL = import.meta.env.VITE_API_URL;

        if (!API_KEY) {
            setChatHistory(prev => {
                const filtered = prev.filter(
                    msg => !(msg.role === "model" && msg.parts?.[0]?.text === "Thinking...")
                );
                return [
                    ...filtered,
                    {
                        role: "model",
                        parts: [{ text: "Error: API key not configured. Please add VITE_API_KEY to your .env file." }]
                    }
                ];
            });
            return;
        }

        const fullURL = `${API_URL}?key=${API_KEY}`;
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: history })
        };

        try {
            const response = await fetch(fullURL, requestOptions);
            const data = await response.json();

            if (!response.ok) throw new Error(data.error?.message || "Something went wrong");

            const apiResponse = data.candidates[0].content.parts[0].text;

            setChatHistory(prev => {
                const filteredHistory = prev.filter(
                    msg => !(msg.role === "model" && msg.parts?.[0]?.text === "Thinking...")
                );
                return [...filteredHistory, { role: "model", parts: [{ text: apiResponse }] }];
            });

        } catch (error) {
            setChatHistory(prev => {
                const filteredHistory = prev.filter(
                    msg => !(msg.role === "model" && msg.parts?.[0]?.text === "Thinking...")
                );
                return [...filteredHistory, { role: "model", parts: [{ text: `Error: ${error.message}. Please try again.` }] }];
            });
        }
    };

    // ✨ NEW: Auto-scroll chat
    useEffect(() => {
        if (chatBodyRef.current) {
            const isAtBottom =
                chatBodyRef.current.scrollHeight ===
                chatBodyRef.current.scrollTop + chatBodyRef.current.clientHeight;

            if (isAtBottom) {
                chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [chatHistory]);

    // If logged in, show dashboard-style home
    if (isAuthenticated) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 100%)',
                color: 'white',
                padding: '40px',
                fontFamily: "'Inter', sans-serif"
            }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '3rem',
                        fontWeight: 400,
                        letterSpacing: '3px',
                        marginBottom: '16px',
                        textTransform: 'uppercase'
                    }}>
                        Welcome Back, {user?.username || user?.firstName || 'User'}
                    </h1>

                    <p style={{ fontSize: '1.125rem', color: '#a0a0a0', marginBottom: '48px' }}>
                        Ready to dive into live sports commentary?
                    </p>

                    {/* Quick Actions */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '24px',
                        marginBottom: '48px'
                    }}>
                        <div
                            onClick={() => navigate('/commentary')}
                            style={{
                                background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.2) 0%, rgba(229, 9, 20, 0.05) 100%)',
                                backdropFilter: 'blur(20px)',
                                padding: '32px',
                                borderRadius: '20px',
                                border: '1px solid rgba(229, 9, 20, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.4s',
                                textAlign: 'center'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 20px 60px rgba(229, 9, 20, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏏</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', fontWeight: 600 }}>Live Commentary</h3>
                            <p style={{ color: '#a0a0a0', fontSize: '0.9375rem' }}>Watch and comment on live matches</p>
                        </div>

                        <div
                            onClick={() => navigate('/profile')}
                            style={{
                                background: 'linear-gradient(135deg, rgba(36, 36, 36, 0.5) 0%, rgba(47, 47, 47, 0.3) 100%)',
                                backdropFilter: 'blur(20px)',
                                padding: '32px',
                                borderRadius: '20px',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                cursor: 'pointer',
                                transition: 'all 0.4s',
                                textAlign: 'center'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                            }}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👤</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', fontWeight: 600 }}>My Profile</h3>
                            <p style={{ color: '#a0a0a0', fontSize: '0.9375rem' }}>View and edit your profile</p>
                        </div>
                    </div>

                    {/* Features */}
                    <h2 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '2.5rem',
                        fontWeight: 400,
                        letterSpacing: '2px',
                        textAlign: 'center',
                        marginBottom: '40px',
                        textTransform: 'uppercase'
                    }}>
                        What You Can Do
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '32px'
                    }}>
                        {features.map((feature, index) => (
                            <div key={index} style={{
                                background: 'rgba(36, 36, 36, 0.4)',
                                backdropFilter: 'blur(20px)',
                                padding: '32px',
                                borderRadius: '20px',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '16px', color: '#E50914' }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', fontWeight: 600 }}>
                                    {feature.title}
                                </h3>
                                <p style={{ color: '#a0a0a0', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ✨ NEW: Chatbot Integration */}
                <button
                    className="chat-toggler"
                    onClick={() => setIsChatOpen(!isChatOpen)}
                >
                    💬
                </button>

                <div className={`chatbot-popup ${isChatOpen ? "open" : ""}`}>
                    <div className="chat-header">
                        <div className="header-info">
                            <ChatbotIcon />
                            <h2 className="logo-text">Chatbot</h2>
                        </div>

                        <button
                            className="material-symbols-rounded"
                            onClick={() => setIsChatOpen(false)}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="chat-body" ref={chatBodyRef}>
                        <div className="message bot-message">
                            <ChatbotIcon />
                            <p className="message-text">
                                Hello! <br /> How can I assist you today?
                            </p>
                        </div>

                        {/* ✨ NEW: Suggested Questions - Only when no chat history */}
                        {chatHistory.length === 0 && (
                            <div className="suggested-questions-inline">
                                <p className="suggestions-label">Quick questions:</p>
                                <div className="suggestions-grid">
                                    {predefinedQA.slice(0, 4).map((qa) => (
                                        <button
                                            key={qa.id}
                                            className="suggestion-btn"
                                            onClick={() => {
                                                const userMessage = {
                                                    role: "user",
                                                    parts: [{ text: qa.question }]
                                                };
                                                setChatHistory([userMessage]);
                                                setTimeout(() => {
                                                    setChatHistory(prev => [
                                                        ...prev,
                                                        { role: "model", parts: [{ text: qa.answer }] }
                                                    ]);
                                                }, 300);
                                            }}
                                            type="button"
                                        >
                                            {qa.question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {chatHistory.map((chat, index) => (
                            <ChatMessage key={index} chat={chat} />
                        ))}

                        <div ref={chatEndRef} style={{ visibility: "visible" }} />
                    </div>

                    <div className="chat-footer">
                        <ChatForm
                            setChatHistory={setChatHistory}
                            chatHistory={chatHistory}
                            generateBotResponse={generateBotResponse}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // NOT logged in - show landing page
    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Welcome to Glimpse AI</h1>
                    <p className="hero-subtitle">
                        Revolutionizing sports commentary with cutting-edge AI.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn btn-danger" onClick={() => navigate("/login")}>
                            Sign In
                        </button>
                        <button className="btn btn-outline-light" onClick={() => navigate("/register")}>
                            Create Account
                        </button>
                    </div>
                </div>

                {/* Floating particles */}
                <FaFutbol className="hero-particle" style={{ top: "10%", left: "15%" }} />
                <FaMicrophone className="hero-particle" style={{ top: "25%", left: "70%" }} />
                <FaChartBar className="hero-particle" style={{ top: "60%", left: "40%" }} />
            </section>

            <section className="features-section">
                <h2>Key Features</h2>
                <div className="features-container">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <div className="feature-title">{feature.title}</div>
                            <div className="feature-desc">{feature.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ✨ NEW: Chatbot Integration for non-logged in users */}
            <button
                className="chat-toggler"
                onClick={() => setIsChatOpen(!isChatOpen)}
            >
                💬
            </button>

            <div className={`chatbot-popup ${isChatOpen ? "open" : ""}`}>
                <div className="chat-header">
                    <div className="header-info">
                        <ChatbotIcon />
                        <h2 className="logo-text">Chatbot</h2>
                    </div>

                    <button
                        className="material-symbols-rounded"
                        onClick={() => setIsChatOpen(false)}
                    >
                        ✕
                    </button>
                </div>

                <div className="chat-body" ref={chatBodyRef}>
                    <div className="message bot-message">
                        <ChatbotIcon />
                        <p className="message-text">
                            Hello! <br /> How can I assist you today?
                        </p>
                    </div>

                    {/* ✨ NEW: Suggested Questions - Only when no chat history */}
                    {chatHistory.length === 0 && (
                        <div className="suggested-questions-inline">
                            <p className="suggestions-label">Quick questions:</p>
                            <div className="suggestions-grid">
                                {predefinedQA.slice(0, 4).map((qa) => (
                                    <button
                                        key={qa.id}
                                        className="suggestion-btn"
                                        onClick={() => {
                                            const userMessage = {
                                                role: "user",
                                                parts: [{ text: qa.question }]
                                            };
                                            setChatHistory([userMessage]);
                                            setTimeout(() => {
                                                setChatHistory(prev => [
                                                    ...prev,
                                                    { role: "model", parts: [{ text: qa.answer }] }
                                                ]);
                                            }, 300);
                                        }}
                                        type="button"
                                    >
                                        {qa.question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {chatHistory.map((chat, index) => (
                        <ChatMessage key={index} chat={chat} />
                    ))}

                    <div ref={chatEndRef} style={{ visibility: "visible" }} />
                </div>

                <div className="chat-footer">
                    <ChatForm
                        setChatHistory={setChatHistory}
                        chatHistory={chatHistory}
                        generateBotResponse={generateBotResponse}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;