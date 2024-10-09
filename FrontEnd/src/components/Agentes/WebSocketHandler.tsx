import React, { useEffect, useRef } from 'react';

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
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.current.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      console.log('Mensaje recibido del servidor:', data);
      onMessage(data);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url, onMessage]);

  return null;
};

export default WebSocketHandler;