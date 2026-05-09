import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const artworkService = {
  getAll: async () => {
    const response = await api.get('artworks');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`artworks/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('artworks', data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`artworks/${id}`);
  },
  purchase: async (id: number) => {
    const response = await api.post(`payments/checkout?artworkId=${id}`);
    return response.data; // This returns the checkout URL
  }
};

export const exhibitionService = {
  getAll: async () => {
    const response = await api.get('exhibitions');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('exhibitions', data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`exhibitions/${id}`);
  }
};

export const artistService = {
  getAll: async () => {
    const response = await api.get('artists');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('artists', data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`artists/${id}`);
  }
};

export const authService = {
  login: async (credentials: any) => {
    const response = await api.post('auth/login', credentials);
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('auth/register', data);
    return response.data;
  }
};

export default api;
