import { api } from './api';

export interface CategoriaResponse {
  id: string;
  nome: string;
  icone?: string;
  cor?: string;
}

export const listarCategorias = async (): Promise<CategoriaResponse[]> => {
  const response = await api.get('/categorias');
  return response.data;
};

export const buscarCategoriaPorId = async (id: string): Promise<CategoriaResponse> => {
  const response = await api.get(`/categorias/${id}`);
  return response.data;
};
