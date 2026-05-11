import { create } from "zustand";
import axios from 'axios'

export const useAuth = create((set) => ({

  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,

  // ── REGISTER ──────────────────────────────────────────────
  register: async (formData) => {
    try {
      set({ loading: true, error: null })

      const res = await axios.post(
        "http://localhost:3000/auth/register",
        formData,
        { withCredentials: true }
      )

      set({ loading: false })
      return { success: true, message: res.data.message }

    } catch (err) {
      set({ loading: false })
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed"
      }
    }
  },

  // ── LOGIN ─────────────────────────────────────────────────
  login: async (userCredObj) => {
    try {
      set({ loading: true, error: null })

      const res = await axios.post(
        "http://localhost:3000/auth/login",
        userCredObj,
        { withCredentials: true }
      )

      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload,
      })

    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.message || err.response?.data?.error || "Login failed",
      })
    }
  },

  // ── GOOGLE LOGIN ──────────────────────────────────────────
  googleLogin: async (credential) => {
    try {
      set({ loading: true, error: null })

      const res = await axios.post(
        "http://localhost:3000/auth/google",
        { credential },
        { withCredentials: true }
      )

      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload,
      })

      return { success: true }

    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.message || "Google login failed",
      })
      return { success: false }
    }
  },

  // ── LOGOUT ────────────────────────────────────────────────
  logout: async () => {
    try {
      set({ loading: true, error: null })

      await axios.get(
        "http://localhost:3000/auth/logout",
        { withCredentials: true }
      )

      set({ loading: false, isAuthenticated: false, currentUser: null })

    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.error || "Logout failed",
      })
    }
  },

  // ── CHECK AUTH ────────────────────────────────────────────
  checkAuth: async () => {
    try {
      set({ loading: true })

      const res = await axios.get(
        "http://localhost:3000/auth/check-auth",
        { withCredentials: true }
      )

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
      })

    } catch (err) {
      set({ currentUser: null, isAuthenticated: false, loading: false })
    }
  },

}))