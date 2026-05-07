import { create } from "zustand";
import axios from "axios";

const API_BASE = "http://localhost:3000/auth";

export const useAuth = create((set) => ({
  // STATE
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,

  // LOGIN
  login: async (userCred) => {
    try {
      // start loading
      set({
        loading: true,
        currentUser: null,
        isAuthenticated: false,
        error: null,
      });

      // login request
      await axios.post(`${API_BASE}/login`, userCred, {
        withCredentials: true,
      });

      // fetch logged in user profile
      const profileRes = await axios.get(`${API_BASE}/profile`, {
        withCredentials: true,
      });

      // update store
      set({
        currentUser: profileRes.data?.user || null,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return {
        success: true,
      };
    } catch (err) {
      console.error("Login failed:", err);

      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error: err.response?.data?.message || "Login failed",
      });

      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  },

  // REGISTER
  register: async (userData) => {
    try {
      set({
        loading: true,
        error: null,
      });

      await axios.post(`${API_BASE}/register`, userData);

      set({
        loading: false,
      });

      return {
        success: true,
      };
    } catch (err) {
      console.error("Registration failed:", err);

      set({
        loading: false,
        error: err.response?.data?.message || "Registration failed",
      });

      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  },

  // LOGOUT
  logout: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await axios.get(`${API_BASE}/logout`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      }

      return {
        success: true,
      };
    } catch (err) {
      console.error("Logout failed:", err);

      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error: err.response?.data?.message || "Logout failed",
      });

      return {
        success: false,
        message: err.response?.data?.message || "Logout failed",
      };
    }
  },

  // CHECK AUTH / RESTORE LOGIN
  checkAuth: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await axios.get(`${API_BASE}/profile`, {
        withCredentials: true,
      });

      set({
        currentUser: res.data?.user || null,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return {
        success: true,
      };
    } catch (err) {
      // user not logged in
      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });

        return {
          success: false,
        };
      }

      console.error("Auth check failed:", err);

      set({
        loading: false,
        error: err.response?.data?.message || "Authentication failed",
      });

      return {
        success: false,
        message:
          err.response?.data?.message || "Authentication failed",
      };
    }
  },
}));