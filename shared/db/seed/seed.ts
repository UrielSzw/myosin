import AsyncStorage from "@react-native-async-storage/async-storage";
import { SupabaseExercisesRepository } from "../../sync/repositories/supabase-exercises-repository";
import { db } from "../client";
import { exercises } from "../schema";

const supabaseExercisesRepo = new SupabaseExercisesRepository();

const LAST_EXERCISES_SYNC_KEY = "last_exercises_sync";
const SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 horas

export const loadExercisesSeed = async () => {
  try {
    // Check if sync is needed based on timestamp
    const lastSyncStr = await AsyncStorage.getItem(LAST_EXERCISES_SYNC_KEY);
    const now = Date.now();

    if (lastSyncStr) {
      const lastSync = parseInt(lastSyncStr, 10);
      const timeSinceLastSync = now - lastSync;

      if (timeSinceLastSync < SYNC_INTERVAL_MS) {
        const hoursRemaining = Math.ceil(
          (SYNC_INTERVAL_MS - timeSinceLastSync) / (60 * 60 * 1000)
        );
        console.log(
          `⚡️ Ejercicios sincronizados recientemente. Próximo sync en ~${hoursRemaining}h`
        );
        return;
      }
    }

    console.log("🌐 Sincronizando ejercicios desde Supabase...");

    // Obtener ejercicios desde Supabase
    const exercisesFromSupabase =
      await supabaseExercisesRepo.getAllSystemExercises();

    console.log(
      `📦 ${exercisesFromSupabase.length} ejercicios obtenidos de Supabase`
    );

    // Insertar o actualizar en SQLite local usando INSERT OR REPLACE
    for (const ex of exercisesFromSupabase) {
      await db
        .insert(exercises)
        .values({
          id: ex.id,
          name: ex.name,
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

    // Guardar timestamp de sincronización exitosa
    await AsyncStorage.setItem(LAST_EXERCISES_SYNC_KEY, now.toString());

    console.log(
      `✅ ${exercisesFromSupabase.length} ejercicios sincronizados desde Supabase a SQLite local`
    );
  } catch (error) {
    console.error("❌ Error en seed:", error);
  }
};
