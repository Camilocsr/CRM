import React, { useState } from 'react';
import { Agente, Message, Download } from './types';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageSender from './MessageSender';
import LeadSidebar from './LeadSidebar';

interface ChatWindowProps {
  selectedChat: number | null;
  agente: Agente | null;
  downloads: Download[];
  downloadFile: (url: string, fileName: string, chatId: number) => Promise<void>;
  enpointAwsBucked: string;
  enpointSenderMessage: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedChat,
  agente,
  downloads,
  downloadFile,
  enpointAwsBucked,
  enpointSenderMessage,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    console.log('Se hizo clic en los tres puntos');
    setIsSidebarOpen((prev) => !prev);
  };

  if (!selectedChat || !agente) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-500">Selecciona una conversación</p>
      </div>
    );
  }

  const selectedLead = agente.leads.find((c) => c.id === selectedChat);
  if (!selectedLead) return null;

  const messages: Message[] = JSON.parse(selectedLead.conversacion);

  return (
    <>
      <ChatHeader lead={selectedLead} onToggleSidebar={toggleSidebar} />
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <MessageList
          messages={messages}
          selectedChat={selectedChat}
          downloads={downloads}
          downloadFile={downloadFile}
          enpointAwsBucked={enpointAwsBucked}
          profilePictureUrl={selectedLead.urlPhotoPerfil}
        />
      </div>
      <MessageSender
        selectedChat={selectedChat}
        numberWhatsApp={selectedLead.numeroWhatsapp}
        nombreAgente={agente.nombre}
        enpointSenderMessage={enpointSenderMessage}
        profilePictureUrl={selectedLead.urlPhotoPerfil}
      />

      {isSidebarOpen && (
        <LeadSidebar lead={selectedLead} />
      )}
    </>
  );
};

export default ChatWindow;