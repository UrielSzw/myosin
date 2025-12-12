import { eq } from "drizzle-orm";
import { db } from "../db/client";
import {
  exercise_in_block,
  exercises,
  routine_blocks,
  routine_sets,
  routines,
  type BlockWithExercises,
  type RoutineFull,
} from "../db/schema/routine";
import { IExerciseMuscle } from "../types/workout";
import { MuscleVolumeData } from "../ui/volume-chart";
import {
  MUSCLE_CONTRIBUTION,
  MuscleCategoryKey,
  MuscleCategoryUtils,
  WeekDay,
} from "./muscle-categories";
import { MuscleVolumeFormatter } from "./muscle-volume-formatter";

// Tipos para el análisis de volumen
export type CategoryVolumeMap = Record<MuscleCategoryKey, number>;

export type WeeklyVolumeMap = Record<
  MuscleCategoryKey,
  {
    totalSets: number;
    frequency: number;
    routineNames: string[];
  }
>;

export type RoutineVolumeData = {
  routineId: string;
  routineName: string;
  trainingDays: WeekDay[];
  frequency: number;
  volumeByCategory: CategoryVolumeMap;
};

// Tipo para datos de sesión (músculos específicos)
export type SessionMuscleData = {
  group: string; // e.g. "chest", "lats", "quads"
  sets: number;
  percentage: number;
};

export class VolumeCalculator {
  /**
   * Calcula el volumen de una rutina específica agrupado por categorías musculares
   */
  static async calculateRoutineVolume(
    routine: RoutineFull
  ): Promise<CategoryVolumeMap> {
    const categoryVolume: CategoryVolumeMap = {
      chest: 0,
      back: 0,
      shoulders: 0,
      arms: 0,
      legs: 0,
      core: 0,
      other: 0,
    };

    // Recorrer todos los bloques de la rutina
    for (const block of routine.blocks) {
      await this.processBlockVolume(block, categoryVolume);
    }

    return categoryVolume;
  }

  /**
   * Procesa el volumen de un bloque específico
   */
  private static async processBlockVolume(
    block: BlockWithExercises,
    categoryVolume: CategoryVolumeMap
  ): Promise<void> {
    for (const exerciseInBlock of block.exercises) {
      const totalSets = exerciseInBlock.sets.length;

      if (totalSets === 0) continue;

      // Obtener el ejercicio completo con músculos
      const exercise = exerciseInBlock.exercise;
      const primaryMuscle = exercise.main_muscle_group as IExerciseMuscle;

      // Obtener músculos secundarios
      const secondaryMuscles = await this.getSecondaryMuscles(exercise.id);

      // Calcular contribución del músculo principal
      const primaryCategory =
        MuscleCategoryUtils.getCategoryForMuscle(primaryMuscle);
      categoryVolume[primaryCategory] +=
        totalSets * MUSCLE_CONTRIBUTION.primary;

      // Calcular contribución de músculos secundarios
      for (const secondaryMuscle of secondaryMuscles) {
        // Solo contar si no es el mismo que el principal
        if (secondaryMuscle !== primaryMuscle) {
          const secondaryCategory =
            MuscleCategoryUtils.getCategoryForMuscle(secondaryMuscle);
          categoryVolume[secondaryCategory] +=
            totalSets * MUSCLE_CONTRIBUTION.secondary;
        }
      }
    }
  }

  /**
   * Obtiene los músculos secundarios de un ejercicio
   */
  private static async getSecondaryMuscles(
    exerciseId: string
  ): Promise<IExerciseMuscle[]> {
    const exercise = await db
      .select()
      .from(exercises)
      .where(eq(exercises.id, exerciseId));

    return exercise[0]?.secondary_muscle_groups || [];
  }

  /**
   * Obtiene todas las rutinas activas del usuario (que tienen días especificados)
   */
  static async getActiveRoutines(
    userId: string = "default-user"
  ): Promise<RoutineFull[]> {
    // Obtener rutinas con datos completos
    const routinesData = await db
      .select()
      .from(routines)
      .leftJoin(routine_blocks, eq(routines.id, routine_blocks.routine_id))
      .leftJoin(
        exercise_in_block,
        eq(routine_blocks.id, exercise_in_block.block_id)
      )
      .leftJoin(
        routine_sets,
        eq(exercise_in_block.id, routine_sets.exercise_in_block_id)
      )
      .leftJoin(exercises, eq(exercise_in_block.exercise_id, exercises.id))
      .where(eq(routines.created_by_user_id, userId));

    // Agrupar y filtrar rutinas activas
    const groupedRoutines = this.groupRoutineData(routinesData);

    // Filtrar solo rutinas activas (que tienen días especificados)
    return groupedRoutines.filter(
      (routine) => routine.training_days && routine.training_days.length > 0
    );
  }

  /**
   * Calcula el volumen semanal total combinando todas las rutinas activas
   */
  static async calculateWeeklyVolume(
    userId: string = "default-user"
  ): Promise<WeeklyVolumeMap> {
    const activeRoutines = await this.getActiveRoutines(userId);

    const weeklyVolume: WeeklyVolumeMap = {
      chest: { totalSets: 0, frequency: 0, routineNames: [] },
      back: { totalSets: 0, frequency: 0, routineNames: [] },
      shoulders: { totalSets: 0, frequency: 0, routineNames: [] },
      arms: { totalSets: 0, frequency: 0, routineNames: [] },
      legs: { totalSets: 0, frequency: 0, routineNames: [] },
      core: { totalSets: 0, frequency: 0, routineNames: [] },
      other: { totalSets: 0, frequency: 0, routineNames: [] },
    };

    const categoryDaysMap: Record<MuscleCategoryKey, Set<WeekDay>> = {
      chest: new Set(),
      back: new Set(),
      shoulders: new Set(),
      arms: new Set(),
      legs: new Set(),
      core: new Set(),
      other: new Set(),
    };

    // Procesar cada rutina activa
    for (const routine of activeRoutines) {
      const routineVolume = await this.calculateRoutineVolume(routine);
      const trainingDays = routine.training_days as WeekDay[];

      // Sumar volumen por categoría
      for (const [category, volume] of Object.entries(routineVolume) as [
        MuscleCategoryKey,
        number
      ][]) {
        if (volume > 0) {
          weeklyVolume[category].totalSets += volume;
          weeklyVolume[category].routineNames.push(routine.name);

          // Agregar días para calcular frecuencia
          trainingDays.forEach((day) => categoryDaysMap[category].add(day));
        }
      }
    }

    // Calcular frecuencia (días únicos por categoría)
    for (const category of Object.keys(weeklyVolume) as MuscleCategoryKey[]) {
      weeklyVolume[category].frequency = categoryDaysMap[category].size;
      // Remover duplicados de nombres de rutinas
      weeklyVolume[category].routineNames = [
        ...new Set(weeklyVolume[category].routineNames),
      ];
    }

    return weeklyVolume;
  }

  /**
   * Agrupa los datos de rutinas de la query SQL
   */
  private static groupRoutineData(queryResult: any[]): RoutineFull[] {
    const routineMap: Map<string, any> = new Map();

    queryResult.forEach((row) => {
      if (!row.routines) return;

      const routineId = row.routines.id;

      if (!routineMap.has(routineId)) {
        routineMap.set(routineId, {
          ...row.routines,
          training_days: row.routines.training_days || [],
          folder: null, // TODO: Agregar si necesitas folder data
          blocks: [],
        });
      }

      const routine = routineMap.get(routineId)!;

      // Agregar bloque si existe
      if (row.routine_blocks) {
        const blockId = row.routine_blocks.id;
        let block = routine.blocks.find((b: any) => b.id === blockId);

        if (!block) {
          block = {
            ...row.routine_blocks,
            exercises: [],
          };
          routine.blocks.push(block);
        }

        // Agregar ejercicio si existe
        if (row.exercise_in_block && row.exercises) {
          const exerciseId = row.exercise_in_block.id;
          let exercise = block.exercises.find((e: any) => e.id === exerciseId);

          if (!exercise) {
            exercise = {
              ...row.exercise_in_block,
              exercise: row.exercises,
              sets: [],
            };
            block.exercises.push(exercise);
          }

          // Agregar set si existe
          if (row.routine_sets) {
            exercise.sets.push(row.routine_sets);
          }
        }
      }
    });

    return Array.from(routineMap.values()) as RoutineFull[];
  }

  /**
   * Versión rápida para cálculos en tiempo real (sin queries complejas)
   */
  static quickCalculateVolume(
    exercises: {
      exerciseId: string;
      mainMuscle: IExerciseMuscle;
      secondaryMuscles: IExerciseMuscle[];
      setsCount: number;
    }[]
  ): CategoryVolumeMap {
    const categoryVolume: CategoryVolumeMap = {
      chest: 0,
      back: 0,
      shoulders: 0,
      arms: 0,
      legs: 0,
      core: 0,
      other: 0,
    };

    exercises.forEach((exercise) => {
      // Músculo principal
      const primaryCategory = MuscleCategoryUtils.getCategoryForMuscle(
        exercise.mainMuscle
      );
      categoryVolume[primaryCategory] +=
        exercise.setsCount * MUSCLE_CONTRIBUTION.primary;

      // Músculos secundarios
      exercise.secondaryMuscles.forEach((secondaryMuscle) => {
        if (secondaryMuscle !== exercise.mainMuscle) {
          console.log("Secondary Muscle:", secondaryMuscle);

          const secondaryCategory =
            MuscleCategoryUtils.getCategoryForMuscle(secondaryMuscle);
          categoryVolume[secondaryCategory] +=
            exercise.setsCount * MUSCLE_CONTRIBUTION.secondary;
        }
      });
    });

    console.log("Calculated Category Volume:", categoryVolume);

    return categoryVolume;
  }

  /**
   * Convierte datos de sesión (músculos específicos) a categorías agrupadas
   * @param sessionData - Array de datos de músculos específicos de una sesión
   * @returns CategoryVolumeMap con músculos agrupados por categorías
   */
  static convertSessionToCategories(
    sessionData: SessionMuscleData[]
  ): CategoryVolumeMap {
    const categoryVolume: CategoryVolumeMap = {
      chest: 0,
      back: 0,
      shoulders: 0,
      arms: 0,
      legs: 0,
      core: 0,
      other: 0,
    };

    sessionData.forEach((muscleData) => {
      try {
        // Convertir string a IExerciseMuscle y obtener categoría
        const muscle = muscleData.group?.toLocaleLowerCase() as IExerciseMuscle;
        const category = MuscleCategoryUtils.getCategoryForMuscle(muscle);

        console.log("Muscle:", muscle, "Category:", category);
        categoryVolume[category] += muscleData.sets;
      } catch {
        // Si no se puede categorizar, agregarlo como "other"
        console.warn(`Could not categorize muscle: ${muscleData.group}`);
        categoryVolume.other += muscleData.sets;
      }
    });

    return categoryVolume;
  }

  /**
   * Formatea CategoryVolumeMap a formato display con traducciones
   * @param categoryVolume - Volumen agrupado por categorías
   * @returns Array de MuscleVolumeData formateado para UI
   */
  static formatVolumeForDisplay(
    categoryVolume: CategoryVolumeMap
  ): MuscleVolumeData[] {
    return MuscleVolumeFormatter.formatVolumeData(categoryVolume);
  }

  /**
   * Método de conveniencia: convierte session data directamente a formato display
   * @param sessionData - Datos de músculos específicos de una sesión
   * @returns Array de MuscleVolumeData formateado para UI
   */
  static formatSessionVolumeForDisplay(
    sessionData: SessionMuscleData[]
  ): MuscleVolumeData[] {
    const categoryVolume = this.convertSessionToCategories(sessionData);
    return this.formatVolumeForDisplay(categoryVolume);
  }
}
