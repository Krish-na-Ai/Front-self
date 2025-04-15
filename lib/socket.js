// lib/socket.js
class SocketManager {
    constructor() {
      this.eventSource = null;
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 3;
      this.reconnectDelay = 2000; // Start with 2s delay
      this.callbacks = {
        message: [],
        typingStart: [],
        typingEnd: [],
        error: [],
        disconnect: []
      };
    }
  
    // Connect to a specific chat via SSE
    connectToChat(chatId) {
      // Close any existing connection
      this.disconnect();
      
      try {
        const apiUrl = `/api/chat/${chatId}/stream`;
        this.eventSource = new EventSource(apiUrl);
        
        this.eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.callbacks.message.forEach(callback => callback(data));
          } catch (error) {
            console.error('Error parsing SSE message:', error);
          }
        };
        
        this.eventSource.onerror = (error) => {
          console.error('SSE connection error:', error);
          this.callbacks.error.forEach(callback => callback(error));
          this.handleReconnect(chatId);
        };
        
        // Optional typing indicators (if backend supports)
        this.eventSource.addEventListener('typing:start', (event) => {
          this.callbacks.typingStart.forEach(callback => callback());
        });
        
        this.eventSource.addEventListener('typing:end', (event) => {
          this.callbacks.typingEnd.forEach(callback => callback());
        });
        
        // Reset reconnect attempts on successful connection
        this.reconnectAttempts = 0;
        
        return true;
      } catch (error) {
        console.error('Failed to connect to chat:', error);
        return false;
      }
    }
    
    // Handle automatic reconnection with exponential backoff
    handleReconnect(chatId) {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        
        setTimeout(() => {
          console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          this.connectToChat(chatId);
        }, delay);
      } else {
        console.error('Max reconnect attempts reached. Giving up.');
        this.callbacks.disconnect.forEach(callback => callback());
      }
    }
    
    // Register callback for message chunks
    onMessageChunk(callback) {
      if (typeof callback === 'function') {
        this.callbacks.message.push(callback);
      }
      return this; // For method chaining
    }
    
    // Register callback for typing indicators
    onTypingStart(callback) {
      if (typeof callback === 'function') {
        this.callbacks.typingStart.push(callback);
      }
      return this;
    }
    
    onTypingEnd(callback) {
      if (typeof callback === 'function') {
        this.callbacks.typingEnd.push(callback);
      }
      return this;
    }
    
    // Register callback for errors
    onError(callback) {
      if (typeof callback === 'function') {
        this.callbacks.error.push(callback);
      }
      return this;
    }
    
    // Register callback for disconnect
    onDisconnect(callback) {
      if (typeof callback === 'function') {
        this.callbacks.disconnect.push(callback);
      }
      return this;
    }
    
    // Clean up connection
    disconnect() {
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
    }
  }
  
  // Export singleton instance
  const socketManager = new SocketManager();
  export default socketManager;