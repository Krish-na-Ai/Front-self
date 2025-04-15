import { jwtDecode } from "jwt-decode";

/**
 * Secure token storage utility
 * Handles JWT storage, retrieval and validation
 */
const tokenStorage = {
  /**
   * Store JWT token in localStorage
   * @param {string} token - JWT token
   */
  setToken: (token) => {
    if (token) {
      localStorage.setItem("auth_token", token);
    }
  },

  /**
   * Get JWT token from localStorage
   * @returns {string|null} JWT token or null if not found
   */
  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  },

  /**
   * Remove JWT token from localStorage
   */
  removeToken: () => {
    localStorage.removeItem("auth_token");
  },

  /**
   * Check if stored token is valid and not expired
   * @returns {boolean} True if token is valid
   */
  isTokenValid: () => {
    try {
      const token = tokenStorage.getToken();
      if (!token) return false;
      
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token has expiry and is not expired
      return decoded.exp && decoded.exp > currentTime;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  }
};

export default tokenStorage;