/**
 * Restore Module Exports
 */

// Legacy restore service (para migración gradual)
export { restoreService } from "./restore-service";
export type {
  RestoreProgress,
  RestoreProgressCallback,
  RestoreResult,
} from "./restore-service";

export { useRestore } from "./use-restore";
export type { RestoreStatus, UseRestoreReturn } from "./use-restore";

// New Login Sync system
export {
  getAllSyncTables,
  getDateLimitForCategory,
  getDateLimitForTable,
  getTableCategory,
  getTableConfig,
  getTablesForClear,
  getTablesForRestore,
  SYNC_TABLE_CATEGORIES,
} from "./sync-limits";
export type { TableCategory, TableConfig } from "./sync-limits";

export { getQueueGateService, QueueGateService } from "./queue-gate";
export type { QueueGateResult, QueueStatus } from "./queue-gate";

export {
  getIncrementalSyncService,
  IncrementalSyncService,
} from "./incremental-sync";
export type {
  LoginSyncResult,
  SyncMode,
  SyncProgress,
  SyncProgressCallback,
  TableSyncResult,
} from "./incremental-sync";
