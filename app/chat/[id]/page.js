// app/chat/[id]/page.js
'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import ChatHeader from '../../../components/chat/ChatHeader';
import ChatWindow from '../../../components/chat/ChatWindow';
import ChatInput from '../../../components/chat/ChatInput';
import useChat from '../../../hooks/useChat';

export default function ChatPage({ onToggleSidebar }) {
  const params = useParams();
  const chatId = params.id;
  
  const {
    chat,
    isLoading,
    isSending,
    error,
    sendMessage,
    updateTitle
  } = useChat(chatId);
  
  // Handle sending a new message
  const handleSendMessage = (content) => {
    sendMessage(content);
  };
  
  // Update chat title
  const handleUpdateTitle = (newTitle) => {
    updateTitle(newTitle);
  };
  
  return (
    <>
      <ChatHeader 
        title={chat?.title} 
        onUpdateTitle={handleUpdateTitle}
        onToggleSidebar={onToggleSidebar}
      />
      
      <ChatWindow 
        messages={chat?.messages || []} 
        isLoading={isLoading && !chat}
      />
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg 
                className="h-5 w-5 text-red-400" 
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isSending || isLoading}
      />
    </>
  );
}