import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import { db } from "../db/client";
import { exercises } from "../db/schema";
import { SupabaseExercisesRepository } from "../sync/repositories/supabase-exercises-repository";
import { isValidLanguage, type SupportedLanguage } from "../types/language";

// Re-export for backward compatibility
export type { SupportedLanguage } from "../types/language";

// ============================================================================
// Constants
// ============================================================================

const LAST_EXERCISES_SYNC_KEY = "last_exercises_sync";
const LAST_EXERCISES_LANGUAGE_KEY = "last_exercises_language";
const SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 horas

// ============================================================================
// Types
// ============================================================================

export interface ExercisesSyncState {
  isSyncing: boolean;
  lastSyncLanguage: SupportedLanguage | null;
  lastSyncTimestamp: number | null;
  error: Error | null;
}

export interface ExercisesSyncOptions {
  /** Forzar sync ignorando el intervalo de tiempo */
  force?: boolean;
  /** Idioma específico a sincronizar (si no se pasa, se detecta automáticamente) */
  language?: SupportedLanguage;
}

export interface ExercisesSyncResult {
  success: boolean;
  syncedCount: number;
  language: SupportedLanguage;
  skipped: boolean;
  error?: Error;
}

// ============================================================================
// Service (lógica pura, sin hooks)
// ============================================================================

const supabaseExercisesRepo = new SupabaseExercisesRepository();

/**
 * Verifica si el sync es necesario basado en timestamp e idioma
 */
export const checkSyncNeeded = async (
  targetLanguage: SupportedLanguage
): Promise<{
  needed: boolean;
  reason: "expired" | "language_changed" | null;
}> => {
  const lastSyncStr = await AsyncStorage.getItem(LAST_EXERCISES_SYNC_KEY);
  const lastLanguage = await AsyncStorage.getItem(LAST_EXERCISES_LANGUAGE_KEY);

  // Si cambió el idioma, necesitamos sync
  if (lastLanguage !== targetLanguage) {
    return { needed: true, reason: "language_changed" };
  }

  // Si no hay sync previo o expiró, necesitamos sync
  if (!lastSyncStr) {
    return { needed: true, reason: "expired" };
  }

  const lastSync = parseInt(lastSyncStr, 10);
  const timeSinceLastSync = Date.now() - lastSync;

  if (timeSinceLastSync >= SYNC_INTERVAL_MS) {
    return { needed: true, reason: "expired" };
  }

  return { needed: false, reason: null };
};

/**
 * Obtiene el tiempo restante hasta el próximo sync en horas
 */
export const getTimeUntilNextSync = async (): Promise<number | null> => {
  const lastSyncStr = await AsyncStorage.getItem(LAST_EXERCISES_SYNC_KEY);

  if (!lastSyncStr) return null;

  const lastSync = parseInt(lastSyncStr, 10);
  const timeSinceLastSync = Date.now() - lastSync;
  const timeRemaining = SYNC_INTERVAL_MS - timeSinceLastSync;

  if (timeRemaining <= 0) return 0;

  return Math.ceil(timeRemaining / (60 * 60 * 1000));
};

/**
 * Ejecuta la sincronización de ejercicios con el idioma especificado
 */
export const syncExercisesWithLanguage = async (
  language: SupportedLanguage,
  options: { force?: boolean } = {}
): Promise<ExercisesSyncResult> => {
  const { force = false } = options;

  try {
    // Verificar si es necesario sincronizar
    if (!force) {
      const { needed, reason } = await checkSyncNeeded(language);

      if (!needed) {
        const hoursRemaining = await getTimeUntilNextSync();
        console.log(
          `⚡️ Ejercicios sincronizados recientemente (${language}). Próximo sync en ~${hoursRemaining}h`
        );
        return {
          success: true,
          syncedCount: 0,
          language,
          skipped: true,
        };
      }

      if (reason === "language_changed") {
        console.log(
          `🌍 Idioma cambió a '${language}', re-sincronizando ejercicios...`
        );
      }
    } else {
      console.log(`🔄 Forzando sync de ejercicios (${language})...`);
    }

    console.log(
      `🌐 Sincronizando ejercicios desde Supabase (idioma: ${language})...`
    );

    // Obtener ejercicios con traducciones desde Supabase
    const exercisesFromSupabase =
      await supabaseExercisesRepo.getSystemExercisesWithTranslations(language);

    console.log(
      `📦 ${exercisesFromSupabase.length} ejercicios obtenidos de Supabase`
    );

    // Insertar o actualizar en SQLite local
    for (const ex of exercisesFromSupabase) {
      await db
        .insert(exercises)
        .values({
          id: ex.id,
          name: ex.name,
          name_search: ex.name_search,
          source: ex.source,
          created_by_user_id: ex.created_by_user_id,
          main_muscle_group: ex.main_muscle_group,
          secondary_muscle_groups: ex.secondary_muscle_groups,
          primary_equipment: ex.primary_equipment,
          exercise_type: ex.exercise_type,
          instructions: ex.instructions,
          equipment: ex.equipment,
          similar_exercises: ex.similar_exercises,
          default_measurement_template: ex.default_measurement_template,
          primary_media_type: ex.primary_media_type,
          primary_media_url: ex.primary_media_url,
        })
        .onConflictDoUpdate({
          target: exercises.id,
          set: {
            name: ex.name,
            name_search: ex.name_search,
            source: ex.source,
            created_by_user_id: ex.created_by_user_id,
            main_muscle_group: ex.main_muscle_group,
            secondary_muscle_groups: ex.secondary_muscle_groups,
            primary_equipment: ex.primary_equipment,
            exercise_type: ex.exercise_type,
            instructions: ex.instructions,
            equipment: ex.equipment,
            similar_exercises: ex.similar_exercises,
            default_measurement_template: ex.default_measurement_template,
            primary_media_type: ex.primary_media_type,
            primary_media_url: ex.primary_media_url,
          },
        });
    }

    // Guardar timestamp e idioma de sincronización exitosa
    const now = Date.now();
    await AsyncStorage.setItem(LAST_EXERCISES_SYNC_KEY, now.toString());
    await AsyncStorage.setItem(LAST_EXERCISES_LANGUAGE_KEY, language);

    console.log(
      `✅ ${exercisesFromSupabase.length} ejercicios sincronizados (${language}) desde Supabase a SQLite local`
    );

    return {
      success: true,
      syncedCount: exercisesFromSupabase.length,
      language,
      skipped: false,
    };
  } catch (error) {
    console.error("❌ Error sincronizando ejercicios:", error);
    return {
      success: false,
      syncedCount: 0,
      language,
      skipped: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

/**
 * Obtiene el último idioma sincronizado desde AsyncStorage
 */
export const getLastSyncedLanguage =
  async (): Promise<SupportedLanguage | null> => {
    const lang = await AsyncStorage.getItem(LAST_EXERCISES_LANGUAGE_KEY);
    if (lang && isValidLanguage(lang)) {
      return lang;
    }
    return null;
  };

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook para sincronizar ejercicios con el idioma del usuario.
 *
 * @example
 * ```tsx
 * const { syncExercises, isSyncing } = useExercisesSync();
 *
 * // Sync normal (respeta intervalo de 24h)
 * await syncExercises("es");
 *
 * // Sync forzado (ignora intervalo)
 * await syncExercises("en", { force: true });
 * ```
 */
export const useExercisesSync = () => {
  const [state, setState] = useState<ExercisesSyncState>({
    isSyncing: false,
    lastSyncLanguage: null,
    lastSyncTimestamp: null,
    error: null,
  });

  const syncExercises = useCallback(
    async (
      language: SupportedLanguage,
      options: ExercisesSyncOptions = {}
    ): Promise<ExercisesSyncResult> => {
      setState((prev) => ({ ...prev, isSyncing: true, error: null }));

      try {
        const result = await syncExercisesWithLanguage(language, options);

        if (result.success && !result.skipped) {
          setState((prev) => ({
            ...prev,
            isSyncing: false,
            lastSyncLanguage: language,
            lastSyncTimestamp: Date.now(),
            error: null,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            isSyncing: false,
            error: result.error || null,
          }));
        }

        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState((prev) => ({
          ...prev,
          isSyncing: false,
          error: err,
        }));

        return {
          success: false,
          syncedCount: 0,
          language,
          skipped: false,
          error: err,
        };
      }
    },
    []
  );

  return {
    ...state,
    syncExercises,
  };
};
