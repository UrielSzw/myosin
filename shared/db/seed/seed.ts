import { syncExercisesWithLanguage } from "../../hooks/use-exercises-sync";
import { supabase } from "../../services/supabase";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "../../types/language";
import { usersRepository } from "../repository/user";

/**
 * Obtiene el idioma del usuario desde user_preferences local o Supabase
 * Por defecto retorna 'en' si no se encuentra
 */
const getUserLanguage = async (): Promise<SupportedLanguage> => {
  try {
    // Intentar obtener el user_id de la sesión actual
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user?.id) {
      // Buscar preferencias locales primero
      const localPrefs = await usersRepository.getUserPreferences(
        session.user.id
      );
      if (localPrefs?.language) {
        return localPrefs.language;
      }
    }

    // Fallback a idioma por defecto
    return DEFAULT_LANGUAGE;
  } catch (error) {
    console.warn(
      `⚠️ Error obteniendo idioma del usuario, usando '${DEFAULT_LANGUAGE}':`,
      error
    );
    return DEFAULT_LANGUAGE;
  }
};

/**
 * Carga/sincroniza ejercicios al iniciar la app.
 * Detecta automáticamente el idioma del usuario.
 */
export const loadExercisesSeed = async () => {
  try {
    const currentLanguage = await getUserLanguage();
    await syncExercisesWithLanguage(currentLanguage);
  } catch (error) {
    console.error("❌ Error en seed:", error);
  }
};
