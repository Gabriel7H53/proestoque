import { api } from './api';
import { Produto } from '../data/mockData';
import { ProdutoFormData } from '../schemas/produtoSchema';

export const listarProdutos = async (): Promise<Produto[]> => {
  const response = await api.get('/produtos');
  return response.data;
};

export const buscarProdutoPorId = async (id: string): Promise<Produto> => {
  const response = await api.get(`/produtos/${id}`);
  return response.data;
};

export const criarProduto = async (data: ProdutoFormData): Promise<Produto> => {
  const response = await api.post('/produtos', data);
  return response.data;
};

export const atualizarProduto = async (id: string, data: ProdutoFormData): Promise<Produto> => {
  const response = await api.put(`/produtos/${id}`, data);
  return response.data;
};

export const deletarProduto = async (id: string): Promise<void> => {
  await api.delete(`/produtos/${id}`);
};
