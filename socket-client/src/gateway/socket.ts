// socket.ts
import { io } from "socket.io-client";

const SERVER_URL =
  process.env.NEX_PUBLIC_SERVER_URL ?? 'ws://localhost:3000/chat';

const socket = io(SERVER_URL, {
  autoConnect: false, // Evita conexão automática
});

export default socket;
