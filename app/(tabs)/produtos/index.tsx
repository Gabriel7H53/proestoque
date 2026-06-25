import React, { useState, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../../../src/constants/theme';
import { useProducts, Produto } from '../../../src/contexts/ProductsContext';
import { useCategorias } from '../../../src/hooks/useCategorias';
import { ProdutoListaSkeleton } from '../../../src/components/ProdutoSkeleton';
import { ErrorView } from '../../../src/components/ErrorView';

export default function ProdutosListScreen() {
  const router = useRouter();
  const { produtos, isLoading, error, carregarProdutos } = useProducts();
  const { categorias } = useCategorias();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarProdutos();
    setRefreshing(false);
  }, [carregarProdutos]);

  // Filter products using useMemo
  const filteredProducts = useMemo(() => {
    return produtos.filter(produto => {
      // Filter by category
      if (selectedCategoria && produto.categoriaId !== selectedCategoria) {
        return false;
      }
      // Filter by search text
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return produto.nome.toLowerCase().includes(query);
      }
      return true;
    });
  }, [produtos, searchQuery, selectedCategoria]);

  // Toggle category filter
  const handleToggleCategoria = useCallback((id: string) => {
    setSelectedCategoria(prev => prev === id ? null : id);
  }, []);

  // Get category icon
  const getCategoriaIcon = useCallback((categoriaId: string) => {
    const cat = categorias.find(c => c.id === categoriaId);
    const iconName = cat?.icone || cat?.icone || 'cube-outline';
    return iconName as keyof typeof Ionicons.glyphMap;
  }, [categorias]);

  // Status Badge component
  const StatusBadge = useCallback(({ status }: { status: 'normal' | 'baixo' | 'sem_estoque' }) => {
    let bgColor, textColor, label;
    switch (status) {
      case 'normal':
        bgColor = theme.colors.success.light;
        textColor = theme.colors.success.dark;
        label = 'Normal';
        break;
      case 'baixo':
        bgColor = theme.colors.warning.light;
        textColor = theme.colors.warning.dark;
        label = 'Baixo';
        break;
      case 'sem_estoque':
        bgColor = theme.colors.danger.light;
        textColor = theme.colors.danger.dark;
        label = 'Sem estoque';
        break;
      default:
        bgColor = theme.colors.neutral[100];
        textColor = theme.colors.neutral[600];
        label = 'Indefinido';
    }

    return (
      <View style={[styles.badge, { backgroundColor: bgColor }]}>
        <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
      </View>
    );
  }, []);

  const renderItem = useCallback(({ item }: { item: Produto }) => {
    const status = item.quantidade <= 0 ? 'sem_estoque' : (item.quantidade < item.quantidadeMinima ? 'baixo' : 'normal');
    return (
      <TouchableOpacity 
        style={styles.productCard}
        activeOpacity={0.7}
        onPress={() => router.push(`/produtos/${item.id}`)}
      >
        <View style={styles.productIconContainer}>
          <Ionicons name={getCategoriaIcon(item.categoriaId)} size={24} color={theme.colors.primary[500]} />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{item.nome}</Text>
          <Text style={styles.productQty}>{item.quantidade} {item.unidade}</Text>
        </View>
        <StatusBadge status={status} />
      </TouchableOpacity>
    );
  }, [getCategoriaIcon, StatusBadge, router]);

  const renderEmptyComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color={theme.colors.neutral[300]} />
      <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
      <Text style={styles.emptySubtext}>Tente buscar por outro termo ou remova os filtros.</Text>
    </View>
  ), []);


  if (error && produtos.length === 0) {
    return <ErrorView mensagem={error} onRetry={carregarProdutos} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Produtos</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.colors.neutral[400]} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produtos..."
            placeholderTextColor={theme.colors.neutral[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={theme.colors.neutral[400]} />
            </TouchableOpacity>
          )}
        </View>

        {categorias.length > 0 && (
          <View style={styles.filtersContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScrollContent}>
              {categorias.map(categoria => {
                const isSelected = selectedCategoria === categoria.id;
                const iconName = (categoria.icone || 'cube-outline') as keyof typeof Ionicons.glyphMap;
                return (
                  <TouchableOpacity
                    key={categoria.id}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => handleToggleCategoria(categoria.id)}
                  >
                    <Ionicons 
                      name={iconName} 
                      size={16} 
                      color={isSelected ? theme.colors.white : theme.colors.neutral[600]} 
                      style={styles.chipIcon}
                    />
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {categoria.nome}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {isLoading && produtos.length === 0 ? (
          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary[500]]}
                tintColor={theme.colors.primary[500]}
              />
            }
          >
            <ProdutoListaSkeleton />
          </ScrollView>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListEmptyComponent={renderEmptyComponent}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary[500]]}
                tintColor={theme.colors.primary[500]}
              />
            }
          />
        )}

        <TouchableOpacity 
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() => router.push('/produtos/novo')}
        >
          <Ionicons name="add" size={28} color={theme.colors.white} />
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[2],
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[900],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
    paddingHorizontal: theme.spacing[3],
    height: 48,
  },
  searchIcon: {
    marginRight: theme.spacing[2],
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[900],
  },
  clearButton: {
    padding: theme.spacing[1],
  },
  filtersContainer: {
    marginBottom: theme.spacing[4],
  },
  filtersScrollContent: {
    paddingHorizontal: theme.spacing[4],
    gap: theme.spacing[2],
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  chipSelected: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  chipIcon: {
    marginRight: theme.spacing[1],
  },
  chipText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.neutral[600],
  },
  chipTextSelected: {
    color: theme.colors.white,
  },
  listContent: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: 80, // Extra padding for FAB
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[16],
  },
  emptyText: {
    marginTop: theme.spacing[4],
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral[700],
  },
  emptySubtext: {
    marginTop: theme.spacing[2],
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[500],
    textAlign: 'center',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  productIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing[3],
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral[900],
    marginBottom: 2,
  },
  productQty: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[500],
  },
  badge: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing[6],
    right: theme.spacing[6],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
