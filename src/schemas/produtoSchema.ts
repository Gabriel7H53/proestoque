import { z } from 'zod';

export const produtoSchema = z.object({
  nome: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres').max(80, 'O nome deve ter no máximo 80 caracteres'),
  categoriaId: z.string().min(1, 'Selecione uma categoria'),
  quantidade: z.number().int('A quantidade deve ser um número inteiro').min(0, 'A quantidade não pode ser negativa'),
  quantidadeMinima: z.number().int('A quantidade mínima deve ser um número inteiro').min(0, 'A quantidade mínima não pode ser negativa'),
  preco: z.number().positive('O preço deve ser maior que zero'),
  unidade: z.enum(['un', 'kg', 'cx', 'L', 'm'], {
    errorMap: () => ({ message: 'Unidade inválida' }),
  }),
  observacao: z.string().max(200, 'A observação deve ter no máximo 200 caracteres').optional().default(''),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;
