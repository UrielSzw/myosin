import { db } from "../client";
import { exercise_images, exercises } from "../schema";
import { exercisesSeed } from "./seed.exercises";

export const loadExercisesSeed = async () => {
  try {
    const existing = await db.select().from(exercises).limit(1);

    if (existing.length > 0) {
      console.log("⚡️ Seed ya cargado, se salta");
      return;
    }

    for (const ex of exercisesSeed) {
      // Insert exercise
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
      });

      // Insert images (vacías por ahora)
      for (const [index, url] of ex.images.entries()) {
        await db.insert(exercise_images).values({
          exercise_id: ex.id,
          url,
          order: index, // ojo, en tu tabla la columna se llama "order"
        });
      }
    }
    console.log("✅ Seed completado");
  } catch (error) {
    console.error("❌ Error en seed:", error);
    process.exit(1);
  }
};
