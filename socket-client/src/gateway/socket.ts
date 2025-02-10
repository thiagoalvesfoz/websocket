// socket.ts
import { io } from "socket.io-client";

const SERVER_URL = 'wss://thiago.soluctions/chat';
  
const socket = io(SERVER_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: false,
});

export default socket;
