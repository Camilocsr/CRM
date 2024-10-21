import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/Agentes/whatsappClone.css';
import { Agente, Message, Download } from './types';
import WebSocketHandler from './WebSocketHandler';
import ChatInterface from './ChatInterface';

// Endpoints
const enpointAwsBucked = import.meta.env.VITE_ENPOINT_AWS_BUCKED; // Donde se guardan todas las imagenes en la nube.
const enpointSenderMessage = import.meta.env.VITE_ENPOINT_SENDER_MESSAGE; // enponit del server para enviar mensajes a el cliente
const enpointGetInfoAgentes = import.meta.env.VITE_ENPOINT_GET_INFO_AGENTES; // Informacion relacionada con el Agente
const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL; // Epoint del server socked para la mensageriia

interface WebSocketMessage {
  numero: string;
  conversacion: Message[];
}

interface WhatsAppCloneProps {
  email: string;
}

const WhatsAppClone: React.FC<WhatsAppCloneProps> = ({ email }) => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [agente, setAgente] = useState<Agente | null>(null);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const fetchAgenteData = async () => {
    try {
      const response = await fetch(`${enpointGetInfoAgentes}${encodeURIComponent(`${email}`)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log(data);
      setAgente(data);
    } catch (error) {
      console.error('Error fetching agente data:', error);
    }
  };

  useEffect(() => {
    fetchAgenteData();
  }, []);

  const downloadFile = async (url: string, fileName: string, chatId: number) => {
    try {
      const response = await axios.get(url, { responseType: 'blob' });
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      setDownloads((prev) => [...prev, { url: urlBlob, fileName, downloaded: true, chatId }]);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleWebSocketMessage = (data: WebSocketMessage) => {
    if (agente) {
      const updatedLeads = agente.leads.map(lead => {
        if (lead.numeroWhatsapp === data.numero) {
          return { ...lead, conversacion: JSON.stringify(data.conversacion) };
        }
        return lead;
      });

      setAgente({ ...agente, leads: updatedLeads });
    }
  };

  return (
    <>
      <WebSocketHandler url={websocketUrl} onMessage={handleWebSocketMessage} />
      <ChatInterface
        agente={agente}
        downloads={downloads}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        downloadFile={downloadFile}
        enpointAwsBucked={enpointAwsBucked}
        enpointSenderMessage={enpointSenderMessage}
      />
    </>
  );
};

export default WhatsAppClone;