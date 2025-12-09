import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
});

socket.on("connect", () => {
  console.log("🔌 Connected to backend:", socket.id);
});

socket.on("disconnect", () => {
  console.warn("❌ Disconnected from backend");
});

export default socket;
