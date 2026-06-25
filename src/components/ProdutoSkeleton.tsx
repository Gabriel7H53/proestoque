import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { theme } from '../constants/theme';

export const ProdutoSkeletonItem: React.FC = () => {
  return (
    <View style={styles.card}>
      {/* Icon Placeholder */}
      <Skeleton width={48} height={48} borderRadius={theme.borderRadius.md} style={styles.icon} />
      
      {/* Info Placeholder */}
      <View style={styles.info}>
        <Skeleton width="75%" height={16} borderRadius={4} style={styles.name} />
        <Skeleton width="40%" height={12} borderRadius={4} />
      </View>
      
      {/* Badge Placeholder */}
      <Skeleton width={64} height={20} borderRadius={theme.borderRadius.full} />
    </View>
  );
};

export const ProdutoListaSkeleton: React.FC = () => {
  return (
    <View style={styles.listContainer}>
      <ProdutoSkeletonItem />
      <ProdutoSkeletonItem />
      <ProdutoSkeletonItem />
      <ProdutoSkeletonItem />
      <ProdutoSkeletonItem />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  icon: {
    marginRight: theme.spacing[3],
  },
  info: {
    flex: 1,
    gap: 6,
  },
  name: {
    marginBottom: 2,
  },
});
