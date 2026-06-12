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
  quantidadeMinima: number;
  observacao?: string | null;
  foto?: string | null;
  ultimaMovimentacao?: string;
  criadoEm?: string;
  atualizadoEm?: string;
  categoria?: {
    id: string;
    nome: string;
    icone?: string;
    cor?: string;
  };
}

export interface Movimentacao {
  id: string;
  produtoId: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  data: string;
}

export const CATEGORIAS_MOCK: Categoria[] = [
  { id: 'cat_1', nome: 'Bebidas', icon: 'cafe-outline' },
  { id: 'cat_2', nome: 'Alimentos', icon: 'fast-food-outline' },
  { id: 'cat_3', nome: 'Limpeza', icon: 'sparkles-outline' },
  { id: 'cat_4', nome: 'Eletrônicos', icon: 'hardware-chip-outline' },
  { id: 'cat_5', nome: 'Papelaria', icon: 'document-outline' },
];

export const PRODUTOS_MOCK: Produto[] = [
  { id: 'p1', nome: 'Notebook Dell XPS 13', quantidade: 15, quantidadeMinima: 5, unidade: 'un', preco: 7500.00, categoriaId: 'cat_4', statusEstoque: 'normal', observacao: '', ultimaMovimentacao: new Date().toISOString() },
  { id: 'p2', nome: 'Mouse Sem Fio Logitech', quantidade: 4, quantidadeMinima: 5, unidade: 'un', preco: 150.00, categoriaId: 'cat_4', statusEstoque: 'baixo', observacao: '', ultimaMovimentacao: new Date().toISOString() },
  { id: 'p3', nome: 'Arroz Branco 5kg', quantidade: 50, quantidadeMinima: 10, unidade: 'pct', preco: 25.90, categoriaId: 'cat_2', statusEstoque: 'normal', observacao: '', ultimaMovimentacao: new Date().toISOString() },
  { id: 'p4', nome: 'Feijão Carioca 1kg', quantidade: 0, quantidadeMinima: 10, unidade: 'pct', preco: 8.50, categoriaId: 'cat_2', statusEstoque: 'sem_estoque', observacao: '', ultimaMovimentacao: new Date().toISOString() },
  { id: 'p5', nome: 'Detergente Líquido', quantidade: 120, quantidadeMinima: 20, unidade: 'un', preco: 2.20, categoriaId: 'cat_3', statusEstoque: 'normal', observacao: '', ultimaMovimentacao: new Date().toISOString() },
  { id: 'p6', nome: 'Desinfetante Pinho', quantidade: 2, quantidadeMinima: 5, unidade: 'un', preco: 7.80, categoriaId: 'cat_3', statusEstoque: 'baixo', observacao: '', ultimaMovimentacao: new Date().toISOString() },
  { id: 'p7', nome: 'Caderno Espiral 10 Matérias', quantidade: 30, quantidadeMinima: 10, unidade: 'un', preco: 18.00, categoriaId: 'cat_5', statusEstoque: 'normal', observacao: '', ultimaMovimentacao: new Date().toISOString() },
  { id: 'p8', nome: 'Martelo Unha 25mm', quantidade: 8, quantidadeMinima: 5, unidade: 'un', preco: 45.00, categoriaId: 'cat_5', statusEstoque: 'normal', observacao: '', ultimaMovimentacao: new Date().toISOString() },
  { id: 'p9', nome: 'Chave de Fenda Kit', quantidade: 1, quantidadeMinima: 2, unidade: 'kit', preco: 35.00, categoriaId: 'cat_5', statusEstoque: 'baixo', observacao: '', ultimaMovimentacao: new Date().toISOString() },
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
