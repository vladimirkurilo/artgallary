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
  update: async (id: number, data: any) => {
    const response = await api.put(`artworks/${id}`, data);
    return response.data;
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
  getById: async (id: number) => {
    const response = await api.get(`exhibitions/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('exhibitions', data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`exhibitions/${id}`);
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`exhibitions/${id}`, data);
    return response.data;
  }
};

export const artistService = {
  getAll: async () => {
    const response = await api.get('artists');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`artists/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('artists', data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`artists/${id}`);
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`artists/${id}`, data);
    return response.data;
  }
};

export const uploadService = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
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
