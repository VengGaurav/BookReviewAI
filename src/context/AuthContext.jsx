import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login - replace with actual API call
    const mockUser = {
      id: '1',
      email,
      name: email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      joinedDate: new Date().toISOString(),
      readingDNA: {
        speed: 75,
        depth: 82,
        consistency: 68,
        emotionalEngagement: 90
      }
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'mock-jwt-token');
    setUser(mockUser);
    return mockUser;
  };

  const signup = async (name, email, password) => {
    // Mock signup
    const mockUser = {
      id: Date.now().toString(),
      email,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      joinedDate: new Date().toISOString(),
      readingDNA: {
        speed: 50,
        depth: 50,
        consistency: 50,
        emotionalEngagement: 50
      }
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', 'mock-jwt-token');
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
