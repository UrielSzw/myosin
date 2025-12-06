/**
 * Tracker Repository
 *
 * Abstraction layer for tracker metric operations.
 * Pattern: Component calls ONE method → SQLite + Sync automatically.
 *
 * Sync operations wrapped (13 total):
 * - TRACKER_METRIC_CREATE: Create custom metric
 * - TRACKER_METRIC_UPDATE: Update metric
 * - TRACKER_METRIC_DELETE: Soft delete metric
 * - TRACKER_METRIC_RESTORE: Restore deleted metric
 * - TRACKER_METRIC_REORDER: Reorder metrics
 * - TRACKER_METRIC_FROM_TEMPLATE: Create metric from template
 * - TRACKER_QUICK_ACTION_CREATE: Create quick action
 * - TRACKER_QUICK_ACTION_DELETE: Delete quick action
 * - TRACKER_ENTRY_WITH_AGGREGATE: Add entry (accumulate behavior)
 * - TRACKER_REPLACE_ENTRY_WITH_AGGREGATE: Add entry (replace behavior)
 * - TRACKER_ENTRY_UPDATE: Update entry
 * - TRACKER_DELETE_ENTRY_WITH_AGGREGATE: Delete entry
 *
 * Read operations (no sync needed):
 * - getActiveMetrics, getMetrics, getDeletedMetrics
 * - getDayData, getTodayData, getDailyAggregate, getMetricHistory
 * - getAvailableTemplates, getTrackerStats
 * - getMetricProgress, getTodaySummary, getDayDataSummary
 */

import { trackerRepository } from "@/shared/db/repository/tracker";
import type {
  BaseTrackerDailyAggregate,
  BaseTrackerEntry,
  BaseTrackerMetric,
  TrackerDayData,
  TrackerEntryInsert,
  TrackerMetricInsert,
  TrackerMetricWithQuickActions,
  TrackerQuickActionInsert,
} from "@/shared/db/schema/tracker";
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
  BaseTrackerDailyAggregate,
  BaseTrackerEntry,
  BaseTrackerMetric,
  TrackerDayData,
  TrackerMetricWithQuickActions,
} from "@/shared/db/schema/tracker";

// Progress stats type
export interface MetricProgressStats {
  metric: BaseTrackerMetric;
  aggregates: BaseTrackerDailyAggregate[];
  totalEntries: number;
  avgDailyValue: number;
  streak: number;
  targetPercentage: number | null;
  isTargetMet: boolean;
  trend: "up" | "down" | "stable";
  daysWithData: number;
  consistency: number;
}

// Day summary type
export interface DaySummaryItem {
  metric: TrackerMetricWithQuickActions;
  totalValue: number;
  entriesCount: number;
  progress: number;
  status: "not_started" | "in_progress" | "completed" | "exceeded";
  displayValue: string;
}

export interface DaySummary {
  dayKey: string;
  summary: DaySummaryItem[];
  totalMetricsWithData: number;
  completedTargets: number;
}

// Tracker stats type
export interface TrackerStats {
  totalMetrics: number;
  activeMetrics: number;
  totalEntries: number;
  entriesByDay: { dayKey: string; entries: number }[];
  lastEntryDate: string | null;
}

// ============================================
// VALIDATION HELPERS
// ============================================

const validateMetricValue = (value: number): void => {
  if (value < 0) {
    throw new Error("El valor no puede ser negativo");
  }
  if (!Number.isInteger(value * 100)) {
    throw new Error("El valor no puede tener más de 2 decimales");
  }
};

const validateQuickActionData = (data: TrackerQuickActionInsert): void => {
  if (data.value <= 0) {
    throw new Error("El valor de la acción rápida debe ser mayor a 0");
  }
  if (!data.label.trim()) {
    throw new Error("La etiqueta no puede estar vacía");
  }
  if (data.position < 0) {
    throw new Error("La posición no puede ser negativa");
  }
};

const validateEntryValue = (value: number): void => {
  if (value <= 0) {
    throw new Error("El valor debe ser mayor a 0");
  }
};

const validateMetricData = (data: Partial<TrackerMetricInsert>): void => {
  if (data.name && data.name.trim().length === 0) {
    throw new Error("El nombre de la métrica no puede estar vacío");
  }
  if (data.unit && data.unit.trim().length === 0) {
    throw new Error("La unidad no puede estar vacía");
  }
  if (data.conversion_factor && data.conversion_factor <= 0) {
    throw new Error("El factor de conversión debe ser mayor a 0");
  }
  if (data.default_target && data.default_target < 0) {
    throw new Error("El objetivo no puede ser negativo");
  }
};

// ============================================
// TRACKER REPOSITORY
// ============================================

export const createTrackerRepository = () => {
  const syncAdapter = getSyncAdapter();

  // Helper to get metrics (internal use)
  const getMetricsInternal = async (
    userId: string
  ): Promise<BaseTrackerMetric[]> => {
    return trackerRepository.getMetrics(userId);
  };

  return {
    // ============================================
    // READ OPERATIONS (No sync needed)
    // ============================================

    /**
     * Get all active metrics with quick actions
     */
    async getActiveMetrics(
      userId: string
    ): Promise<TrackerMetricWithQuickActions[]> {
      if (!userId) throw new Error("User ID is required");
      return trackerRepository.getActiveMetricsWithQuickActions(userId);
    },

    /**
     * Get all active metrics without quick actions
     */
    async getMetrics(userId: string): Promise<BaseTrackerMetric[]> {
      if (!userId) throw new Error("User ID is required");
      return trackerRepository.getMetrics(userId);
    },

    /**
     * Get deleted metrics that can be restored
     */
    async getDeletedMetrics(userId: string): Promise<BaseTrackerMetric[]> {
      if (!userId) throw new Error("User ID is required");
      return trackerRepository.getDeletedMetrics(userId);
    },

    /**
     * Get all data for a specific day
     */
    async getDayData(dayKey: string, userId: string): Promise<TrackerDayData> {
      if (!userId) throw new Error("User ID is required");
      return trackerRepository.getDayData(userId, dayKey);
    },

    /**
     * Get today's data
     */
    async getTodayData(userId: string): Promise<TrackerDayData> {
      if (!userId) throw new Error("User ID is required");
      const today = getDayKeyLocal();
      return trackerRepository.getDayData(userId, today);
    },

    /**
     * Get daily aggregate for a metric
     */
    async getDailyAggregate(
      metricId: string,
      dayKey: string,
      userId: string
    ): Promise<BaseTrackerDailyAggregate | null> {
      return trackerRepository.getDailyAggregate(userId, metricId, dayKey);
    },

    /**
     * Get metric history (aggregates for date range)
     */
    async getMetricHistory(
      metricId: string,
      days: number = 30,
      userId: string
    ): Promise<BaseTrackerDailyAggregate[]> {
      const endDate = getDayKeyLocal();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days + 1);
      const startDateKey = getDayKeyLocal(startDate);

      return trackerRepository.getDailyAggregatesRange(
        userId,
        metricId,
        startDateKey,
        endDate
      );
    },

    /**
     * Get available templates that user hasn't added yet
     */
    async getAvailableTemplates(userId: string): Promise<any[]> {
      return trackerRepository.getAvailableTemplates(userId);
    },

    /**
     * Get metric progress stats
     */
    async getMetricProgress(
      metricId: string,
      days: number = 7,
      userId: string
    ): Promise<MetricProgressStats> {
      const metric = await trackerRepository.getMetricById(metricId);
      if (!metric) {
        throw new Error("Métrica no encontrada");
      }

      const endDate = getDayKeyLocal();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days + 1);
      const startDateKey = getDayKeyLocal(startDate);

      const aggregates = await trackerRepository.getDailyAggregatesRange(
        userId,
        metricId,
        startDateKey,
        endDate
      );

      const totalEntries = aggregates.reduce((sum, agg) => sum + agg.count, 0);
      const avgDailyValue =
        aggregates.length > 0
          ? aggregates.reduce((sum, agg) => sum + agg.sum_normalized, 0) /
            aggregates.length
          : 0;

      // Calculate streak
      let streak = 0;
      const today = new Date();
      for (let i = 0; i < days; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const checkDateKey = getDayKeyLocal(checkDate);
        const dayAggregate = aggregates.find(
          (agg) => agg.day_key === checkDateKey
        );
        if (dayAggregate && dayAggregate.count > 0) {
          streak++;
        } else {
          break;
        }
      }

      // Target progress
      const hasTarget = metric.default_target && metric.default_target > 0;
      let targetPercentage: number | null = null;
      let isTargetMet = false;

      if (hasTarget && aggregates.length > 0) {
        const todayAggregate = aggregates.find(
          (agg) => agg.day_key === getDayKeyLocal()
        );
        if (todayAggregate) {
          targetPercentage = Math.round(
            (todayAggregate.sum_normalized / metric.default_target!) * 100
          );
          isTargetMet = todayAggregate.sum_normalized >= metric.default_target!;
        }
      }

      // Trend calculation
      let trend: "up" | "down" | "stable" = "stable";
      if (aggregates.length >= 6) {
        const recent = aggregates.slice(-3);
        const previous = aggregates.slice(-6, -3);
        const recentAvg =
          recent.reduce((sum, agg) => sum + agg.sum_normalized, 0) / 3;
        const previousAvg =
          previous.reduce((sum, agg) => sum + agg.sum_normalized, 0) / 3;
        const difference = ((recentAvg - previousAvg) / previousAvg) * 100;
        if (difference > 5) trend = "up";
        else if (difference < -5) trend = "down";
      }

      return {
        metric,
        aggregates,
        totalEntries,
        avgDailyValue,
        streak,
        targetPercentage,
        isTargetMet,
        trend,
        daysWithData: aggregates.filter((agg) => agg.count > 0).length,
        consistency:
          aggregates.length > 0
            ? (aggregates.filter((agg) => agg.count > 0).length /
                aggregates.length) *
              100
            : 0,
      };
    },

    /**
     * Get today's summary for all metrics
     */
    async getTodaySummary(userId: string): Promise<DaySummary> {
      if (!userId) throw new Error("User ID is required");
      const todayData = await trackerRepository.getDayData(
        userId,
        getDayKeyLocal()
      );

      const summary: DaySummaryItem[] = todayData.metrics.map((metric) => {
        const totalValue = metric.aggregate?.sum_normalized || 0;
        const entriesCount = metric.entries.length;
        const hasTarget = metric.default_target && metric.default_target > 0;

        let progress = 0;
        let status: DaySummaryItem["status"] = "not_started";

        if (hasTarget) {
          progress = (totalValue / metric.default_target!) * 100;
          if (progress === 0) status = "not_started";
          else if (progress < 100) status = "in_progress";
          else if (progress >= 100 && progress < 120) status = "completed";
          else status = "exceeded";
        } else if (entriesCount > 0) {
          status = "in_progress";
        }

        return {
          metric,
          totalValue,
          entriesCount,
          progress: Math.round(progress),
          status,
          displayValue: `${totalValue.toFixed(1)} ${metric.unit}`,
        };
      });

      return {
        dayKey: todayData.day_key,
        summary,
        totalMetricsWithData: summary.filter((s) => s.entriesCount > 0).length,
        completedTargets: summary.filter(
          (s) => s.status === "completed" || s.status === "exceeded"
        ).length,
      };
    },

    /**
     * Get summary for a specific day
     */
    async getDayDataSummary(
      dayKey: string,
      userId: string
    ): Promise<DaySummary> {
      const dayData = await trackerRepository.getDayData(userId, dayKey);

      const summary: DaySummaryItem[] = dayData.metrics.map((metric) => {
        const totalValue = metric.aggregate?.sum_normalized || 0;
        const entriesCount = metric.entries.length;
        const hasTarget = metric.default_target && metric.default_target > 0;

        let progress = 0;
        let status: DaySummaryItem["status"] = "not_started";

        if (hasTarget) {
          progress = (totalValue / metric.default_target!) * 100;
          if (progress === 0) status = "not_started";
          else if (progress < 100) status = "in_progress";
          else if (progress >= 100 && progress < 120) status = "completed";
          else status = "exceeded";
        } else if (entriesCount > 0) {
          status = "in_progress";
        }

        return {
          metric,
          totalValue,
          entriesCount,
          progress: Math.round(progress),
          status,
          displayValue: `${totalValue.toFixed(1)} ${metric.unit}`,
        };
      });

      return {
        dayKey: dayData.day_key,
        summary,
        totalMetricsWithData: summary.filter((s) => s.entriesCount > 0).length,
        completedTargets: summary.filter(
          (s) => s.status === "completed" || s.status === "exceeded"
        ).length,
      };
    },

    /**
     * Get general tracker stats
     */
    async getTrackerStats(userId: string): Promise<TrackerStats> {
      if (!userId) throw new Error("User ID is required");
      const [metrics, recentEntries] = await Promise.all([
        trackerRepository.getMetrics(userId),
        trackerRepository.getRecentEntries(userId, 100),
      ]);

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return getDayKeyLocal(date);
      });

      const entriesByDay = last7Days.map((dayKey) => ({
        dayKey,
        entries: recentEntries.filter((entry) => entry.day_key === dayKey)
          .length,
      }));

      return {
        totalMetrics: metrics.length,
        activeMetrics: metrics.length,
        totalEntries: recentEntries.length,
        entriesByDay,
        lastEntryDate: recentEntries[0]?.recorded_at || null,
      };
    },

    // ============================================
    // WRITE OPERATIONS (With automatic sync)
    // ============================================

    /**
     * Create a custom metric
     * Sync: TRACKER_METRIC_CREATE
     */
    async createCustomMetric(
      data: Omit<TrackerMetricInsert, "user_id" | "order_index">,
      userId: string
    ): Promise<BaseTrackerMetric> {
      if (!userId) throw new Error("User ID is required");
      validateMetricData(data);

      const slugExists = await trackerRepository.metricExistsBySlug(
        data.slug,
        userId
      );
      if (slugExists) {
        throw new Error(
          `Ya existe una métrica con el identificador "${data.slug}"`
        );
      }

      const activeMetrics = await getMetricsInternal(userId);
      const nextOrderIndex =
        Math.max(...activeMetrics.map((m) => m.order_index), 0) + 1;

      const metricData: TrackerMetricInsert = {
        ...data,
        user_id: userId,
        order_index: nextOrderIndex,
      };

      const result = await trackerRepository.createMetric(metricData);

      syncAdapter.sync(
        "TRACKER_METRIC_CREATE" as MutationCode,
        metricData
      );

      return result;
    },

    /**
     * Update a metric
     * Sync: TRACKER_METRIC_UPDATE
     */
    async updateMetric(
      metricId: string,
      data: Partial<TrackerMetricInsert>
    ): Promise<BaseTrackerMetric> {
      validateMetricData(data);

      const result = await trackerRepository.updateMetric(metricId, data);

      syncAdapter.sync("TRACKER_METRIC_UPDATE" as MutationCode, {
        metricId,
        data,
      });

      return result;
    },

    /**
     * Soft delete a metric
     * Sync: TRACKER_METRIC_DELETE
     */
    async deleteMetric(metricId: string): Promise<BaseTrackerMetric> {
      const result = await trackerRepository.deleteMetric(metricId);

      syncAdapter.sync("TRACKER_METRIC_DELETE" as MutationCode, {
        metricId,
      });

      return result;
    },

    /**
     * Restore a deleted metric
     * Sync: TRACKER_METRIC_RESTORE
     */
    async restoreMetric(metricId: string): Promise<BaseTrackerMetric> {
      const result = await trackerRepository.restoreMetric(metricId);

      syncAdapter.sync("TRACKER_METRIC_RESTORE" as MutationCode, {
        metricId,
      });

      return result;
    },

    /**
     * Reorder metrics
     * Sync: TRACKER_METRIC_REORDER
     */
    async reorderMetrics(metricIds: string[], userId: string): Promise<void> {
      if (!userId) throw new Error("User ID is required");

      const activeMetrics = await getMetricsInternal(userId);
      const activeMetricIds = activeMetrics.map((m) => m.id);

      const invalidIds = metricIds.filter(
        (id) => !activeMetricIds.includes(id)
      );
      if (invalidIds.length > 0) {
        throw new Error(
          `Una o más métricas no existen o están eliminadas: ${invalidIds.join(
            ", "
          )}`
        );
      }

      const metricOrders = metricIds.map((id, index) => ({
        id,
        order_index: index + 1,
      }));

      await trackerRepository.reorderMetrics(metricOrders);

      syncAdapter.sync("TRACKER_METRIC_REORDER" as MutationCode, {
        metricOrders,
      });
    },

    /**
     * Add metric from template
     * Sync: TRACKER_METRIC_FROM_TEMPLATE
     */
    async addMetricFromTemplate(
      templateSlug: string,
      userId: string
    ): Promise<BaseTrackerMetric> {
      if (!userId) throw new Error("User ID is required");

      const templates = await trackerRepository.getPredefinedTemplates();
      const template = templates.find((t) => t.slug === templateSlug);

      if (!template) {
        throw new Error(`Template no encontrado: ${templateSlug}`);
      }

      const existingMetric = await trackerRepository.getMetricBySlug(
        templateSlug,
        userId
      );
      if (existingMetric) {
        throw new Error(
          `Ya existe una métrica con el identificador "${templateSlug}"`
        );
      }

      const activeMetrics = await getMetricsInternal(userId);
      const nextOrderIndex =
        Math.max(...activeMetrics.map((m) => m.order_index), 0) + 1;

      const templateData: TrackerMetricInsert = {
        ...template,
        user_id: userId,
        order_index: nextOrderIndex,
      };

      const result = await trackerRepository.createMetricFromTemplate(
        userId,
        templateSlug,
        templateData
      );

      const createdQuickActions = await trackerRepository.getQuickActions(
        result.id
      );

      syncAdapter.sync("TRACKER_METRIC_FROM_TEMPLATE" as MutationCode, {
        metric: result,
        quickActions: createdQuickActions,
      });

      return result;
    },

    /**
     * Create quick action for a metric
     * Sync: TRACKER_QUICK_ACTION_CREATE
     */
    async createQuickAction(data: TrackerQuickActionInsert): Promise<void> {
      validateQuickActionData(data);

      await trackerRepository.createQuickAction(data);

      syncAdapter.sync(
        "TRACKER_QUICK_ACTION_CREATE" as MutationCode,
        data
      );
    },

    /**
     * Delete quick action
     * Sync: TRACKER_QUICK_ACTION_DELETE
     */
    async deleteQuickAction(quickActionId: string): Promise<void> {
      await trackerRepository.deleteQuickAction(quickActionId);

      syncAdapter.sync("TRACKER_QUICK_ACTION_DELETE" as MutationCode, {
        quickActionId,
      });
    },

    /**
     * Add entry manually
     * Sync: TRACKER_ENTRY_WITH_AGGREGATE or TRACKER_REPLACE_ENTRY_WITH_AGGREGATE
     */
    async addEntry(
      metricId: string,
      value: number,
      userId: string,
      notes?: string,
      recordedAt?: string,
      displayValue?: string
    ): Promise<BaseTrackerEntry> {
      if (!userId) throw new Error("User ID is required");

      const metric = await trackerRepository.getMetricById(metricId);
      if (!metric) {
        throw new Error("Métrica no encontrada o está eliminada");
      }

      validateMetricValue(value);

      const recordedAtISO = recordedAt
        ? combineSelectedDateWithCurrentTime(recordedAt)
        : toUTCISOString();
      const dayKey = recordedAt ? recordedAt : getDayKeyLocal();

      const valueNormalized = value * (metric.conversion_factor || 1);

      const entryData: TrackerEntryInsert = {
        user_id: userId,
        metric_id: metricId,
        value,
        value_normalized: valueNormalized,
        unit: metric.unit,
        day_key: dayKey,
        recorded_at: recordedAtISO,
        source: "manual",
        notes: notes || null,
        meta: null,
        display_value: displayValue || null,
        raw_input: null,
      };

      const result = await trackerRepository.createEntry(entryData);

      const dailyAggregate = await trackerRepository.getDailyAggregate(
        userId,
        result.metric_id,
        dayKey
      );

      const mutationCode =
        metric.behavior === "replace"
          ? "TRACKER_REPLACE_ENTRY_WITH_AGGREGATE"
          : "TRACKER_ENTRY_WITH_AGGREGATE";

      syncAdapter.sync(mutationCode as MutationCode, {
        entry: result,
        dailyAggregate,
      });

      return result;
    },

    /**
     * Add entry from quick action
     * Sync: TRACKER_ENTRY_WITH_AGGREGATE or TRACKER_REPLACE_ENTRY_WITH_AGGREGATE
     */
    async addEntryFromQuickAction(
      quickActionId: string,
      userId: string,
      notes?: string,
      recordedAt?: string,
      slug?: string
    ): Promise<BaseTrackerEntry> {
      if (!userId) throw new Error("User ID is required");

      const recordedAtISO = recordedAt
        ? combineSelectedDateWithCurrentTime(recordedAt)
        : toUTCISOString();
      const dayKey = recordedAt ? recordedAt : getDayKeyLocal();

      const result = await trackerRepository.createEntryFromQuickAction(
        quickActionId,
        userId,
        notes,
        recordedAtISO,
        slug
      );

      const dailyAggregate = await trackerRepository.getDailyAggregate(
        userId,
        result.metric_id,
        dayKey
      );

      const metric = await trackerRepository.getMetricById(result.metric_id);

      const mutationCode =
        metric?.behavior === "replace"
          ? "TRACKER_REPLACE_ENTRY_WITH_AGGREGATE"
          : "TRACKER_ENTRY_WITH_AGGREGATE";

      syncAdapter.sync(mutationCode as MutationCode, {
        entry: result,
        dailyAggregate,
      });

      return result;
    },

    /**
     * Update entry
     * Sync: TRACKER_ENTRY_UPDATE
     */
    async updateEntry(
      entryId: string,
      value: number,
      userId: string,
      notes?: string
    ): Promise<BaseTrackerEntry> {
      if (!userId) throw new Error("User ID is required");
      validateEntryValue(value);

      const entries = await trackerRepository.getRecentEntries(userId, 1000);
      const entry = entries.find((e) => e.id === entryId);

      if (!entry) {
        throw new Error("Entrada no encontrada");
      }

      const metric = await trackerRepository.getMetricById(entry.metric_id);
      if (!metric) {
        throw new Error("Métrica asociada no encontrada");
      }

      validateMetricValue(value);

      const valueNormalized = value * (metric.conversion_factor || 1);

      const updateData = {
        value,
        value_normalized: valueNormalized,
        notes: notes || null,
      };

      const result = await trackerRepository.updateEntry(entryId, updateData);

      syncAdapter.sync("TRACKER_ENTRY_UPDATE" as MutationCode, {
        entryId,
        data: updateData,
      });

      return result;
    },

    /**
     * Delete entry
     * Sync: TRACKER_DELETE_ENTRY_WITH_AGGREGATE
     */
    async deleteEntry(entryId: string): Promise<void> {
      const entryToDelete = await trackerRepository.getEntryById(entryId);

      if (!entryToDelete) {
        throw new Error("Entrada no encontrada");
      }

      const { user_id, metric_id, day_key } = entryToDelete;

      await trackerRepository.deleteEntry(entryId);

      const updatedAggregate = await trackerRepository.getDailyAggregate(
        user_id,
        metric_id,
        day_key
      );

      syncAdapter.sync(
        "TRACKER_DELETE_ENTRY_WITH_AGGREGATE" as MutationCode,
        {
          entryId,
          dailyAggregate: updatedAggregate,
        }
      );
    },
  };
};
