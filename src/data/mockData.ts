import { Ionicons } from '@expo/vector-icons';

export type StatusEstoque = 'normal' | 'baixo' | 'sem_estoque';

export interface Categoria {
  id: string;
  nome: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export interface Produto {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
  preco: number;
  categoriaId: string;
  statusEstoque: StatusEstoque;
}

export interface Movimentacao {
  id: string;
  produtoId: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  data: string;
}

export const CATEGORIAS_MOCK: Categoria[] = [
  { id: '1', nome: 'Eletrônicos', icon: 'hardware-chip-outline' },
  { id: '2', nome: 'Alimentos', icon: 'fast-food-outline' },
  { id: '3', nome: 'Limpeza', icon: 'water-outline' },
  { id: '4', nome: 'Papelaria', icon: 'pencil-outline' },
  { id: '5', nome: 'Ferramentas', icon: 'hammer-outline' },
];

export const PRODUTOS_MOCK: Produto[] = [
  { id: 'p1', nome: 'Notebook Dell XPS 13', quantidade: 15, unidade: 'un', preco: 7500.00, categoriaId: '1', statusEstoque: 'normal' },
  { id: 'p2', nome: 'Mouse Sem Fio Logitech', quantidade: 4, unidade: 'un', preco: 150.00, categoriaId: '1', statusEstoque: 'baixo' },
  { id: 'p3', nome: 'Arroz Branco 5kg', quantidade: 50, unidade: 'pct', preco: 25.90, categoriaId: '2', statusEstoque: 'normal' },
  { id: 'p4', nome: 'Feijão Carioca 1kg', quantidade: 0, unidade: 'pct', preco: 8.50, categoriaId: '2', statusEstoque: 'sem_estoque' },
  { id: 'p5', nome: 'Detergente Líquido', quantidade: 120, unidade: 'un', preco: 2.20, categoriaId: '3', statusEstoque: 'normal' },
  { id: 'p6', nome: 'Desinfetante Pinho', quantidade: 2, unidade: 'un', preco: 7.80, categoriaId: '3', statusEstoque: 'baixo' },
  { id: 'p7', nome: 'Caderno Espiral 10 Matérias', quantidade: 30, unidade: 'un', preco: 18.00, categoriaId: '4', statusEstoque: 'normal' },
  { id: 'p8', nome: 'Martelo Unha 25mm', quantidade: 8, unidade: 'un', preco: 45.00, categoriaId: '5', statusEstoque: 'normal' },
  { id: 'p9', nome: 'Chave de Fenda Kit', quantidade: 1, unidade: 'kit', preco: 35.00, categoriaId: '5', statusEstoque: 'baixo' },
];

export const MOVIMENTACOES_MOCK: Movimentacao[] = [
  { id: 'm1', produtoId: 'p1', tipo: 'entrada', quantidade: 10, data: '2023-10-25T10:00:00Z' },
  { id: 'm2', produtoId: 'p2', tipo: 'saida', quantidade: 2, data: '2023-10-26T14:30:00Z' },
  { id: 'm3', produtoId: 'p4', tipo: 'saida', quantidade: 10, data: '2023-10-27T09:15:00Z' },
];

export const getProdutosComEstoqueBaixo = (): Produto[] => {
  return PRODUTOS_MOCK.filter(
    (p) => p.statusEstoque === 'baixo' || p.statusEstoque === 'sem_estoque'
  );
};

export const getValorTotalEstoque = (): number => {
  return PRODUTOS_MOCK.reduce((total, p) => total + (p.quantidade * p.preco), 0);
};

export const formatarPreco = (valor: number): string => {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
