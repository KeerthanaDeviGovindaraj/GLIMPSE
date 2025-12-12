import ChatbotIcon from "./ChatbotIcon";

const ChatMessage = ({ chat }) => {
  // safely read message text
  let messageText = chat?.parts?.[0]?.text || "";

  // REMOVE all asterisk (*) characters
  messageText = messageText.replace(/\*/g, "");

  return (
    <div className={`message ${chat.role === "model" ? "bot" : "user"}-message`}>
      {chat.role === "model" && <ChatbotIcon />}
      <p className="message-text">{messageText}</p>
    </div>
  );
};

export default ChatMessage;
