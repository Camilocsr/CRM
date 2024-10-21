import React from 'react';
import Split from 'react-split';
import { Lead, ChatInterfaceProps } from './types';
import LeadList from './LeadList';
import ChatWindow from './ChatWindow';
import SearchBar from './SearchBar';
import ChatCategories from './ChatCategories';
import '../../css/Agentes/ChatInterface.css'

const categoryToTipoGestionMap: { [key: string]: string | null } = {
  'Todos': null,
  'Conversacion': 'gestionado',
  'Sin gestionar': 'no gestionado',
  'Depuracion': 'depuracion',
  'Llamadas': 'llamada',
  'Segunda Llamada': 'segunda llamada',
  'Inscrito': 'inscrito',
  'Venta Perdida': 'venta perdida'
};

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

    const requiredTipoGestion = categoryToTipoGestionMap[selectedCategory];

    if (requiredTipoGestion === null) {
      return matchesSearch;
    }

    return matchesSearch && lead.TipoGestion === requiredTipoGestion;
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
          <button className='Btn_Cerrar_Sesion'>Cerrar sesion.</button>
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