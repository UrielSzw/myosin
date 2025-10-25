import { and, desc, eq, sql } from "drizzle-orm";
import {
  PREDEFINED_METRIC_TEMPLATES,
  PREDEFINED_QUICK_ACTION_TEMPLATES,
  getQuickActionTemplates,
} from "../../../features/tracker/constants/templates";

import { getDayKey, getFullTimestamp } from "../../utils/date-utils";
import { db } from "../client";
import {
  BaseTrackerDailyAggregate,
  BaseTrackerEntry,
  BaseTrackerMetric,
  BaseTrackerQuickAction,
  TrackerDailyAggregateInsert,
  TrackerDayData,
  TrackerEntryInsert,
  TrackerMetricInsert,
  TrackerMetricWithQuickActions,
  TrackerQuickActionInsert,
  tracker_daily_aggregates,
  tracker_entries,
  tracker_metrics,
  tracker_quick_actions,
} from "../schema/tracker";
import { generateUUID } from "../utils/uuid";

// Utility para convertir valor a normalizado
const normalizeValue = (
  value: number,
  conversionFactor: number = 1
): number => {
  return value * conversionFactor;
};

export const trackerRepository = {
  // ==================== METRICS ====================

  /**
   * Obtiene todas las métricas de un usuario (incluyendo eliminadas)
   */
  getAllMetrics: async (
    userId: string = "default-user"
  ): Promise<BaseTrackerMetric[]> => {
    const rows = await db
      .select()
      .from(tracker_metrics)
      .where(eq(tracker_metrics.user_id, userId))
      .orderBy(tracker_metrics.order_index, tracker_metrics.created_at);

    return rows;
  },

  /**
   * Obtiene todas las métricas activas de un usuario (no eliminadas)
   */
  getMetrics: async (
    userId: string = "default-user"
  ): Promise<BaseTrackerMetric[]> => {
    const rows = await db
      .select()
      .from(tracker_metrics)
      .where(
        and(
          eq(tracker_metrics.user_id, userId),
          sql`${tracker_metrics.deleted_at} IS NULL`
        )
      )
      .orderBy(tracker_metrics.order_index, tracker_metrics.created_at);

    return rows;
  },

  /**
   * Obtiene métricas eliminadas que pueden ser restauradas
   */
  getDeletedMetrics: async (
    userId: string = "default-user"
  ): Promise<BaseTrackerMetric[]> => {
    const rows = await db
      .select()
      .from(tracker_metrics)
      .where(
        and(
          eq(tracker_metrics.user_id, userId),
          sql`${tracker_metrics.deleted_at} IS NOT NULL`
        )
      )
      .orderBy(desc(tracker_metrics.deleted_at));

    return rows;
  },

  /**
   * Obtiene una métrica específica por ID (solo activas por defecto)
   */
  getMetricById: async (
    id: string,
    includeDeleted: boolean = false
  ): Promise<BaseTrackerMetric | null> => {
    const whereConditions = [eq(tracker_metrics.id, id)];

    if (!includeDeleted) {
      whereConditions.push(sql`${tracker_metrics.deleted_at} IS NULL`);
    }

    const row = await db
      .select()
      .from(tracker_metrics)
      .where(and(...whereConditions))
      .limit(1);

    return row[0] || null;
  },

  /**
   * Obtiene una métrica por slug (solo activas por defecto)
   */
  getMetricBySlug: async (
    slug: string,
    userId: string = "default-user",
    includeDeleted: boolean = false
  ): Promise<BaseTrackerMetric | null> => {
    const whereConditions = [
      eq(tracker_metrics.slug, slug),
      eq(tracker_metrics.user_id, userId),
    ];

    if (!includeDeleted) {
      whereConditions.push(sql`${tracker_metrics.deleted_at} IS NULL`);
    }

    const row = await db
      .select()
      .from(tracker_metrics)
      .where(and(...whereConditions))
      .limit(1);

    return row[0] || null;
  },

  /**
   * Verifica si existe una métrica activa con el slug dado
   */
  metricExistsBySlug: async (
    slug: string,
    userId: string = "default-user"
  ): Promise<boolean> => {
    const metric = await trackerRepository.getMetricBySlug(slug, userId, false);
    return metric !== null;
  },

  /**
   * Obtiene métricas activas con sus quick actions (solo para métricas numéricas)
   */
  getActiveMetricsWithQuickActions: async (
    userId: string = "default-user"
  ): Promise<TrackerMetricWithQuickActions[]> => {
    const metrics = await db
      .select()
      .from(tracker_metrics)
      .where(
        and(
          eq(tracker_metrics.user_id, userId),
          sql`${tracker_metrics.deleted_at} IS NULL` // Activas = no eliminadas
        )
      )
      .orderBy(tracker_metrics.order_index, tracker_metrics.created_at);

    // Fetch quick actions para cada métrica
    const metricsWithActions = await Promise.all(
      metrics.map(async (metric) => {
        const quickActions = await db
          .select()
          .from(tracker_quick_actions)
          .where(eq(tracker_quick_actions.metric_id, metric.id))
          .orderBy(tracker_quick_actions.position);

        return {
          ...metric,
          quick_actions: quickActions,
        };
      })
    );

    return metricsWithActions;
  },

  /**
   * Crea una nueva métrica
   */
  createMetric: async (
    data: TrackerMetricInsert
  ): Promise<BaseTrackerMetric> => {
    const id = generateUUID();
    const [inserted] = await db
      .insert(tracker_metrics)
      .values({ id, ...data })
      .returning();

    return inserted;
  },

  /**
   * Actualiza una métrica
   */
  updateMetric: async (
    id: string,
    data: Partial<TrackerMetricInsert>
  ): Promise<BaseTrackerMetric> => {
    const [updated] = await db
      .update(tracker_metrics)
      .set({ ...data, updated_at: new Date() })
      .where(eq(tracker_metrics.id, id))
      .returning();

    return updated;
  },

  /**
   * Actualiza el orden de múltiples métricas
   */
  reorderMetrics: async (
    metricOrders: { id: string; order_index: number }[]
  ): Promise<void> => {
    // Actualizar orden en batch
    for (const { id, order_index } of metricOrders) {
      await db
        .update(tracker_metrics)
        .set({ order_index, updated_at: new Date() })
        .where(eq(tracker_metrics.id, id));
    }
  },

  /**
   * Elimina una métrica (soft delete)
   */
  deleteMetric: async (id: string): Promise<BaseTrackerMetric> => {
    const [updated] = await db
      .update(tracker_metrics)
      .set({
        deleted_at: new Date().toISOString(),
        updated_at: new Date(),
      })
      .where(eq(tracker_metrics.id, id))
      .returning();

    return updated;
  },

  /**
   * Reactiva una métrica eliminada
   */
  restoreMetric: async (id: string): Promise<BaseTrackerMetric> => {
    const [updated] = await db
      .update(tracker_metrics)
      .set({
        deleted_at: null,
        updated_at: new Date(),
      })
      .where(eq(tracker_metrics.id, id))
      .returning();

    return updated;
  },

  /**
   * Elimina permanentemente una métrica (hard delete)
   * CUIDADO: Esto eliminará entries y quick actions por cascade
   */
  permanentlyDeleteMetric: async (id: string): Promise<void> => {
    await db.delete(tracker_metrics).where(eq(tracker_metrics.id, id));
  },

  // ==================== QUICK ACTIONS ====================

  /**
   * Obtiene quick actions de una métrica
   */
  getQuickActions: async (
    metricId: string
  ): Promise<BaseTrackerQuickAction[]> => {
    return await db
      .select()
      .from(tracker_quick_actions)
      .where(eq(tracker_quick_actions.metric_id, metricId))
      .orderBy(tracker_quick_actions.position);
  },

  /**
   * Crea una quick action
   */
  createQuickAction: async (
    data: TrackerQuickActionInsert
  ): Promise<BaseTrackerQuickAction> => {
    const id = generateUUID();

    // Pre-calcular valor normalizado si tenemos la métrica
    let valueNormalized = data.value_normalized;
    if (!valueNormalized) {
      const metric = await db
        .select({ conversion_factor: tracker_metrics.conversion_factor })
        .from(tracker_metrics)
        .where(eq(tracker_metrics.id, data.metric_id))
        .limit(1);

      if (metric[0]) {
        valueNormalized = normalizeValue(
          data.value,
          metric[0].conversion_factor || 1
        );
      }
    }

    const [inserted] = await db
      .insert(tracker_quick_actions)
      .values({
        id,
        ...data,
        value_normalized: valueNormalized,
      })
      .returning();

    return inserted;
  },

  /**
   * Elimina una quick action
   */
  deleteQuickAction: async (id: string): Promise<void> => {
    await db
      .delete(tracker_quick_actions)
      .where(eq(tracker_quick_actions.id, id));
  },

  // ==================== ENTRIES ====================

  /**
   * Crear entrada con display value generado automáticamente
   */
  createEntryWithDisplay: async (data: {
    metricId: string;
    value: number;
    userId?: string;
    notes?: string;
    recordedAt?: string;
    rawInput?: any;
  }): Promise<BaseTrackerEntry> => {
    // Get metric to determine input type and generate display value
    const metric = await trackerRepository.getMetricById(data.metricId);
    if (!metric) {
      throw new Error(`Metric not found: ${data.metricId}`);
    }

    // Generate display value based on input type
    let displayValue = "";
    const normalizedValue = normalizeValue(
      data.value,
      metric.conversion_factor || 1
    );

    switch (metric.input_type) {
      case "scale_discrete":
        // For scale metrics, display value comes from inputConfig (hardcoded in PREDEFINED_METRICS)
        if (metric.slug === "mood") {
          const labels = [
            "Frown Terrible",
            "Meh Malo",
            "Minus Normal",
            "Smile Bueno",
            "Laugh Excelente",
          ];
          displayValue = labels[data.value - 1] || `${data.value}`;
        } else if (metric.slug === "energy") {
          const labels = [
            "BatteryLow Agotado",
            "BatteryLow Muy bajo",
            "BatteryLow Bajo",
            "Battery Regular",
            "Battery Normal",
            "Battery Bueno",
            "BatteryMedium Muy bueno",
            "BatteryHigh Alto",
            "BatteryFull Muy alto",
            "Zap Máximo",
          ];
          displayValue = labels[data.value - 1] || `${data.value}`;
        }
        break;

      case "boolean_toggle":
        if (metric.slug === "supplements") {
          displayValue =
            data.value === 1 ? "✅ Tomé suplementos" : "❌ No tomé";
        } else {
          displayValue = data.value === 1 ? "✅ Completado" : "❌ Pendiente";
        }
        break;

      default:
        // Numeric types
        displayValue = `${data.value}${metric.unit}`;
    }

    const dayKey = getDayKey(
      data.recordedAt ? new Date(getFullTimestamp(data.recordedAt)) : undefined
    );

    return trackerRepository.createEntry({
      user_id: data.userId || "default-user",
      metric_id: data.metricId,
      value: data.value,
      value_normalized: normalizedValue,
      unit: metric.unit,
      notes: data.notes || null,
      source: "manual",
      day_key: dayKey,
      recorded_at: getFullTimestamp(data.recordedAt),
      display_value: displayValue,
      raw_input: data.rawInput,
      meta: null,
    });
  },

  /**
   * Crear una entrada (registro de valor)
   */
  createEntry: async (data: TrackerEntryInsert): Promise<BaseTrackerEntry> => {
    // Obtener métrica para verificar behavior
    const metric = await trackerRepository.getMetricById(data.metric_id);
    if (!metric) {
      throw new Error(`Metric not found: ${data.metric_id}`);
    }

    // Asegurar que recorded_at sea un timestamp ISO completo
    const entryData = {
      ...data,
      recorded_at: getFullTimestamp(data.recorded_at),
    };

    // Si la métrica tiene behavior "replace", buscar entrada existente del mismo día
    if (metric.behavior === "replace") {
      const existingEntry = await db
        .select()
        .from(tracker_entries)
        .where(
          and(
            eq(tracker_entries.user_id, data.user_id || "default-user"),
            eq(tracker_entries.metric_id, data.metric_id),
            eq(tracker_entries.day_key, data.day_key)
          )
        )
        .limit(1);

      if (existingEntry[0]) {
        // Reemplazar entrada existente
        const [updated] = await db
          .update(tracker_entries)
          .set({ ...entryData, updated_at: new Date() })
          .where(eq(tracker_entries.id, existingEntry[0].id))
          .returning();

        // Recalcular agregado del día
        await trackerRepository.recalculateDailyAggregate(
          data.user_id || "default-user",
          data.metric_id,
          data.day_key
        );

        return updated;
      }
    }

    // Comportamiento normal (accumulate o primera entrada de replace)
    const id = generateUUID();
    const [inserted] = await db
      .insert(tracker_entries)
      .values({ id, ...entryData })
      .returning();

    // Recalcular agregado del día
    await trackerRepository.recalculateDailyAggregate(
      data.user_id || "default-user",
      data.metric_id,
      data.day_key
    );

    return inserted;
  },

  /**
   * Crear entrada a partir de quick action
   */
  createEntryFromQuickAction: async (
    quickActionId: string,
    userId: string = "default-user",
    notes?: string,
    recordedAt?: string,
    slug?: string
  ): Promise<BaseTrackerEntry> => {
    let qa: any = null;
    let metric: any = null;

    // Si viene slug, intentar buscar en quick actions predefinidas primero
    if (slug) {
      const predefinedActions = PREDEFINED_QUICK_ACTION_TEMPLATES[slug] || [];
      const predefinedQA = predefinedActions.find(
        (action) => action.id === quickActionId
      );

      if (predefinedQA) {
        // Buscar la métrica real del usuario por slug
        metric = await trackerRepository.getMetricBySlug(slug, userId);
        if (!metric) {
          throw new Error(`Metric with slug ${slug} not found for user`);
        }

        // Crear objeto qa compatible con el resto del código
        qa = {
          value: predefinedQA.value,
          value_normalized:
            predefinedQA.value * (metric.conversion_factor || 1),
        };
      }
    }

    // Fallback: buscar en DB si no encontró en predefinidas o no viene slug
    if (!qa) {
      const quickActionData = await db
        .select({
          qa: tracker_quick_actions,
          metric: tracker_metrics,
        })
        .from(tracker_quick_actions)
        .innerJoin(
          tracker_metrics,
          eq(tracker_quick_actions.metric_id, tracker_metrics.id)
        )
        .where(eq(tracker_quick_actions.id, quickActionId))
        .limit(1);

      if (!quickActionData[0]) {
        throw new Error(`Quick action ${quickActionId} not found`);
      }

      const dbResult = quickActionData[0];
      qa = dbResult.qa;
      metric = dbResult.metric;
    }

    const dayKey = getDayKey(
      recordedAt ? new Date(getFullTimestamp(recordedAt)) : undefined
    );

    const entryData: TrackerEntryInsert = {
      user_id: userId,
      metric_id: metric.id,
      value: qa.value,
      value_normalized:
        qa.value_normalized ||
        normalizeValue(qa.value, metric.conversion_factor || 1),
      unit: metric.unit,
      day_key: dayKey,
      recorded_at: getFullTimestamp(recordedAt),
      source: "quick_action",
      notes: notes || null,
      meta: null,
      display_value: null, // Can be enhanced later
      raw_input: null,
    };

    return await trackerRepository.createEntry(entryData);
  },

  /**
   * Obtiene entradas de un día específico
   */
  getEntriesByDay: async (
    userId: string,
    dayKey: string,
    metricId?: string
  ): Promise<BaseTrackerEntry[]> => {
    let query = db
      .select()
      .from(tracker_entries)
      .where(
        and(
          eq(tracker_entries.user_id, userId),
          eq(tracker_entries.day_key, dayKey)
        )
      );

    if (metricId) {
      query = db
        .select()
        .from(tracker_entries)
        .where(
          and(
            eq(tracker_entries.user_id, userId),
            eq(tracker_entries.day_key, dayKey),
            eq(tracker_entries.metric_id, metricId)
          )
        );
    }

    return await query.orderBy(desc(tracker_entries.recorded_at));
  },

  /**
   * Obtiene entradas recientes (útil para historial)
   */
  getRecentEntries: async (
    userId: string = "default-user",
    limit: number = 50
  ): Promise<BaseTrackerEntry[]> => {
    return await db
      .select()
      .from(tracker_entries)
      .where(eq(tracker_entries.user_id, userId))
      .orderBy(desc(tracker_entries.recorded_at))
      .limit(limit);
  },

  /**
   * Actualiza una entrada
   */
  updateEntry: async (
    id: string,
    data: Partial<TrackerEntryInsert>
  ): Promise<BaseTrackerEntry> => {
    // Normalizar recorded_at si viene en los datos
    const normalizedData = {
      ...data,
      updated_at: new Date(),
      ...(data.recorded_at && {
        recorded_at: getFullTimestamp(data.recorded_at),
      }),
    };

    const [updated] = await db
      .update(tracker_entries)
      .set(normalizedData)
      .where(eq(tracker_entries.id, id))
      .returning();

    // Si cambió el valor, recalcular agregado
    if (data.value !== undefined || data.value_normalized !== undefined) {
      const entry = await db
        .select({
          user_id: tracker_entries.user_id,
          metric_id: tracker_entries.metric_id,
          day_key: tracker_entries.day_key,
        })
        .from(tracker_entries)
        .where(eq(tracker_entries.id, id))
        .limit(1);

      if (entry[0]) {
        await trackerRepository.recalculateDailyAggregate(
          entry[0].user_id,
          entry[0].metric_id,
          entry[0].day_key
        );
      }
    }

    return updated;
  },

  /**
   * Elimina una entrada
   */
  deleteEntry: async (id: string): Promise<void> => {
    // Obtener info antes de eliminar para recalcular agregado
    const entry = await db
      .select({
        user_id: tracker_entries.user_id,
        metric_id: tracker_entries.metric_id,
        day_key: tracker_entries.day_key,
      })
      .from(tracker_entries)
      .where(eq(tracker_entries.id, id))
      .limit(1);

    await db.delete(tracker_entries).where(eq(tracker_entries.id, id));

    // Recalcular agregado
    if (entry[0]) {
      await trackerRepository.recalculateDailyAggregate(
        entry[0].user_id,
        entry[0].metric_id,
        entry[0].day_key
      );
    }
  },

  // ==================== DAILY AGGREGATES ====================

  /**
   * Obtiene agregado diario
   */
  getDailyAggregate: async (
    userId: string,
    metricId: string,
    dayKey: string
  ): Promise<BaseTrackerDailyAggregate | null> => {
    const rows = await db
      .select()
      .from(tracker_daily_aggregates)
      .where(
        and(
          eq(tracker_daily_aggregates.user_id, userId),
          eq(tracker_daily_aggregates.metric_id, metricId),
          eq(tracker_daily_aggregates.day_key, dayKey)
        )
      )
      .limit(1);

    return rows[0] || null;
  },

  /**
   * Recalcula agregado diario a partir de entradas
   */
  recalculateDailyAggregate: async (
    userId: string,
    metricId: string,
    dayKey: string
  ): Promise<BaseTrackerDailyAggregate> => {
    // Obtener métrica para verificar behavior
    const metric = await trackerRepository.getMetricById(metricId);
    if (!metric) {
      throw new Error(`Metric not found: ${metricId}`);
    }

    // Obtener todas las entradas del día ordenadas por fecha de creación
    const entries = await db
      .select()
      .from(tracker_entries)
      .where(
        and(
          eq(tracker_entries.user_id, userId),
          eq(tracker_entries.metric_id, metricId),
          eq(tracker_entries.day_key, dayKey)
        )
      )
      .orderBy(desc(tracker_entries.recorded_at));

    // Calcular estadísticas según el behavior de la métrica
    let count, sumNormalized, minNormalized, maxNormalized, avgNormalized;

    if (metric.behavior === "replace") {
      // Para métricas "replace": solo importa el último valor
      if (entries.length > 0) {
        const latestEntry = entries[0]; // Ya ordenado por recorded_at desc
        count = 1;
        sumNormalized = latestEntry.value_normalized;
        minNormalized = latestEntry.value_normalized;
        maxNormalized = latestEntry.value_normalized;
        avgNormalized = latestEntry.value_normalized;
      } else {
        count = 0;
        sumNormalized = 0;
        minNormalized = null;
        maxNormalized = null;
        avgNormalized = null;
      }
    } else {
      // Para métricas "accumulate": comportamiento original (suma)
      count = entries.length;
      sumNormalized = entries.reduce(
        (sum, entry) => sum + entry.value_normalized,
        0
      );
      const values = entries.map((e) => e.value_normalized);
      minNormalized = count > 0 ? Math.min(...values) : null;
      maxNormalized = count > 0 ? Math.max(...values) : null;
      avgNormalized = count > 0 ? sumNormalized / count : null;
    }

    // Obtener suma del día anterior para tendencia
    const previousDay = new Date(dayKey);
    previousDay.setDate(previousDay.getDate() - 1);
    const previousDayKey = getDayKey(previousDay);

    const previousAggregate = await trackerRepository.getDailyAggregate(
      userId,
      metricId,
      previousDayKey
    );

    const aggregateData: TrackerDailyAggregateInsert = {
      user_id: userId,
      metric_id: metricId,
      day_key: dayKey,
      sum_normalized: sumNormalized,
      count,
      min_normalized: minNormalized,
      max_normalized: maxNormalized,
      avg_normalized: avgNormalized,
      previous_day_sum: previousAggregate?.sum_normalized || null,
    };

    // Upsert del agregado
    const existing = await trackerRepository.getDailyAggregate(
      userId,
      metricId,
      dayKey
    );

    if (existing) {
      const [updated] = await db
        .update(tracker_daily_aggregates)
        .set({ ...aggregateData, updated_at: new Date() })
        .where(eq(tracker_daily_aggregates.id, existing.id))
        .returning();
      return updated;
    } else {
      const id = generateUUID();
      const [inserted] = await db
        .insert(tracker_daily_aggregates)
        .values({ id, ...aggregateData })
        .returning();
      return inserted;
    }
  },

  /**
   * Obtiene agregados de múltiples días (para gráficas, tendencias)
   */
  getDailyAggregatesRange: async (
    userId: string,
    metricId: string,
    startDate: string,
    endDate: string
  ): Promise<BaseTrackerDailyAggregate[]> => {
    return await db
      .select()
      .from(tracker_daily_aggregates)
      .where(
        and(
          eq(tracker_daily_aggregates.user_id, userId),
          eq(tracker_daily_aggregates.metric_id, metricId),
          sql`${tracker_daily_aggregates.day_key} >= ${startDate}`,
          sql`${tracker_daily_aggregates.day_key} <= ${endDate}`
        )
      )
      .orderBy(tracker_daily_aggregates.day_key);
  },

  // ==================== QUERIES COMPLEJAS ====================

  /**
   * Obtiene todas las métricas que estaban activas en una fecha específica
   * (no eliminadas o eliminadas después de esa fecha)
   */
  getActiveMetricsForDate: async (
    userId: string,
    dayKey: string
  ): Promise<TrackerMetricWithQuickActions[]> => {
    const metrics = await db
      .select()
      .from(tracker_metrics)
      .where(
        and(
          eq(tracker_metrics.user_id, userId),
          // Métrica activa en la fecha: created_at <= dayKey Y (deleted_at IS NULL O deleted_at > dayKey)
          sql`${tracker_metrics.created_at} <= ${dayKey + "T23:59:59"}`,
          sql`(${tracker_metrics.deleted_at} IS NULL OR ${
            tracker_metrics.deleted_at
          } > ${dayKey + "T23:59:59"})`
        )
      )
      .orderBy(tracker_metrics.order_index, tracker_metrics.created_at);

    // Fetch quick actions para cada métrica
    const metricsWithActions = await Promise.all(
      metrics.map(async (metric) => {
        const quickActions = await db
          .select()
          .from(tracker_quick_actions)
          .where(eq(tracker_quick_actions.metric_id, metric.id))
          .orderBy(tracker_quick_actions.position);

        return {
          ...metric,
          quick_actions: quickActions,
        };
      })
    );

    return metricsWithActions;
  },

  /**
   * Obtiene todos los datos de un día (métricas + entradas + agregados)
   */
  getDayData: async (
    userId: string,
    dayKey: string
  ): Promise<TrackerDayData> => {
    // Obtener métricas que estaban activas en la fecha específica
    const metrics = await trackerRepository.getActiveMetricsForDate(
      userId,
      dayKey
    );

    // Para cada métrica, obtener entradas y agregado del día
    const metricsWithDayData = await Promise.all(
      metrics.map(async (metric) => {
        const [entries, aggregate] = await Promise.all([
          trackerRepository.getEntriesByDay(userId, dayKey, metric.id),
          trackerRepository.getDailyAggregate(userId, metric.id, dayKey),
        ]);

        return {
          ...metric,
          entries,
          aggregate,
        };
      })
    );

    return {
      day_key: dayKey,
      metrics: metricsWithDayData,
    };
  },

  // ==================== UTILITIES ====================

  // ==================== TEMPLATES ====================

  /**
   * Obtiene todos los templates de métricas predefinidas
   */
  getPredefinedTemplates: () => {
    return PREDEFINED_METRIC_TEMPLATES;
  },

  /**
   * Obtiene templates que el usuario aún no ha agregado (solo considera métricas activas)
   */
  getAvailableTemplates: async (userId: string = "default-user") => {
    // Solo considerar métricas que no estén eliminadas
    const activeUserMetrics = await db
      .select({ slug: tracker_metrics.slug })
      .from(tracker_metrics)
      .where(
        and(
          eq(tracker_metrics.user_id, userId),
          sql`${tracker_metrics.deleted_at} IS NULL`
        )
      );

    const usedSlugs = activeUserMetrics.map((m) => m.slug);
    return PREDEFINED_METRIC_TEMPLATES.filter(
      (template) => !usedSlugs.includes(template.slug)
    );
  },

  /**
   * Crea una métrica desde un template predefinido (sin validaciones de negocio)
   */
  createMetricFromTemplate: async (
    userId: string,
    templateSlug: string,
    templateData: TrackerMetricInsert
  ): Promise<BaseTrackerMetric> => {
    // Crear métrica
    const metricData: TrackerMetricInsert = {
      ...templateData,
      user_id: userId,
    };

    const newMetric = await trackerRepository.createMetric(metricData);

    // Crear quick actions asociadas
    const quickActionTemplates = getQuickActionTemplates(templateSlug);
    for (const qaTemplate of quickActionTemplates) {
      const quickActionData: TrackerQuickActionInsert = {
        ...qaTemplate,
        metric_id: newMetric.id,
      };
      await trackerRepository.createQuickAction(quickActionData);
    }

    return newMetric;
  },
};

// El export ya está en la declaración const
