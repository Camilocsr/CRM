import React, { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface Conversacion {
  sender: string;
  message: string;
  time: string;
}

interface WebSocketMessage {
  numero: string;
  conversacion: Conversacion[];
}

interface WebSocketHandlerProps {
  url: string;
  onMessage: (data: WebSocketMessage) => void;
}

const WebSocketHandler: React.FC<WebSocketHandlerProps> = ({ url, onMessage }) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    console.log(`Connecting to Socket.IO server at: ${url}`);
    socketRef.current = io(url, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket']
    });

    socketRef.current.on('connect', () => {
      console.log('Socket.IO connection established');
    });

    socketRef.current.on('leadUpdate', (data: WebSocketMessage) => {
      console.log('Mensaje recibido del servidor:', data);
      onMessage(data);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url, onMessage]);

  return null;
};

export default WebSocketHandler;