import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('token');
    if (token && config.headers) {
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
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  token: string;
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
  accountVerified: boolean;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface VerifyOtpRequest {
  otp: string;
}

// Auth API functions
export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', data);
    if (response.data.token) {
      Cookies.set('token', response.data.token, { expires: 1 }); // 1 day
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/logout');
    } finally {
      Cookies.remove('token');
    }
  },

  sendOtp: async (): Promise<void> => {
    await api.post('/send-otp');
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<void> => {
    await api.post('/verify-otp', data);
  },

  sendResetOtp: async (email: string): Promise<void> => {
    await api.post(`/send-reset-otp?email=${encodeURIComponent(email)}`);
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await api.post('/reset-password', data);
  },
};

export const getToken = (): string | undefined => {
  return Cookies.get('token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
