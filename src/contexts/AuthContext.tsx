import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

export type User = {
  id: string;
  nome: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha?: string) => Promise<void>;
  registrar: (nome: string, email: string, senha?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOKEN: "@proestoque:token",
  USER: "@proestoque:user",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const [[, storedToken], [, storedUser]] = await AsyncStorage.multiGet([
          STORAGE_KEYS.TOKEN,
          STORAGE_KEYS.USER,
        ]);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Validação em segundo plano do token atual
          try {
            const response = await api.get('/auth/me');
            const userApi = response.data;
            setUser(userApi);
            await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userApi));
          } catch (apiError: any) {
            console.warn('Falha ao validar token na API. Mantendo sessão offline.', apiError.message);
          }
        }
      } catch (error) {
        console.error('Falha ao carregar os dados de autenticação', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const login = async (email: string, senha?: string) => {
    if (!email) throw new Error('Email obrigatório');
    if (!senha) throw new Error('Senha obrigatória');

    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { usuario, token: jwtToken } = response.data;

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, jwtToken],
        [STORAGE_KEYS.USER, JSON.stringify(usuario)],
      ]);
      setToken(jwtToken);
      setUser(usuario);
    } finally {
      setIsLoading(false);
    }
  };

  const registrar = async (nome: string, email: string, senha?: string) => {
    if (!nome) throw new Error('Nome obrigatório');
    if (!email) throw new Error('Email obrigatório');
    if (!senha) throw new Error('Senha obrigatória');

    setIsLoading(true);
    try {
      const response = await api.post('/auth/registro', { nome, email, senha });
      const { usuario, token: jwtToken } = response.data;

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, jwtToken],
        [STORAGE_KEYS.USER, JSON.stringify(usuario)],
      ]);
      setToken(jwtToken);
      setUser(usuario);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Falha ao remover o usuário', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        registrar,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
