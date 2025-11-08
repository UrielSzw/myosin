import { useNetwork } from "../hooks/use-network";
import { supabaseSyncDictionary } from "./dictionary/sync-dictionary";
import type { MutationCode } from "./types/mutations";

export interface SyncResult {
  success: boolean;
  queued?: boolean;
  result?: any;
  error?: string;
}

/**
 * Función simple para sync directo (para tests y uso sin hooks)
 */
export const syncToSupabase = async (
  code: MutationCode,
  payload: any
): Promise<SyncResult> => {
  try {
    const syncFunction = supabaseSyncDictionary[code];

    if (!syncFunction) {
      throw new Error(`No sync function found for mutation code: ${code}`);
    }

    const result = await syncFunction(payload);
    return { success: true, result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
};

export const useSyncEngine = () => {
  const isOnline = useNetwork();

  const sync = async (
    code: MutationCode,
    payload: any
  ): Promise<SyncResult> => {
    console.log(`🔄 Attempting sync: ${code}`, { isOnline, payload });

    if (!isOnline) {
      console.log("📴 Offline - would queue mutation:", code);
      // TODO: Add to queue when we implement the queue system
      return { success: false, queued: true };
    }

    // Usar la función directa
    return await syncToSupabase(code, payload);
  };

  return {
    sync,
    isOnline,
    // Funciones útiles para debugging
    getSyncFunction: (code: MutationCode) => supabaseSyncDictionary[code],
    getAvailableMutations: () =>
      Object.keys(supabaseSyncDictionary) as MutationCode[],
  };
};
