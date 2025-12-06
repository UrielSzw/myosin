import { dataService } from "@/shared/data/data-service";
import { getDayKey } from "@/shared/utils/date-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ==================== QUERY KEYS ====================
export const macroQueryKeys = {
  all: ["macros"] as const,
  target: (userId: string) =>
    [...macroQueryKeys.all, "target", userId] as const,
  dayData: (userId: string, dayKey: string) =>
    [...macroQueryKeys.all, "dayData", userId, dayKey] as const,
  todayData: (userId: string) =>
    [...macroQueryKeys.all, "todayData", userId] as const,
  quickActions: (userId: string) =>
    [...macroQueryKeys.all, "quickActions", userId] as const,
  stats: (userId: string, days: number) =>
    [...macroQueryKeys.all, "stats", userId, days] as const,
  hasTargets: (userId: string) =>
    [...macroQueryKeys.all, "hasTargets", userId] as const,
};

// ==================== TARGET HOOKS ====================

/**
 * Hook to get active macro targets
 */
export const useMacroTarget = (userId: string) => {
  return useQuery({
    queryKey: macroQueryKeys.target(userId),
    queryFn: () => dataService.macros.getActiveTarget(userId),
    staleTime: 1000 * 60 * 30, // 30 minutes (targets don't change often)
    gcTime: 1000 * 60 * 60, // 1 hour
    enabled: !!userId,
  });
};

/**
 * Hook to check if user has targets
 */
export const useHasMacroTargets = (userId: string) => {
  return useQuery({
    queryKey: macroQueryKeys.hasTargets(userId),
    queryFn: () => dataService.macros.hasTargets(userId),
    staleTime: 1000 * 60 * 30,
    enabled: !!userId,
  });
};

/**
 * Hook to set macro targets
 */
export const useSetMacroTargets = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      protein,
      carbs,
      fats,
      userId,
      name,
    }: {
      protein: number;
      carbs: number;
      fats: number;
      userId: string;
      name?: string;
    }) => dataService.macros.setTargets(protein, carbs, fats, userId, name),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: macroQueryKeys.target(userId),
      });
      queryClient.invalidateQueries({
        queryKey: macroQueryKeys.hasTargets(userId),
      });
      // Invalidate day data to refresh progress bars
      queryClient.invalidateQueries({
        queryKey: [...macroQueryKeys.all, "dayData", userId],
      });
      queryClient.invalidateQueries({
        queryKey: macroQueryKeys.todayData(userId),
      });
    },
  });
};

/**
 * Hook to update macro targets
 */
export const useUpdateMacroTargets = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      targetId,
      protein,
      carbs,
      fats,
      userId,
    }: {
      targetId: string;
      protein: number;
      carbs: number;
      fats: number;
      userId: string;
    }) =>
      dataService.macros.updateTargets(targetId, protein, carbs, fats, userId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: macroQueryKeys.target(userId),
      });
      queryClient.invalidateQueries({
        queryKey: [...macroQueryKeys.all, "dayData", userId],
      });
      queryClient.invalidateQueries({
        queryKey: macroQueryKeys.todayData(userId),
      });
    },
  });
};

// ==================== DAY DATA HOOKS ====================

/**
 * Hook to get macro data for a specific day
 */
export const useMacroDayData = (dayKey: string, userId: string) => {
  return useQuery({
    queryKey: macroQueryKeys.dayData(userId, dayKey),
    queryFn: () => dataService.macros.getDayData(dayKey, userId),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5,
    enabled: !!userId && !!dayKey,
  });
};

/**
 * Hook to get today's macro data
 */
export const useMacroTodayData = (userId: string) => {
  return useQuery({
    queryKey: macroQueryKeys.todayData(userId),
    queryFn: () => dataService.macros.getTodayData(userId),
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
    enabled: !!userId,
  });
};

// ==================== ENTRY HOOKS ====================

/**
 * Hook to add macro entry manually
 */
export const useAddMacroEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      protein,
      carbs,
      fats,
      userId,
      label,
      notes,
      recordedAt,
    }: {
      protein: number;
      carbs: number;
      fats: number;
      userId: string;
      label?: string;
      notes?: string;
      recordedAt?: string;
    }) =>
      dataService.macros.addEntry(protein, carbs, fats, userId, {
        label,
        notes,
        recordedAt,
      }),
    onSuccess: (entry, { userId }) => {
      // Invalidate day data
      queryClient.invalidateQueries({
        queryKey: macroQueryKeys.dayData(userId, entry.day_key),
      });

      // If today, invalidate today data too
      const today = getDayKey();
      if (entry.day_key === today) {
        queryClient.invalidateQueries({
          queryKey: macroQueryKeys.todayData(userId),
        });
      }

      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: [...macroQueryKeys.all, "stats", userId],
      });
    },
  });
};

/**
 * Hook to add entry from quick action
 */
export const useAddMacroFromQuickAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quickActionId,
      userId,
      recordedAt,
    }: {
      quickActionId: string;
      userId: string;
      recordedAt?: string;
    }) =>
      dataService.macros.addEntryFromQuickAction(
        quickActionId,
        userId,
        recordedAt
      ),
    onSuccess: (entry, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: macroQueryKeys.dayData(userId, entry.day_key),
      });

      const today = getDayKey();
      if (entry.day_key === today) {
        queryClient.invalidateQueries({
          queryKey: macroQueryKeys.todayData(userId),
        });
      }

      queryClient.invalidateQueries({
        queryKey: [...macroQueryKeys.all, "stats", userId],
      });
    },
  });
};

/**
 * Hook to update macro entry
 */
export const useUpdateMacroEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entryId,
      protein,
      carbs,
      fats,
      userId,
      label,
    }: {
      entryId: string;
      protein: number;
      carbs: number;
      fats: number;
      userId: string;
      label?: string;
    }) =>
      dataService.macros.updateEntry(
        entryId,
        protein,
        carbs,
        fats,
        userId,
        label
      ),
    onSuccess: (entry, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: macroQueryKeys.dayData(userId, entry.day_key),
      });

      const today = getDayKey();
      if (entry.day_key === today) {
        queryClient.invalidateQueries({
          queryKey: macroQueryKeys.todayData(userId),
        });
      }
    },
  });
};

/**
 * Hook to delete macro entry
 */
export const useDeleteMacroEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entryId, userId }: { entryId: string; userId: string }) =>
      dataService.macros.deleteEntry(entryId, userId),
    onSuccess: (_, { userId }) => {
      // Invalidate all day data since we don't know which day
      queryClient.invalidateQueries({
        queryKey: [...macroQueryKeys.all, "dayData", userId],
      });
      queryClient.invalidateQueries({
        queryKey: macroQueryKeys.todayData(userId),
      });
      queryClient.invalidateQueries({
        queryKey: [...macroQueryKeys.all, "stats", userId],
      });
    },
  });
};

// ==================== QUICK ACTION HOOKS ====================

/**
 * Hook to get quick actions
 */
export const useMacroQuickActions = (userId: string) => {
  return useQuery({
    queryKey: macroQueryKeys.quickActions(userId),
    queryFn: () => dataService.macros.getQuickActions(userId),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30,
    enabled: !!userId,
  });
};

/**
 * Hook to initialize quick actions
 */
export const useInitializeMacroQuickActions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      dataService.macros.initializeQuickActions(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({
        queryKey: macroQueryKeys.quickActions(userId),
      });
    },
  });
};

/**
 * Hook to create custom quick action
 */
export const useCreateMacroQuickAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      label,
      protein,
      carbs,
      fats,
      userId,
    }: {
      label: string;
      protein: number;
      carbs: number;
      fats: number;
      userId: string;
    }) =>
      dataService.macros.createQuickAction(label, protein, carbs, fats, userId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: macroQueryKeys.quickActions(userId),
      });
    },
  });
};

/**
 * Hook to delete quick action
 */
export const useDeleteMacroQuickAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quickActionId,
      userId,
    }: {
      quickActionId: string;
      userId: string;
    }) => dataService.macros.deleteQuickAction(quickActionId, userId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: macroQueryKeys.quickActions(userId),
      });
    },
  });
};

// ==================== ANALYTICS HOOKS ====================

/**
 * Hook to get macro stats
 */
export const useMacroStats = (userId: string, days: number = 7) => {
  return useQuery({
    queryKey: macroQueryKeys.stats(userId, days),
    queryFn: () => dataService.macros.getStats(userId, days),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15,
    enabled: !!userId,
  });
};

// ==================== UTILITY HOOKS ====================

/**
 * Hook to invalidate all macro queries
 */
export const useInvalidateMacroQueries = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: macroQueryKeys.all });
  };
};

/**
 * Combined hook for macro card data
 * Returns day data + quick actions in one call
 */
export const useMacroCardData = (dayKey: string, userId: string) => {
  const dayDataQuery = useMacroDayData(dayKey, userId);
  const quickActionsQuery = useMacroQuickActions(userId);

  return {
    dayData: dayDataQuery.data,
    quickActions: quickActionsQuery.data || [],
    isLoading: dayDataQuery.isLoading || quickActionsQuery.isLoading,
    error: dayDataQuery.error || quickActionsQuery.error,
    refetch: () => {
      dayDataQuery.refetch();
      quickActionsQuery.refetch();
    },
  };
};
