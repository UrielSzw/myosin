import { SupabaseExercisesRepository } from "../../sync/repositories/supabase-exercises-repository";
import { db } from "../client";
import { exercises } from "../schema";

const supabaseExercisesRepo = new SupabaseExercisesRepository();

export const loadExercisesSeed = async () => {
  try {
    const existing = await db.select().from(exercises).limit(1);

    if (existing.length > 0) {
      console.log("⚡️ Seed ya cargado, se salta");
      return;
    }

    console.log("🌐 Cargando ejercicios desde Supabase...");

    // Obtener ejercicios desde Supabase
    const exercisesFromSupabase =
      await supabaseExercisesRepo.getAllSystemExercises();

    console.log(
      `📦 ${exercisesFromSupabase.length} ejercicios obtenidos de Supabase`
    );

    // Insertar en SQLite local
    for (const ex of exercisesFromSupabase) {
      await db.insert(exercises).values({
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
      });
    }

    console.log(
      `✅ ${exercisesFromSupabase.length} ejercicios sincronizados desde Supabase a SQLite local`
    );
  } catch (error) {
    console.error("❌ Error en seed:", error);
  }
};
