import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../src/constants/theme';
import { Button } from '../../src/components/Button';
import { useAuth } from '../../src/contexts/AuthContext';

export default function ConfiguracoesScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: async () => await logout() },
    ]);
  };

  const MenuItem = ({ icon, title, color }: { icon: any; title: string; color: string }) => (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.neutral[300]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Configurações</Text>
        
        <View style={styles.content}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.nome?.charAt(0).toUpperCase() || 'U'}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.nome || 'Usuário'}</Text>
              <Text style={styles.profileEmail}>{user?.email || 'email@exemplo.com'}</Text>
            </View>
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>Preferências</Text>
            <MenuItem icon="notifications" title="Notificações" color={theme.colors.warning.base} />
            <MenuItem icon="color-palette" title="Aparência" color="#F472B6" />
            <MenuItem icon="help-circle" title="Ajuda" color={theme.colors.danger.base} />
          </View>
        </View>

        <Button 
          title="Sair da conta" 
          variant="danger-outline" 
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing[8],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing[4],
  },
  avatarText: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary[500],
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[900],
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[500],
  },
  menuSection: {
    marginBottom: theme.spacing[6],
  },
  menuSectionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[800],
    marginBottom: theme.spacing[4],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral[800],
    marginLeft: theme.spacing[3],
  },
  logoutButton: {
    marginTop: 'auto',
  },
});
