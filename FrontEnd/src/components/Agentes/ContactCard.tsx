import React from 'react';
import { Phone } from 'lucide-react';
import './ContactCard.css';

interface Contact {
  name: string;
  profilePic: string;
  whatsapp: string;
}

interface ContactCardProps {
  contact: Contact | null;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  if (!contact) {
    return null;
  }

  const { name, profilePic, whatsapp } = contact;

  return (
    <div className="contact-card">
      <div className="contact-info">
        <img className="contact-avatar" src={profilePic} alt={name} />
        <h2 className="contact-name">{name}</h2>
      </div>
      <div className="contact-details">
        <div className="contact-phone">
          <Phone className="phone-icon" />
          <span className="phone-number">{whatsapp}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;