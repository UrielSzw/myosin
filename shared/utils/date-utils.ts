/**
 * Utility para calcular day_key consistente
 */
export const getDayKey = (date?: Date): string => {
  const d = date || new Date();
  return d.toISOString().split("T")[0];
};

/**
 * Utility para generar timestamp ISO completo
 * Si recordedAt es solo fecha (YYYY-MM-DD), agrega la hora actual
 * Si ya es timestamp completo, lo devuelve tal como está
 */
export const getFullTimestamp = (recordedAt?: string): string => {
  if (!recordedAt) {
    return new Date().toISOString();
  }

  // Si ya es un timestamp completo, devolverlo tal como está
  if (recordedAt.includes("T")) {
    return recordedAt;
  }

  // Si es solo fecha (YYYY-MM-DD), agregar hora actual
  const currentTime = new Date().toTimeString().split(" ")[0]; // HH:MM:SS
  return `${recordedAt}T${currentTime}`;
};
