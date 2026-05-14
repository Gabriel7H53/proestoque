import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    // Simular API request delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Fake token and user
    const fakeToken = 'fake-jwt-token-12345';
    // Use email part before @ as the name, capitalized
    const nameFromEmail = email.split('@')[0];
    const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

    const fakeUser: User = {
      id: '1',
      nome: capitalizedName,
      email: email,
    };

    try {
      await AsyncStorage.multiSet([
        ['@proestoque:token', fakeToken],
        ['@proestoque:user', JSON.stringify(fakeUser)],
      ]);
      setToken(fakeToken);
      setUser(fakeUser);
    } catch (error) {
      console.error('Falha ao salvar o usuário', error);
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
