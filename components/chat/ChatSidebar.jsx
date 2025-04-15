// components/chat/ChatSidebar.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useChatStore from '../../store/chatStore';
import useAuthStore from '../../store/authStore';
import Button from '../ui/Button';

const ChatSidebar = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user, logout } = useAuthStore();
  const { 
    chats, 
    loadChats, 
    startNewChat,
    currentChat,
    isLoading
  } = useChatStore();
  
  // Load chats on mount
  useEffect(() => {
    loadChats();
  }, [loadChats]);
  
  // Filter chats based on search term
  const filteredChats = searchTerm
    ? chats.filter(chat => 
        chat.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : chats;
  
  // Handle new chat button
  const handleNewChat = async () => {
    const chatId = await startNewChat();
    if (chatId) {
      router.push(`/chat/${chatId}`);
      if (onClose) onClose(); // Close sidebar on mobile
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  // Format chat date
  const formatChatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Today - show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // This week - show day name
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Older - show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  // Sidebar classes (responsive)
  const sidebarClasses = `
    flex flex-col bg-gray-50 w-full md:w-64 lg:w-80 border-r border-gray-200
    h-full md:h-screen overflow-hidden transition-all duration-300 ease-in-out
    ${isOpen ? 'fixed inset-0 z-40' : 'hidden md:flex'}
  `;
  
  return (
    <aside className={sidebarClasses}>
      {/* Mobile Close Button */}
      <div className="md:hidden flex justify-end p-2">
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Close sidebar"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
            {user?.name?.charAt(0) || '?'}
          </div>
          <div className="ml-3 flex-1 overflow-hidden">
            <p className="font-medium text-gray-800 truncate">{user?.name || 'User'}</p>
            <p className="text-sm text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="px-4 py-3">
        <Button 
          onClick={handleNewChat} 
          fullWidth 
          variant="primary"
          isLoading={isLoading && !chats.length}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
          New Chat
        </Button>
      </div>

      {/* Search Input */}
      <div className="px-4 py-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && !chats.length ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center p-2">
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                <div className="ml-auto bg-gray-200 h-3 rounded w-10"></div>
              </div>
            ))}
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No matching chats found' : 'No chats yet'}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredChats.map((chat) => (
              <li key={chat.id}>
                <Link 
                  href={`/chat/${chat.id}`}
                  className={`
                    block px-4 py-3 hover:bg-gray-100 transition-colors
                    ${currentChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
                  `}
                  onClick={() => {
                    if (onClose) onClose();
                  }}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-800 truncate max-w-[70%]">
                      {chat.title || 'New Chat'}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatChatDate(chat.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {chat.messages && chat.messages.length > 0
                      ? chat.messages[chat.messages.length - 1].content.substring(0, 50) + '...'
                      : 'Start a new conversation'}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Logout Button */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default ChatSidebar;