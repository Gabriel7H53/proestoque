import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Input } from '../Input';
import { Button } from '../Button';
import { produtoSchema, ProdutoFormData } from '../../schemas/produtoSchema';
import { useProducts } from '../../contexts/ProductsContext';
import { CATEGORIAS_MOCK } from '../../data/mockData';
import { theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface ProdutoFormProps {
  initialData?: ProdutoFormData & { id?: string };
  modo: 'criacao' | 'edicao';
}

const UNIDADES = ['un', 'kg', 'cx', 'L', 'm'] as const;

export const ProdutoForm: React.FC<ProdutoFormProps> = ({ initialData, modo }) => {
  const router = useRouter();
  const { adicionarProduto, editarProduto, deletarProduto } = useProducts();

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: '',
      categoriaId: '',
      quantidade: 0,
      quantidadeMinima: 0,
      preco: 0,
      unidade: 'un',
      observacao: '',
    }
  });

  useEffect(() => {
    if (modo === 'edicao' && initialData) {
      reset(initialData);
    }
  }, [modo, initialData, reset]);

  const onSubmit = async (data: ProdutoFormData) => {
    try {
      if (modo === 'criacao') {
        await adicionarProduto(data);
        Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
      } else if (modo === 'edicao' && initialData?.id) {
        await editarProduto(initialData.id, data);
        Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      }
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o produto.');
    }
  };

  const handleDelete = () => {
    if (!initialData?.id) return;
    Alert.alert(
      'Excluir Produto',
      'Tem certeza que deseja excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarProduto(initialData.id!);
              Alert.alert('Sucesso', 'Produto excluído!');
              router.back();
            } catch (error) {
              Alert.alert('Erro', 'Ocorreu um erro ao excluir.');
            }
          }
        }
      ]
    );
  };

  // Funções auxiliares para lidar com números
  const formatNumberInput = (value: number) => value === 0 ? '' : value.toString();
  const parseNumberInput = (text: string) => {
    const parsed = parseInt(text.replace(/[^0-9]/g, ''), 10);
    return isNaN(parsed) ? 0 : parsed;
  };
  const parsePriceInput = (text: string) => {
    const parsed = parseFloat(text.replace(',', '.').replace(/[^0-9.]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Controller
        control={control}
        name="nome"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nome do Produto *"
            placeholder="Ex: Notebook Dell"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.nome?.message}
          />
        )}
      />

      <Text style={styles.sectionTitle}>Categoria *</Text>
      <Controller
        control={control}
        name="categoriaId"
        render={({ field: { onChange, value } }) => (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
              {CATEGORIAS_MOCK.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryChip, value === cat.id && styles.categoryChipSelected]}
                  onPress={() => onChange(cat.id)}
                >
                  <Ionicons 
                    name={cat.icon} 
                    size={16} 
                    color={value === cat.id ? theme.colors.white : theme.colors.neutral[600]} 
                  />
                  <Text style={[styles.categoryText, value === cat.id && styles.categoryTextSelected]}>
                    {cat.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {errors.categoriaId && <Text style={styles.errorText}>{errors.categoriaId.message}</Text>}
          </View>
        )}
      />

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Controller
            control={control}
            name="quantidade"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Quantidade *"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(text) => onChange(parseNumberInput(text))}
                value={formatNumberInput(value)}
                error={errors.quantidade?.message}
              />
            )}
          />
        </View>
        <View style={styles.halfWidth}>
          <Controller
            control={control}
            name="quantidadeMinima"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Qtd. Mínima *"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(text) => onChange(parseNumberInput(text))}
                value={formatNumberInput(value)}
                error={errors.quantidadeMinima?.message}
              />
            )}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Controller
            control={control}
            name="preco"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Preço *"
                keyboardType="decimal-pad"
                onBlur={onBlur}
                onChangeText={(text) => onChange(parsePriceInput(text))}
                value={value ? value.toString() : ''}
                error={errors.preco?.message}
                leftIcon="cash-outline"
              />
            )}
          />
        </View>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Unidade *</Text>
          <Controller
            control={control}
            name="unidade"
            render={({ field: { onChange, value } }) => (
              <View style={styles.unidadesContainer}>
                {UNIDADES.map((u) => (
                  <TouchableOpacity
                    key={u}
                    style={[styles.unidadeChip, value === u && styles.unidadeChipSelected]}
                    onPress={() => onChange(u)}
                  >
                    <Text style={[styles.unidadeText, value === u && styles.unidadeTextSelected]}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
        </View>
      </View>

      <Controller
        control={control}
        name="observacao"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Observação (Opcional)"
            placeholder="Detalhes adicionais..."
            multiline
            numberOfLines={3}
            style={{ height: 80, textAlignVertical: 'top' }}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.observacao?.message}
          />
        )}
      />

      <View style={styles.actions}>
        <Button 
          title={modo === 'criacao' ? 'Cadastrar Produto' : 'Salvar Alterações'} 
          onPress={handleSubmit(onSubmit)} 
          loading={isSubmitting}
          fullWidth
        />
        
        {modo === 'edicao' && (
          <Button 
            title="Excluir Produto" 
            variant="danger-outline" 
            onPress={handleDelete} 
            fullWidth
            style={styles.deleteButton}
            icon="trash-outline"
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[8],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[800],
    marginBottom: theme.spacing[2],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[800],
    marginBottom: theme.spacing[2],
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing[4],
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.neutral[100],
    marginRight: theme.spacing[2],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  categoryChipSelected: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  categoryText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    marginLeft: theme.spacing[1],
  },
  categoryTextSelected: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.bold,
  },
  unidadesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  unidadeChip: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral[100],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  unidadeChipSelected: {
    backgroundColor: theme.colors.primary[50],
    borderColor: theme.colors.primary[500],
  },
  unidadeText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
  },
  unidadeTextSelected: {
    color: theme.colors.primary[600],
    fontWeight: theme.typography.fontWeight.bold,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.danger.base,
    marginTop: -theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  actions: {
    marginTop: theme.spacing[4],
    gap: theme.spacing[4],
  },
  deleteButton: {
    marginTop: theme.spacing[2],
  }
});
