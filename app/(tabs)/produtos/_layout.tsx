import { Stack } from 'expo-router';
import { theme } from '../../../src/constants/theme';

export default function ProdutosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary[500],
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          fontWeight: theme.typography.fontWeight.bold,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Produtos',
          headerShown: false // Já temos um header customizado na tela de index
        }} 
      />
      <Stack.Screen 
        name="novo" 
        options={{ 
          title: 'Novo Produto',
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'Editar Produto',
          presentation: 'modal'
        }} 
      />
    </Stack>
  );
}
