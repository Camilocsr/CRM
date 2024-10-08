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
        const fileName = msg.message.split('/').pop() || 'file';
        const isDownloaded = downloads.some(download => download.url.includes(msg.message) && download.chatId === selectedChat);
        
        const isAudio = msg.message.endsWith('.mp3') || msg.message.endsWith('.wav'); // o cualquier otra extensión de audio
        const isImage = msg.message.endsWith('.jpg') || msg.message.endsWith('.jpeg') || msg.message.endsWith('.png') || msg.message.endsWith('.gif');
        const isVideo = msg.message.endsWith('.mp4') || msg.message.endsWith('.mov'); // o cualquier otra extensión de video

        return (
          <div key={index} className={`flex mb-2 ${msg.Cliente ? 'justify-start' : 'justify-end'}`}>
            <div className={`message ${msg.Cliente ? 'cliente' : 'agente'}`}>
              {isFileUrl ? (
                isAudio ? (
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
                      Descargar archivo de audio
                    </button>
                  )
                ) : isImage ? (
                  <img src={msg.message} alt="Imagen" className="max-w-full h-auto" />
                ) : isVideo ? (
                  <video controls className="max-w-full h-auto">
                    <source src={msg.message} type="video/mp4" />
                    Tu navegador no soporta el video.
                  </video>
                ) : (
                  <span>No se puede mostrar el archivo.</span>
                )
              ) : (
                <span>{msg.message}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;