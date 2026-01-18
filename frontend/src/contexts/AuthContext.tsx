import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { authApi, LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '@/lib/api';

interface User {
  email: string;
  name?: string;
  userId?: string;
  accountVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<LoginResponse>;
  register: (data: RegisterRequest) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  sendOtp: () => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  sendResetOtp: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        Cookies.remove('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await authApi.login(data);
    const userData: User = { email: response.email };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return response;
  };

  const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await authApi.register(data);
    const userData: User = {
      email: response.email,
      name: response.name,
      userId: response.userId,
      accountVerified: response.accountVerified,
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return response;
  };

  const logout = async (): Promise<void> => {
    await authApi.logout();
    setUser(null);
    localStorage.removeItem('user');
  };

  const sendOtp = async (): Promise<void> => {
    await authApi.sendOtp();
  };

  const verifyOtp = async (otp: string): Promise<void> => {
    await authApi.verifyOtp({ otp });
    if (user) {
      const updatedUser = { ...user, accountVerified: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const sendResetOtp = async (email: string): Promise<void> => {
    await authApi.sendResetOtp(email);
  };

  const resetPassword = async (email: string, otp: string, newPassword: string): Promise<void> => {
    await authApi.resetPassword({ email, otp, newPassword });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        sendOtp,
        verifyOtp,
        sendResetOtp,
        resetPassword,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
