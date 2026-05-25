import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Produto, PRODUTOS_MOCK, StatusEstoque } from '../data/mockData';
import { ProdutoFormData } from '../schemas/produtoSchema';

interface ProductsState {
  produtos: Produto[];
  isLoading: boolean;
}

type Action =
  | { type: 'LOAD'; payload: Produto[] }
  | { type: 'ADD'; payload: Produto }
  | { type: 'UPDATE'; payload: Produto }
  | { type: 'DELETE'; payload: string };

const initialState: ProductsState = {
  produtos: [],
  isLoading: true,
};

function productsReducer(state: ProductsState, action: Action): ProductsState {
  switch (action.type) {
    case 'LOAD':
      return { ...state, produtos: action.payload, isLoading: false };
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
  adicionarProduto: (data: ProdutoFormData) => Promise<void>;
  editarProduto: (id: string, data: ProdutoFormData) => Promise<void>;
  deletarProduto: (id: string) => Promise<void>;
  getProdutoById: (id: string) => Produto | undefined;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const STORAGE_KEY = '@proestoque:produtos';

const calcularStatusEstoque = (quantidade: number, quantidadeMinima: number): StatusEstoque => {
  if (quantidade === 0) return 'sem_estoque';
  if (quantidade < quantidadeMinima) return 'baixo';
  return 'normal';
};

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(productsReducer, initialState);

  useEffect(() => {
    async function loadProdutos() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          dispatch({ type: 'LOAD', payload: JSON.parse(stored) });
        } else {
          // Fallback to mock data se não houver produtos locais
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(PRODUTOS_MOCK));
          dispatch({ type: 'LOAD', payload: PRODUTOS_MOCK });
        }
      } catch (error) {
        console.error('Failed to load products', error);
        dispatch({ type: 'LOAD', payload: PRODUTOS_MOCK });
      }
    }
    loadProdutos();
  }, []);

  const persistirProdutos = async (novosProdutos: Produto[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosProdutos));
    } catch (error) {
      console.error('Failed to save products', error);
      throw new Error('Erro ao salvar no dispositivo');
    }
  };

  const adicionarProduto = useCallback(async (data: ProdutoFormData) => {
    const novoProduto: Produto = {
      id: `prod_${Date.now()}`,
      nome: data.nome,
      categoriaId: data.categoriaId,
      quantidade: data.quantidade,
      quantidadeMinima: data.quantidadeMinima,
      preco: data.preco,
      unidade: data.unidade,
      observacao: data.observacao || '',
      ultimaMovimentacao: new Date().toISOString(),
      statusEstoque: calcularStatusEstoque(data.quantidade, data.quantidadeMinima),
    };

    const novosProdutos = [novoProduto, ...state.produtos];
    await persistirProdutos(novosProdutos);
    dispatch({ type: 'ADD', payload: novoProduto });
  }, [state.produtos]);

  const editarProduto = useCallback(async (id: string, data: ProdutoFormData) => {
    const produtoAtual = state.produtos.find((p) => p.id === id);
    if (!produtoAtual) throw new Error('Produto não encontrado');

    const produtoAtualizado: Produto = {
      ...produtoAtual,
      ...data,
      observacao: data.observacao || '',
      ultimaMovimentacao: new Date().toISOString(),
      statusEstoque: calcularStatusEstoque(data.quantidade, data.quantidadeMinima),
    };

    const novosProdutos = state.produtos.map((p) => (p.id === id ? produtoAtualizado : p));
    await persistirProdutos(novosProdutos);
    dispatch({ type: 'UPDATE', payload: produtoAtualizado });
  }, [state.produtos]);

  const deletarProduto = useCallback(async (id: string) => {
    const novosProdutos = state.produtos.filter((p) => p.id !== id);
    await persistirProdutos(novosProdutos);
    dispatch({ type: 'DELETE', payload: id });
  }, [state.produtos]);

  const getProdutoById = useCallback((id: string) => {
    return state.produtos.find((p) => p.id === id);
  }, [state.produtos]);

  return (
    <ProductsContext.Provider
      value={{
        produtos: state.produtos,
        isLoading: state.isLoading,
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
