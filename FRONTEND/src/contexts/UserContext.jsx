import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/profile', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      await checkAuthStatus(); // Refresh user data
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    await fetch('http://localhost:3000/auth/logout', {
      credentials: 'include',
    });
    setUser(null);
  };

  const register = async (userData) => {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, message: error.message };
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      loading,
      login,
      logout,
      register,
      checkAuthStatus,
    }}>
      {children}
    </UserContext.Provider>
  );
};