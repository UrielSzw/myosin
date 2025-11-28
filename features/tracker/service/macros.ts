import { macroRepository } from "@/shared/db/repository/macros";
import {
  BaseMacroQuickAction,
  MacroDayData,
  MacroEntryInsert,
  MacroEntryWithCalories,
  MacroTargetInsert,
  MacroTargetWithCalories,
  calculateCalories,
} from "@/shared/db/schema/macros";
import { SyncQueueRepository } from "@/shared/sync/queue/sync-queue-repository";
import { syncToSupabase } from "@/shared/sync/sync-engine";
import type { MutationCode } from "@/shared/sync/types/mutations";
import {
  combineSelectedDateWithCurrentTime,
  getDayKeyLocal,
  toUTCISOString,
} from "@/shared/utils/timezone";
import NetInfo from "@react-native-community/netinfo";

// Helper function for sync without hooks
const syncHelper = async (code: MutationCode, payload: any) => {
  try {
    const netInfo = await NetInfo.fetch();
    const isOnline = netInfo.isConnected && netInfo.isInternetReachable;

    if (isOnline) {
      await syncToSupabase(code, payload);
    } else {
      const queueRepo = new SyncQueueRepository();
      await queueRepo.enqueue({ code, payload });
      console.log(`📴 Queued for later sync: ${code}`);
    }
  } catch (error) {
    console.error(`Failed to sync ${code}:`, error);
  }
};

// Validation helpers
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

export const macroService = {
  // ==================== TARGETS ====================

  /**
   * Get active macro targets
   */
  getActiveTarget: async (
    userId: string
  ): Promise<MacroTargetWithCalories | null> => {
    if (!userId) throw new Error("User ID is required");
    return await macroRepository.getActiveTarget(userId);
  },

  /**
   * Set macro targets
   */
  setTargets: async (
    protein: number,
    carbs: number,
    fats: number,
    userId: string,
    name?: string
  ): Promise<MacroTargetWithCalories> => {
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
    syncHelper("MACRO_TARGET_UPSERT" as MutationCode, result);

    return result;
  },

  /**
   * Update existing targets
   */
  updateTargets: async (
    targetId: string,
    protein: number,
    carbs: number,
    fats: number,
    userId: string
  ): Promise<MacroTargetWithCalories> => {
    if (!userId) throw new Error("User ID is required");
    validateTargets(protein, carbs, fats);

    const result = await macroRepository.updateTarget(targetId, {
      protein_target: protein,
      carbs_target: carbs,
      fats_target: fats,
      user_id: userId,
    });

    // Background sync
    syncHelper("MACRO_TARGET_UPDATE" as MutationCode, result);

    return result;
  },

  /**
   * Check if user has targets configured
   */
  hasTargets: async (userId: string): Promise<boolean> => {
    if (!userId) throw new Error("User ID is required");
    return await macroRepository.hasTargets(userId);
  },

  // ==================== ENTRIES ====================

  /**
   * Add macro entry manually
   */
  addEntry: async (
    protein: number,
    carbs: number,
    fats: number,
    userId: string,
    options?: {
      label?: string;
      notes?: string;
      recordedAt?: string; // YYYY-MM-DD format or ISO string
    }
  ): Promise<MacroEntryWithCalories> => {
    if (!userId) throw new Error("User ID is required");
    validateMacroValues(protein, carbs, fats);

    const recordedAtISO = options?.recordedAt
      ? options.recordedAt.includes("T")
        ? options.recordedAt
        : combineSelectedDateWithCurrentTime(options.recordedAt)
      : toUTCISOString();

    const dayKey = options?.recordedAt
      ? options.recordedAt.includes("T")
        ? options.recordedAt.split("T")[0]
        : options.recordedAt
      : getDayKeyLocal();

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
    syncHelper("MACRO_ENTRY_CREATE" as MutationCode, {
      entry: result,
      aggregate,
    });

    return result;
  },

  /**
   * Add entry from quick action
   */
  addEntryFromQuickAction: async (
    quickActionId: string,
    userId: string,
    recordedAt?: string
  ): Promise<MacroEntryWithCalories> => {
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

    const dayKey = recordedAt
      ? recordedAt.includes("T")
        ? recordedAt.split("T")[0]
        : recordedAt
      : getDayKeyLocal();

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
    syncHelper("MACRO_ENTRY_CREATE" as MutationCode, {
      entry: result,
      aggregate,
    });

    return result;
  },

  /**
   * Update entry
   */
  updateEntry: async (
    entryId: string,
    protein: number,
    carbs: number,
    fats: number,
    userId: string,
    label?: string
  ): Promise<MacroEntryWithCalories> => {
    if (!userId) throw new Error("User ID is required");
    validateMacroValues(protein, carbs, fats);

    const result = await macroRepository.updateEntry(entryId, {
      protein,
      carbs,
      fats,
      label: label || null,
    });

    // Background sync
    syncHelper("MACRO_ENTRY_UPDATE" as MutationCode, result);

    return result;
  },

  /**
   * Delete entry
   */
  deleteEntry: async (entryId: string, userId: string): Promise<void> => {
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
    syncHelper("MACRO_ENTRY_DELETE" as MutationCode, {
      entryId,
      aggregate,
    });
  },

  // ==================== DAY DATA ====================

  /**
   * Get all data for a specific day
   */
  getDayData: async (dayKey: string, userId: string): Promise<MacroDayData> => {
    if (!userId) throw new Error("User ID is required");
    return await macroRepository.getDayData(userId, dayKey);
  },

  /**
   * Get today's data
   */
  getTodayData: async (userId: string): Promise<MacroDayData> => {
    if (!userId) throw new Error("User ID is required");
    const today = getDayKeyLocal();
    return await macroService.getDayData(today, userId);
  },

  // ==================== QUICK ACTIONS ====================

  /**
   * Get user's quick actions
   */
  getQuickActions: async (userId: string): Promise<BaseMacroQuickAction[]> => {
    if (!userId) throw new Error("User ID is required");
    return await macroRepository.getQuickActions(userId);
  },

  /**
   * Initialize predefined quick actions for new user
   */
  initializeQuickActions: async (
    userId: string
  ): Promise<BaseMacroQuickAction[]> => {
    if (!userId) throw new Error("User ID is required");
    const quickActions = await macroRepository.initializePredefinedQuickActions(
      userId
    );

    // Background sync
    syncHelper("MACRO_QUICK_ACTIONS_INIT" as MutationCode, quickActions);

    return quickActions;
  },

  /**
   * Create custom quick action
   */
  createQuickAction: async (
    label: string,
    protein: number,
    carbs: number,
    fats: number,
    userId: string
  ): Promise<BaseMacroQuickAction> => {
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
    syncHelper("MACRO_QUICK_ACTION_CREATE" as MutationCode, result);

    return result;
  },

  /**
   * Delete quick action
   */
  deleteQuickAction: async (
    quickActionId: string,
    userId: string
  ): Promise<void> => {
    if (!userId) throw new Error("User ID is required");

    await macroRepository.deleteQuickAction(quickActionId);

    // Background sync
    syncHelper("MACRO_QUICK_ACTION_DELETE" as MutationCode, { quickActionId });
  },

  // ==================== ANALYTICS ====================

  /**
   * Get macro stats for a period
   */
  getStats: async (userId: string, days: number = 7) => {
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
        ? aggregates.reduce((sum, a) => sum + a.total_protein, 0) / daysWithData
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
        if (agg.total_protein >= target.protein_target * 0.9) proteinHitDays++;
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
          daysWithData > 0 ? Math.round((fatsHitDays / daysWithData) * 100) : 0,
      },
      streak,
      aggregates,
    };
  },
};
