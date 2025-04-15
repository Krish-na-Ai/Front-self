// hooks/useChat.js
import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import useChatStore from '../store/chatStore';
import socketManager from '../lib/socket';

export default function useChat(chatId) {
  const router = useRouter();
  const [isTyping, setIsTyping] = useState(false);
  const [streamError, setStreamError] = useState(null);
  
  const { 
    currentChat,
    sendMessage: storeSendMessage,
    loadChat,
    updateChatTitle,
    isLoading,
    sendingMessage,
    error
  } = useChatStore();
  
  // Load chat data when chatId changes
  useEffect(() => {
    if (chatId) {
      loadChat(chatId);
    }
  }, [chatId, loadChat]);
  
  // Optional: Connect to SSE for real-time updates
  // Uncomment when ready to implement real-time features
  /*
  useEffect(() => {
    if (chatId) {
      // Connect and set up listeners
      socketManager
        .connectToChat(chatId)
        .onMessageChunk((data) => {
          // Message chunks will be handled by chatStore.sendMessage
        })
        .onTypingStart(() => setIsTyping(true))
        .onTypingEnd(() => setIsTyping(false))
        .onError((err) => {
          setStreamError('Connection error. Please refresh.');
        })
        .onDisconnect(() => {
          setStreamError('Connection lost. Please refresh.');
        });
      
      // Clean up when component unmounts
      return () => socketManager.disconnect();
    }
  }, [chatId]);
  */
  
  // Send a message to the current chat
  const sendChatMessage = useCallback((content) => {
    if (!chatId || !content.trim()) return;
    
    storeSendMessage(chatId, content);
  }, [chatId, storeSendMessage]);
  
  // Update the title of the current chat
  const updateTitle = useCallback((newTitle) => {
    if (!chatId || !newTitle.trim()) return;
    
    updateChatTitle(chatId, newTitle);
  }, [chatId, updateChatTitle]);
  
  // Load more messages (for pagination)
  // Placeholder for future implementation
  const loadMoreMessages = useCallback(() => {
    console.log('Loading more messages - to be implemented');
    // Future implementation when backend supports pagination
  }, []);
  
  return {
    chat: currentChat,
    isLoading,
    isSending: sendingMessage,
    isTyping,
    error: error || streamError,
    sendMessage: sendChatMessage,
    updateTitle,
    loadMoreMessages
  };
}