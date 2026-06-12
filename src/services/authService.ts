import { api } from './api';
import { User } from '../contexts/AuthContext';

export type AuthResponse = {
  usuario: User;
  token: string;
};

export const loginApi = async (email: string, senha?: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', { email, senha });
  return response.data;
};

export const registrarApi = async (nome: string, email: string, senha?: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/registro', { nome, email, senha });
  return response.data;
};

export const buscarPerfilApi = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data;
};
