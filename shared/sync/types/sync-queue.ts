import type { MutationCode } from "./mutations";

// Queue Entry Types
export interface SyncMutation {
  code: MutationCode;
  payload: any;
  maxRetries?: number;
}

export interface SyncQueueEntry {
  id: string;
  mutation_code: MutationCode;
  payload: string; // JSON serializado
  created_at: string | null;
  scheduled_at: string;
  retry_count: number;
  max_retries: number;
  status: SyncQueueStatus;
  error_message: string | null;
  updated_at: string | null;
}

export type SyncQueueStatus = "pending" | "processing" | "completed" | "failed";

// Insert types for repository operations
export interface SyncQueueInsert {
  mutation_code: MutationCode;
  payload: string;
  scheduled_at: string;
  max_retries: number;
}

// Engine State Types
export interface SyncEngineState {
  status: "healthy" | "degraded" | "failed";
  consecutiveFailures: number;
  lastFailureTime: Date | null;
  backoffUntil: Date | null;
  networkState: "online" | "offline" | "poor";
  lastNetworkChange: Date | null;
}

// Configuration Types
export interface AdaptiveRetryConfig {
  maxRetries: number; // 5 intentos + manual
  baseDelay: number; // 1000ms (1 segundo)
  maxDelay: number; // 300000ms (5 minutos cap)
  backoffMultiplier: number; // 2 (doubling)
  jitterFactor: number; // 0.3 (±30% randomness)
  networkRecoveryReset: number; // 30000ms (reset after 30s offline)
}

// Result Types
export interface QueueProcessResult {
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
  nextRetryAt?: Date;
}

export interface SyncHealthMetrics {
  queueSize: number;
  pendingCount: number;
  failedCount: number;
  successRate: number;
  averageRetryCount: number;
  isHealthy: boolean;
}
