import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../src/constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, João 👋</Text>
          <Text style={styles.subtitle}>Visão geral do seu estoque</Text>
        </View>

        <View style={styles.mainCard}>
          <Text style={styles.mainCardLabel}>Total em produtos</Text>
          <Text style={styles.mainCardValue}>247</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Categorias</Text>
            <Text style={styles.statValue}>12</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Alertas</Text>
            <Text style={[styles.statValue, styles.alertValue]}>5</Text>
          </View>
        </View>

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
    padding: theme.spacing[6],
  },
  header: {
    marginBottom: theme.spacing[6],
    marginTop: theme.spacing[4],
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
  mainCard: {
    backgroundColor: theme.colors.primary[500],
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[6],
    marginBottom: theme.spacing[4],
  },
  mainCardLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing[1],
  },
  mainCardValue: {
    color: theme.colors.white,
    fontSize: 48,
    fontWeight: theme.typography.fontWeight.bold,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[10],
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
    marginHorizontal: theme.spacing[1],
  },
  statLabel: {
    color: theme.colors.neutral[500],
    fontSize: theme.typography.fontSize.sm,
    marginBottom: theme.spacing[2],
  },
  statValue: {
    color: theme.colors.neutral[900],
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
  },
  alertValue: {
    color: theme.colors.danger.base,
  },
  bottomText: {
    textAlign: 'center',
    color: theme.colors.neutral[400],
    fontSize: theme.typography.fontSize.sm,
    fontStyle: 'italic',
  },
});
