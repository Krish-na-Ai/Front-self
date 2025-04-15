// store/chatStore.js
import { create } from 'zustand';
import api from '../lib/api';

const useChatStore = create((set, get) => ({
  // Chat state
  chats: [],
  currentChat: null,
  isLoading: false,
  sendingMessage: false,
  error: null,
  
  // Load all chats for the sidebar
  loadChats: async () => {
    try {
      set({ isLoading: true, error: null });
      const chats = await api.loadChatHistory();
      set({ chats, isLoading: false });
    } catch (error) {
      console.error('Failed to load chats:', error);
      set({ 
        error: error.message || 'Failed to load chats', 
        isLoading: false 
      });
    }
  },
  
  // Start a new chat
  startNewChat: async () => {
    try {
      set({ isLoading: true, error: null });
      const { chatId } = await api.startNewChat();
      
      // Create a placeholder chat until we load the full details
      const newChat = {
        id: chatId,
        title: 'New Chat',
        messages: [],
        createdAt: new Date().toISOString()
      };
      
      set(state => ({
        chats: [newChat, ...state.chats],
        currentChat: newChat,
        isLoading: false
      }));
      
      return chatId;
    } catch (error) {
      console.error('Failed to start new chat:', error);
      set({ 
        error: error.message || 'Failed to start new chat', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // Load a specific chat by ID
  loadChat: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const chat = await api.loadChatById(id);
      set({ currentChat: chat, isLoading: false });
    } catch (error) {
      console.error(`Failed to load chat ${id}:`, error);
      set({ 
        error: error.message || 'Failed to load chat', 
        isLoading: false 
      });
    }
  },
  
  // Send a message and handle streaming response
  sendMessage: async (chatId, content) => {
    try {
      set({ sendingMessage: true, error: null });
      
      // Optimistically add user message to the UI
      const userMessage = {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      set(state => {
        const updatedMessages = [...(state.currentChat?.messages || []), userMessage];
        const updatedChat = {
          ...state.currentChat,
          messages: updatedMessages
        };
        
        return {
          currentChat: updatedChat
        };
      });
      
      // Prepare for AI response with temporary message
      const tempAiMessage = {
        id: `ai-${Date.now()}`,
        content: '',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        isStreaming: true
      };
      
      set(state => {
        const updatedMessages = [...(state.currentChat?.messages || []), tempAiMessage];
        return {
          currentChat: {
            ...state.currentChat,
            messages: updatedMessages
          }
        };
      });
      
      // Start streaming response
      const eventSource = api.sendMessage(chatId, content);
      
      let fullResponse = '';
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          fullResponse += data.content;
          
          // Update the streaming message
          set(state => {
            const messages = [...state.currentChat.messages];
            const aiMessageIndex = messages.findIndex(m => m.id === tempAiMessage.id);
            
            if (aiMessageIndex !== -1) {
              messages[aiMessageIndex] = {
                ...messages[aiMessageIndex],
                content: fullResponse
              };
            }
            
            return {
              currentChat: {
                ...state.currentChat,
                messages
              }
            };
          });
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };
      
      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        eventSource.close();
        
        // Mark streaming as complete
        set(state => {
          const messages = [...state.currentChat.messages];
          const aiMessageIndex = messages.findIndex(m => m.id === tempAiMessage.id);
          
          if (aiMessageIndex !== -1) {
            messages[aiMessageIndex] = {
              ...messages[aiMessageIndex],
              isStreaming: false
            };
          }
          
          return {
            sendingMessage: false,
            currentChat: {
              ...state.currentChat,
              messages
            },
            error: 'Connection error. Please try again.'
          };
        });
      };
      
      eventSource.onclose = () => {
        // Mark streaming as complete
        set(state => {
          const messages = [...state.currentChat.messages];
          const aiMessageIndex = messages.findIndex(m => m.id === tempAiMessage.id);
          
          if (aiMessageIndex !== -1) {
            messages[aiMessageIndex] = {
              ...messages[aiMessageIndex],
              isStreaming: false
            };
          }
          
          // Update first chat title if this is the first message
          let updatedChats = [...state.chats];
          if (state.currentChat.messages.length <= 2 && fullResponse) { // Just the user message and AI response
            const chatTitle = fullResponse.split(' ').slice(0, 5).join(' ') + '...';
            
            // Update the current chat title
            const updatedCurrentChat = {
              ...state.currentChat,
              title: chatTitle,
              messages
            };
            
            // Update the chat in the list
            const chatIndex = updatedChats.findIndex(c => c.id === chatId);
            if (chatIndex !== -1) {
              updatedChats[chatIndex] = {
                ...updatedChats[chatIndex],
                title: chatTitle
              };
            }
            
            return {
              sendingMessage: false,
              currentChat: updatedCurrentChat,
              chats: updatedChats
            };
          }
          
          return {
            sendingMessage: false,
            currentChat: {
              ...state.currentChat,
              messages
            }
          };
        });
      };
      
    } catch (error) {
      console.error('Failed to send message:', error);
      set({ 
        sendingMessage: false, 
        error: error.message || 'Failed to send message' 
      });
    }
  },
  
  // Update chat title
  updateChatTitle: async (id, title) => {
    // Optimistic update
    set(state => {
      const updatedChats = state.chats.map(chat => 
        chat.id === id ? { ...chat, title } : chat
      );
      
      const updatedCurrentChat = state.currentChat?.id === id 
        ? { ...state.currentChat, title } 
        : state.currentChat;
      
      return {
        chats: updatedChats,
        currentChat: updatedCurrentChat
      };
    });
    
    // TODO: Uncomment when backend supports chat title updates
    // try {
    //   await api.updateChatTitle(id, title);
    // } catch (error) {
    //   console.error('Failed to update chat title:', error);
    //   
    //   // Revert to original state on error
    //   set(state => {
    //     const originalChats = state.chats.map(chat => 
    //       chat.id === id ? { ...chat, title: state.currentChat.title } : chat
    //     );
    //     
    //     return {
    //       chats: originalChats,
    //       error: 'Failed to update chat title'
    //     };
    //   });
    // }
  },
  
  // Clear current chat selection
  clearCurrentChat: () => {
    set({ currentChat: null });
  }
}));

export default useChatStore;