import React from 'react';
import { Lead } from './types';
import '../../css/Agentes/LeadList.css'

interface LeadListProps {
  leads: Lead[];
  selectedChat: number | null;
  setSelectedChat: (chatId: number) => void;
}

const LeadList: React.FC<LeadListProps> = ({ leads, selectedChat, setSelectedChat }) => {
  return (
    <div className="lead-list-container">
      {leads.map((lead) => (
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
              <span className="lead-time">12:34 PM</span>
            </div>
            <p className="lead-last-message">{lead.conversacion}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeadList;