/**
 * Centralized Query Keys Factory
 *
 * This file contains all query keys used throughout the app.
 * Using a centralized factory ensures:
 * - Type-safety and autocompletion
 * - Consistent key structure
 * - Easy invalidation of related queries
 * - No typos in query keys
 *
 * Pattern: Domain > Entity > Specific query
 *
 * Usage:
 *   queryKey: queryKeys.workouts.routines.list()
 *   invalidateQueries({ queryKey: queryKeys.workouts.all })
 */

export const queryKeys = {
  // ==================== WORKOUTS DOMAIN ====================
  workouts: {
    all: ["workouts"] as const,

    routines: {
      all: () => [...queryKeys.workouts.all, "routines"] as const,
      list: (folderId?: string | null) =>
        [...queryKeys.workouts.routines.all(), folderId ?? "root"] as const,
      count: () => [...queryKeys.workouts.routines.all(), "count"] as const,
    },

    folders: {
      all: () => [...queryKeys.workouts.all, "folders"] as const,
    },
  },

  // ==================== SESSIONS DOMAIN ====================
  sessions: {
    all: ["sessions"] as const,
    list: (userId: string) =>
      [...queryKeys.sessions.all, "list", userId] as const,
    detail: (sessionId: string) =>
      [...queryKeys.sessions.all, "detail", sessionId] as const,
  },

  // ==================== ANALYTICS DOMAIN ====================
  analytics: {
    all: ["analytics"] as const,
    dashboard: (userId: string) =>
      [...queryKeys.analytics.all, "dashboard", userId] as const,
    tracker: (userId: string) =>
      [...queryKeys.analytics.all, "tracker", userId] as const,
  },

  // ==================== EXERCISES DOMAIN ====================
  exercises: {
    all: ["exercises"] as const,
  },
} as const;

// Type helpers for query key inference
export type QueryKeys = typeof queryKeys;
