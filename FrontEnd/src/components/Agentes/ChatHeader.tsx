import React from 'react';
import { Video, Phone, MoreVertical } from 'lucide-react';
import { Lead } from './types';

interface ChatHeaderProps {
  lead: Lead | undefined;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ lead }) => {
  return (
    <div className="p-4 bg-gray-200 flex justify-between items-center">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
        <h2 className="font-semibold">{lead?.nombre}</h2>
      </div>
      <div className="flex space-x-4">
        <Video size={20} />
        <Phone size={20} />
        <MoreVertical size={20} />
      </div>
    </div>
  );
};

export default ChatHeader;