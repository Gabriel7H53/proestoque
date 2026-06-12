import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export type Categoria = {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  _count?: { produtos: number };
};

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarCategorias = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Categoria[]>('/categorias');
      setCategorias(response.data);
    } catch (err: any) {
      console.error('Erro ao carregar categorias:', err.message);
      setError(err.message || 'Erro ao carregar categorias');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarCategorias();
  }, [carregarCategorias]);

  return {
    categorias,
    isLoading,
    error,
    carregarCategorias,
  };
}
