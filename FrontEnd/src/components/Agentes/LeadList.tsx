import React, { useMemo } from 'react';
import { Lead } from './types';
import '../../css/Agentes/LeadList.css';

interface LeadListProps {
  leads: Lead[];
  selectedChat: number | null;
  setSelectedChat: (chatId: number) => void;
}

const getLastMessageTime = (conversation: string): Date => {
  try {
    const parsedConversation = JSON.parse(conversation) || [];
    const lastMessage = parsedConversation[parsedConversation.length - 1];
    if (lastMessage && lastMessage.timestamp) {
      // Parse the timestamp directly
      return new Date(lastMessage.timestamp); // Esto devuelve un objeto Date
    }
    return new Date(0); // Devuelve la fecha de "epoca" si no hay mensajes
  } catch (error) {
    console.error('Error al parsear la conversación:', error);
    return new Date(0); // Devuelve la fecha de "epoca" en caso de error
  }
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const LeadList: React.FC<LeadListProps> = ({ leads, selectedChat, setSelectedChat }) => {
  const sortedLeads = useMemo(() => {
    return [...leads].sort((a, b) => {
      const timeA = getLastMessageTime(a.conversacion);
      const timeB = getLastMessageTime(b.conversacion);
      return timeB.getTime() - timeA.getTime();
    });
  }, [leads]);

  return (
    <div className="lead-list-container">
      {sortedLeads.map((lead) => (
        <div
          key={lead.id}
          className={`lead-item ${selectedChat === lead.id ? 'lead-item-selected' : ''}`}
          onClick={() => setSelectedChat(lead.id)}
        >
          <div className="lead-avatar">
            {lead.urlPhotoPerfil ? (
              <img src={lead.urlPhotoPerfil} alt={lead.nombre} className="lead-avatar-img" />
            ) : (
              <div className="lead-avatar-placeholder">
                {lead.nombre.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="lead-info">
            <div className="lead-header">
              <h2 className="lead-name">{lead.nombre}</h2>
              <span className="lead-time">{formatTime(getLastMessageTime(lead.conversacion))}</span>
            </div>
            <p className="lead-last-message">
              {JSON.parse(lead.conversacion)?.slice(-1)[0]?.message || 'Sin mensajes'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadList;