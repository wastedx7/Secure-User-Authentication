import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  email: string;
  token: string;
}

export interface ProfileRequest {
  name: string;
  email: string;
  password: string;
}

export interface ProfileResponse {
  userId: string;
  name: string;
  email: string;
  isAccountVerified: boolean;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  otp: string;
}

export const authApi = {
  login: async (data: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/login', data);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  register: async (data: ProfileRequest): Promise<ProfileResponse> => {
    const response = await api.post<ProfileResponse>('/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/logout');
    localStorage.removeItem('auth_token');
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      const response = await api.get<boolean>('/is-authenticated');
      return response.data;
    } catch {
      return false;
    }
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>('/profile');
    return response.data;
  },

  sendResetOtp: async (email: string): Promise<void> => {
    await api.post('/send-reset-otp', null, { params: { email } });
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await api.post('/reset-password', data);
  },

  sendVerifyOtp: async (): Promise<void> => {
    await api.post('/send-otp');
  },

  verifyOtp: async (otp: string): Promise<void> => {
    await api.post('/verify-otp', { otp });
  },
};

export default api;
