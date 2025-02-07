// socket.ts
import { io } from "socket.io-client";

const SERVER_URL = 'wss://ec2-54-82-69-77.compute-1.amazonaws.com/chat';
  
const socket = io(SERVER_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: false,
});

export default socket;
