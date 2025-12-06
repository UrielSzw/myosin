/**
 * User Preferences Repository - Repositorio de preferencias de usuario con sync automático
 *
 * Maneja todas las preferencias del usuario: tema, unidades, toggles, datos personales.
 */

import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import type { BaseUserPreferences } from "../../db/schema/user";
import { user_preferences } from "../../db/schema/user";
import { getSyncAdapter } from "../core/sync-adapter";

// =============================================================================
// TYPES
// =============================================================================

export type { BaseUserPreferences };

/** Tipo completo de preferencias incluyendo user_id */
export type UserPreferencesWithUserId = BaseUserPreferences & {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

/** Datos para crear preferencias (solo user_id requerido) */
export type UserPreferencesCreateDTO = {
  user_id: string;
} & Partial<BaseUserPreferences>;

/** Datos para actualizar preferencias */
export type UserPreferencesUpdateDTO = Partial<BaseUserPreferences>;

// =============================================================================
// INTERFACE
// =============================================================================

export interface IUserPreferencesRepository {
  /** Obtiene las preferencias de un usuario */
  findByUserId(userId: string): Promise<UserPreferencesWithUserId | null>;
  /** Crea o actualiza preferencias (upsert) */
  upsert(userId: string, data: UserPreferencesUpdateDTO): Promise<void>;
  /** Solo crea nuevas preferencias */
  create(data: UserPreferencesCreateDTO): Promise<void>;
}

// =============================================================================
// LOCAL REPOSITORY (SQLite operations)
// =============================================================================

const localRepository: IUserPreferencesRepository = {
  async findByUserId(
    userId: string
  ): Promise<UserPreferencesWithUserId | null> {
    const rows = await db
      .select()
      .from(user_preferences)
      .where(eq(user_preferences.user_id, userId))
      .limit(1);
    return (rows?.[0] as UserPreferencesWithUserId) ?? null;
  },

  async upsert(userId: string, data: UserPreferencesUpdateDTO): Promise<void> {
    await db
      .insert(user_preferences)
      .values({
        user_id: userId,
        ...data,
      })
      .onConflictDoUpdate({
        target: user_preferences.user_id,
        set: { ...data, updated_at: new Date().toISOString() },
      });
  },

  async create(data: UserPreferencesCreateDTO): Promise<void> {
    await db.insert(user_preferences).values(data);
  },
};

// =============================================================================
// SYNC ADAPTER
// =============================================================================

const syncAdapter = getSyncAdapter();

// =============================================================================
// SYNCED REPOSITORY - Combina local + sync automático
// =============================================================================

export const createUserPreferencesRepository =
  (): IUserPreferencesRepository => {
    return {
      findByUserId: localRepository.findByUserId,

      async upsert(
        userId: string,
        data: UserPreferencesUpdateDTO
      ): Promise<void> {
        // 1. Ejecutar en SQLite local
        await localRepository.upsert(userId, data);

        // 2. Sync automático a Supabase
        syncAdapter.sync("USER_PREFERENCES_UPDATE", {
          userId,
          data,
        });
      },

      async create(data: UserPreferencesCreateDTO): Promise<void> {
        // 1. Crear en SQLite local
        await localRepository.create(data);

        // 2. Sync automático a Supabase
        syncAdapter.sync("USER_PREFERENCES_CREATE", {
          userId: data.user_id,
          data,
        });
      },
    };
  };

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const userPreferencesRepository = createUserPreferencesRepository();
