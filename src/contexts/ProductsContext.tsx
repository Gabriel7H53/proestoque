import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { notificarEstoqueCritico, limparBadge } from '../services/notifications';

export type Produto = {
  id: string;
  nome: string;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  unidade: string;
  observacao: string | null;
  foto?: string | null;
  categoriaId: string;
  categoria?: {
    id: string;
    nome: string;
    icone: string;
    cor: string;
  };
  ultimaMovimentacao: string;
  criadoEm: string;
  atualizadoEm?: string;
};

type ProductsState = {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
};

type Action =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: Produto[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'ADD'; payload: Produto }
  | { type: 'UPDATE'; payload: Produto }
  | { type: 'DELETE'; payload: string };

const initialState: ProductsState = {
  produtos: [],
  isLoading: true,
  error: null,
};

function productsReducer(state: ProductsState, action: Action): ProductsState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, isLoading: true, error: null };
    case 'LOAD_SUCCESS':
      return { ...state, produtos: action.payload, isLoading: false, error: null };
    case 'LOAD_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'ADD':
      return { ...state, produtos: [action.payload, ...state.produtos] };
    case 'UPDATE':
      return {
        ...state,
        produtos: state.produtos.map((p) => (p.id === action.payload.id ? action.payload : p)),
      };
    case 'DELETE':
      return {
        ...state,
        produtos: state.produtos.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
}

interface ProductsContextType {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
  carregarProdutos: () => Promise<void>;
  adicionarProduto: (data: any) => Promise<void>;
  editarProduto: (id: string, data: any) => Promise<void>;
  deletarProduto: (id: string) => Promise<void>;
  getProdutoById: (id: string) => Produto | undefined;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(productsReducer, initialState);
  const { isAuthenticated } = useAuth();

  const carregarProdutos = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const response = await api.get<Produto[]>('/produtos');
      dispatch({ type: 'LOAD_SUCCESS', payload: response.data });
      
      // Verificação de estoque crítico
      const produtosCriticos = response.data.filter(
        (p) => p.quantidade < p.quantidadeMinima
      );
      if (produtosCriticos.length > 0) {
        await notificarEstoqueCritico(produtosCriticos.length);
      } else {
        await limparBadge();
      }
    } catch (err: any) {
      console.error('Erro ao carregar produtos:', err.message);
      dispatch({ type: 'LOAD_ERROR', payload: err.message || 'Erro ao carregar produtos' });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      carregarProdutos();
    } else {
      dispatch({ type: 'LOAD_SUCCESS', payload: [] });
    }
  }, [isAuthenticated, carregarProdutos]);

  const adicionarProduto = useCallback(async (data: any) => {
    const response = await api.post<Produto>('/produtos', data);
    dispatch({ type: 'ADD', payload: response.data });
  }, []);

  const editarProduto = useCallback(async (id: string, data: any) => {
    const response = await api.put<Produto>(`/produtos/${id}`, data);
    dispatch({ type: 'UPDATE', payload: response.data });
  }, []);

  const deletarProduto = useCallback(async (id: string) => {
    await api.delete(`/produtos/${id}`);
    dispatch({ type: 'DELETE', payload: id });
  }, []);

  const getProdutoById = useCallback((id: string) => {
    return state.produtos.find((p) => p.id === id);
  }, [state.produtos]);

  return (
    <ProductsContext.Provider
      value={{
        produtos: state.produtos,
        isLoading: state.isLoading,
        error: state.error,
        carregarProdutos,
        adicionarProduto,
        editarProduto,
        deletarProduto,
        getProdutoById,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts deve ser usado dentro de um ProductsProvider');
  }
  return context;
};
