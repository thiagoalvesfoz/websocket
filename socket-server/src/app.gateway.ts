import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface Payload {
  type: 'JOIN' | 'LEFT' | 'SAY';
  username: string;
  message?: string;
  timestamp: Date;
}

@WebSocketGateway({
  cors: {
    origin: '*', // Allows requests from any origin
  },
  namespace: '/chat', // Defines a specific namespace for this gateway
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  // Map to store client IDs and their corresponding usernames
  private clients: Map<string, string> = new Map();
  private typingUsers = new Set<string>();

  afterInit() {
    console.log('WebSocket server initialized');
  }

  handleDisconnect(client: Socket) {
    const username = this.clients.get(client.id);

    if (username) {
      console.log(`Client disconnected: ${client.id} (${username})`);

      const message: Payload = {
        type: 'LEFT',
        username,
        timestamp: new Date(),
      };

      this.server.emit('message', message);
      this.clients.delete(client.id);
      this.server.emit('userActives', Array.from(this.clients.values()));
    }
  }
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('username')
  handleSetUsername(client: Socket, username: string) {
    if (this.isUsernameTaken(username)) {
      client.emit('username', 'Username is already taken');
      return;
    } else {
      client.emit('username', 'OK');
    }

    const payload: Payload = {
      type: 'JOIN',
      username,
      timestamp: new Date(),
    };

    this.clients.set(client.id, username);
    this.server.emit('message', payload);
    this.server.emit('userActives', Array.from(this.clients.values()));
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: Payload): void {
    if (payload.type === 'SAY') {
      const username = this.clients.get(client.id);

      if (!username) return;

      payload = {
        ...payload,
        username,
        timestamp: new Date(),
      };
    }

    this.server.emit('message', payload);
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket, isTyping: boolean): void {
    const username = this.clients.get(client.id);
    if (!username) return;

    if (isTyping) {
      this.typingUsers.add(username);
    } else {
      this.typingUsers.delete(username);
    }

    this.server.emit('typingUpdate', Array.from(this.typingUsers));
  }

  private isUsernameTaken(username: string): boolean {
    return Array.from(this.clients.values()).includes(username);
  }
}
