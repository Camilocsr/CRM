import React from 'react';
import { Lead } from './types';
import { Video, Phone, MoreVertical } from 'lucide-react';

interface ChatHeaderProps {
  lead: Lead;
  onToggleSidebar: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ lead, onToggleSidebar }) => {
  return (
    <div className="p-3 bg-gray-200 flex justify-between items-center">
      <div>
        <h2 className="font-semibold text-lg">{lead.nombre}</h2>
        <p className="text-xs text-gray-600">{lead.numeroWhatsapp}</p>
      </div>
      <div className="flex space-x-4">
        <Video size={18} className="cursor-pointer" />
        <Phone size={18} className="cursor-pointer" />
        <MoreVertical size={18} className="cursor-pointer" onClick={onToggleSidebar} />
      </div>
    </div>
  );
};

export default ChatHeader;