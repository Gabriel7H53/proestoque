import React, { useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  RefreshControl, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import { 
  PRODUTOS_MOCK, 
  CATEGORIAS_MOCK, 
  getProdutosComEstoqueBaixo, 
  getValorTotalEstoque, 
  formatarPreco,
  Produto
} from '../../src/data/mockData';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // Saudação baseada no horário
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Simulating refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  // Calculate summaries
  const totalProdutos = PRODUTOS_MOCK.length;
  const produtosBaixoEstoque = getProdutosComEstoqueBaixo();
  const totalCategorias = CATEGORIAS_MOCK.length;
  const valorTotal = getValorTotalEstoque();

  // Get category icon
  const getCategoriaIcon = (categoriaId: string) => {
    const cat = CATEGORIAS_MOCK.find(c => c.id === categoriaId);
    return cat ? cat.icon : 'cube-outline';
  };

  // Status Badge components
  const StatusBadge = ({ status }: { status: Produto['statusEstoque'] }) => {
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
    }

    return (
      <View style={[styles.badge, { backgroundColor: bgColor }]}>
        <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.greetingHeader}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}, {user?.nome || 'Usuário'} 👋</Text>
            <Text style={styles.subtitle}>Visão geral do seu estoque</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.nome?.charAt(0).toUpperCase() || 'U'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardValue}>{totalProdutos}</Text>
          <Text style={styles.summaryCardLabel}>Produtos</Text>
        </View>
        <View style={[styles.summaryCard, styles.summaryCardWarning]}>
          <Text style={styles.summaryCardValueWarning}>{produtosBaixoEstoque.length}</Text>
          <Text style={styles.summaryCardLabelWarning}>Alertas</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryCardValue}>{totalCategorias}</Text>
          <Text style={styles.summaryCardLabel}>Categorias</Text>
        </View>
        <View style={[styles.summaryCard, styles.summaryCardSuccess]}>
          <Text style={styles.summaryCardValueSuccess}>{formatarPreco(valorTotal)}</Text>
          <Text style={styles.summaryCardLabelSuccess}>Valor</Text>
        </View>
      </View>

      {produtosBaixoEstoque.length > 0 && (
        <View style={styles.alertsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚠️ Alertas de Estoque</Text>
            {produtosBaixoEstoque.length > 3 && (
              <TouchableOpacity onPress={() => router.push('/(tabs)/produtos')}>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            )}
          </View>
          {produtosBaixoEstoque.slice(0, 3).map(produto => (
            <View key={`alert-${produto.id}`} style={styles.alertItem}>
              <View style={styles.alertItemLeft}>
                <Ionicons name="warning-outline" size={20} color={theme.colors.danger.base} />
                <Text style={styles.alertItemName} numberOfLines={1}>{produto.nome}</Text>
              </View>
              <Text style={styles.alertItemQtd}>
                {produto.quantidade} {produto.unidade}
              </Text>
            </View>
          ))}
        </View>
      )}

      <Text style={[styles.sectionTitle, styles.recentProductsTitle]}>Produtos recentes</Text>
    </View>
  );

  const renderItem = useCallback(({ item }: { item: Produto }) => (
    <View style={styles.productCard}>
      <View style={styles.productIconContainer}>
        <Ionicons name={getCategoriaIcon(item.categoriaId)} size={24} color={theme.colors.primary[500]} />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.productQty}>{item.quantidade} {item.unidade}</Text>
      </View>
      <StatusBadge status={item.statusEstoque} />
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={PRODUTOS_MOCK}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[8],
  },
  headerContainer: {
    marginBottom: theme.spacing[4],
  },
  greetingHeader: {
    marginBottom: theme.spacing[6],
    marginTop: theme.spacing[2],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary[500],
  },
  greeting: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[1],
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[500],
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[6],
  },
  summaryCard: {
    width: '48%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  summaryCardWarning: {
    backgroundColor: theme.colors.warning.light,
    borderColor: theme.colors.warning.light,
  },
  summaryCardSuccess: {
    backgroundColor: theme.colors.success.light,
    borderColor: theme.colors.success.light,
  },
  summaryCardLabel: {
    color: theme.colors.neutral[500],
    fontSize: theme.typography.fontSize.sm,
  },
  summaryCardLabelWarning: {
    color: theme.colors.warning.dark,
    fontSize: theme.typography.fontSize.sm,
  },
  summaryCardLabelSuccess: {
    color: theme.colors.success.dark,
    fontSize: theme.typography.fontSize.sm,
  },
  summaryCardValue: {
    color: theme.colors.neutral[900],
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing[1],
  },
  summaryCardValueWarning: {
    color: theme.colors.warning.dark,
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing[1],
  },
  summaryCardValueSuccess: {
    color: theme.colors.success.dark,
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing[1],
  },
  alertsSection: {
    backgroundColor: theme.colors.danger.light,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[900],
  },
  seeAllText: {
    color: theme.colors.primary[500],
    fontWeight: theme.typography.fontWeight.medium,
    fontSize: theme.typography.fontSize.sm,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[2],
  },
  alertItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertItemName: {
    marginLeft: theme.spacing[2],
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.neutral[800],
    flex: 1,
  },
  alertItemQtd: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.danger.base,
  },
  recentProductsTitle: {
    marginBottom: theme.spacing[4],
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
});
