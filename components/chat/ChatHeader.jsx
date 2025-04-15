// components/chat/ChatHeader.jsx
import React, { useState, useRef, useEffect } from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';

const ChatHeader = ({ title, onUpdateTitle, onToggleSidebar }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title || 'New Chat');
  const inputRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  // Update local state when title changes
  useEffect(() => {
    if (title) {
      setEditedTitle(title);
    }
  }, [title]);
  
  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleTitleClick = () => {
    setIsEditing(true);
  };
  
  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };
  
  const handleTitleBlur = () => {
    if (editedTitle.trim() !== '') {
      onUpdateTitle(editedTitle.trim());
    } else {
      setEditedTitle(title || 'New Chat');
    }
    setIsEditing(false);
  };
  
  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setEditedTitle(title || 'New Chat');
      setIsEditing(false);
    }
  };
  
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white p-4 flex items-center">
      {isMobile && (
        <button
          onClick={onToggleSidebar}
          className="mr-3 p-1 rounded-md text-gray-500 hover:bg-gray-100"
          aria-label="Toggle sidebar"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="w-6 h-6"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
        </button>
      )}
      
      <div className="flex-1 text-center">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            className="w-full max-w-xs mx-auto px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Edit chat title"
          />
        ) : (
          <h1
            onClick={handleTitleClick}
            className="text-xl font-semibold text-gray-800 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md inline-block transition-colors"
            title="Click to edit"
          >
            {editedTitle || 'New Chat'}
          </h1>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;