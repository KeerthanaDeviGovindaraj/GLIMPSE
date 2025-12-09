// services/websocketService.js
const WebSocket = require('ws');

class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Map();
    this.rooms = new Map();
  }

  initialize(server) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on('connection', (ws, req) => {
      const clientId = this.generateClientId();
      this.clients.set(clientId, {
        ws,
        id: clientId,
        ip: req.socket.remoteAddress,
        connectedAt: new Date()
      });

      console.log(`✅ Client connected: ${clientId} (Total: ${this.clients.size})`);

      ws.on('message', (message) => {
        this.handleMessage(clientId, message);
      });

      ws.on('close', () => {
        this.handleDisconnect(clientId);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
      });

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'connection',
        clientId,
        message: 'Connected to InsightOS Commentary'
      });
    });

    console.log('🔌 WebSocket server initialized');
  }

  handleMessage(clientId, message) {
    try {
      const data = JSON.parse(message);
      console.log(`📨 Message from ${clientId}:`, data.type);

      switch (data.type) {
        case 'join_room':
          this.joinRoom(clientId, data.room);
          break;
        case 'leave_room':
          this.leaveRoom(clientId, data.room);
          break;
        case 'commentary':
          this.broadcastToRoom(data.room, {
            type: 'commentary',
            data: data.payload,
            from: clientId
          });
          break;
        case 'ping':
          this.sendToClient(clientId, { type: 'pong' });
          break;
        default:
          console.log(`Unknown message type: ${data.type}`);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  handleDisconnect(clientId) {
    // Remove from all rooms
    this.rooms.forEach((members, roomId) => {
      if (members.has(clientId)) {
        this.leaveRoom(clientId, roomId);
      }
    });

    this.clients.delete(clientId);
    console.log(`❌ Client disconnected: ${clientId} (Total: ${this.clients.size})`);
  }

  joinRoom(clientId, roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }

    this.rooms.get(roomId).add(clientId);
    console.log(`👥 Client ${clientId} joined room ${roomId}`);

    this.sendToClient(clientId, {
      type: 'joined_room',
      room: roomId,
      members: this.rooms.get(roomId).size
    });

    this.broadcastToRoom(roomId, {
      type: 'user_joined',
      clientId,
      members: this.rooms.get(roomId).size
    }, clientId);
  }

  leaveRoom(clientId, roomId) {
    if (this.rooms.has(roomId)) {
      this.rooms.get(roomId).delete(clientId);
      
      if (this.rooms.get(roomId).size === 0) {
        this.rooms.delete(roomId);
      } else {
        this.broadcastToRoom(roomId, {
          type: 'user_left',
          clientId,
          members: this.rooms.get(roomId).size
        });
      }

      console.log(`👋 Client ${clientId} left room ${roomId}`);
    }
  }

  sendToClient(clientId, data) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(data));
    }
  }

  broadcastToRoom(roomId, data, excludeClientId = null) {
    if (!this.rooms.has(roomId)) return;

    const members = this.rooms.get(roomId);
    members.forEach(clientId => {
      if (clientId !== excludeClientId) {
        this.sendToClient(clientId, data);
      }
    });
  }

  broadcast(data, excludeClientId = null) {
    this.clients.forEach((client, clientId) => {
      if (clientId !== excludeClientId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(data));
      }
    });
  }

  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getStats() {
    return {
      totalClients: this.clients.size,
      totalRooms: this.rooms.size,
      rooms: Array.from(this.rooms.entries()).map(([roomId, members]) => ({
        roomId,
        members: members.size
      }))
    };
  }
}

module.exports = new WebSocketService();