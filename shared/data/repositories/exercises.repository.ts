/**
 * Exercises Repository - Repositorio de ejercicios (read-only)
 *
 * Los ejercicios son datos de referencia que vienen pre-cargados en la app.
 * No requieren sync ya que no son modificados por el usuario.
 */

import { db } from "../../db/client";
import type { BaseExercise } from "../../db/schema";
import { exercises } from "../../db/schema";

// =============================================================================
// TYPES
// =============================================================================

export type { BaseExercise };

// =============================================================================
// INTERFACE
// =============================================================================

export interface IExercisesRepository {
  /** Obtiene todos los ejercicios */
  findAll(): Promise<BaseExercise[]>;
  /** Busca un ejercicio por ID */
  findById(id: string): Promise<BaseExercise | null>;
}

// =============================================================================
// IMPLEMENTATION
// =============================================================================

const localRepository: IExercisesRepository = {
  async findAll(): Promise<BaseExercise[]> {
    const rows = await db.select().from(exercises);
    return rows as BaseExercise[];
  },

  async findById(id: string): Promise<BaseExercise | null> {
    const rows = await db.select().from(exercises);
    const exercise = rows.find((e) => e.id === id);
    return (exercise as BaseExercise) ?? null;
  },
};

// =============================================================================
// EXPORT - Sin sync (read-only)
// =============================================================================

export const exercisesRepository: IExercisesRepository = localRepository;
