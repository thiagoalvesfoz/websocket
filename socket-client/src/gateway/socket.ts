// socket.ts
import { io } from "socket.io-client";

const SERVER_URL = 'ws://ec2-54-82-69-77.compute-1.amazonaws.com/chat';
  
const socket = io(SERVER_URL, {
  autoConnect: false, // Evita conexão automática
});

export default socket;
