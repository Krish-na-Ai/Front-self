// components/chat/ChatMessage.jsx
import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

// Configure marked to use highlight.js for code highlighting
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

const ChatMessage = ({ sender, content, timestamp, isStreaming = false }) => {
  // Format the timestamp
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  // Determine classes based on sender
  const messageClasses = sender === 'user' 
    ? 'ml-auto bg-blue-500 text-white' 
    : 'mr-auto bg-gray-100 text-gray-800';
  
  const containerClasses = sender === 'user'
    ? 'flex justify-end'
    : 'flex justify-start';
  
  // Convert markdown to HTML with sanitization to prevent XSS
  const renderContent = () => {
    if (!content && isStreaming) {
      return <span className="typing-animation">•••</span>;
    }
    
    if (!content) return "";
    
    const rawHtml = marked(content);
    const sanitizedHtml = DOMPurify.sanitize(rawHtml);
    
    return (
      <div 
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    );
  };
  
  return (
    <div className={`${containerClasses} mb-4 max-w-full`}>
      <div className={`relative rounded-lg px-4 py-2 shadow ${messageClasses} max-w-[85%]`}>
        <div className="flex items-center mb-1">
          <div className="font-medium">
            {sender === 'user' ? 'You' : 'AI Assistant'}
          </div>
          <div className="text-xs opacity-70 ml-2">
            {formattedTime}
          </div>
        </div>
        
        <div className={`message-content ${isStreaming ? 'streaming' : ''}`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;