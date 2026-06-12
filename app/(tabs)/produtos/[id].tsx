import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '../../../src/constants/theme';
import { ProdutoForm } from '../../../src/components/forms/ProdutoForm';
import { useProducts } from '../../../src/contexts/ProductsContext';
import { Button } from '../../../src/components/Button';
import { Ionicons } from '@expo/vector-icons';

export default function EditarProdutoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getProdutoById } = useProducts();

  const produto = getProdutoById(id);

  if (!produto) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={theme.colors.danger.base} />
        <Text style={styles.errorText}>Produto não encontrado.</Text>
        <Text style={styles.errorSubtext}>O produto pode ter sido excluído ou não existe.</Text>
        <Button 
          title="Voltar para Produtos" 
          onPress={() => router.back()} 
          style={{ marginTop: theme.spacing[4] }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProdutoForm 
        modo="edicao" 
        initialData={{
          id: produto.id,
          nome: produto.nome,
          categoriaId: produto.categoriaId,
          quantidade: produto.quantidade,
          quantidadeMinima: produto.quantidadeMinima,
          preco: produto.preco,
          unidade: produto.unidade as any,
          observacao: produto.observacao || '',
        }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[6],
  },
  errorText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[900],
    marginTop: theme.spacing[4],
  },
  errorSubtext: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[500],
    textAlign: 'center',
    marginTop: theme.spacing[2],
  },
});
