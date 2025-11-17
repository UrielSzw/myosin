// Solo importar expo-crypto para React Native
import { randomUUID as expoRandomUUID } from "expo-crypto";
import "react-native-get-random-values";

export const generateUUID = (): string => {
  // En Node.js (migrations), usar crypto nativo
  if (typeof process !== "undefined" && process.versions?.node) {
    // Usar importación dinámica para evitar que Metro bundler procese 'crypto'
    const crypto = eval("require")("crypto");
    return crypto.randomUUID();
  }

  // En React Native, usar expo-crypto con polyfill
  return expoRandomUUID();
};
