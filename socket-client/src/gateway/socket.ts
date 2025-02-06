// socket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:3000/chat", {
  autoConnect: false, // Evita conexão automática
});

export default socket;
