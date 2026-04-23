import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';

export default function ConfiguracoesScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // Limpar auth token (simulado)
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Configurações</Text>
        
        <View style={styles.content}>
          <Text style={styles.subtitle}>Opções do aplicativo aparecerão aqui.</Text>
        </View>

        <Button 
          title="Sair" 
          variant="outline" 
          icon="log-out-outline"
          onPress={handleLogout}
          fullWidth
          style={styles.logoutButton}
        />
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
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing[6],
  },
  content: {
    flex: 1,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[500],
  },
  logoutButton: {
    marginTop: 'auto',
  },
});
