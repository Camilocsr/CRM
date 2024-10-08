import React, { useEffect, useState } from 'react';
import { Search, MoreVertical, Phone, Video } from 'lucide-react';
import '../../css/whatsappClone.css';

interface Lead {
  id: number;
  nombre: string;
  numeroWhatsapp: string;
  conversacion: string;
}

interface Agente {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  leads: Lead[];
}

interface Message {
  Cliente?: string;
  Agente?: string;
  message: string;
}

const WhatsAppClone: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [agente, setAgente] = useState<Agente | null>(null);

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

  const renderMessages = () => {
    if (!selectedChat) return null;

    const selectedLead = agente?.leads.find((c) => c.id === selectedChat);
    if (!selectedLead) return null;

    const messages: Message[] = JSON.parse(selectedLead.conversacion);

    return (
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg: Message, index: number) => (
          <div key={index} className={`flex mb-2 ${msg.Cliente ? 'justify-start' : 'justify-end'}`}>
            <div className={`message ${msg.Cliente ? 'cliente' : 'agente'}`}>
              {msg.message}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 bg-white border-r">
        <div className="p-4 bg-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-semibold">WhatsApp</h1>
          <MoreVertical size={20} />
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
        <div className="overflow-y-auto h-[calc(100%-120px)]">
          {agente?.leads.map((lead) => (
            <div
              key={lead.id}
              className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer ${selectedChat === lead.id ? 'bg-gray-200' : ''}`}
              onClick={() => setSelectedChat(lead.id)}
            >
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
              <div className="flex-1">
                <h2 className="font-semibold">{lead.nombre}</h2>
                <p className="text-sm text-gray-600 truncate">{lead.conversacion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 bg-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <h2 className="font-semibold">
                  {agente?.leads.find((c) => c.id === selectedChat)?.nombre}
                </h2>
              </div>
              <div className="flex space-x-4">
                <Video size={20} />
                <Phone size={20} />
                <MoreVertical size={20} />
              </div>
            </div>

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