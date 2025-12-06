/**
 * Synced Repository - Wrapper que agrega sync automático a cualquier repositorio
 *
 * Este wrapper envuelve un repositorio local (SQLite) y automáticamente
 * sincroniza las operaciones de escritura con el cloud.
 *
 * Patrón: Local-first con sync en background
 * - Las operaciones se ejecutan primero en SQLite (rápido, offline-capable)
 * - El sync a Supabase ocurre en background (fire-and-forget)
 * - Si está offline, se encola para retry posterior
 */

import type {
  IRepository,
  ISyncAdapter,
  SyncConfig,
} from "../types/repository.types";
import { getSyncAdapter } from "./sync-adapter";

/**
 * Crea un repositorio con sync automático.
 *
 * @param localRepo - Repositorio local (SQLite)
 * @param syncConfig - Configuración de mutations para sync
 * @returns Repositorio wrapped con sync automático
 *
 * @example
 * ```typescript
 * const syncedFolders = createSyncedRepository(sqliteFoldersRepo, {
 *   createMutation: "FOLDER_CREATE",
 *   updateMutation: "FOLDER_UPDATE",
 *   deleteMutation: "FOLDER_DELETE",
 * });
 *
 * // Ahora las operaciones incluyen sync automático:
 * await syncedFolders.create(data); // SQLite + Supabase
 * ```
 */
export function createSyncedRepository<
  T,
  CreateDTO,
  UpdateDTO = Partial<CreateDTO>,
  ID extends string = string
>(
  localRepo: IRepository<T, CreateDTO, UpdateDTO, ID>,
  syncConfig: SyncConfig<CreateDTO, UpdateDTO>,
  syncAdapter: ISyncAdapter = getSyncAdapter()
): IRepository<T, CreateDTO, UpdateDTO, ID> {
  return {
    // =========== READ OPERATIONS (no sync needed) ===========

    findById: (id: ID) => localRepo.findById(id),

    findAll: () => localRepo.findAll(),

    // =========== WRITE OPERATIONS (with auto-sync) ===========

    create: async (data: CreateDTO): Promise<T> => {
      // 1. Local first: ejecutar en SQLite
      const result = await localRepo.create(data);

      // 2. Background sync: enviar a Supabase (fire-and-forget)
      if (syncConfig.createMutation) {
        const payload = syncConfig.createPayloadTransform
          ? syncConfig.createPayloadTransform(data, result)
          : data;

        syncAdapter.sync(syncConfig.createMutation, payload).catch((err) => {
          console.warn(`[SyncedRepo] Create sync failed, will retry:`, err);
        });
      }

      return result;
    },

    update: async (id: ID, data: UpdateDTO): Promise<T> => {
      // 1. Local first: ejecutar en SQLite
      const result = await localRepo.update(id, data);

      // 2. Background sync: enviar a Supabase (fire-and-forget)
      if (syncConfig.updateMutation) {
        const payload = syncConfig.updatePayloadTransform
          ? syncConfig.updatePayloadTransform(id, data, result)
          : { id, data };

        syncAdapter.sync(syncConfig.updateMutation, payload).catch((err) => {
          console.warn(`[SyncedRepo] Update sync failed, will retry:`, err);
        });
      }

      return result;
    },

    delete: async (id: ID): Promise<void> => {
      // 1. Local first: ejecutar en SQLite
      await localRepo.delete(id);

      // 2. Background sync: enviar a Supabase (fire-and-forget)
      if (syncConfig.deleteMutation) {
        const payload = syncConfig.deletePayloadTransform
          ? syncConfig.deletePayloadTransform(id)
          : { id };

        syncAdapter.sync(syncConfig.deleteMutation, payload).catch((err) => {
          console.warn(`[SyncedRepo] Delete sync failed, will retry:`, err);
        });
      }
    },
  };
}
