import { useState, useEffect, useRef } from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null); // Reference to scroll to the bottom
  const chatBodyRef = useRef(null); // Reference to check if user is scrolling manually

  // Function to check if the user is at the bottom of the chat
  const isUserAtBottom = () => {
    const chatBody = chatBodyRef.current;
    return chatBody.scrollHeight === chatBody.scrollTop + chatBody.clientHeight;
  };

  const generateBotResponse = async (history) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = import.meta.env.VITE_API_URL;

    if (!API_KEY) {
      setChatHistory(prev => {
        const filtered = prev.filter(msg => !(msg.role === "model" && msg.parts?.[0]?.text === "Thinking..."));
        return [...filtered, { role: "model", parts: [{ text: "Error: API key not configured. Please add VITE_API_KEY to your .env file." }] }];
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
      
      if (!response.ok) {
        throw new Error(data.error?.message || "Something went wrong");
      }
      
      const apiResponse = data.candidates[0].content.parts[0].text;
      setChatHistory(prev => {
        const filteredHistory = prev.filter(msg => !(msg.role === "model" && msg.parts?.[0]?.text === "Thinking..."));
        return [...filteredHistory, { role: "model", parts: [{ text: apiResponse }] }];
      });
      
    } catch (error) {
      setChatHistory(prev => {
        const filteredHistory = prev.filter(msg => !(msg.role === "model" && msg.parts?.[0]?.text === "Thinking..."));
        return [...filteredHistory, { role: "model", parts: [{ text: `Error: ${error.message}. Please try again.` }] }];
      });
    }
  };

  // Scroll to the bottom only if the user is already at the bottom
  useEffect(() => {
    if (isUserAtBottom()) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

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

        <div
          className="chat-body"
          ref={chatBodyRef} // Add the ref here
          onScroll={() => {
            // If the user scrolls up manually, hide the auto-scroll hint
            if (!isUserAtBottom()) {
              chatEndRef.current.style.visibility = "hidden";
            } else {
              chatEndRef.current.style.visibility = "visible";
            }
          }}
        >
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hello! <br /> How can I assist you today?
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}

          {/* This div helps to auto-scroll to the bottom */}
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

export default App;
