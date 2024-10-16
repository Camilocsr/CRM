import React, { useState } from 'react';
import axios from 'axios';
import '../../css/Agentes/LeadSidebar.css';

const enpointEditarLeads = import.meta.env.VITE_ENPOINT_SERVER_UPLOAD_LEAD;

interface LeadSidebarProps {
  lead: {
    nombre: string;
    numeroWhatsapp: string;
    urlPhotoPerfil: string;
  };
}

const LeadSidebar: React.FC<LeadSidebarProps> = ({ lead }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nombre, setNombre] = useState(lead.nombre);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(event.target.value);
  };

  const handleBlur = async () => {
    setIsEditing(false);

    try {
      const response = await axios.put(`${enpointEditarLeads}${lead.numeroWhatsapp}`, { nombre });

      if (response.status === 200) {
        console.log('Lead actualizado correctamente');
      } else {
        throw new Error('Error al actualizar el lead');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div className="lead-sidebar">
      <div className="lead-info">
        <div className="lead-avatar">
          <img src={lead.urlPhotoPerfil} alt={lead.nombre} className="lead-avatar-img" />
        </div>
        <div>
          {isEditing ? (
            <input
              type="text"
              value={nombre}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="edit-input"
              autoFocus
            />
          ) : (
            <h2 onClick={handleEditClick}>{nombre}</h2>
          )}
          <p>{lead.numeroWhatsapp}</p>
        </div>
      </div>
      <div className="lead-actions">
        <button className="action-btn edit" onClick={handleEditClick}>✏️</button>
      </div>
      <div className="conversation-actions">
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