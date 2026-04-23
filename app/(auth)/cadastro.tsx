import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { theme } from '../../src/constants/theme';

export default function CadastroScreen() {
  const router = useRouter();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let isValid = true;
    let newErrors: { [key: string]: string } = {};

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
      isValid = false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'E-mail inválido';
      isValid = false;
    }

    if (senha.length < 6) {
      newErrors.senha = 'A senha deve ter pelo menos 6 caracteres';
      isValid = false;
    }

    if (senha !== confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCadastro = () => {
    if (validate()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // Sucesso no cadastro
        router.replace('/(tabs)');
      }, 2000);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <View style={styles.logoIconContainer}>
              <Ionicons name="card-outline" size={32} color={theme.colors.white} />
            </View>
            <Text style={styles.title}>Criar conta</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Nome completo"
              placeholder="João Silva"
              leftIcon="person-outline"
              value={nome}
              onChangeText={setNome}
              error={errors.nome}
            />

            <Input
              label="E-mail"
              placeholder="joao@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />
            
            <Input
              label="Senha"
              placeholder="••••••"
              isPassword
              leftIcon="lock-closed-outline"
              value={senha}
              onChangeText={setSenha}
              error={errors.senha}
            />

            <Input
              label="Confirmar senha"
              placeholder="••••"
              isPassword
              leftIcon="lock-closed-outline"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              error={errors.confirmarSenha}
            />

            <Button
              title="Criar Conta"
              onPress={handleCadastro}
              loading={loading}
              size="lg"
              fullWidth
              style={styles.registerButton}
            />

            <View style={styles.loginContainer}>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}>Já tenho conta</Text>
              </TouchableOpacity>
            </View>
          </View>

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
    alignItems: 'center',
    marginBottom: theme.spacing[8],
  },
  logoIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 24, // Squircle look
    backgroundColor: theme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[2],
  },
  form: {
    width: '100%',
  },
  registerButton: {
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLink: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary[500],
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
