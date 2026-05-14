import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../src/constants/theme';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

function NavigationGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redireciona para login se não estiver autenticado e tentar acessar rotas protegidas
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redireciona para o dashboard se estiver autenticado e tentar acessar auth
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.logoIconContainer}>
          <Ionicons name="card-outline" size={32} color={theme.colors.white} />
        </View>
        <Text style={styles.logoText}>ProEstoque</Text>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} style={styles.spinner} />
        <Text style={styles.loadingText}>Verificando sessão...</Text>
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" backgroundColor={theme.colors.background} />
      <NavigationGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="index" />
        </Stack>
      </NavigationGuard>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  logoIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: theme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  logoText: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[8],
  },
  spinner: {
    marginBottom: theme.spacing[4],
  },
  loadingText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[400],
  },
});
