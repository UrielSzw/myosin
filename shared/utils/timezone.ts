import * as Localization from "expo-localization";

/**
 * Detecta automáticamente la zona horaria del usuario
 * Usa Intl API como primera opción, expo-localization como fallback
 */
export const getUserTimezone = (): string => {
  try {
    // Intl API es más preciso y está disponible en la mayoría de dispositivos modernos
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone) return timezone;
  } catch (error) {
    console.warn("Intl.DateTimeFormat no disponible, usando expo-localization");
  }

  // Fallback a expo-localization
  try {
    return Localization.timezone || "America/Argentina/Buenos_Aires";
  } catch (error) {
    console.warn("Error detectando timezone, usando default:", error);
    return "America/Argentina/Buenos_Aires"; // Default para Argentina
  }
};

/**
 * Convierte una fecha UTC a la zona horaria local del usuario
 * @param utcDate - Fecha en UTC (string ISO o Date)
 * @param userTimezone - Zona horaria opcional, si no se proporciona se detecta automáticamente
 * @returns Fecha formateada en zona horaria local
 */
export const formatToUserTimezone = (
  utcDate: string | Date,
  userTimezone?: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = typeof utcDate === "string" ? new Date(utcDate) : utcDate;
  const timezone = userTimezone || getUserTimezone();

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  };

  return date.toLocaleString("es-AR", { ...defaultOptions, ...options });
};

/**
 * Convierte una fecha UTC a solo la fecha en zona horaria local
 * Útil para mostrar "Agregado el 10/11/2025"
 */
export const formatDateToUserTimezone = (
  utcDate: string | Date,
  userTimezone?: string
): string => {
  return formatToUserTimezone(utcDate, userTimezone, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/**
 * Convierte una fecha UTC a solo la hora en zona horaria local
 * Útil para mostrar "20:47"
 */
export const formatTimeToUserTimezone = (
  utcDate: string | Date,
  userTimezone?: string
): string => {
  return formatToUserTimezone(utcDate, userTimezone, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Obtiene el day_key en UTC para agregaciones consistentes
 * Siempre devuelve el día en UTC sin importar la zona horaria local
 * @param date - Fecha actual (opcional, usa new Date() si no se proporciona)
 * @returns String en formato YYYY-MM-DD en UTC
 */
export const getDayKeyUTC = (date?: Date): string => {
  const d = date || new Date();
  return d.toISOString().split("T")[0]; // "2025-11-10"
};

/**
 * Convierte cualquier fecha a UTC ISO string
 * Útil para almacenar fechas consistentemente
 */
export const toUTCISOString = (date?: Date): string => {
  const d = date || new Date();
  return d.toISOString();
};

/**
 * Parsea una fecha manteniendo la zona horaria local del usuario
 * y la convierte a UTC para almacenamiento
 * @param dateString - Fecha en formato local "2025-11-10 20:47"
 * @returns Date object en UTC
 */
export const parseLocalToUTC = (dateString: string): Date => {
  // Si ya es un ISO string, lo devolvemos como Date
  if (dateString.includes("T") && dateString.includes("Z")) {
    return new Date(dateString);
  }

  // Si es formato local, asumimos que es en la zona horaria del usuario
  const localDate = new Date(dateString);
  return localDate; // JavaScript automáticamente lo trata como UTC al convertir
};

/**
 * Combina la fecha seleccionada con la hora actual en UTC
 * Útil para recorded_at: fecha del día seleccionado + hora actual
 * @param selectedDate - Fecha seleccionada en formato "YYYY-MM-DD"
 * @returns ISO string en UTC con fecha seleccionada + hora actual
 */
export const combineSelectedDateWithCurrentTime = (
  selectedDate: string
): string => {
  console.log("🚀 [combineSelectedDateWithCurrentTime] Input:", selectedDate);

  // Si ya es un timestamp ISO completo, devolverlo tal como está
  if (selectedDate.includes("T") && selectedDate.includes("Z")) {
    console.log(
      "🚀 [combineSelectedDateWithCurrentTime] Already ISO timestamp, returning as-is"
    );
    return selectedDate;
  }

  const now = new Date();

  // Crear fecha UTC a partir del selectedDate (solo fecha)
  const selectedDateObj = new Date(selectedDate + "T00:00:00.000Z");

  // Combinar: fecha seleccionada + hora/minutos/segundos actuales en UTC
  selectedDateObj.setUTCHours(now.getUTCHours());
  selectedDateObj.setUTCMinutes(now.getUTCMinutes());
  selectedDateObj.setUTCSeconds(now.getUTCSeconds());
  selectedDateObj.setUTCMilliseconds(now.getUTCMilliseconds());

  const result = selectedDateObj.toISOString();
  console.log("🚀 [combineSelectedDateWithCurrentTime] Output:", result);
  console.log(
    "🚀 [combineSelectedDateWithCurrentTime] Current UTC time:",
    now.toISOString()
  );

  return result;
};

/**
 * Obtiene información completa de la zona horaria del usuario
 * Útil para debugging y configuraciones avanzadas
 */
export const getTimezoneInfo = () => {
  const timezone = getUserTimezone();
  const now = new Date();

  return {
    timezone,
    offset: now.getTimezoneOffset(), // en minutos
    offsetHours: now.getTimezoneOffset() / 60, // en horas
    utcTime: now.toISOString(),
    localTime: formatToUserTimezone(now),
    locale: Localization.getLocales()[0]?.languageTag || "es-AR",
  };
};
