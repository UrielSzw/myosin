// Solo importar expo-crypto para React Native
import { randomUUID as expoRandomUUID } from "expo-crypto";
import "react-native-get-random-values";

export const generateUUID = (): string => {
  // En React Native, usar expo-crypto con polyfill
  return expoRandomUUID();
};

// ===== PARA MIGRACIONES CON NODE.JS =====
// import { randomUUID } from "crypto";

// export const generateUUID = (): string => {
//   // Usar crypto nativo de Node.js para drizzle-kit
//   return randomUUID();
// };
