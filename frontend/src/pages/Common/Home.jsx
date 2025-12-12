import React from "react";
import { FaFutbol, FaMicrophone, FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // <-- import hook
import "./Home.css";

const features = [
  { icon: <FaMicrophone />, title: "Real-time Commentary", desc: "Get instant AI-powered commentary for live matches with insightful analytics." },
  { icon: <FaFutbol />, title: "Fan Interaction", desc: "Engage with other fans and AI to discuss match highlights and predictions." },
  { icon: <FaChartBar />, title: "Performance Insights", desc: "Track team and player statistics with visually appealing, real-time dashboards." }
];

const Home = () => {
  const navigate = useNavigate(); // <-- hook for programmatic navigation

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Glimpse AI</h1>
          <p className="hero-subtitle">
            Revolutionizing sports commentary with cutting-edge AI.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-danger" onClick={() => navigate("/login")}>Log In</button>
            <button className="btn btn-outline-light" onClick={() => navigate("/dashboard")}>Dashboard</button>
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
    </div>
  );
};

export default Home;

