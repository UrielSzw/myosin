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
import { getDayKey, getFullTimestamp } from "@/shared/utils/date-utils";

// Validaciones de negocio
const validateMetricValue = (
  value: number,
  type: "value" | "counter"
): void => {
  if (value < 0) {
    throw new Error("El valor no puede ser negativo");
  }

  if (type === "counter" && !Number.isInteger(value * 100)) {
    // Permitir hasta 2 decimales para counters
    throw new Error(
      "Los valores de contador no pueden tener más de 2 decimales"
    );
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

export const trackerService = {
  // ==================== METRICS MANAGEMENT ====================

  /**
   * Obtiene todas las métricas activas (no eliminadas)
   */
  getActiveMetrics: async (
    userId: string = "default-user"
  ): Promise<TrackerMetricWithQuickActions[]> => {
    return await trackerRepository.getActiveMetricsWithQuickActions(userId);
  },

  /**
   * Obtiene todas las métricas activas sin quick actions
   */
  getMetrics: async (
    userId: string = "default-user"
  ): Promise<BaseTrackerMetric[]> => {
    return await trackerRepository.getMetrics(userId);
  },

  /**
   * Obtiene métricas eliminadas que pueden ser restauradas
   */
  getDeletedMetrics: async (
    userId: string = "default-user"
  ): Promise<BaseTrackerMetric[]> => {
    return await trackerRepository.getDeletedMetrics(userId);
  },

  /**
   * Crea una nueva métrica personalizada
   */
  createCustomMetric: async (
    data: Omit<TrackerMetricInsert, "user_id" | "order_index">,
    userId: string = "default-user"
  ): Promise<BaseTrackerMetric> => {
    validateMetricData(data);

    // Verificar que el slug sea único para el usuario (solo métricas activas)
    const slugExists = await trackerRepository.metricExistsBySlug(
      data.slug,
      userId
    );
    if (slugExists) {
      throw new Error(
        `Ya existe una métrica con el identificador "${data.slug}"`
      );
    }

    // Obtener siguiente order_index
    const activeMetrics = await trackerService.getMetrics(userId);
    const nextOrderIndex =
      Math.max(...activeMetrics.map((m) => m.order_index), 0) + 1;

    const metricData: TrackerMetricInsert = {
      ...data,
      user_id: userId,
      order_index: nextOrderIndex,
    };

    return await trackerRepository.createMetric(metricData);
  },

  /**
   * Elimina una métrica (soft delete)
   */
  deleteMetric: async (metricId: string): Promise<BaseTrackerMetric> => {
    return await trackerRepository.deleteMetric(metricId);
  },

  /**
   * Restaura una métrica eliminada
   */
  restoreMetric: async (metricId: string): Promise<BaseTrackerMetric> => {
    return await trackerRepository.restoreMetric(metricId);
  },

  /**
   * Actualiza una métrica
   */
  updateMetric: async (
    metricId: string,
    data: Partial<TrackerMetricInsert>
  ): Promise<BaseTrackerMetric> => {
    validateMetricData(data);
    return await trackerRepository.updateMetric(metricId, data);
  },

  /**
   * Elimina una métrica (solo si es custom)
   */
  /**
   * Reordena métricas
   */
  reorderMetrics: async (
    metricIds: string[],
    userId: string = "default-user"
  ): Promise<void> => {
    // Validar que todas las métricas sean activas del usuario
    const activeMetrics = await trackerService.getMetrics(userId);
    const activeMetricIds = activeMetrics.map((m) => m.id);

    const invalidIds = metricIds.filter((id) => !activeMetricIds.includes(id));
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
  },

  // ==================== QUICK ACTIONS ====================

  /**
   * Crea una quick action para una métrica
   */
  createQuickAction: async (data: TrackerQuickActionInsert): Promise<void> => {
    validateQuickActionData(data);
    await trackerRepository.createQuickAction(data);
  },

  /**
   * Elimina una quick action
   */
  deleteQuickAction: async (quickActionId: string): Promise<void> => {
    await trackerRepository.deleteQuickAction(quickActionId);
  },

  // ==================== ENTRIES MANAGEMENT ====================

  /**
   * Registra un valor manualmente
   */
  addEntry: async (
    metricId: string,
    value: number,
    userId: string = "default-user",
    notes?: string,
    recordedAt?: string
  ): Promise<BaseTrackerEntry> => {
    // Obtener métrica para validaciones (solo métricas activas)
    const metric = await trackerRepository.getMetricById(metricId);

    if (!metric) {
      throw new Error("Métrica no encontrada o está eliminada");
    }

    validateMetricValue(value, metric.type);

    const recordedAtISO = getFullTimestamp(recordedAt);
    const dayKey = getDayKey(new Date(recordedAtISO));

    // Calcular valor normalizado
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
    };

    return await trackerRepository.createEntry(entryData);
  },

  /**
   * Registra un valor usando una quick action
   */
  addEntryFromQuickAction: async (
    quickActionId: string,
    userId: string = "default-user",
    notes?: string,
    recordedAt?: string,
    slug?: string
  ): Promise<BaseTrackerEntry> => {
    return await trackerRepository.createEntryFromQuickAction(
      quickActionId,
      userId,
      notes,
      recordedAt,
      slug
    );
  },

  /**
   * Actualiza una entrada existente
   */
  updateEntry: async (
    entryId: string,
    value: number,
    notes?: string
  ): Promise<BaseTrackerEntry> => {
    validateEntryValue(value);

    // Obtener entry actual para validar con su métrica
    const entries = await trackerRepository.getRecentEntries(
      "default-user",
      1000
    );
    const entry = entries.find((e) => e.id === entryId);

    if (!entry) {
      throw new Error("Entrada no encontrada");
    }

    // Obtener métrica para calcular valor normalizado
    const metric = await trackerRepository.getMetricById(entry.metric_id);
    if (!metric) {
      throw new Error("Métrica asociada no encontrada");
    }

    validateMetricValue(value, metric.type);

    const valueNormalized = value * (metric.conversion_factor || 1);

    return await trackerRepository.updateEntry(entryId, {
      value,
      value_normalized: valueNormalized,
      notes: notes || null,
    });
  },

  /**
   * Elimina una entrada
   */
  deleteEntry: async (entryId: string): Promise<void> => {
    await trackerRepository.deleteEntry(entryId);
  },

  // ==================== DAY DATA & AGGREGATES ====================

  /**
   * Obtiene todos los datos de un día específico
   */
  getDayData: async (
    dayKey: string,
    userId: string = "default-user"
  ): Promise<TrackerDayData> => {
    return await trackerRepository.getDayData(userId, dayKey);
  },

  /**
   * Obtiene datos del día actual
   */
  getTodayData: async (
    userId: string = "default-user"
  ): Promise<TrackerDayData> => {
    const today = getDayKey();
    return await trackerService.getDayData(today, userId);
  },

  /**
   * Obtiene el agregado de una métrica para un día específico
   */
  getDailyAggregate: async (
    metricId: string,
    dayKey: string,
    userId: string = "default-user"
  ): Promise<BaseTrackerDailyAggregate | null> => {
    return await trackerRepository.getDailyAggregate(userId, metricId, dayKey);
  },

  /**
   * Obtiene agregados de una métrica para un rango de días
   */
  getMetricHistory: async (
    metricId: string,
    days: number = 30,
    userId: string = "default-user"
  ): Promise<BaseTrackerDailyAggregate[]> => {
    const endDate = getDayKey();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    const startDateKey = getDayKey(startDate);

    return await trackerRepository.getDailyAggregatesRange(
      userId,
      metricId,
      startDateKey,
      endDate
    );
  },

  // ==================== ANALYTICS & INSIGHTS ====================

  /**
   * Obtiene estadísticas de progreso de una métrica
   */
  getMetricProgress: async (
    metricId: string,
    days: number = 7,
    userId: string = "default-user"
  ) => {
    // Obtener métrica
    const metric = await trackerRepository.getMetricById(metricId);
    if (!metric) {
      throw new Error("Métrica no encontrada");
    }

    // Calcular rango de fechas
    const endDate = getDayKey();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    const startDateKey = getDayKey(startDate);

    // Obtener agregados del período
    const aggregates = await trackerRepository.getDailyAggregatesRange(
      userId,
      metricId,
      startDateKey,
      endDate
    );

    // Calcular estadísticas básicas
    const totalEntries = aggregates.reduce((sum, agg) => sum + agg.count, 0);
    const avgDailyValue =
      aggregates.length > 0
        ? aggregates.reduce((sum, agg) => sum + agg.sum_normalized, 0) /
          aggregates.length
        : 0;

    // Calcular streak (días consecutivos con al menos 1 entry)
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const checkDateKey = getDayKey(checkDate);

      const dayAggregate = aggregates.find(
        (agg) => agg.day_key === checkDateKey
      );
      if (dayAggregate && dayAggregate.count > 0) {
        streak++;
      } else {
        break; // se rompe el streak
      }
    }

    // Calcular porcentaje de objetivo alcanzado (si tiene objetivo)
    const hasTarget = metric.default_target && metric.default_target > 0;
    let targetPercentage = null;
    let isTargetMet = false;

    if (hasTarget && aggregates.length > 0) {
      const todayAggregate = aggregates.find(
        (agg) => agg.day_key === getDayKey()
      );

      if (todayAggregate) {
        targetPercentage = Math.round(
          (todayAggregate.sum_normalized / metric.default_target!) * 100
        );
        isTargetMet = todayAggregate.sum_normalized >= metric.default_target!;
      }
    }

    // Calcular tendencia (comparar últimos 3 días vs 3 días anteriores)
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
   * Obtiene resumen de todas las métricas activas para hoy
   */
  getTodaySummary: async (userId: string = "default-user") => {
    const todayData = await trackerService.getTodayData(userId);

    const summary = todayData.metrics.map((metric) => {
      const totalValue = metric.aggregate?.sum_normalized || 0;
      const entriesCount = metric.entries.length;
      const hasTarget = metric.default_target && metric.default_target > 0;

      let progress = 0;
      let status: "not_started" | "in_progress" | "completed" | "exceeded" =
        "not_started";

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
   * Obtiene resumen de cualquier día específico (similar a getTodaySummary pero para cualquier fecha)
   */
  getDayDataSummary: async (
    dayKey: string,
    userId: string = "default-user"
  ) => {
    const dayData = await trackerService.getDayData(dayKey, userId);

    const summary = dayData.metrics.map((metric) => {
      const totalValue = metric.aggregate?.sum_normalized || 0;
      const entriesCount = metric.entries.length;
      const hasTarget = metric.default_target && metric.default_target > 0;

      let progress = 0;
      let status: "not_started" | "in_progress" | "completed" | "exceeded" =
        "not_started";

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

  // ==================== INITIALIZATION ====================

  // ==================== TEMPLATES ====================

  /**
   * Obtiene templates disponibles que el usuario aún no ha agregado
   */
  getAvailableTemplates: async (
    userId: string = "default-user"
  ): Promise<any[]> => {
    return await trackerRepository.getAvailableTemplates(userId);
  },

  /**
   * Agrega una métrica desde un template predefinido
   */
  addMetricFromTemplate: async (
    templateSlug: string,
    userId: string = "default-user"
  ): Promise<BaseTrackerMetric> => {
    const templates = await trackerRepository.getPredefinedTemplates();
    const template = templates.find((t) => t.slug === templateSlug);

    if (!template) {
      throw new Error(`Template no encontrado: ${templateSlug}`);
    }

    // Verificar si ya existe una métrica activa con este slug
    const existingMetric = await trackerRepository.getMetricBySlug(
      templateSlug,
      userId
    );
    if (existingMetric) {
      throw new Error(
        `Ya existe una métrica con el identificador "${templateSlug}"`
      );
    }

    // Obtener siguiente order_index
    const activeMetrics = await trackerService.getMetrics(userId);
    const nextOrderIndex =
      Math.max(...activeMetrics.map((m) => m.order_index), 0) + 1;

    const templateData: TrackerMetricInsert = {
      ...template,
      user_id: userId,
      order_index: nextOrderIndex,
    };

    return await trackerRepository.createMetricFromTemplate(
      userId,
      templateSlug,
      templateData
    );
  },

  /**
   * Obtiene estadísticas generales del tracker
   */
  getTrackerStats: async (userId: string = "default-user") => {
    const [metrics, recentEntries] = await Promise.all([
      trackerService.getMetrics(userId), // Solo métricas activas
      trackerRepository.getRecentEntries(userId, 100),
    ]);

    // Todas las métricas devueltas ya son activas
    const activeMetrics = metrics;

    // Calcular últimos 7 días de actividad
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return getDayKey(date);
    });

    const entriesByDay = last7Days.map((dayKey) => ({
      dayKey,
      entries: recentEntries.filter((entry) => entry.day_key === dayKey).length,
    }));

    return {
      totalMetrics: metrics.length,
      activeMetrics: activeMetrics.length,
      totalEntries: recentEntries.length,
      entriesByDay,
      lastEntryDate: recentEntries[0]?.recorded_at || null,
    };
  },
};

// El export ya está en la declaración const
