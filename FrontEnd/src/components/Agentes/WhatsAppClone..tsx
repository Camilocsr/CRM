import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Split from 'react-split';
import '../../css/Agentes/whatsappClone.css';
import { Agente, Message, Download } from './types';
import LeadList from './LeadList';
import ChatWindow from './ChatWindow';
import WebSocketHandler from './WebSocketHandler';
import SearchBar from './SearchBar';
import ChatCategories from './ChatCategories';

// Endpoints
const enpointAwsBucked = import.meta.env.VITE_ENPOINT_AWS_BUCKED;
const enpointSenderMessage = import.meta.env.VITE_ENPOINT_SENDER_MESSAGE;
const enpointGetInfoAgentes = import.meta.env.VITE_ENPOINT_GET_INFO_AGENTES;
const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

interface WebSocketMessage {
  numero: string;
  conversacion: Message[];
}

const WhatsAppClone: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [agente, setAgente] = useState<Agente | null>(null);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchAgenteData = async () => {
    try {
      const response = await fetch(`${enpointGetInfoAgentes}${encodeURIComponent('iudcdesarrollo@gamil.com')}`);
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

  const filteredLeads = agente?.leads.filter(lead => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      lead.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
      lead.numeroWhatsapp.includes(lowerCaseSearchTerm)
    );
  }) || [];

  return (
    <>
      <WebSocketHandler url={websocketUrl} onMessage={handleWebSocketMessage} />
      <Split
        className="flex h-screen bg-gray-100"
        sizes={[25, 75]}
        minSize={200}
        expandToMin={false}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
      >
        <div className="bg-white border-r overflow-hidden">
          <div className="p-4 bg-gray-200 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Whatsapp Innovacion.</h1>
          </div>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <ChatCategories/>
          <LeadList leads={filteredLeads} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatWindow
            selectedChat={selectedChat}
            agente={agente}
            downloads={downloads}
            downloadFile={downloadFile}
            enpointAwsBucked={enpointAwsBucked}
            enpointSenderMessage={enpointSenderMessage}
          />
        </div>
      </Split>
    </>
  );
};

export default WhatsAppClone;