/**
 * Utility para calcular day_key consistente
 * Usa la fecha LOCAL del usuario (no UTC) para que el día corresponda
 * a lo que el usuario ve en su zona horaria
 */
export const getDayKey = (date?: Date): string => {
  const d = date || new Date();
  // Usar fecha local en vez de UTC
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
