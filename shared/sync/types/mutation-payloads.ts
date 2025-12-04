/**
 * Type-safe payload definitions for all sync mutations.
 *
 * This file defines the exact shape of data that each mutation code expects.
 * Using discriminated unions ensures type safety throughout the sync system.
 */

import type { FolderInsert } from "../../db/repository/folders";
import type { CreateRoutineData } from "../../db/repository/routines";
import type { CreateWorkoutSessionData } from "../../db/repository/workout-sessions";
import type {
  BaseMacroDailyAggregate,
  BaseMacroEntry,
  MacroEntryInsert,
  MacroQuickActionInsert,
  MacroTargetInsert,
} from "../../db/schema/macros";
import type { PRCurrentInsert, PRHistoryInsert } from "../../db/schema/pr";
import type {
  BaseTrackerDailyAggregate,
  BaseTrackerEntry,
  TrackerEntryInsert,
  TrackerMetricInsert,
  TrackerQuickActionInsert,
} from "../../db/schema/tracker";
import type { BaseUserPreferences } from "../../db/schema/user";
import type { BaseWorkoutSession } from "../../db/schema/workout-session";

// ==================== ROUTINE PAYLOADS ====================

export interface RoutineCreatePayload extends CreateRoutineData {}

export interface RoutineUpdatePayload {
  routineId: string;
  data: CreateRoutineData;
}

export interface RoutineDeletePayload {
  id: string;
}

export interface RoutineClearTrainingDaysPayload {
  routineId: string;
}

export interface RoutineCreateQuickWorkoutPayload {
  id: string;
  name: string;
  created_by_user_id: string;
  is_quick_workout: boolean;
  show_rpe?: boolean;
  show_tempo?: boolean;
}

export interface RoutineConvertFromQuickPayload {
  routineId: string;
  newName?: string;
}

// ==================== FOLDER PAYLOADS ====================

/**
 * For FOLDER_CREATE, we send the full folder data including the locally-generated ID.
 * This differs from FolderInsert which excludes the ID (for local-first generation).
 */
export interface FolderCreatePayload extends FolderInsert {
  id: string; // ID is generated locally and sent to Supabase
}

export interface FolderUpdatePayload {
  id: string;
  data: Partial<FolderInsert>;
}

export interface FolderDeletePayload {
  id: string;
}

export interface FolderReorderPayload {
  orderedIds: string[];
}

// ==================== TRACKER ENTRY PAYLOADS ====================

export interface TrackerEntryCreatePayload extends TrackerEntryInsert {}

export interface TrackerEntryUpdatePayload {
  entryId: string;
  data: Partial<TrackerEntryInsert>;
}

export interface TrackerEntryDeletePayload {
  entryId: string;
}

export interface TrackerEntryFromQuickActionPayload {
  quick_action_id: string;
  user_id: string;
  notes?: string;
  recorded_at?: string;
  day_key: string;
}

export interface TrackerEntryWithAggregatePayload {
  entry: BaseTrackerEntry;
  dailyAggregate: BaseTrackerDailyAggregate | null;
}

export interface TrackerReplaceEntryWithAggregatePayload {
  entry: BaseTrackerEntry;
  dailyAggregate: BaseTrackerDailyAggregate | null;
}

export interface TrackerDeleteEntryWithAggregatePayload {
  entryId: string;
  dailyAggregate: BaseTrackerDailyAggregate | null;
}

// ==================== TRACKER METRIC PAYLOADS ====================

export interface TrackerMetricCreatePayload extends TrackerMetricInsert {}

export interface TrackerMetricUpdatePayload {
  metricId: string;
  data: Partial<TrackerMetricInsert>;
}

export interface TrackerMetricDeletePayload {
  metricId: string;
}

export interface TrackerMetricRestorePayload {
  metricId: string;
}

export interface TrackerMetricReorderPayload {
  metricOrders: { id: string; order_index: number }[];
}

export interface TrackerMetricFromTemplatePayload {
  metric: TrackerMetricInsert;
  quickActions?: Omit<TrackerQuickActionInsert, "metric_id">[];
}

// ==================== TRACKER QUICK ACTION PAYLOADS ====================

export interface TrackerQuickActionCreatePayload
  extends TrackerQuickActionInsert {}

export interface TrackerQuickActionDeletePayload {
  quickActionId: string;
}

// ==================== MACRO TARGET PAYLOADS ====================

export interface MacroTargetUpsertPayload extends MacroTargetInsert {
  id?: string;
  calories_target?: number; // Calculated field, stripped before sync
}

export interface MacroTargetUpdatePayload extends Partial<MacroTargetInsert> {
  id: string;
  calories_target?: number; // Calculated field, stripped before sync
}

// ==================== MACRO ENTRY PAYLOADS ====================

export interface MacroEntryCreatePayload {
  entry: BaseMacroEntry & { calories?: number };
  aggregate: (BaseMacroDailyAggregate & { total_calories?: number }) | null;
}

export interface MacroEntryUpdatePayload extends Partial<MacroEntryInsert> {
  id: string;
  calories?: number; // Calculated field, stripped before sync
}

export interface MacroEntryDeletePayload {
  entryId: string;
  aggregate: (BaseMacroDailyAggregate & { total_calories?: number }) | null;
}

// ==================== MACRO QUICK ACTION PAYLOADS ====================

export type MacroQuickActionsInitPayload = MacroQuickActionInsert[];

export interface MacroQuickActionCreatePayload extends MacroQuickActionInsert {}

export interface MacroQuickActionDeletePayload {
  quickActionId: string;
}

// ==================== PR PAYLOADS ====================

export interface PRCreatePayload extends PRCurrentInsert {}

export interface PRUpdatePayload extends PRHistoryInsert {}

// ==================== WORKOUT PAYLOADS ====================

/**
 * For workout sync, we send the CreateWorkoutSessionData plus the session ID.
 * The ID is generated locally and synced to Supabase.
 */
export interface WorkoutStartPayload extends CreateWorkoutSessionData {
  id?: string; // Optional for start (session might not be saved yet)
}

export interface WorkoutCompletePayload extends CreateWorkoutSessionData {
  id: string; // Required - session ID from completed workout
}

export interface WorkoutUpdatePayload {
  sessionId: string;
  data: Partial<BaseWorkoutSession>;
}

// ==================== USER PREFERENCES PAYLOADS ====================

export interface UserPreferencesCreatePayload {
  userId: string;
  data: Partial<BaseUserPreferences>;
}

export interface UserPreferencesUpdatePayload {
  userId: string;
  data: Partial<BaseUserPreferences>;
}

// ==================== DISCRIMINATED UNION ====================

/**
 * Maps each MutationCode to its exact payload type.
 * Use this for type-safe mutation handling.
 */
export type MutationPayloadMap = {
  // Routines
  ROUTINE_CREATE: RoutineCreatePayload;
  ROUTINE_UPDATE: RoutineUpdatePayload;
  ROUTINE_DELETE: RoutineDeletePayload;
  ROUTINE_CLEAR_TRAINING_DAYS: RoutineClearTrainingDaysPayload;
  ROUTINE_CREATE_QUICK_WORKOUT: RoutineCreateQuickWorkoutPayload;
  ROUTINE_CONVERT_FROM_QUICK: RoutineConvertFromQuickPayload;

  // Folders
  FOLDER_CREATE: FolderCreatePayload;
  FOLDER_UPDATE: FolderUpdatePayload;
  FOLDER_DELETE: FolderDeletePayload;
  FOLDER_REORDER: FolderReorderPayload;

  // Tracker Entries
  TRACKER_ENTRY_CREATE: TrackerEntryCreatePayload;
  TRACKER_ENTRY_UPDATE: TrackerEntryUpdatePayload;
  TRACKER_ENTRY_DELETE: TrackerEntryDeletePayload;
  TRACKER_ENTRY_FROM_QUICK_ACTION: TrackerEntryFromQuickActionPayload;
  TRACKER_ENTRY_WITH_AGGREGATE: TrackerEntryWithAggregatePayload;
  TRACKER_REPLACE_ENTRY_WITH_AGGREGATE: TrackerReplaceEntryWithAggregatePayload;
  TRACKER_DELETE_ENTRY_WITH_AGGREGATE: TrackerDeleteEntryWithAggregatePayload;

  // Tracker Metrics
  TRACKER_METRIC_CREATE: TrackerMetricCreatePayload;
  TRACKER_METRIC_UPDATE: TrackerMetricUpdatePayload;
  TRACKER_METRIC_DELETE: TrackerMetricDeletePayload;
  TRACKER_METRIC_RESTORE: TrackerMetricRestorePayload;
  TRACKER_METRIC_REORDER: TrackerMetricReorderPayload;
  TRACKER_METRIC_FROM_TEMPLATE: TrackerMetricFromTemplatePayload;

  // Tracker Quick Actions
  TRACKER_QUICK_ACTION_CREATE: TrackerQuickActionCreatePayload;
  TRACKER_QUICK_ACTION_DELETE: TrackerQuickActionDeletePayload;

  // Macro Targets
  MACRO_TARGET_UPSERT: MacroTargetUpsertPayload;
  MACRO_TARGET_UPDATE: MacroTargetUpdatePayload;

  // Macro Entries
  MACRO_ENTRY_CREATE: MacroEntryCreatePayload;
  MACRO_ENTRY_UPDATE: MacroEntryUpdatePayload;
  MACRO_ENTRY_DELETE: MacroEntryDeletePayload;

  // Macro Quick Actions
  MACRO_QUICK_ACTIONS_INIT: MacroQuickActionsInitPayload;
  MACRO_QUICK_ACTION_CREATE: MacroQuickActionCreatePayload;
  MACRO_QUICK_ACTION_DELETE: MacroQuickActionDeletePayload;

  // PR
  PR_CREATE: PRCreatePayload;
  PR_UPDATE: PRUpdatePayload;

  // Workouts
  WORKOUT_START: WorkoutStartPayload;
  WORKOUT_COMPLETE: WorkoutCompletePayload;
  WORKOUT_UPDATE: WorkoutUpdatePayload;

  // User Preferences
  USER_PREFERENCES_CREATE: UserPreferencesCreatePayload;
  USER_PREFERENCES_UPDATE: UserPreferencesUpdatePayload;
};

/**
 * Type-safe mutation with payload.
 * Ensures the payload matches the mutation code.
 */
export type TypedSyncMutation<T extends keyof MutationPayloadMap> = {
  code: T;
  payload: MutationPayloadMap[T];
  maxRetries?: number;
};

/**
 * Union of all possible typed mutations.
 * Use this when you need to handle any mutation type.
 */
export type AnyTypedSyncMutation = {
  [K in keyof MutationPayloadMap]: TypedSyncMutation<K>;
}[keyof MutationPayloadMap];

/**
 * Helper type to extract payload type from mutation code.
 */
export type PayloadFor<T extends keyof MutationPayloadMap> =
  MutationPayloadMap[T];
