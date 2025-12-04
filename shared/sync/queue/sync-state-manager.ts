import type { SyncEngineState } from "../types/sync-queue";
import {
  calculateNextRetryDate,
  DEFAULT_RETRY_CONFIG,
  shouldTriggerCircuitBreaker,
} from "../utils/backoff-calculator";
import {
  getSyncQueueRepository,
  SyncQueueRepository,
} from "./sync-queue-repository";

// Singleton instance - única instancia en toda la app
let globalInstance: SyncStateManager | null = null;

export class SyncStateManager {
  private queueRepo: SyncQueueRepository;
  private cachedState: SyncEngineState | null = null;

  constructor() {
    this.queueRepo = getSyncQueueRepository();
  }

  /**
   * Get current engine state (cached)
   */
  async getState(): Promise<SyncEngineState> {
    if (!this.cachedState) {
      await this.loadFromDatabase();
    }

    return this.cachedState || this.getDefaultState();
  }

  /**
   * Update engine state
   */
  async updateState(updates: Partial<SyncEngineState>): Promise<void> {
    const currentState = await this.getState();

    // Update cache
    this.cachedState = { ...currentState, ...updates };

    // Persist to database
    await this.queueRepo.updateEngineState(updates);

    console.log("🔄 Engine state updated:", updates);
  }

  /**
   * Handle sync failure - update circuit breaker state
   */
  async onSyncFailure(error: Error): Promise<Date | null> {
    const state = await this.getState();

    const shouldTriggerBreaker = shouldTriggerCircuitBreaker(error);
    const consecutiveFailures = state.consecutiveFailures + 1;

    let backoffUntil: Date | null = null;

    if (shouldTriggerBreaker) {
      // Calculate exponential backoff
      backoffUntil = calculateNextRetryDate(consecutiveFailures);

      console.warn(
        `🔴 Circuit breaker triggered. Backoff until: ${backoffUntil.toISOString()}`
      );
    }

    await this.updateState({
      status: consecutiveFailures >= 3 ? "failed" : "degraded",
      consecutiveFailures,
      lastFailureTime: new Date(),
      backoffUntil,
    });

    return backoffUntil;
  }

  /**
   * Handle sync success - reset circuit breaker
   */
  async onSyncSuccess(): Promise<void> {
    const state = await this.getState();

    if (state.consecutiveFailures > 0) {
      console.log("✅ Circuit breaker reset - sync successful");

      await this.updateState({
        status: "healthy",
        consecutiveFailures: 0,
        lastFailureTime: null,
        backoffUntil: null,
      });
    }
  }

  /**
   * Handle network state change
   */
  async onNetworkChange(
    isOnline: boolean,
    isGoodConnection: boolean = true
  ): Promise<void> {
    const state = await this.getState();
    const newNetworkState = !isOnline
      ? "offline"
      : isGoodConnection
      ? "online"
      : "poor";

    // Check if network was offline for a while and just recovered
    const wasOffline = state.networkState === "offline";
    const isNowOnline = newNetworkState !== "offline";
    const offlineTime = state.lastNetworkChange
      ? Date.now() - state.lastNetworkChange.getTime()
      : 0;

    // Reset backoff if network was offline for more than 30 seconds
    let resetBackoff = false;
    if (
      wasOffline &&
      isNowOnline &&
      offlineTime > DEFAULT_RETRY_CONFIG.networkRecoveryReset
    ) {
      resetBackoff = true;
      console.log("🌐 Network recovered after long outage - resetting backoff");
    }

    await this.updateState({
      networkState: newNetworkState,
      lastNetworkChange: new Date(),
      ...(resetBackoff && {
        backoffUntil: null,
        consecutiveFailures: 0,
        status: "healthy" as const,
      }),
    });
  }

  /**
   * Check if queue processing should be paused
   */
  async shouldPauseProcessing(): Promise<boolean> {
    const state = await this.getState();

    // Always pause if offline
    if (state.networkState === "offline") {
      return true;
    }

    // Pause if in backoff period
    if (state.backoffUntil && new Date() < state.backoffUntil) {
      return true;
    }

    return false;
  }

  /**
   * Get time remaining in backoff (if any)
   */
  async getBackoffTimeRemaining(): Promise<number> {
    const state = await this.getState();

    if (!state.backoffUntil) return 0;

    const remaining = state.backoffUntil.getTime() - Date.now();
    return Math.max(0, remaining);
  }

  private async loadFromDatabase(): Promise<void> {
    const dbState = await this.queueRepo.getEngineState();

    if (dbState) {
      this.cachedState = dbState;
    } else {
      // Initialize default state in database
      const defaultState = this.getDefaultState();
      await this.queueRepo.updateEngineState(defaultState);
      this.cachedState = defaultState;
    }
  }

  private getDefaultState(): SyncEngineState {
    return {
      status: "healthy",
      consecutiveFailures: 0,
      lastFailureTime: null,
      backoffUntil: null,
      networkState: "offline",
      lastNetworkChange: new Date(),
    };
  }
}

/**
 * Get the singleton instance of SyncStateManager
 * Use this for non-React code (services, utilities)
 */
export const getSyncStateManager = (): SyncStateManager => {
  if (!globalInstance) {
    globalInstance = new SyncStateManager();
  }
  return globalInstance;
};

/**
 * Hook para usar el state manager en componentes React
 * Retorna el mismo singleton que getSyncStateManager()
 */
export const useSyncStateManager = (): SyncStateManager => {
  return getSyncStateManager();
};
