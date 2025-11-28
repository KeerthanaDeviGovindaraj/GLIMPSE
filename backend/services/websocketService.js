const WebSocket = require('ws');
const config = require('../config/websocket');

class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map();
    this.heartbeatInterval = null;
  }

  initialize(server) {
    this.wss = new WebSocket.Server({ server });
    console.log('🔌 WebSocket server initialized');

    this.wss.on('connection', (ws, req) => {
      const clientId = this.generateClientId();
      this.clients.set(clientId, { ws, alive: true });
      
      console.log(`✅ Client connected: ${clientId}`);

      // Send welcome message
      this.sendToClient(ws, 'connected', { clientId, message: 'Connected to InsightOS' });

      // Handle incoming messages
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(clientId, data);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      // Handle pong (heartbeat response)
      ws.on('pong', () => {
        const client = this.clients.get(clientId);
        if (client) client.alive = true;
      });

      // Handle disconnection
      ws.on('close', () => {
        this.clients.delete(clientId);
        console.log(`❌ Client disconnected: ${clientId}`);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for ${clientId}:`, error);
      });
    });

    // Start heartbeat
    this.startHeartbeat();
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach((client, clientId) => {
        if (!client.alive) {
          console.log(`💔 Terminating inactive client: ${clientId}`);
          client.ws.terminate();
          this.clients.delete(clientId);
          return;
        }
        
        client.alive = false;
        client.ws.ping();
      });
    }, config.heartbeat);
  }

  handleMessage(clientId, data) {
    console.log(`📨 Message from ${clientId}:`, data);
    
    switch (data.type) {
      case 'subscribe':
        this.handleSubscribe(clientId, data.channel);
        break;
      case 'unsubscribe':
        this.handleUnsubscribe(clientId, data.channel);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  handleSubscribe(clientId, channel) {
    const client = this.clients.get(clientId);
    if (client) {
      if (!client.subscriptions) client.subscriptions = new Set();
      client.subscriptions.add(channel);
      console.log(`✅ Client ${clientId} subscribed to ${channel}`);
    }
  }

  handleUnsubscribe(clientId, channel) {
    const client = this.clients.get(clientId);
    if (client && client.subscriptions) {
      client.subscriptions.delete(channel);
      console.log(`❌ Client ${clientId} unsubscribed from ${channel}`);
    }
  }

  broadcast(event, data, channel = null) {
    const message = JSON.stringify({ event, data, timestamp: new Date().toISOString() });
    
    this.clients.forEach((client, clientId) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        // If channel specified, only send to subscribed clients
        if (!channel || (client.subscriptions && client.subscriptions.has(channel))) {
          client.ws.send(message);
        }
      }
    });
  }

  sendToClient(ws, event, data) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ event, data, timestamp: new Date().toISOString() }));
    }
  }

  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  close() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    this.clients.forEach((client) => {
      client.ws.close();
    });
    
    if (this.wss) {
      this.wss.close();
    }
    
    console.log('🔌 WebSocket server closed');
  }
}

module.exports = new WebSocketService();