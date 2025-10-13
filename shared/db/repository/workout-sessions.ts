import { and, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { db } from "../client";
import {
  exercises,
  routines,
  workout_blocks,
  workout_exercises,
  workout_sessions,
  workout_sets,
} from "../schema";
import type {
  BaseWorkoutSession,
  WorkoutBlockInsert,
  WorkoutBlockWithExercises,
  WorkoutExerciseInsert,
  WorkoutSessionFull,
  WorkoutSessionInsert,
  WorkoutSetInsert,
} from "../schema/workout-session";

// Tipo para recibir los datos de Zustand
export type CreateWorkoutSessionData = {
  session: WorkoutSessionInsert;
  blocks: WorkoutBlockInsert[];
  exercises: WorkoutExerciseInsert[];
  sets: WorkoutSetInsert[];
};

// Tipo para analytics básicas
export type WorkoutSessionSummary = BaseWorkoutSession & {
  routine: {
    id: string;
    name: string;
  };
  completion_percentage: number;
  duration_formatted: string;
};

export const workoutSessionsRepository = {
  // Crear sesión completa desde Zustand
  createWorkoutSessionWithData: async (
    data: CreateWorkoutSessionData
  ): Promise<BaseWorkoutSession> => {
    return await db.transaction(async (tx) => {
      try {
        // 1. Insertar sesión principal
        const [createdSession] = await tx
          .insert(workout_sessions)
          .values(data.session)
          .returning();

        // 2. Insertar bloques con session_id
        if (data.blocks.length > 0) {
          const blocksWithSessionId = data.blocks.map((block) => ({
            ...block,
            workout_session_id: createdSession.id,
          }));

          await tx.insert(workout_blocks).values(blocksWithSessionId);
        }

        // 3. Insertar ejercicios
        if (data.exercises.length > 0) {
          await tx.insert(workout_exercises).values(data.exercises);
        }

        // 4. Insertar sets
        if (data.sets.length > 0) {
          await tx.insert(workout_sets).values(data.sets);
        }

        return createdSession;
      } catch (error) {
        // El rollback es automático en caso de error
        console.error("Error creating workout session:", error);
        throw new Error("Failed to create workout session");
      }
    });
  },

  // Obtener todas las sesiones con resumen
  findAllWithSummary: async (
    limit: number = 50
  ): Promise<WorkoutSessionSummary[]> => {
    const sessions = await db
      .select({
        id: workout_sessions.id,
        user_id: workout_sessions.user_id,
        routine_id: workout_sessions.routine_id,
        started_at: workout_sessions.started_at,
        finished_at: workout_sessions.finished_at,
        total_duration_seconds: workout_sessions.total_duration_seconds,
        total_sets_planned: workout_sessions.total_sets_planned,
        total_sets_completed: workout_sessions.total_sets_completed,
        total_volume_kg: workout_sessions.total_volume_kg,
        average_rpe: workout_sessions.average_rpe,
        created_at: workout_sessions.created_at,
        updated_at: workout_sessions.updated_at,
        routine_name: routines.name,
      })
      .from(workout_sessions)
      .innerJoin(routines, eq(workout_sessions.routine_id, routines.id))
      .orderBy(desc(workout_sessions.started_at))
      .limit(limit);

    return sessions.map((session) => ({
      ...session,
      routine: {
        id: session.routine_id,
        name: session.routine_name,
      },
      completion_percentage: Math.round(
        (session.total_sets_completed / session.total_sets_planned) * 100
      ),
      duration_formatted: formatDuration(session.total_duration_seconds),
    }));
  },

  // Obtener sesión completa por ID
  findSessionById: async (sessionId: string): Promise<WorkoutSessionFull> => {
    // 1. Obtener sesión principal con rutina
    const [sessionData] = await db
      .select({
        session: {
          id: workout_sessions.id,
          user_id: workout_sessions.user_id,
          routine_id: workout_sessions.routine_id,
          started_at: workout_sessions.started_at,
          finished_at: workout_sessions.finished_at,
          total_duration_seconds: workout_sessions.total_duration_seconds,
          total_sets_planned: workout_sessions.total_sets_planned,
          total_sets_completed: workout_sessions.total_sets_completed,
          total_volume_kg: workout_sessions.total_volume_kg,
          average_rpe: workout_sessions.average_rpe,
          created_at: workout_sessions.created_at,
          updated_at: workout_sessions.updated_at,
        },
        routine: {
          id: routines.id,
          name: routines.name,
        },
      })
      .from(workout_sessions)
      .innerJoin(routines, eq(workout_sessions.routine_id, routines.id))
      .where(eq(workout_sessions.id, sessionId));

    if (!sessionData) {
      throw new Error(`Workout session with id ${sessionId} not found`);
    }

    // 2. Obtener bloques ordenados
    const blocks = await db
      .select()
      .from(workout_blocks)
      .where(eq(workout_blocks.workout_session_id, sessionId))
      .orderBy(workout_blocks.order_index);

    // 3. Obtener ejercicios con detalles
    const exercisesWithDetails = await db
      .select({
        workoutExercise: workout_exercises,
        exercise: {
          id: exercises.id,
          name: exercises.name,
          main_muscle_group: exercises.main_muscle_group,
          primary_equipment: exercises.primary_equipment,
          instructions: exercises.instructions,
        },
      })
      .from(workout_exercises)
      .innerJoin(exercises, eq(workout_exercises.exercise_id, exercises.id))
      .where(
        inArray(
          workout_exercises.workout_block_id,
          blocks.map((b) => b.id)
        )
      )
      .orderBy(workout_exercises.order_index);

    // 4. Obtener sets
    const sets = await db
      .select({
        id: workout_sets.id,
        user_id: workout_sets.user_id,
        workout_exercise_id: workout_sets.workout_exercise_id,
        exercise_id: workout_sets.exercise_id,
        original_set_id: workout_sets.original_set_id,
        order_index: workout_sets.order_index,
        planned_weight: workout_sets.planned_weight,
        planned_reps: workout_sets.planned_reps,
        planned_rpe: workout_sets.planned_rpe,
        planned_tempo: workout_sets.planned_tempo,
        actual_weight: workout_sets.actual_weight,
        actual_reps: workout_sets.actual_reps,
        actual_rpe: workout_sets.actual_rpe,
        set_type: workout_sets.set_type,
        reps_type: workout_sets.reps_type,
        reps_range: workout_sets.reps_range,
        completed: workout_sets.completed,
        created_at: workout_sets.created_at,
        updated_at: workout_sets.updated_at,
      })
      .from(workout_sets)
      .where(
        inArray(
          workout_sets.workout_exercise_id,
          exercisesWithDetails.map((e) => e.workoutExercise.id)
        )
      )
      .orderBy(workout_sets.order_index);

    // 5. Construir estructura anidada
    const blocksWithExercises = blocks.map((block) => {
      const blockExercises = exercisesWithDetails
        .filter((e) => e.workoutExercise.workout_block_id === block.id)
        .map((exerciseData) => {
          const exerciseSets = sets.filter(
            (set) => set.workout_exercise_id === exerciseData.workoutExercise.id
          );

          return {
            ...exerciseData.workoutExercise,
            exercise: exerciseData.exercise,
            sets: exerciseSets,
          };
        });

      return {
        ...block,
        exercises: blockExercises,
      };
    });

    return {
      ...sessionData.session,
      routine: sessionData.routine,
      blocks: blocksWithExercises as WorkoutBlockWithExercises[],
    };
  },

  // Obtener estadísticas por rutina
  getRoutineStats: async (routineId: string) => {
    const stats = await db
      .select({
        total_sessions: sql<number>`COUNT(*)`,
        avg_duration: sql<number>`AVG(${workout_sessions.total_duration_seconds})`,
        avg_completion: sql<number>`AVG(CAST(${workout_sessions.total_sets_completed} AS FLOAT) / ${workout_sessions.total_sets_planned} * 100)`,
        total_volume: sql<number>`SUM(${workout_sessions.total_volume_kg})`,
        avg_rpe: sql<number>`AVG(${workout_sessions.average_rpe})`,
        last_performed: sql<string>`MAX(${workout_sessions.started_at})`,
      })
      .from(workout_sessions)
      .where(eq(workout_sessions.routine_id, routineId));

    return stats[0];
  },

  // Obtener progresión por ejercicio
  getExerciseProgression: async (exerciseId: string, limit: number = 10) => {
    const progression = await db
      .select({
        session_date: workout_sessions.started_at,
        set_data: {
          actual_weight: workout_sets.actual_weight,
          actual_reps: workout_sets.actual_reps,
          actual_rpe: workout_sets.actual_rpe,
          completed: workout_sets.completed,
        },
      })
      .from(workout_sets)
      .innerJoin(
        workout_exercises,
        eq(workout_sets.workout_exercise_id, workout_exercises.id)
      )
      .innerJoin(
        workout_blocks,
        eq(workout_exercises.workout_block_id, workout_blocks.id)
      )
      .innerJoin(
        workout_sessions,
        eq(workout_blocks.workout_session_id, workout_sessions.id)
      )
      .where(
        and(
          eq(workout_exercises.exercise_id, exerciseId),
          eq(workout_sets.completed, true)
        )
      )
      .orderBy(desc(workout_sessions.started_at))
      .limit(limit * 10); // Más sets para calcular mejor

    return progression;
  },

  // Obtener últimos sets para un ejercicio específico (para previous sets)
  getLastSetsForExercise: async (
    exerciseId: string,
    userId: string = "default-user"
  ) => {
    const lastSets = await db
      .select({
        order_index: workout_sets.order_index,
        actual_weight: workout_sets.actual_weight,
        actual_reps: workout_sets.actual_reps,
        actual_rpe: workout_sets.actual_rpe,
        session_date: workout_sessions.started_at,
      })
      .from(workout_sets)
      .innerJoin(
        workout_exercises,
        eq(workout_sets.workout_exercise_id, workout_exercises.id)
      )
      .innerJoin(
        workout_blocks,
        eq(workout_exercises.workout_block_id, workout_blocks.id)
      )
      .innerJoin(
        workout_sessions,
        eq(workout_blocks.workout_session_id, workout_sessions.id)
      )
      .where(
        and(
          eq(workout_sets.exercise_id, exerciseId),
          eq(workout_sets.user_id, userId),
          eq(workout_sets.completed, true)
        )
      )
      .orderBy(desc(workout_sessions.started_at))
      .limit(20); // Últimos 20 sets para cubrir múltiples sesiones

    // Agrupar por order_index y tomar el más reciente
    const setsByOrderIndex = new Map<number, (typeof lastSets)[0]>();

    lastSets.forEach((set) => {
      if (!setsByOrderIndex.has(set.order_index)) {
        setsByOrderIndex.set(set.order_index, set);
      }
    });

    return Array.from(setsByOrderIndex.values());
  },

  // Eliminar sesión completa
  deleteSession: async (sessionId: string): Promise<void> => {
    await db.transaction(async (tx) => {
      // 1. Obtener bloques
      const blocks = await tx
        .select({ id: workout_blocks.id })
        .from(workout_blocks)
        .where(eq(workout_blocks.workout_session_id, sessionId));

      if (blocks.length > 0) {
        const blockIds = blocks.map((b) => b.id);

        // 2. Obtener ejercicios
        const exercises = await tx
          .select({ id: workout_exercises.id })
          .from(workout_exercises)
          .where(inArray(workout_exercises.workout_block_id, blockIds));

        if (exercises.length > 0) {
          const exerciseIds = exercises.map((e) => e.id);

          // 3. Eliminar sets
          await tx
            .delete(workout_sets)
            .where(inArray(workout_sets.workout_exercise_id, exerciseIds));

          // 4. Eliminar ejercicios
          await tx
            .delete(workout_exercises)
            .where(inArray(workout_exercises.workout_block_id, blockIds));
        }

        // 5. Eliminar bloques
        await tx
          .delete(workout_blocks)
          .where(inArray(workout_blocks.id, blockIds));
      }

      // 6. Eliminar sesión
      await tx
        .delete(workout_sessions)
        .where(eq(workout_sessions.id, sessionId));
    });
  },

  // Obtener sesiones recientes
  getRecentSessions: async (limit: number = 5) => {
    return await db
      .select({
        id: workout_sessions.id,
        started_at: workout_sessions.started_at,
        total_duration_seconds: workout_sessions.total_duration_seconds,
        total_sets_completed: workout_sessions.total_sets_completed,
        total_sets_planned: workout_sessions.total_sets_planned,
        routine_name: routines.name,
      })
      .from(workout_sessions)
      .innerJoin(routines, eq(workout_sessions.routine_id, routines.id))
      .orderBy(desc(workout_sessions.started_at))
      .limit(limit);
  },

  // Verificar si una rutina específica ya fue realizada
  hasRoutineBeenPerformed: async (
    routineId: string,
    userId: string = "default-user"
  ): Promise<boolean> => {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(workout_sessions)
      .where(
        and(
          eq(workout_sessions.routine_id, routineId),
          eq(workout_sessions.user_id, userId),
          isNotNull(workout_sessions.finished_at) // Solo completadas
        )
      );

    return result[0].count > 0;
  },
};

// Helper function para formatear duración
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
