/**
 * Macros Repository
 *
 * Abstraction layer for macro tracking operations.
 * Pattern: Component calls ONE method → SQLite + Sync automatically.
 *
 * Sync operations wrapped:
 * - MACRO_TARGET_UPSERT: Set macro targets
 * - MACRO_TARGET_UPDATE: Update existing targets
 * - MACRO_ENTRY_CREATE: Add entry manually or from quick action
 * - MACRO_ENTRY_UPDATE: Update entry
 * - MACRO_ENTRY_DELETE: Delete entry
 * - MACRO_QUICK_ACTIONS_INIT: Initialize predefined quick actions
 * - MACRO_QUICK_ACTION_CREATE: Create custom quick action
 * - MACRO_QUICK_ACTION_DELETE: Delete quick action
 *
 * Read operations (no sync needed):
 * - getActiveTarget
 * - hasTargets
 * - getDayData
 * - getQuickActions
 * - getStats
 */

import { macroRepository } from "@/shared/db/repository/macros";
import type {
  BaseMacroQuickAction,
  MacroDayData,
  MacroEntryInsert,
  MacroEntryWithCalories,
  MacroTargetInsert,
  MacroTargetWithCalories,
} from "@/shared/db/schema/macros";
import { calculateCalories } from "@/shared/db/schema/macros";
import type { MutationCode } from "@/shared/sync/types/mutations";
import {
  combineSelectedDateWithCurrentTime,
  getDayKeyLocal,
  toUTCISOString,
} from "@/shared/utils/timezone";
import { getSyncAdapter } from "../core/sync-adapter";

// ============================================
// TYPES
// ============================================

export type {
  BaseMacroQuickAction,
  MacroDayData,
  MacroEntryWithCalories,
  MacroTargetWithCalories,
} from "@/shared/db/schema/macros";

// Options for adding entries
export interface AddEntryOptions {
  label?: string;
  notes?: string;
  recordedAt?: string; // YYYY-MM-DD format or ISO string
}

// Stats result type
export interface MacroStats {
  period: { start: string; end: string; days: number };
  averages: {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
  };
  target: MacroTargetWithCalories | null;
  compliance: {
    daysWithData: number;
    proteinHitDays: number;
    carbsHitDays: number;
    fatsHitDays: number;
    proteinHitPercent: number;
    carbsHitPercent: number;
    fatsHitPercent: number;
  };
  streak: number;
  aggregates: any[];
}

// ============================================
// VALIDATION HELPERS
// ============================================

const validateMacroValues = (
  protein: number,
  carbs: number,
  fats: number
): void => {
  if (protein < 0 || carbs < 0 || fats < 0) {
    throw new Error("Los valores de macros no pueden ser negativos");
  }
  if (protein > 500 || carbs > 1000 || fats > 500) {
    throw new Error("Los valores de macros parecen demasiado altos");
  }
};

const validateTargets = (
  protein: number,
  carbs: number,
  fats: number
): void => {
  if (protein <= 0 || carbs <= 0 || fats <= 0) {
    throw new Error("Los objetivos deben ser mayores a 0");
  }
  const calories = calculateCalories(protein, carbs, fats);
  if (calories < 800 || calories > 10000) {
    throw new Error(
      "Las calorías calculadas están fuera del rango razonable (800-10000)"
    );
  }
};

// ============================================
// MACROS REPOSITORY
// ============================================

export const createMacrosRepository = () => {
  const syncAdapter = getSyncAdapter();

  return {
    // ============================================
    // READ OPERATIONS (No sync needed)
    // ============================================

    /**
     * Get active macro targets
     */
    async getActiveTarget(
      userId: string
    ): Promise<MacroTargetWithCalories | null> {
      if (!userId) throw new Error("User ID is required");
      return macroRepository.getActiveTarget(userId);
    },

    /**
     * Check if user has targets configured
     */
    async hasTargets(userId: string): Promise<boolean> {
      if (!userId) throw new Error("User ID is required");
      return macroRepository.hasTargets(userId);
    },

    /**
     * Get all data for a specific day
     */
    async getDayData(dayKey: string, userId: string): Promise<MacroDayData> {
      if (!userId) throw new Error("User ID is required");
      return macroRepository.getDayData(userId, dayKey);
    },

    /**
     * Get today's data
     */
    async getTodayData(userId: string): Promise<MacroDayData> {
      if (!userId) throw new Error("User ID is required");
      const today = getDayKeyLocal();
      return macroRepository.getDayData(userId, today);
    },

    /**
     * Get user's quick actions
     */
    async getQuickActions(userId: string): Promise<BaseMacroQuickAction[]> {
      if (!userId) throw new Error("User ID is required");
      return macroRepository.getQuickActions(userId);
    },

    /**
     * Get macro stats for a period
     */
    async getStats(userId: string, days: number = 7): Promise<MacroStats> {
      if (!userId) throw new Error("User ID is required");

      const endDate = getDayKeyLocal();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days + 1);
      const startDateKey = getDayKeyLocal(startDate);

      const [aggregates, target] = await Promise.all([
        macroRepository.getAggregatesRange(userId, startDateKey, endDate),
        macroRepository.getActiveTarget(userId),
      ]);

      // Calculate averages
      const daysWithData = aggregates.length;
      const avgProtein =
        daysWithData > 0
          ? aggregates.reduce((sum, a) => sum + a.total_protein, 0) /
            daysWithData
          : 0;
      const avgCarbs =
        daysWithData > 0
          ? aggregates.reduce((sum, a) => sum + a.total_carbs, 0) / daysWithData
          : 0;
      const avgFats =
        daysWithData > 0
          ? aggregates.reduce((sum, a) => sum + a.total_fats, 0) / daysWithData
          : 0;
      const avgCalories = calculateCalories(avgProtein, avgCarbs, avgFats);

      // Calculate target hit percentage
      let proteinHitDays = 0;
      let carbsHitDays = 0;
      let fatsHitDays = 0;

      if (target) {
        aggregates.forEach((agg) => {
          if (agg.total_protein >= target.protein_target * 0.9)
            proteinHitDays++;
          if (agg.total_carbs >= target.carbs_target * 0.9) carbsHitDays++;
          if (agg.total_fats >= target.fats_target * 0.9) fatsHitDays++;
        });
      }

      // Calculate streak (consecutive days with entries)
      let streak = 0;
      const today = new Date();
      for (let i = 0; i < days; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const checkDateKey = getDayKeyLocal(checkDate);
        const dayAgg = aggregates.find((a) => a.day_key === checkDateKey);
        if (dayAgg && dayAgg.entry_count > 0) {
          streak++;
        } else {
          break;
        }
      }

      return {
        period: { start: startDateKey, end: endDate, days },
        averages: {
          protein: Math.round(avgProtein),
          carbs: Math.round(avgCarbs),
          fats: Math.round(avgFats),
          calories: avgCalories,
        },
        target,
        compliance: {
          daysWithData,
          proteinHitDays,
          carbsHitDays,
          fatsHitDays,
          proteinHitPercent:
            daysWithData > 0
              ? Math.round((proteinHitDays / daysWithData) * 100)
              : 0,
          carbsHitPercent:
            daysWithData > 0
              ? Math.round((carbsHitDays / daysWithData) * 100)
              : 0,
          fatsHitPercent:
            daysWithData > 0
              ? Math.round((fatsHitDays / daysWithData) * 100)
              : 0,
        },
        streak,
        aggregates,
      };
    },

    // ============================================
    // WRITE OPERATIONS (With automatic sync)
    // ============================================

    /**
     * Set macro targets
     * Sync: MACRO_TARGET_UPSERT
     */
    async setTargets(
      protein: number,
      carbs: number,
      fats: number,
      userId: string,
      name?: string
    ): Promise<MacroTargetWithCalories> {
      if (!userId) throw new Error("User ID is required");
      validateTargets(protein, carbs, fats);

      const data: MacroTargetInsert = {
        user_id: userId,
        protein_target: protein,
        carbs_target: carbs,
        fats_target: fats,
        name: name || null,
        is_active: true,
      };

      const result = await macroRepository.upsertTarget(data);

      // Background sync
      syncAdapter.sync("MACRO_TARGET_UPSERT" as MutationCode, result);

      return result;
    },

    /**
     * Update existing targets
     * Sync: MACRO_TARGET_UPDATE
     */
    async updateTargets(
      targetId: string,
      protein: number,
      carbs: number,
      fats: number,
      userId: string
    ): Promise<MacroTargetWithCalories> {
      if (!userId) throw new Error("User ID is required");
      validateTargets(protein, carbs, fats);

      const result = await macroRepository.updateTarget(targetId, {
        protein_target: protein,
        carbs_target: carbs,
        fats_target: fats,
        user_id: userId,
      });

      // Background sync
      syncAdapter.sync("MACRO_TARGET_UPDATE" as MutationCode, result);

      return result;
    },

    /**
     * Add macro entry manually
     * Sync: MACRO_ENTRY_CREATE
     */
    async addEntry(
      protein: number,
      carbs: number,
      fats: number,
      userId: string,
      options?: AddEntryOptions
    ): Promise<MacroEntryWithCalories> {
      if (!userId) throw new Error("User ID is required");
      validateMacroValues(protein, carbs, fats);

      const recordedAtISO = options?.recordedAt
        ? options.recordedAt.includes("T")
          ? options.recordedAt
          : combineSelectedDateWithCurrentTime(options.recordedAt)
        : toUTCISOString();

      let dayKey: string;
      if (options?.recordedAt) {
        dayKey = options.recordedAt.includes("T")
          ? options.recordedAt.split("T")[0] ?? getDayKeyLocal()
          : options.recordedAt;
      } else {
        dayKey = getDayKeyLocal();
      }

      const data: MacroEntryInsert = {
        user_id: userId,
        protein,
        carbs,
        fats,
        label: options?.label || null,
        notes: options?.notes || null,
        source: "manual",
        day_key: dayKey,
        recorded_at: recordedAtISO,
      };

      const result = await macroRepository.createEntry(data);

      // Get updated aggregate for sync
      const aggregate = await macroRepository.getDailyAggregate(userId, dayKey);

      // Background sync
      syncAdapter.sync("MACRO_ENTRY_CREATE" as MutationCode, {
        entry: result,
        aggregate,
      });

      return result;
    },

    /**
     * Add entry from quick action
     * Sync: MACRO_ENTRY_CREATE
     */
    async addEntryFromQuickAction(
      quickActionId: string,
      userId: string,
      recordedAt?: string
    ): Promise<MacroEntryWithCalories> {
      if (!userId) throw new Error("User ID is required");

      // Get quick action data
      const quickActions = await macroRepository.getQuickActions(userId);
      const qa = quickActions.find((q) => q.id === quickActionId);

      if (!qa) {
        throw new Error("Quick action no encontrada");
      }

      const recordedAtISO = recordedAt
        ? recordedAt.includes("T")
          ? recordedAt
          : combineSelectedDateWithCurrentTime(recordedAt)
        : toUTCISOString();

      let dayKey: string;
      if (recordedAt) {
        dayKey = recordedAt.includes("T")
          ? recordedAt.split("T")[0] ?? getDayKeyLocal()
          : recordedAt;
      } else {
        dayKey = getDayKeyLocal();
      }

      const data: MacroEntryInsert = {
        user_id: userId,
        protein: qa.protein,
        carbs: qa.carbs,
        fats: qa.fats,
        label: qa.label,
        notes: null,
        source: "quick_action",
        day_key: dayKey,
        recorded_at: recordedAtISO,
      };

      const result = await macroRepository.createEntry(data);

      // Get updated aggregate for sync
      const aggregate = await macroRepository.getDailyAggregate(userId, dayKey);

      // Background sync
      syncAdapter.sync("MACRO_ENTRY_CREATE" as MutationCode, {
        entry: result,
        aggregate,
      });

      return result;
    },

    /**
     * Update entry
     * Sync: MACRO_ENTRY_UPDATE
     */
    async updateEntry(
      entryId: string,
      protein: number,
      carbs: number,
      fats: number,
      userId: string,
      label?: string
    ): Promise<MacroEntryWithCalories> {
      if (!userId) throw new Error("User ID is required");
      validateMacroValues(protein, carbs, fats);

      const result = await macroRepository.updateEntry(entryId, {
        protein,
        carbs,
        fats,
        label: label || null,
      });

      // Background sync
      syncAdapter.sync("MACRO_ENTRY_UPDATE" as MutationCode, result);

      return result;
    },

    /**
     * Delete entry
     * Sync: MACRO_ENTRY_DELETE
     */
    async deleteEntry(entryId: string, userId: string): Promise<void> {
      if (!userId) throw new Error("User ID is required");

      // Get entry info before delete
      const entry = await macroRepository.getEntryById(entryId);
      if (!entry) throw new Error("Entry no encontrada");

      await macroRepository.deleteEntry(entryId);

      // Get updated aggregate
      const aggregate = await macroRepository.getDailyAggregate(
        userId,
        entry.day_key
      );

      // Background sync
      syncAdapter.sync("MACRO_ENTRY_DELETE" as MutationCode, {
        entryId,
        aggregate,
      });
    },

    /**
     * Initialize predefined quick actions for new user
     * Sync: MACRO_QUICK_ACTIONS_INIT
     */
    async initializeQuickActions(
      userId: string
    ): Promise<BaseMacroQuickAction[]> {
      if (!userId) throw new Error("User ID is required");
      const quickActions =
        await macroRepository.initializePredefinedQuickActions(userId);

      // Background sync
      syncAdapter.sync(
        "MACRO_QUICK_ACTIONS_INIT" as MutationCode,
        quickActions
      );

      return quickActions;
    },

    /**
     * Create custom quick action
     * Sync: MACRO_QUICK_ACTION_CREATE
     */
    async createQuickAction(
      label: string,
      protein: number,
      carbs: number,
      fats: number,
      userId: string
    ): Promise<BaseMacroQuickAction> {
      if (!userId) throw new Error("User ID is required");
      if (!label.trim()) throw new Error("El nombre no puede estar vacío");
      validateMacroValues(protein, carbs, fats);

      // Get next position
      const existing = await macroRepository.getQuickActions(userId);
      const nextPosition = Math.max(...existing.map((q) => q.position), -1) + 1;

      const result = await macroRepository.createQuickAction({
        user_id: userId,
        label,
        protein,
        carbs,
        fats,
        position: nextPosition,
        is_predefined: false,
        slug: null,
        icon: null,
        color: null,
      });

      // Background sync
      syncAdapter.sync(
        "MACRO_QUICK_ACTION_CREATE" as MutationCode,
        result
      );

      return result;
    },

    /**
     * Delete quick action
     * Sync: MACRO_QUICK_ACTION_DELETE
     */
    async deleteQuickAction(
      quickActionId: string,
      userId: string
    ): Promise<void> {
      if (!userId) throw new Error("User ID is required");

      await macroRepository.deleteQuickAction(quickActionId);

      // Background sync
      syncAdapter.sync("MACRO_QUICK_ACTION_DELETE" as MutationCode, {
        quickActionId,
      });
    },
  };
};
