import React, { useState } from 'react';
import axios from 'axios';
import { MessageSenderProps } from './types';
import { Send, Mic, Paperclip } from 'lucide-react';
import '../../css/Agentes/MessageSender.css';

const MessageSender: React.FC<MessageSenderProps> = ({
    selectedChat,
    numberWhatsApp,
    nombreAgente,
    enpointSenderMessage
}) => {
    const [messageText, setMessageText] = useState<string>('');

    const sendMessage = async () => {
        if (!selectedChat || !messageText.trim()) return;

        const messagePayload = {
            number: numberWhatsApp,
            message: messageText,
            nombreAgente: nombreAgente
        };

        try {
            await axios.post(enpointSenderMessage, messagePayload);
            console.log('Mensaje enviado con éxito');
            setMessageText('');
        } catch (error) {
            console.error('Error enviando mensaje:', error);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };

    const handleAudioRecord = () => {
        // Implementar lógica para grabar audio
        console.log('Grabando audio...');
    };

    const handleFileUpload = () => {
        // Implementar lógica para subir archivos
        console.log('Subiendo archivo...');
    };

    return (
        <div className="message-sender-container">
            <input
                type="text"
                placeholder="Escribe un mensaje"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="message-input"
            />
            <button
                className="btn-action"
                onClick={handleAudioRecord}
                title="Grabar audio"
            >
                <Mic />
            </button>
            <button
                className="btn-action"
                onClick={handleFileUpload}
                title="Subir archivo"
            >
                <Paperclip />
            </button>
            <button
                className="btn-send"
                onClick={sendMessage}
                title="Enviar mensaje"
                disabled={!messageText.trim()}
            >
                <Send />
            </button>
        </div>
    );
};

export default MessageSender;