import axios, { AxiosError, AxiosInstance } from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Types
export interface User {
  userId: string;
  name: string;
  email: string;
  isAccountVerified: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  userId: string;
  name: string;
  email: string;
  isAccountVerified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  jwtToken: string;
}

export interface ProfileResponse {
  userId: string;
  name: string;
  email: string;
  isAccountVerified: boolean;
}

export interface IsAuthenticatedResponse {
  isAccountVerified: boolean;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  otp: string;
}

export interface VerifyOtpRequest {
  otp: string;
}

// API Functions
export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', data);
    return response.data;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>('/profile');
    return response.data;
  },

  isAuthenticated: async (): Promise<IsAuthenticatedResponse> => {
    const response = await api.get<IsAuthenticatedResponse>('/is-authenticated');
    return response.data;
  },

  sendResetOtp: async (email: string): Promise<void> => {
    await api.post('/send-reset-otp', { email });
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await api.post('/reset-password', data);
  },

  sendVerificationOtp: async (): Promise<void> => {
    await api.post('/send-otp');
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<void> => {
    await api.post('/verify-otp', data);
  },
};

// Error helper
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.response?.data?.error || error.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
