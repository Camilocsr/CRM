export interface Lead {
    id: number;
    nombre: string;
    numeroWhatsapp: string;
    conversacion: string;
}

export interface Agente {
    id: number;
    nombre: string;
    correo: string;
    rol: string;
    leads: Lead[];
}

export interface Message {
    Cliente?: string;
    Agente?: string;
    message: string;
}

export interface Download {
    url: string;
    fileName: string;
    downloaded: boolean;
    chatId: number;
}

export interface MessageSenderProps {
    selectedChat: number | null;
    numberWhatsApp: string; // Número de WhatsApp que ahora se pasa como prop
    nombreAgente: string; // Nombre del agente que ahora se pasa como prop
    enpointSenderMessage: string;
}