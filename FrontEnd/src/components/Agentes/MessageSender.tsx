import React, { useState } from 'react';
import axios from 'axios';
import { MessageSenderProps } from './types';

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

    return (
        <div className="p-4 bg-gray-200 flex items-center">
            <input
                type="text"
                placeholder="Escribe un mensaje"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <button
                className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200"
                onClick={sendMessage}
            >
                Enviar
            </button>
        </div>
    );
};

export default MessageSender;