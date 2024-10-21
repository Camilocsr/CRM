import React, { useState, useEffect } from 'react';
import Split from 'react-split';
import { Lead, ChatInterfaceProps } from './types';
import LeadList from './LeadList';
import ChatWindow from './ChatWindow';
import SearchBar from './SearchBar';
import ChatCategories from './ChatCategories';
import '../../css/Agentes/ChatInterface.css';
import { googleLogout } from '@react-oauth/google';
import { fetchLeadsByCategory } from '../../services/leadService';

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  agente,
  downloads,
  searchTerm,
  setSearchTerm,
  setSelectedCategory,
  selectedChat,
  setSelectedChat,
  downloadFile,
  enpointAwsBucked,
  enpointSenderMessage,
  setEmail
}) => {
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('Todos');

  useEffect(() => {
    if (agente) {
      handleCategoryChange('Todos');
    }
  }, [agente]);

  const handleCategoryChange = async (category: string) => {
    setIsLoading(true);
    setCurrentCategory(category);
    setSelectedCategory(category);
    try {
      const leads = await fetchLeadsByCategory(category, agente?.nombre || '');
      setFilteredLeads(leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setFilteredLeads([]);
    }
    setIsLoading(false);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      handleCategoryChange(currentCategory);
    } else {
      const searchedLeads = filteredLeads.filter((lead: Lead) => {
        const lowerCaseSearchTerm = term.toLowerCase();
        return lead.nombre?.toLowerCase().includes(lowerCaseSearchTerm) ||
          lead.numeroWhatsapp.includes(lowerCaseSearchTerm);
      });
      setFilteredLeads(searchedLeads);
    }
  };

  const handleLogout = () => {
    googleLogout();
    setEmail('');
    console.log('Sesión de Google cerrada');
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
          <h1 className="text-xl font-semibold">Whatsapp Innovacion.</h1>
          <button className='Btn_Cerrar_Sesion' onClick={handleLogout}>Cerrar sesion.</button>
        </div>
        <SearchBar searchTerm={searchTerm} setSearchTerm={handleSearch} />
        <ChatCategories onCategoryChange={handleCategoryChange} />
        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          <LeadList leads={filteredLeads} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
        )}
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