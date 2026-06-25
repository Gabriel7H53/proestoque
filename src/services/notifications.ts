import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configura o Notification Handler para definir o comportamento das notificações recebidas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  } as any),
});

/**
 * Solicita a permissão do usuário para enviar notificações locais.
 * Retorna true se a permissão foi concedida.
 */
export async function solicitarPermissaoNotificacoes(): Promise<boolean> {
  // Notificações físicas necessitam de permissão, mas simuladores também funcionam
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permissão de notificações locais negada.');
    return false;
  }

  // No Android, é necessário configurar o canal de notificações padrão
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#5838C7',
    });
  }

  return true;
}

/**
 * Envia uma notificação local imediata sobre o estoque crítico e define a badge
 */
export async function notificarEstoqueCritico(totalCritico: number) {
  // Atualiza o contador do badge
  await Notifications.setBadgeCountAsync(totalCritico);

  // Dispara a notificação local imediata
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⚠️ Alerta de Estoque Crítico',
      body: `Você possui ${totalCritico} ${totalCritico === 1 ? 'produto' : 'produtos'} com estoque abaixo do limite mínimo definido!`,
      sound: true,
      badge: totalCritico,
    },
    trigger: null, // Envio imediato
  });
}

/**
 * Agenda uma notificação diária recorrente para lembrete de verificação
 */
export async function agendarVerificacaoDiaria() {
  const agendadas = await Notifications.getAllScheduledNotificationsAsync();
  const jaAgendada = agendadas.some(
    (n) => n.content.title === '📋 Verificação Diária de Estoque'
  );

  if (jaAgendada) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '📋 Verificação Diária de Estoque',
      body: 'Não se esqueça de conferir e atualizar os níveis de estoque no painel do ProEstoque!',
      sound: true,
    },
    trigger: {
      type: 'calendar',
      hour: 9,
      minute: 0,
      repeats: true,
    } as any,
  });
}

/**
 * Reseta o contador de badge do aplicativo
 */
export async function limparBadge() {
  await Notifications.setBadgeCountAsync(0);
}
