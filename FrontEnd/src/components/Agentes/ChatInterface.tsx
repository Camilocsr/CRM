import React from 'react';
import Split from 'react-split';
import { Agente, Lead, Download } from './types';
import LeadList from './LeadList';
import ChatWindow from './ChatWindow';
import SearchBar from './SearchBar';
import ChatCategories from './ChatCategories';

interface ChatInterfaceProps {
  agente: Agente | null;
  downloads: Download[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedChat: number | null;
  setSelectedChat: (chatId: number | null) => void;
  downloadFile: (url: string, fileName: string, chatId: number) => Promise<void>;
  enpointAwsBucked: string;
  enpointSenderMessage: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  agente,
  downloads,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedChat,
  setSelectedChat,
  downloadFile,
  enpointAwsBucked,
  enpointSenderMessage,
}) => {
  const filteredLeads = agente?.leads.filter((lead: Lead) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesSearch = lead.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
      lead.numeroWhatsapp.includes(lowerCaseSearchTerm);
    
    if (selectedCategory === 'Todos') {
      return matchesSearch;
    } else if (selectedCategory === 'Conversacion') {
      return matchesSearch && lead.TipoGestion === 'gestionado';
    } else if (selectedCategory === 'Sin gestionar') {
      return matchesSearch && lead.TipoGestion === 'no gestionado';
    }
    
  }) || [];

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
          <h1 className="text-xl font-semibold">Whatsapp Innovacion.</h1>
        </div>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <ChatCategories onCategoryChange={setSelectedCategory} />
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
  );
};

export default ChatInterface;