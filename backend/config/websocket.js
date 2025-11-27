module.exports = {
  port: process.env.WS_PORT || 8080,
  heartbeat: 30000, // 30 seconds
  reconnectInterval: 5000, // 5 seconds
  maxReconnectAttempts: 5
};