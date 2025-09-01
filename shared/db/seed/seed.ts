import { db } from "../client";
import {
  exerciseEquipment,
  exerciseImages,
  exerciseMuscleGroups,
  exercises,
} from "../schema";
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
        primary_equipment: ex.primary_equipment,
        instructions: JSON.stringify(ex.instructions),
      });

      // Insert muscles
      await db.insert(exerciseMuscleGroups).values({
        exercise_id: ex.id,
        muscle_group: ex.main_muscle_group,
      });

      // Insert equipment
      for (const eq of ex.equipment) {
        await db.insert(exerciseEquipment).values({
          exercise_id: ex.id,
          equipment: eq,
        });
      }

      // Insert images (vacías por ahora)
      for (const [index, url] of ex.images.entries()) {
        await db.insert(exerciseImages).values({
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
