import axios from "axios";
import tokenStorage from "./tokenStorage";

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to inject auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Central API client for all backend requests
 */
const api = {
  /**
   * Log in an existing user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data with token
   */
  loginUser: async (email, password) => {
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error.response?.data || { message: "Login failed" };
    }
  },

  /**
   * Register a new user
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data with token
   */
  signupUser: async (name, email, password) => {
    try {
      const response = await apiClient.post("/auth/signup", {
        name,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error.response?.data || { message: "Signup failed" };
    }
  },

  /**
   * Start a new chat conversation
   * @returns {Promise<Object>} New chat object with ID
   */
  startNewChat: async () => {
    try {
      const response = await apiClient.post("/chat/new");
      return response.data;
    } catch (error) {
      console.error("Start chat error:", error);
      throw error.response?.data || { message: "Failed to start new chat" };
    }
  },

  /**
   * Load all chats for the current user
   * @returns {Promise<Array>} List of chat objects
   */
  loadChatHistory: async () => {
    try {
      const response = await apiClient.get("/chat/history");
      return response.data;
    } catch (error) {
      console.error("Load chat history error:", error);
      throw error.response?.data || { message: "Failed to load chat history" };
    }
  },

  /**
   * Load a specific chat by ID
   * @param {string} id - Chat ID
   * @returns {Promise<Object>} Chat object with messages
   */
  loadChatById: async (id) => {
    try {
      const response = await apiClient.get(`/chat/${id}`);
      return response.data;
    } catch (error) {
      console.error("Load chat error:", error);
      throw error.response?.data || { message: "Failed to load chat" };
    }
  },

  /**
   * Send a message to a chat (with streaming support)
   * @param {string} chatId - Chat ID
   * @param {string} message - Message content
   * @returns {EventSource} SSE connection for streaming response
   */
  sendMessage: (chatId, message) => {
    const token = tokenStorage.getToken();
    if (!token) throw new Error("Authentication required");

    // Use Server-Sent Events for streaming
    const eventSource = new EventSource(
      `/api/chat/${chatId}/message?message=${encodeURIComponent(message)}&token=${token}`
    );
    
    return eventSource;
  }
};

export default api;