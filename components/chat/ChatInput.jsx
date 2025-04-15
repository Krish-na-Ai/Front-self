// components/chat/ChatInput.jsx
import React, { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';

const ChatInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  
  // Auto-resize textarea as content grows
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    // Set height based on scrollHeight (with a max height)
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [message]);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    
    onSendMessage(message);
    setMessage('');
  };
  
  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Send on Enter (but not with Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="border-t border-gray-200 bg-white p-4 sticky bottom-0"
    >
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          className={`
            flex-1 p-3 border rounded-lg resize-none min-h-[2.5rem] max-h-[200px]
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors
            ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}
          `}
          rows={1}
        />
        <Button 
          type="submit" 
          disabled={!message.trim() || disabled}
          isLoading={disabled}
          variant="primary"
        >
          Send
        </Button>
      </div>
      
      <div className="text-xs text-gray-500 mt-2 text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  );
};

export default ChatInput;