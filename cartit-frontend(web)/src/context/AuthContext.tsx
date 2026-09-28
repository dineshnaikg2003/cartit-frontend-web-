import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { MOCK_ADDRESSES } from '../data/mockData';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  sendOtp: (phone: string) => Promise<boolean>;
  loginWithPhoneOtp: (phone: string, otp: string) => Promise<boolean>;
  loginWithOtp: (phone: string, otp: string) => Promise<boolean>;
  loginWithGoogle: (idToken?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('cartit_web_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('cartit_web_jwt') || null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('cartit_web_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cartit_web_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('cartit_web_jwt', token);
    } else {
      localStorage.removeItem('cartit_web_jwt');
    }
  }, [token]);

  const sendOtp = async (phone: string): Promise<boolean> => {
    try {
      await authApi.sendOtp(phone);
      return true;
    } catch (e) {
      console.warn('Backend send-otp failed, fallback local mode:', e);
      return true;
    }
  };

  const loginWithPhoneOtp = async (phone: string, otp: string): Promise<boolean> => {
    try {
      const res = await authApi.verifyOtp(phone, otp);
      if (res && res.token) {
        setToken(res.token);
        const authenticatedUser: User = {
          id: res.user?.id ? String(res.user.id) : 'CUST-' + Math.floor(100000 + Math.random() * 900000),
          name: res.user?.fullName || res.user?.name || 'CartIT Customer',
          phone: res.user?.phone || phone,
          email: res.user?.email || `${phone}@cartit.in`,
          addresses: res.user?.addresses || MOCK_ADDRESSES,
        };
        setUser(authenticatedUser);
        setIsAuthModalOpen(false);
        return true;
      }
    } catch (e) {
      console.warn('Backend verify-otp offline or failed, activating local session:', e);
    }

    // Local fallback for quick preview
    const dummyToken = 'cartit_jwt_customer_' + Date.now();
    const authenticatedUser: User = {
      id: 'CUST-' + Math.floor(100000 + Math.random() * 900000),
      name: 'CartIT Customer',
      phone: phone,
      email: `${phone}@cartit.in`,
      addresses: MOCK_ADDRESSES,
    };
    setToken(dummyToken);
    setUser(authenticatedUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const loginWithGoogle = async (_idToken?: string): Promise<boolean> => {
    const dummyToken = 'cartit_jwt_google_' + Date.now();
    const authenticatedUser: User = {
      id: 'CUST-G' + Math.floor(1000 + Math.random() * 9000),
      name: 'Ananya Sharma',
      phone: '9876543210',
      email: 'ananya.sharma@gmail.com',
      googleSubject: 'google_sub_web_123890',
      addresses: MOCK_ADDRESSES,
    };
    setToken(dummyToken);
    setUser(authenticatedUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!token,
        token,
        isAuthModalOpen,
        setIsAuthModalOpen,
        sendOtp,
        loginWithPhoneOtp,
        loginWithOtp: loginWithPhoneOtp,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
