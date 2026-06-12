import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi, registrarApi, buscarPerfilApi } from '../services/authService';

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const [[, storedToken], [, storedUser]] = await AsyncStorage.multiGet([
          '@proestoque:token',
          '@proestoque:user',
        ]);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Validação em segundo plano do token atual
          try {
            const userApi = await buscarPerfilApi();
            setUser(userApi);
            await AsyncStorage.setItem('@proestoque:user', JSON.stringify(userApi));
          } catch (apiError: any) {
            console.warn('Falha ao validar token na API. Mantendo sessão offline.', apiError);
            if (apiError.response?.status === 401) {
              await AsyncStorage.multiRemove(['@proestoque:token', '@proestoque:user']);
              setToken(null);
              setUser(null);
            }
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
    if (!email) {
      throw new Error('Email obrigatório');
    }
    if (!senha) {
      throw new Error('Senha obrigatória');
    }

    setIsLoading(true);

    try {
      const response = await loginApi(email, senha);
      const { usuario, token: jwtToken } = response;

      await AsyncStorage.multiSet([
        ['@proestoque:token', jwtToken],
        ['@proestoque:user', JSON.stringify(usuario)],
      ]);
      setToken(jwtToken);
      setUser(usuario);
    } catch (error: any) {
      console.error('Erro ao fazer login', error);
      const mensagem = error.response?.data?.erro || error.response?.data?.message || 'Erro ao fazer login';
      throw new Error(mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  const registrar = async (nome: string, email: string, senha?: string) => {
    if (!nome) {
      throw new Error('Nome obrigatório');
    }
    if (!email) {
      throw new Error('Email obrigatório');
    }
    if (!senha) {
      throw new Error('Senha obrigatória');
    }

    setIsLoading(true);

    try {
      const response = await registrarApi(nome, email, senha);
      const { usuario, token: jwtToken } = response;

      await AsyncStorage.multiSet([
        ['@proestoque:token', jwtToken],
        ['@proestoque:user', JSON.stringify(usuario)],
      ]);
      setToken(jwtToken);
      setUser(usuario);
    } catch (error: any) {
      console.error('Erro ao criar conta', error);
      const mensagem = error.response?.data?.erro || error.response?.data?.message || 'Erro ao criar conta';
      throw new Error(mensagem);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['@proestoque:token', '@proestoque:user']);
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
