"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Username } from "./components/username.component";
import { Sender } from "./components/sender.component";
import socket from "@/gateway/socket";

interface Payload {
  type: "JOIN" | "LEFT" | "SAY";
  message: string;
}

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Payload[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("username", (message) => {
      console.log(message);
      if (message === "OK") {
        setConnected(true);
      } else {
        alert("O usuário já existe na sala");
      }
    });

    socket.on("message", (message) => {
      console.log(message);
      setMessages((prev) => [...prev, message]);

      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSetUsername = useCallback((username: string) => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("username", username);
  }, []);

  const handleSendMessage = useCallback((message: string) => {
    socket.emit("message", { type: "SAY", message });
  }, []);

  if (!connected) {
    return (
      <div className="bg-gray-300 flex items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <Username handleSubmit={handleSetUsername} />
      </div>
    );
  }

  const messageClassName = {
    LEFT: "text-red-600 font-medium",
    JOIN: "text-green-600 font-medium",
    SAY: "text-gray-700",
  };

  return (
    <div className="bg-gray-300 flex items-center justify-center h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col w-full h-full bg-white rounded-md shadow-md p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Sala</h1>
          <button
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
            onClick={() => {
              socket.disconnect();
              setConnected(false);
            }}
          >
            Sair
          </button>
        </div>
        <div className="flex-1 bg-gray-100 rounded-md overflow-y-auto text-gray-700 p-2">
          <div className="space-y-1">
            {messages.map((payload, index) => (
              <div key={index} className={messageClassName[payload.type]}>
                {payload.message}
              </div>
            ))}
            <div className="h-[40px]" ref={messagesEndRef} />
          </div>
        </div>
        <Sender handleSubmit={handleSendMessage} />
      </div>
    </div>
  );
}
