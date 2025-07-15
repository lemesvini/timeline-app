import Axios, { type InternalAxiosRequestConfig } from 'axios';

import { env } from '@/config/env';
import { tokenStorage } from './token';
import { toast } from 'sonner';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }

  const token = tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    toast.error(message);

    if (error.response?.status === 401) {
      tokenStorage.removeToken();
    }

    return Promise.reject(error);
  }
);
