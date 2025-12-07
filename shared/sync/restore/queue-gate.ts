/**
 * Queue Gate Service
 *
 * Verifica si es seguro hacer login con un usuario diferente.
 * Bloquea si hay queue pendiente de otro usuario (para no perder sus datos).
 */

import { inArray } from "drizzle-orm";
import { db, sqlite } from "../../db/client";
import { syncQueue } from "../../db/schema/sync-queue";
import { user_preferences } from "../../db/schema/user";

// =============================================================================
// TYPES
// =============================================================================

export type QueueGateResult =
  | { allowed: true; reason: "same_user" | "empty_queue" | "first_login" }
  | {
      allowed: false;
      reason: "queue_has_other_user_data";
      pendingCount: number;
    };

export interface QueueStatus {
  hasPendingItems: boolean;
  pendingCount: number;
  lastUserId: string | null;
}

// =============================================================================
// QUEUE GATE SERVICE
// =============================================================================

class QueueGateServiceImpl {
  /**
   * Verifica si es seguro hacer login con el userId dado
   */
  async checkLoginAllowed(newUserId: string): Promise<QueueGateResult> {
    try {
      // 1. Obtener el último usuario logueado desde user_preferences
      const lastUserId = await this.getLastLoggedUserId();

      // 2. Si no hay usuario previo, es primera vez - permitir
      if (!lastUserId) {
        return { allowed: true, reason: "first_login" };
      }

      // 3. Si es el mismo usuario, siempre permitir
      if (lastUserId === newUserId) {
        return { allowed: true, reason: "same_user" };
      }

      // 4. Usuario diferente - verificar si hay queue pendiente
      const queueStatus = await this.getQueueStatus();

      if (!queueStatus.hasPendingItems) {
        return { allowed: true, reason: "empty_queue" };
      }

      // 5. Hay queue pendiente con otro usuario - bloquear
      console.warn(
        `[QueueGate] BLOCKED: Queue has ${queueStatus.pendingCount} pending items from user ${lastUserId}`
      );
      return {
        allowed: false,
        reason: "queue_has_other_user_data",
        pendingCount: queueStatus.pendingCount,
      };
    } catch (error) {
      console.error("[QueueGate] Error checking login:", error);
      // En caso de error, ser conservador y permitir
      // (mejor que bloquear al usuario sin razón)
      return { allowed: true, reason: "first_login" };
    }
  }

  /**
   * Obtiene el último user_id de user_preferences
   * Si no hay user_preferences, busca en otras tablas
   */
  async getLastLoggedUserId(): Promise<string | null> {
    try {
      // Primero intentar user_preferences
      const [prefs] = await db
        .select({ user_id: user_preferences.user_id })
        .from(user_preferences)
        .limit(1);

      if (prefs?.user_id) {
        return prefs.user_id;
      }

      // Si no hay user_preferences, buscar en otras tablas que tengan user_id
      // Esto cubre el caso donde hay data huérfana
      const queries = [
        {
          query: "SELECT created_by_user_id as user_id FROM folders LIMIT 1",
          table: "folders",
        },
        {
          query: "SELECT created_by_user_id as user_id FROM routines LIMIT 1",
          table: "routines",
        },
        {
          query: "SELECT user_id FROM tracker_metrics LIMIT 1",
          table: "tracker_metrics",
        },
        {
          query: "SELECT user_id FROM workout_sessions LIMIT 1",
          table: "workout_sessions",
        },
      ];

      for (const { query } of queries) {
        try {
          const result = sqlite.getFirstSync<{ user_id: string }>(query);
          if (result?.user_id) {
            return result.user_id;
          }
        } catch {
          // Table might not exist or be empty, continue
        }
      }

      return null;
    } catch (error) {
      console.error("[QueueGate] Error in getLastLoggedUserId:", error);
      return null;
    }
  }

  /**
   * Obtiene el estado del queue
   */
  async getQueueStatus(): Promise<QueueStatus> {
    try {
      const pendingItems = await db
        .select({ id: syncQueue.id })
        .from(syncQueue)
        .where(inArray(syncQueue.status, ["pending", "processing"]));

      const lastUserId = await this.getLastLoggedUserId();

      return {
        hasPendingItems: pendingItems.length > 0,
        pendingCount: pendingItems.length,
        lastUserId,
      };
    } catch {
      return {
        hasPendingItems: false,
        pendingCount: 0,
        lastUserId: null,
      };
    }
  }

  /**
   * Fuerza el clear del queue (solo usar cuando el usuario lo pide explícitamente)
   * DANGER: Esto puede causar pérdida de datos!
   */
  async forceQueueClear(): Promise<void> {
    console.warn("[QueueGate] FORCE CLEARING QUEUE - Data may be lost!");
    await db.delete(syncQueue);
  }

  /**
   * Intenta procesar el queue pendiente antes de permitir login
   * Retorna true si el queue está vacío después de procesar
   */
  async tryProcessQueueBeforeLogin(): Promise<boolean> {
    // No podemos usar el sync engine directamente aquí porque es un hook
    // En cambio, verificamos si hay items pendientes
    const status = await this.getQueueStatus();
    return !status.hasPendingItems;
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

let instance: QueueGateServiceImpl | null = null;

export function getQueueGateService(): QueueGateServiceImpl {
  if (!instance) {
    instance = new QueueGateServiceImpl();
  }
  return instance;
}

export const QueueGateService = {
  checkLoginAllowed: (userId: string) =>
    getQueueGateService().checkLoginAllowed(userId),
  getLastLoggedUserId: () => getQueueGateService().getLastLoggedUserId(),
  getQueueStatus: () => getQueueGateService().getQueueStatus(),
  forceQueueClear: () => getQueueGateService().forceQueueClear(),
  tryProcessQueueBeforeLogin: () =>
    getQueueGateService().tryProcessQueueBeforeLogin(),
};
