/**
 * Sync Adapter - Connects the data layer to the sync engine
 *
 * Este adaptador encapsula la lógica de sync para que los repositorios
 * no dependan directamente del sync engine.
 */

import NetInfo from "@react-native-community/netinfo";
import { getSyncQueueRepository } from "../../sync/queue/sync-queue-repository";
import { syncToSupabase } from "../../sync/sync-engine";
import type { MutationCode } from "../../sync/types/mutations";
import type { SyncMutation } from "../../sync/types/sync-queue";
import type { ISyncAdapter, SyncResult } from "../types/repository.types";

/**
 * Implementación del adaptador de sync.
 * Maneja online/offline automáticamente.
 */
class SyncAdapterImpl implements ISyncAdapter {
  async sync(mutationCode: string, payload: unknown): Promise<SyncResult> {
    try {
      const netInfo = await NetInfo.fetch();
      const isOnline = netInfo.isConnected && netInfo.isInternetReachable;

      if (isOnline) {
        // Online: sync directo a Supabase
        const result = await syncToSupabase(
          mutationCode as MutationCode,
          payload as Parameters<typeof syncToSupabase>[1]
        );
        return {
          success: result.success,
          error: result.error,
        };
      } else {
        // Offline: agregar a queue para retry posterior
        const queueRepo = getSyncQueueRepository();
        // Cast necesario porque el tipo de payload depende del mutation code
        await queueRepo.enqueue({
          code: mutationCode,
          payload,
        } as SyncMutation);
        return {
          success: false,
          queued: true,
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`[SyncAdapter] Failed to sync ${mutationCode}:`, error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

// Singleton instance
let syncAdapterInstance: ISyncAdapter | null = null;

/**
 * Obtiene la instancia del sync adapter (singleton)
 */
export const getSyncAdapter = (): ISyncAdapter => {
  if (!syncAdapterInstance) {
    syncAdapterInstance = new SyncAdapterImpl();
  }
  return syncAdapterInstance;
};

/**
 * Para testing: permite inyectar un mock del sync adapter
 */
export const setSyncAdapter = (adapter: ISyncAdapter): void => {
  syncAdapterInstance = adapter;
};
