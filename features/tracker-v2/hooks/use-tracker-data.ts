import { dataService } from "@/shared/data/data-service";
import type {
  BaseTrackerEntry,
  TrackerDayData,
  TrackerMetricInsert,
  TrackerQuickActionInsert,
} from "@/shared/db/schema/tracker";
import { getDayKey } from "@/shared/utils/date-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ==================== QUERY KEYS ====================
export const trackerQueryKeys = {
  all: ["tracker"] as const,
  metrics: (userId?: string) =>
    [...trackerQueryKeys.all, "metrics", userId] as const,
  activeMetrics: (userId?: string) =>
    [...trackerQueryKeys.all, "metrics", "active", userId] as const,
  deletedMetrics: (userId?: string) =>
    [...trackerQueryKeys.all, "metrics", "deleted", userId] as const,
  availableTemplates: (userId?: string) =>
    [...trackerQueryKeys.all, "templates", "available", userId] as const,
  dayData: (userId: string, dayKey: string) =>
    [...trackerQueryKeys.all, "dayData", userId, dayKey] as const,
  todayData: (userId?: string) =>
    [...trackerQueryKeys.all, "todayData", userId] as const,
  metricProgress: (userId: string, metricId: string, days: number) =>
    [...trackerQueryKeys.all, "progress", userId, metricId, days] as const,
  metricHistory: (userId: string, metricId: string, days: number) =>
    [...trackerQueryKeys.all, "history", userId, metricId, days] as const,
  todaySummary: (userId?: string) =>
    [...trackerQueryKeys.all, "summary", "today", userId] as const,
  daySummary: (userId: string, dayKey: string) =>
    [...trackerQueryKeys.all, "summary", "day", userId, dayKey] as const,
  stats: (userId?: string) =>
    [...trackerQueryKeys.all, "stats", userId] as const,
};

// ==================== METRICS HOOKS ====================

/**
 * Hook para obtener todas las métricas activas con quick actions
 */
export const useActiveMetrics = (userId: string) => {
  return useQuery({
    queryKey: trackerQueryKeys.activeMetrics(userId),
    queryFn: () => dataService.tracker.getActiveMetrics(userId),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
};

/**
 * Hook para obtener todas las métricas activas (no eliminadas)
 */
export const useAllMetrics = (userId: string) => {
  return useQuery({
    queryKey: trackerQueryKeys.metrics(userId),
    queryFn: () => dataService.tracker.getMetrics(userId),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
};

/**
 * Hook para obtener métricas eliminadas
 */
export const useDeletedMetrics = (userId: string) => {
  return useQuery({
    queryKey: trackerQueryKeys.deletedMetrics(userId),
    queryFn: () => dataService.tracker.getDeletedMetrics(userId),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
};

/**
 * Hook para crear una métrica personalizada
 */
export const useCreateMetric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      userId,
    }: {
      data: Omit<TrackerMetricInsert, "user_id" | "order_index">;
      userId: string;
    }) => dataService.tracker.createCustomMetric(data, userId),
    onSuccess: (_, { userId }) => {
      // Invalidar métricas para refrescar la lista
      queryClient.invalidateQueries({
        queryKey: trackerQueryKeys.metrics(userId),
      });
      queryClient.invalidateQueries({
        queryKey: trackerQueryKeys.activeMetrics(userId),
      });

      // Invalidar datos del día actual y de hoy para que aparezca la nueva métrica
      const today = getDayKey();
      queryClient.invalidateQueries({
        queryKey: trackerQueryKeys.dayData(userId, today),
      });
      queryClient.invalidateQueries({
        queryKey: trackerQueryKeys.todayData(userId),
      });

      // Invalidar cualquier dayData que pueda estar en cache
      queryClient.invalidateQueries({
        queryKey: [...trackerQueryKeys.all, "dayData", userId],
      });
    },
  });
};

/**
 * Hook para agregar métrica desde template
 */
export const useAddMetricFromTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateSlug,
      userId,
    }: {
      templateSlug: string;
      userId: string;
    }) => dataService.tracker.addMetricFromTemplate(templateSlug, userId),
    onSuccess: (_, { userId }) => {
      // Invalidar todas las queries de métricas
      queryClient.invalidateQueries({
        queryKey: trackerQueryKeys.metrics(userId),
      });
      queryClient.invalidateQueries({
        queryKey: trackerQueryKeys.activeMetrics(userId),
      });
      queryClient.invalidateQueries({
        queryKey: trackerQueryKeys.availableTemplates(userId),
      });

      // Invalidar datos del día actual y de hoy para que aparezca la nueva métrica
      const today = getDayKey();
      queryClient.invalidateQueries({
        queryKey: trackerQueryKeys.dayData(userId, today),
      });
      queryClient.invalidateQueries({
        queryKey: trackerQueryKeys.todayData(userId),
      });

      // Invalidar cualquier dayData que pueda estar en cache
      queryClient.invalidateQueries({
        queryKey: [...trackerQueryKeys.all, "dayData", userId],
      });
    },
  });
};

/**
 * Hook para obtener templates disponibles
 */
export const useAvailableTemplates = (userId: string) => {
  return useQuery({
    queryKey: trackerQueryKeys.availableTemplates(userId),
    queryFn: () => dataService.tracker.getAvailableTemplates(userId),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para actualizar una métrica
 */
export const useUpdateMetric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      metricId,
      data,
    }: {
      metricId: string;
      data: Partial<TrackerMetricInsert>;
    }) => dataService.tracker.updateMetric(metricId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackerQueryKeys.all });
    },
  });
};

/**
 * Hook para eliminar una métrica (soft delete)
 */
export const useDeleteMetric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (metricId: string) =>
      dataService.tracker.deleteMetric(metricId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackerQueryKeys.all });
    },
  });
};

/**
 * Hook para restaurar una métrica eliminada
 */
export const useRestoreMetric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (metricId: string) =>
      dataService.tracker.restoreMetric(metricId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackerQueryKeys.all });
    },
  });
};

// ==================== QUICK ACTIONS HOOKS ====================

/**
 * Hook para crear una quick action
 */
export const useCreateQuickAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TrackerQuickActionInsert) =>
      dataService.tracker.createQuickAction(data),
    onSuccess: () => {
      // Invalidar métricas activas para refrescar quick actions
      queryClient.invalidateQueries({
        queryKey: trackerQueryKeys.activeMetrics(),
      });
    },
  });
};

/**
 * Hook para eliminar una quick action
 */
export const useDeleteQuickAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quickActionId: string) =>
      dataService.tracker.deleteQuickAction(quickActionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trackerQueryKeys.activeMetrics(),
      });
    },
  });
};

// ==================== ENTRIES HOOKS ====================

/**
 * Hook para agregar una entrada manual
 */
export const useAddEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      metricId,
      value,
      userId,
      notes,
      recordedAt,
      displayValue,
    }: {
      metricId: string;
      value: number;
      userId: string;
      notes?: string;
      recordedAt?: string;
      displayValue?: string;
    }) =>
      dataService.tracker.addEntry(
        metricId,
        value,
        userId,
        notes,
        recordedAt,
        displayValue
      ),
    onSuccess: (newEntry) => {
      // Invalidar day data del día de la entrada
      queryClient.invalidateQueries({
        queryKey: trackerQueryKeys.dayData(newEntry.user_id, newEntry.day_key),
      });

      // Si es hoy, invalidar también today data y summary
      const today = getDayKey();
      if (newEntry.day_key === today) {
        queryClient.invalidateQueries({
          queryKey: trackerQueryKeys.todayData(newEntry.user_id),
        });
        queryClient.invalidateQueries({
          queryKey: trackerQueryKeys.todaySummary(newEntry.user_id),
        });
      }

      // Invalidar progreso y historial de la métrica
      queryClient.invalidateQueries({
        queryKey: [
          ...trackerQueryKeys.all,
          "progress",
          newEntry.user_id,
          newEntry.metric_id,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          ...trackerQueryKeys.all,
          "history",
          newEntry.user_id,
          newEntry.metric_id,
        ],
      });
    },
  });
};

/**
 * Hook para agregar entrada desde quick action
 */
export const useAddEntryFromQuickAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quickActionId,
      userId,
      notes,
      recordedAt,
      slug,
    }: {
      quickActionId: string;
      userId: string;
      notes?: string;
      recordedAt?: string;
      slug?: string;
    }) =>
      dataService.tracker.addEntryFromQuickAction(
        quickActionId,
        userId,
        notes,
        recordedAt,
        slug
      ),
    onSuccess: (newEntry) => {
      // Misma invalidación que addEntry
      queryClient.invalidateQueries({
        queryKey: trackerQueryKeys.dayData(newEntry.user_id, newEntry.day_key),
      });

      const today = getDayKey();
      if (newEntry.day_key === today) {
        queryClient.invalidateQueries({
          queryKey: trackerQueryKeys.todayData(newEntry.user_id),
        });
        queryClient.invalidateQueries({
          queryKey: trackerQueryKeys.todaySummary(newEntry.user_id),
        });
      }

      queryClient.invalidateQueries({
        queryKey: [
          ...trackerQueryKeys.all,
          "progress",
          newEntry.user_id,
          newEntry.metric_id,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [
          ...trackerQueryKeys.all,
          "history",
          newEntry.user_id,
          newEntry.metric_id,
        ],
      });
    },
  });
};

/**
 * Hook para actualizar una entrada
 */
export const useUpdateEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entryId,
      value,
      userId,
      notes,
    }: {
      entryId: string;
      value: number;
      userId: string;
      notes?: string;
    }) => dataService.tracker.updateEntry(entryId, value, userId, notes),
    onSuccess: (updatedEntry) => {
      // Invalidar day data del día de la entrada
      queryClient.invalidateQueries({
        queryKey: trackerQueryKeys.dayData(
          updatedEntry.user_id,
          updatedEntry.day_key
        ),
      });

      const today = getDayKey();
      if (updatedEntry.day_key === today) {
        queryClient.invalidateQueries({
          queryKey: trackerQueryKeys.todayData(updatedEntry.user_id),
        });
        queryClient.invalidateQueries({
          queryKey: trackerQueryKeys.todaySummary(updatedEntry.user_id),
        });
      }

      queryClient.invalidateQueries({
        queryKey: [
          ...trackerQueryKeys.all,
          "progress",
          updatedEntry.user_id,
          updatedEntry.metric_id,
        ],
      });
    },
  });
};

/**
 * Hook para eliminar una entrada
 */
export const useDeleteEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId: string) => dataService.tracker.deleteEntry(entryId),
    onSuccess: () => {
      // Invalidar todas las queries relacionadas (no tenemos la info de la entry eliminada)
      queryClient.invalidateQueries({ queryKey: trackerQueryKeys.all });
    },
  });
};

// ==================== DAY DATA HOOKS ====================

/**
 * Hook para obtener datos de un día específico
 * Optimizado con caché agresivo para días pasados
 */
export const useDayData = (dayKey: string, userId: string) => {
  const today = getDayKey();
  const isToday = dayKey === today;
  const isPast = dayKey < today;

  return useQuery({
    queryKey: trackerQueryKeys.dayData(userId, dayKey),
    queryFn: () => dataService.tracker.getDayData(dayKey, userId),
    // Días pasados: caché infinito (no cambian)
    // Hoy: caché corto (cambia frecuentemente)
    staleTime: isPast ? Infinity : isToday ? 1000 * 30 : 1000 * 60 * 2,
    gcTime: isPast ? 1000 * 60 * 60 : 1000 * 60 * 5, // 1 hora para pasados, 5 min para otros
    // Mantener datos anteriores mientras carga (evita flash)
    placeholderData: (previousData) => previousData,
    // Solo refetch en focus si es hoy
    refetchOnWindowFocus: isToday,
  });
};

/**
 * Hook para obtener datos de hoy
 */
export const useTodayData = (userId: string) => {
  return useQuery({
    queryKey: trackerQueryKeys.todayData(userId),
    queryFn: () => dataService.tracker.getTodayData(userId),
    staleTime: 1000 * 30, // 30 segundos (muy dinámico)
    gcTime: 1000 * 60 * 2, // 2 minutos
    refetchOnWindowFocus: true, // Refrescar cuando vuelve a la app
  });
};

/**
 * Hook para obtener resumen del día de hoy
 */
export const useTodaySummary = (userId: string) => {
  return useQuery({
    queryKey: trackerQueryKeys.todaySummary(userId),
    queryFn: () => dataService.tracker.getTodaySummary(userId),
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 2, // 2 minutos
    refetchOnWindowFocus: true,
  });
};

/**
 * Hook para obtener resumen de cualquier día específico
 */
export const useDayDataSummary = (dayKey: string, userId: string) => {
  return useQuery({
    queryKey: trackerQueryKeys.daySummary(userId, dayKey),
    queryFn: () => dataService.tracker.getDayDataSummary(dayKey, userId),
    staleTime: 1000 * 60 * 5, // 5 minutos (datos históricos cambian menos)
    gcTime: 1000 * 60 * 10, // 10 minutos
    refetchOnWindowFocus: dayKey === getDayKey(), // Solo refrescar si es hoy
  });
};

// ==================== ANALYTICS HOOKS ====================

/**
 * Hook para obtener progreso de una métrica
 */
export const useMetricProgress = (
  metricId: string,
  days: number = 7,
  userId: string
) => {
  return useQuery({
    queryKey: trackerQueryKeys.metricProgress(userId, metricId, days),
    queryFn: () =>
      dataService.tracker.getMetricProgress(metricId, days, userId),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    enabled: !!metricId, // Solo ejecutar si tenemos metricId
  });
};

/**
 * Hook para obtener historial de una métrica
 */
export const useMetricHistory = (
  metricId: string,
  days: number = 30,
  userId: string
) => {
  return useQuery({
    queryKey: trackerQueryKeys.metricHistory(userId, metricId, days),
    queryFn: () => dataService.tracker.getMetricHistory(metricId, days, userId),
    staleTime: 1000 * 60 * 10, // 10 minutos (datos históricos cambian poco)
    gcTime: 1000 * 60 * 30, // 30 minutos
    enabled: !!metricId,
  });
};

/**
 * Hook para estadísticas generales del tracker
 */
export const useTrackerStats = (userId: string) => {
  return useQuery({
    queryKey: trackerQueryKeys.stats(userId),
    queryFn: () => dataService.tracker.getTrackerStats(userId),
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 30, // 30 minutos
  });
};

// ==================== UTILITY HOOKS ====================

/**
 * Hook personalizado para invalidar todas las queries del tracker
 */
export const useInvalidateTrackerQueries = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: trackerQueryKeys.all });
  };
};

/**
 * Hook para optimistic updates (para UX más responsiva)
 */
export const useOptimisticEntry = () => {
  const queryClient = useQueryClient();

  const addOptimisticEntry = (
    userId: string,
    dayKey: string,
    metricId: string,
    tempEntry: Partial<BaseTrackerEntry>
  ) => {
    queryClient.setQueryData<TrackerDayData>(
      trackerQueryKeys.dayData(userId, dayKey),
      (oldData) => {
        if (!oldData) return oldData;

        const metricIndex = oldData.metrics.findIndex((m) => m.id === metricId);
        if (metricIndex === -1) return oldData;

        const newEntry: BaseTrackerEntry = {
          id: `temp-${Date.now()}`,
          user_id: userId,
          metric_id: metricId,
          value: tempEntry.value || 0,
          value_normalized: tempEntry.value_normalized || 0,
          unit: tempEntry.unit || "",
          day_key: dayKey,
          recorded_at: new Date().toISOString(),
          source: "manual",
          notes: null,
          meta: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          display_value: tempEntry.display_value || null,
          raw_input: tempEntry.raw_input || null,
          ...tempEntry,
        };

        const updatedMetric = {
          ...oldData.metrics[metricIndex],
          entries: [newEntry, ...oldData.metrics[metricIndex].entries],
        };

        const newMetrics = [...oldData.metrics];
        newMetrics[metricIndex] = updatedMetric;

        return {
          ...oldData,
          metrics: newMetrics,
        };
      }
    );
  };

  return { addOptimisticEntry };
};
