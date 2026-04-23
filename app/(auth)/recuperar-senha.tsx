import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { theme } from '../../src/constants/theme';

export default function RecuperarSenhaScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [error, setError] = useState('');

  const handleEnviar = () => {
    setError('');
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    setLoading(true);
    // Simulando requisição de recuperação
    setTimeout(() => {
      setLoading(false);
      setSucesso(true);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Recuperar Senha</Text>
            <Text style={styles.subtitle}>
              {sucesso 
                ? 'E-mail enviado com sucesso!' 
                : 'Digite seu e-mail para receber as instruções de recuperação de senha.'}
            </Text>
          </View>

          {sucesso ? (
            <View style={styles.successContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="mail-unread-outline" size={64} color={theme.colors.success.base} />
              </View>
              <Text style={styles.successText}>
                Enviamos um link de recuperação para{'\n'}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>
              <Text style={styles.successSubtext}>
                Verifique sua caixa de entrada e a pasta de spam.
              </Text>
              
              <Button
                title="Voltar ao Login"
                onPress={() => router.back()}
                fullWidth
                style={styles.backButton}
              />
            </View>
          ) : (
            <View style={styles.form}>
              <Input
                label="E-mail"
                placeholder="Digite seu e-mail cadastrado"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail-outline"
                value={email}
                onChangeText={setEmail}
                error={error}
              />

              <Button
                title="Enviar"
                onPress={handleEnviar}
                loading={loading}
                fullWidth
                style={styles.sendButton}
              />

              <Button
                title="Voltar ao Login"
                variant="ghost"
                onPress={() => router.back()}
                fullWidth
              />
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: theme.spacing[6],
    justifyContent: 'center',
  },
  header: {
    marginBottom: theme.spacing[8],
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[500],
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  sendButton: {
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.success.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  successText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutral[800],
    textAlign: 'center',
    marginBottom: theme.spacing[2],
    lineHeight: 28,
  },
  emailHighlight: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary[500],
  },
  successSubtext: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[500],
    textAlign: 'center',
    marginBottom: theme.spacing[8],
  },
  backButton: {
    marginTop: theme.spacing[4],
  },
});
