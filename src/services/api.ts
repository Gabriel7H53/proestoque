import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Em desenvolvimento, troque SEU_IP_LOCAL pelo IP da sua máquina.
// Android não acessa o localhost do computador diretamente.
// Exemplo: http://192.168.1.100:3333/api
const BASE_URL = __DEV__
  ? "http://192.168.0.13:3333/api" // TODO: Troque pelo IP da sua máquina
  : "https://proestoque-api.onrender.com/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@proestoque:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado.
      // Tratamento global completo será feito em aula futura, se necessário.
    }
    return Promise.reject(error);
  }
);
