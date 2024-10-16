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
      return new Date(lastMessage.timestamp);
    }
    return new Date(0);
  } catch (error) {
    console.error('Error al parsear la conversación:', error);
    return new Date(0);
  }
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const countUnreadMessages = (conversation: string): number => {
  try {
    const parsedConversation = JSON.parse(conversation) || [];
    let count = 0;
    
    for (let i = parsedConversation.length - 1; i >= 0; i--) {
      if (parsedConversation[i].Cliente) {
        count++;
      } else if (parsedConversation[i].Agente) {
        break;
      }
    }

    return count;
  } catch (error) {
    console.error('Error al contar mensajes no leídos:', error);
    return 0;
  }
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
      {sortedLeads.map((lead) => {
        const unreadCount = countUnreadMessages(lead.conversacion);
        return (
          <div
            key={lead.id}
            className={`lead-item ${selectedChat === lead.id ? 'lead-item-selected' : ''}`}
            onClick={() => setSelectedChat(lead.id)}
          >
            <div className="lead-avatar">
              {lead.urlPhotoPerfil ? (
                <img src={lead.urlPhotoPerfil} alt={lead.nombre} className="lead-avatar-img" />
              ) : (
                lead.nombre.charAt(0).toUpperCase()
              )}
            </div>
            <div className="lead-info">
              <div className="lead-main-info">
                <h2 className="lead-name">{lead.nombre}</h2>
                <p className="lead-last-message">
                  {JSON.parse(lead.conversacion)?.slice(-1)[0]?.message || 'Sin mensajes'}
                </p>
              </div>
              <div className="lead-meta">
                <span className="lead-time">{formatTime(getLastMessageTime(lead.conversacion))}</span>
                {unreadCount > 0 && (
                  <span className="unread-count">{unreadCount}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeadList;