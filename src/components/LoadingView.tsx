import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

interface LoadingViewProps {
  mensagem?: string;
}

export function LoadingView({ mensagem = 'Carregando...' }: LoadingViewProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary[500]} />
      <Text style={styles.text}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing[6],
  },
  text: {
    marginTop: theme.spacing[4],
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[500],
  },
});
