import { useState } from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);

  const generateBotResponse = async (history) => {
    // Get API key from environment - CHANGED to match your .env
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;
    
    // Debug logging
    console.log("✅ API Key exists:", !!API_KEY);
    console.log("✅ API URL exists:", !!API_URL);
    
    if (!API_KEY) {
      console.error("❌ API Key is missing!");
      setChatHistory(prev => {
        const filtered = prev.filter(
          msg => !(msg.role === "model" && msg.parts?.[0]?.text === "Thinking...")
        );
        return [...filtered, { 
          role: "model", 
          parts: [{ text: "Error: API key not configured. Please add VITE_API_KEY to your .env file." }] 
        }];
      });
      return;
    }

    // Use the URL from .env and append the API key
    const fullURL = `${API_URL}?key=${API_KEY}`;
    
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: history
      })
    };

    try {
      const response = await fetch(fullURL, requestOptions); 
      const data = await response.json();
      
      if (!response.ok) {
        console.error("API Error:", data);
        throw new Error(data.error?.message || "Something went wrong");
      }
      
      const apiResponse = data.candidates[0].content.parts[0].text;
      
      // Remove "Thinking..." and add actual bot response
      setChatHistory(prev => {
        const filteredHistory = prev.filter(
          msg => !(msg.role === "model" && msg.parts?.[0]?.text === "Thinking...")
        );
        return [...filteredHistory, { role: "model", parts: [{ text: apiResponse }] }];
      });
      
    } catch (error) {
      console.error("Error:", error);
      
      setChatHistory(prev => {
        const filteredHistory = prev.filter(
          msg => !(msg.role === "model" && msg.parts?.[0]?.text === "Thinking...")
        );
        return [...filteredHistory, { 
          role: "model", 
          parts: [{ text: `Error: ${error.message}. Please try again.` }] 
        }];
      });
    }
  };

  return (
    <div className="container">
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button className="material-symbols-rounded">
            keyboard_arrow_down
          </button>
        </div>

        <div className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hello! <br /> How can I assist you today?
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
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

export default App;