/**
 * Folders Repository - Repositorio de carpetas con sync automático
 *
 * Este módulo expone el repositorio de folders con todas las operaciones
 * necesarias y sync automático a Supabase.
 */

import { eq, sql } from "drizzle-orm";
import { db } from "../../db/client";
import type { BaseFolder } from "../../db/schema/routine";
import { folders, routines } from "../../db/schema/routine";
import { generateUUID } from "../../db/utils/uuid";
import { createSyncedRepository } from "../core/synced-repository";
import type { IRepository } from "../types/repository.types";

// =============================================================================
// TYPES
// =============================================================================

/** Datos para crear un folder (sin id, timestamps) */
export type FolderCreateDTO = {
  name: string;
  color: string;
  icon: string;
  order_index: number;
  created_by_user_id: string;
};

/** Datos para actualizar un folder */
export type FolderUpdateDTO = Partial<FolderCreateDTO>;

/** Folder con métricas adicionales */
export type FolderWithMetrics = BaseFolder & {
  routineCount: number;
};

// =============================================================================
// EXTENDED INTERFACE (operaciones adicionales específicas de folders)
// =============================================================================

export interface IFoldersRepository
  extends IRepository<BaseFolder, FolderCreateDTO, FolderUpdateDTO> {
  /** Obtiene todos los folders con conteo de rutinas */
  findAllWithMetrics(): Promise<FolderWithMetrics[]>;
  /** Obtiene el siguiente order_index disponible */
  getNextOrderIndex(): Promise<number>;
  /** Reordena los folders */
  reorder(orderedFolderIds: string[]): Promise<void>;
}

// =============================================================================
// SQLITE IMPLEMENTATION
// =============================================================================

const sqliteFoldersRepository: IFoldersRepository = {
  findById: async (id: string): Promise<BaseFolder | null> => {
    const [folder] = await db.select().from(folders).where(eq(folders.id, id));
    return folder ?? null;
  },

  findAll: async (): Promise<BaseFolder[]> => {
    return db.select().from(folders).orderBy(folders.order_index);
  },

  findAllWithMetrics: async (): Promise<FolderWithMetrics[]> => {
    const result = await db
      .select({
        id: folders.id,
        name: folders.name,
        color: folders.color,
        icon: folders.icon,
        order_index: folders.order_index,
        created_by_user_id: folders.created_by_user_id,
        created_at: folders.created_at,
        updated_at: folders.updated_at,
        routineCount: sql<number>`COALESCE(COUNT(${routines.id}), 0)`.as(
          "routine_count"
        ),
      })
      .from(folders)
      .leftJoin(routines, eq(folders.id, routines.folder_id))
      .groupBy(folders.id)
      .orderBy(folders.order_index);

    return result.map((row) => ({
      ...row,
      routineCount: Number(row.routineCount) || 0,
    }));
  },

  create: async (data: FolderCreateDTO): Promise<BaseFolder> => {
    const id = generateUUID();
    const [created] = await db
      .insert(folders)
      .values({ id, ...data })
      .returning();

    if (!created) {
      throw new Error("Failed to create folder");
    }
    return created;
  },

  update: async (id: string, data: FolderUpdateDTO): Promise<BaseFolder> => {
    const [updated] = await db
      .update(folders)
      .set({ ...data, updated_at: new Date().toISOString() })
      .where(eq(folders.id, id))
      .returning();

    if (!updated) {
      throw new Error(`Folder with id ${id} not found`);
    }
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await db.delete(folders).where(eq(folders.id, id));
  },

  getNextOrderIndex: async (): Promise<number> => {
    const result = await db
      .select({ maxOrder: sql<number>`MAX(${folders.order_index})` })
      .from(folders);
    return (result[0]?.maxOrder ?? -1) + 1;
  },

  reorder: async (orderedFolderIds: string[]): Promise<void> => {
    await db.transaction(async (tx) => {
      for (let index = 0; index < orderedFolderIds.length; index++) {
        const folderId = orderedFolderIds[index];
        if (folderId) {
          await tx
            .update(folders)
            .set({ order_index: index })
            .where(eq(folders.id, folderId));
        }
      }
    });
  },
};

// =============================================================================
// SYNCED REPOSITORY FACTORY
// =============================================================================

/**
 * Crea el repositorio de folders con sync automático.
 *
 * Las operaciones básicas (create, update, delete) tienen sync automático.
 * Las operaciones extendidas (findAllWithMetrics, reorder) se agregan manualmente.
 */
export const createFoldersRepository = (): IFoldersRepository => {
  // Crear el repo base con sync para operaciones CRUD
  const syncedBase = createSyncedRepository<
    BaseFolder,
    FolderCreateDTO,
    FolderUpdateDTO
  >(sqliteFoldersRepository, {
    createMutation: "FOLDER_CREATE",
    updateMutation: "FOLDER_UPDATE",
    deleteMutation: "FOLDER_DELETE",
    // El payload de create necesita incluir el ID generado
    createPayloadTransform: (data, result) => ({
      id: (result as BaseFolder).id,
      ...data,
    }),
    // El payload de update usa el formato { id, data }
    updatePayloadTransform: (id, data) => ({ id, data }),
    // El payload de delete es { id }
    deletePayloadTransform: (id) => ({ id }),
  });

  // Agregar operaciones extendidas que no necesitan sync o tienen sync especial
  return {
    ...syncedBase,
    findAllWithMetrics: sqliteFoldersRepository.findAllWithMetrics,
    getNextOrderIndex: sqliteFoldersRepository.getNextOrderIndex,
    reorder: async (orderedFolderIds: string[]): Promise<void> => {
      // 1. Local first
      await sqliteFoldersRepository.reorder(orderedFolderIds);

      // 2. Sync (tiene su propia mutation)
      const { getSyncAdapter } = await import("../core/sync-adapter");
      getSyncAdapter()
        .sync("FOLDER_REORDER", { orderedIds: orderedFolderIds })
        .catch((err) => {
          console.warn("[FoldersRepo] Reorder sync failed:", err);
        });
    },
  };
};
