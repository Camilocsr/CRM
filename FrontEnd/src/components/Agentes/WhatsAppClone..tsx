import React, { useState } from 'react';
import { Search, MoreVertical, Phone, Video, Send } from 'lucide-react';
import '../../css/whatsappClone.css'

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
}

const WhatsAppClone: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');

  const chats: Chat[] = [
    { id: 1, name: 'Alice', lastMessage: 'Hey, how are you?', time: '10:30 AM' },
    { id: 2, name: 'Bob', lastMessage: 'Can we meet tomorrow?', time: '9:45 AM' },
    { id: 3, name: 'Charlie', lastMessage: 'Thanks for the info!', time: 'Yesterday' },
  ];

  const handleSendMessage = (): void => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left sidebar */}
      <div className="w-1/3 bg-white border-r">
        <div className="p-4 bg-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-semibold">WhatsApp</h1>
          <MoreVertical size={20} />
        </div>
        <div className="p-2">
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="bg-transparent ml-2 outline-none flex-1"
            />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100%-120px)]">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer ${
                selectedChat === chat.id ? 'bg-gray-200' : ''
              }`}
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
              <div className="flex-1">
                <h2 className="font-semibold">{chat.name}</h2>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
              </div>
              <span className="text-xs text-gray-500">{chat.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right chat area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 bg-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <h2 className="font-semibold">
                  {chats.find((c) => c.id === selectedChat)?.name}
                </h2>
              </div>
              <div className="flex space-x-4">
                <Video size={20} />
                <Phone size={20} />
                <MoreVertical size={20} />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {/* Chat messages would go here */}
            </div>
            <div className="p-4 bg-gray-200 flex items-center">
              <input
                type="text"
                placeholder="Type a message"
                className="flex-1 rounded-full px-4 py-2 outline-none"
                value={message}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setMessage(e.target.value)
                }
              />
              <Send
                size={20}
                className="ml-2 text-green-500 cursor-pointer"
                onClick={handleSendMessage}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-100">
            <p className="text-xl text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppClone;