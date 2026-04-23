import { Redirect } from 'expo-router';

export default function Index() {
  // Inicialmente redirecionamos para a tela de login
  return <Redirect href="/(auth)/login" />;
}
