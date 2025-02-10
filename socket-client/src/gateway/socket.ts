// socket.ts
import { io } from "socket.io-client";

const SERVER_URL = 'ws://localhost:3000/chat';
  
const socket = io(SERVER_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: false,
});

export default socket;
