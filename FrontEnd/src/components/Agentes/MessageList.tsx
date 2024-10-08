import React, { useState } from 'react';
import { Message, Download } from './types';

interface MessageListProps {
  messages: Message[];
  selectedChat: number | null;
  downloads: Download[];
  downloadFile: (url: string, fileName: string, chatId: number) => Promise<void>;
  enpointAwsBucked: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, selectedChat, downloads, downloadFile, enpointAwsBucked }) => {
  const [audioPlaying, setAudioPlaying] = useState<{ [key: string]: boolean }>({});

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg, index) => {
        const isFileUrl = msg.message.includes(enpointAwsBucked);
        const fileName = msg.message.split('/').pop() || 'file.mp3';
        const isDownloaded = downloads.some(download => download.url.includes(msg.message) && download.chatId === selectedChat);
        
        return (
          <div key={index} className={`flex mb-2 ${msg.Cliente ? 'justify-start' : 'justify-end'}`}>
            <div className={`message ${msg.Cliente ? 'cliente' : 'agente'}`}>
              {isFileUrl ? (
                isDownloaded || audioPlaying[fileName] ? (
                  <audio 
                    controls 
                    onEnded={() => setAudioPlaying(prev => ({ ...prev, [fileName]: false }))}
                    src={downloads.find(d => d.fileName === fileName && d.chatId === selectedChat)?.url || msg.message}
                  >
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                ) : (
                  <button
                    className="text-blue-500 underline"
                    onClick={async () => {
                      if (selectedChat !== null) {
                        await downloadFile(msg.message, fileName, selectedChat);
                        setAudioPlaying(prev => ({ ...prev, [fileName]: true }));
                      }
                    }}
                  >
                    Descargar archivo
                  </button>
                )
              ) : (
                msg.message
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;