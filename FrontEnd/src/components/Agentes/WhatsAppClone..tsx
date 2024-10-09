import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import Split from 'react-split';
import '../../css/whatsappClone.css';
import { Agente, Message, Download } from './types';
import LeadList from './LeadList';
import MessageList from './MessageList';
import ChatHeader from './ChatHeader';
import MessageSender from './MessageSender';

// Enpoint de aws.
const enpointAwsBucked = import.meta.env.VITE_ENPOINT_AWS_BUCKED;
// Enpoint del server.
const enpointSenderMessage = import.meta.env.VITE_ENPOINT_SENDER_MESSAGE;
const enpointGetInfoAgentes = import.meta.env.VITE_ENPOINT_GET_INFO_AGENTES;

const WhatsAppClone: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [agente, setAgente] = useState<Agente | null>(null);
  const [downloads, setDownloads] = useState<Download[]>([]);

  const fetchAgenteData = async () => {
    try {
      const response = await fetch(`${enpointGetInfoAgentes}${encodeURIComponent('iudcdesarrollo@gmail.com')}`);
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

  const renderMessages = () => {
    if (!selectedChat || !agente) return null;

    const selectedLead = agente.leads.find((c) => c.id === selectedChat);
    if (!selectedLead) return null;

    const messages: Message[] = JSON.parse(selectedLead.conversacion);

    return (
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <MessageList
          messages={messages}
          selectedChat={selectedChat}
          downloads={downloads}
          downloadFile={downloadFile}
          enpointAwsBucked={enpointAwsBucked}
        />
      </div>
    );
  };

  return (
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
          <h1 className="text-xl font-semibold">iudcdesarrollo@gmail.com</h1>
        </div>
        <div className="p-2">
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="bg-transparent ml-2 outline-none flex-1"
            />
          </div>
        </div>
        <LeadList leads={agente?.leads || []} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedChat ? (
          <>
            <ChatHeader lead={agente?.leads.find((c) => c.id === selectedChat) || null} />
            {renderMessages()}
            {agente && (
              <MessageSender
                selectedChat={selectedChat}
                numberWhatsApp={agente.leads.find((c) => c.id === selectedChat)?.numeroWhatsapp || ''}
                nombreAgente={agente.nombre}
                enpointSenderMessage={enpointSenderMessage}
              />
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-100">
            <p className="text-xl text-gray-500">Selecciona una conversación</p>
          </div>
        )}
      </div>
    </Split>
  );
};

export default WhatsAppClone;