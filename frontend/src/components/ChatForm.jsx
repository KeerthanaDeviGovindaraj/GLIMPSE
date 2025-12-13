import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;

    inputRef.current.value = "";

    const newUserMessage = {
      role: "user",
      parts: [{ text: userMessage }]
    };

    setChatHistory((prev) => [...prev, newUserMessage]);

    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "Thinking..." }] }
      ]);
    }, 600);
    
    setTimeout(() => {
      generateBotResponse([...chatHistory, newUserMessage]);
    }, 700);
  };

  return (
    <form className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input"
        required
      />
      <button type="submit" className="material-symbols-rounded">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#1f1f1f"
        >
          <path d="M480-407 324-252q-11 11-27.5 11.5T268-252q-11-11-11-28t11-28l184-184q6-6 13-8.5t15-2.5q8 0 15 2.5t13 8.5l184 184q11 11 11.5 27.5T692-252q-11 11-28 11t-28-11L480-407Zm0-240L324-492q-11 11-27.5 11.5T268-492q-11-11-11-28t11-28l184-184q6-6 13-8.5t15-2.5q8 0 15 2.5t13 8.5l184 184q11 11 11.5 27.5T692-492q-11 11-28 11t-28-11L480-647Z" />
        </svg>
      </button>
    </form>
  );
};

export default ChatForm;