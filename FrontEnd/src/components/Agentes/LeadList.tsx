import React from 'react';
import { Lead } from './types';

interface LeadListProps {
  leads: Lead[];
  selectedChat: number | null;
  setSelectedChat: (chatId: number) => void;
}

const LeadList: React.FC<LeadListProps> = ({ leads, selectedChat, setSelectedChat }) => {
  return (
    <div className="overflow-y-auto h-[calc(100%-120px)]">
      {leads.map((lead) => (
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
  );
};

export default LeadList;