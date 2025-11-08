import 'react-native-get-random-values'; // Polyfill para crypto.getRandomValues
import { randomUUID } from 'expo-crypto';

export const generateUUID = (): string => {
  return randomUUID();
};
