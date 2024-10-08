import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import '../../css/whatsappClone.css';
import { Agente, Message, Download } from './types';
import LeadList from './LeadList';
import MessageList from './MessageList';
import ChatHeader from './ChatHeader';

const enpointAwsBucked = import.meta.env.VITE_ENPOINT_AWS_BUCKED;

const WhatsAppClone: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [agente, setAgente] = useState<Agente | null>(null);
  const [downloads, setDownloads] = useState<Download[]>([]);

  const fetchAgenteData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/getAgentes/${encodeURIComponent('iudcdesarrollo@gmail.com')}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setAgente(data);
    } catch (error) {
      console.error('Error fetching agente data:', error);
    }
  };

  useEffect(() => {
    fetchAgenteData();
  }, []);

  const downloadFile = async (url: string, fileName: string, chatId: number) => {
    const response = await axios.get(url, { responseType: 'blob' });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));

    setDownloads(prev => [...prev, { url: urlBlob, fileName, downloaded: true, chatId }]);
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
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 bg-white border-r">
        <div className="p-4 bg-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-semibold">WhatsApp</h1>
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

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <ChatHeader lead={agente?.leads.find((c) => c.id === selectedChat)} />
            {renderMessages()}
            <div className="p-4 bg-gray-200">
              <input
                type="text"
                placeholder="Type a message"
                className="w-full p-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-100">
            <p className="text-xl text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppClone;