import React from 'react';
import '../../css/Agentes/LeadSidebar.css';

interface LeadSidebarProps {
  lead: {
    nombre: string;
    numeroWhatsapp: string;
    urlPhotoPerfil: string;
  };
}

const LeadSidebar: React.FC<LeadSidebarProps> = ({ lead }) => {
  return (
    <div className="lead-sidebar">
      <div className="lead-info">
        <div className="lead-avatar">
          <img src={lead.urlPhotoPerfil} alt={lead.nombre} className="lead-avatar-img" />
        </div>
        <div>
          <h2>{lead.nombre}</h2>
          <p>{lead.numeroWhatsapp}</p>
          {/* <p>No Disponible</p> */}
        </div>
      </div>
      <div className="lead-actions">
        <button className="action-btn edit">✏️</button>
        <button className="action-btn delete">🗑️</button>
      </div>
      <div className="conversation-actions">
        <h3>Acciones de conversación</h3>
        <div className="action-item">
          <label>Tipo de gestión</label>
          <select>
            <option>Ninguna</option>
            <option>Asignar a mí</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default LeadSidebar;