import ChatbotIcon from "./ChatbotIcon";

const ChatMessage = ({ chat }) => {
  const messageText = chat.parts?.[0]?.text || "";
  
  return (
    <div
      className={`message ${
        chat.role === "model" ? "bot" : "user"
      }-message`}
    >
      {chat.role === "model" && <ChatbotIcon />}
      <p className="message-text">{messageText}</p>
    </div>
  );
};

export default ChatMessage;