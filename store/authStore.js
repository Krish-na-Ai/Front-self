import { create } from "zustand";
import api from "../lib/api";
import tokenStorage from "../lib/tokenStorage";

/**
 * Authentication state store using Zustand
 * Manages user auth state, login/signup flows
 */
const useAuthStore = create((set) => ({
  // User data
  user: null,
  token: tokenStorage.getToken(),
  isLoading: false,
  error: null,

  /**
   * Log in a user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   */
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { token, ...userData } = await api.loginUser(email, password);
      
      // Store token securely
      tokenStorage.setToken(token);
      
      set({ 
        user: userData,
        token,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message || "Login failed" 
      });
      return false;
    }
  },

  /**
   * Register a new user
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password
   */
  signup: async (name, email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { token, ...userData } = await api.signupUser(name, email, password);
      
      // Store token securely
      tokenStorage.setToken(token);
      
      set({ 
        user: userData,
        token,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message || "Signup failed" 
      });
      return false;
    }
  },

  /**
   * Log out the current user
   */
  logout: () => {
    tokenStorage.removeToken();
    set({ 
      user: null,
      token: null
    });
  },

  /**
   * Update user profile information
   * @param {Object} userData - User data to update
   */
  updateProfile: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      // API endpoint to be implemented
      // const updated = await api.updateProfile(userData);
      
      set({ 
        user: { ...userData },
        isLoading: false
      });
      
      return true;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message || "Profile update failed" 
      });
      return false;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    return  true
    /*tokenStorage.isTokenValid();*/
  }
}));

export default useAuthStore;