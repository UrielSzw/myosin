import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../client";
import {
  BaseMacroDailyAggregate,
  BaseMacroEntry,
  BaseMacroQuickAction,
  BaseMacroTarget,
  MacroDailyAggregateInsert,
  MacroDailyAggregateWithCalories,
  MacroDayData,
  MacroEntryInsert,
  MacroEntryWithCalories,
  MacroQuickActionInsert,
  MacroTargetInsert,
  MacroTargetWithCalories,
  calculateCalories,
  macro_daily_aggregates,
  macro_entries,
  macro_quick_actions,
  macro_targets,
} from "../schema/macros";
import { generateUUID } from "../utils/uuid";

// Helper to add calories to entry
const withCalories = (entry: BaseMacroEntry): MacroEntryWithCalories => ({
  ...entry,
  calories: calculateCalories(entry.protein, entry.carbs, entry.fats),
});

// Helper to add calories to aggregate
const aggregateWithCalories = (
  agg: BaseMacroDailyAggregate
): MacroDailyAggregateWithCalories => ({
  ...agg,
  total_calories: calculateCalories(
    agg.total_protein,
    agg.total_carbs,
    agg.total_fats
  ),
});

// Helper to add calories to target
const targetWithCalories = (
  target: BaseMacroTarget
): MacroTargetWithCalories => ({
  ...target,
  calories_target: calculateCalories(
    target.protein_target,
    target.carbs_target,
    target.fats_target
  ),
});

export const macroRepository = {
  // ==================== TARGETS ====================

  /**
   * Get active macro target for user
   */
  getActiveTarget: async (
    userId: string
  ): Promise<MacroTargetWithCalories | null> => {
    const rows = await db
      .select()
      .from(macro_targets)
      .where(
        and(
          eq(macro_targets.user_id, userId),
          eq(macro_targets.is_active, true)
        )
      )
      .limit(1);

    return rows[0] ? targetWithCalories(rows[0]) : null;
  },

  /**
   * Get all targets for user
   */
  getAllTargets: async (userId: string): Promise<MacroTargetWithCalories[]> => {
    const rows = await db
      .select()
      .from(macro_targets)
      .where(eq(macro_targets.user_id, userId))
      .orderBy(desc(macro_targets.is_active), macro_targets.created_at);

    return rows.map(targetWithCalories);
  },

  /**
   * Create or update macro target
   */
  upsertTarget: async (
    data: MacroTargetInsert
  ): Promise<MacroTargetWithCalories> => {
    // If setting as active, deactivate others first
    if (data.is_active) {
      await db
        .update(macro_targets)
        .set({ is_active: false, updated_at: new Date().toISOString() })
        .where(eq(macro_targets.user_id, data.user_id));
    }

    const id = generateUUID();
    const [inserted] = await db
      .insert(macro_targets)
      .values({ id, ...data })
      .returning();

    return targetWithCalories(inserted);
  },

  /**
   * Update target
   */
  updateTarget: async (
    id: string,
    data: Partial<MacroTargetInsert>
  ): Promise<MacroTargetWithCalories> => {
    // If setting as active, deactivate others first
    if (data.is_active && data.user_id) {
      await db
        .update(macro_targets)
        .set({ is_active: false, updated_at: new Date().toISOString() })
        .where(
          and(
            eq(macro_targets.user_id, data.user_id),
            sql`${macro_targets.id} != ${id}`
          )
        );
    }

    const [updated] = await db
      .update(macro_targets)
      .set({ ...data, updated_at: new Date().toISOString() })
      .where(eq(macro_targets.id, id))
      .returning();

    return targetWithCalories(updated);
  },

  /**
   * Delete target
   */
  deleteTarget: async (id: string): Promise<void> => {
    await db.delete(macro_targets).where(eq(macro_targets.id, id));
  },

  // ==================== ENTRIES ====================

  /**
   * Create a macro entry
   */
  createEntry: async (
    data: MacroEntryInsert
  ): Promise<MacroEntryWithCalories> => {
    const id = generateUUID();
    const [inserted] = await db
      .insert(macro_entries)
      .values({ id, ...data })
      .returning();

    // Recalculate daily aggregate
    await macroRepository.recalculateDailyAggregate(data.user_id, data.day_key);

    return withCalories(inserted);
  },

  /**
   * Update an entry
   */
  updateEntry: async (
    id: string,
    data: Partial<MacroEntryInsert>
  ): Promise<MacroEntryWithCalories> => {
    const [updated] = await db
      .update(macro_entries)
      .set({ ...data, updated_at: new Date().toISOString() })
      .where(eq(macro_entries.id, id))
      .returning();

    // Recalculate daily aggregate
    await macroRepository.recalculateDailyAggregate(
      updated.user_id,
      updated.day_key
    );

    return withCalories(updated);
  },

  /**
   * Delete an entry
   */
  deleteEntry: async (id: string): Promise<void> => {
    // Get entry info first
    const entry = await db
      .select()
      .from(macro_entries)
      .where(eq(macro_entries.id, id))
      .limit(1);

    if (!entry[0]) return;

    await db.delete(macro_entries).where(eq(macro_entries.id, id));

    // Recalculate daily aggregate
    await macroRepository.recalculateDailyAggregate(
      entry[0].user_id,
      entry[0].day_key
    );
  },

  /**
   * Get entry by ID
   */
  getEntryById: async (id: string): Promise<MacroEntryWithCalories | null> => {
    const rows = await db
      .select()
      .from(macro_entries)
      .where(eq(macro_entries.id, id))
      .limit(1);

    return rows[0] ? withCalories(rows[0]) : null;
  },

  /**
   * Get entries for a day
   */
  getEntriesByDay: async (
    userId: string,
    dayKey: string
  ): Promise<MacroEntryWithCalories[]> => {
    const rows = await db
      .select()
      .from(macro_entries)
      .where(
        and(
          eq(macro_entries.user_id, userId),
          eq(macro_entries.day_key, dayKey)
        )
      )
      .orderBy(desc(macro_entries.recorded_at));

    return rows.map(withCalories);
  },

  /**
   * Get recent entries
   */
  getRecentEntries: async (
    userId: string,
    limit: number = 50
  ): Promise<MacroEntryWithCalories[]> => {
    const rows = await db
      .select()
      .from(macro_entries)
      .where(eq(macro_entries.user_id, userId))
      .orderBy(desc(macro_entries.recorded_at))
      .limit(limit);

    return rows.map(withCalories);
  },

  // ==================== DAILY AGGREGATES ====================

  /**
   * Get daily aggregate
   */
  getDailyAggregate: async (
    userId: string,
    dayKey: string
  ): Promise<MacroDailyAggregateWithCalories | null> => {
    const rows = await db
      .select()
      .from(macro_daily_aggregates)
      .where(
        and(
          eq(macro_daily_aggregates.user_id, userId),
          eq(macro_daily_aggregates.day_key, dayKey)
        )
      )
      .limit(1);

    return rows[0] ? aggregateWithCalories(rows[0]) : null;
  },

  /**
   * Recalculate daily aggregate from entries
   */
  recalculateDailyAggregate: async (
    userId: string,
    dayKey: string
  ): Promise<MacroDailyAggregateWithCalories> => {
    // Get all entries for the day
    const entries = await db
      .select()
      .from(macro_entries)
      .where(
        and(
          eq(macro_entries.user_id, userId),
          eq(macro_entries.day_key, dayKey)
        )
      );

    // Calculate totals
    const totals = entries.reduce(
      (acc, entry) => ({
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fats: acc.fats + entry.fats,
      }),
      { protein: 0, carbs: 0, fats: 0 }
    );

    const aggregateData: MacroDailyAggregateInsert = {
      user_id: userId,
      day_key: dayKey,
      total_protein: totals.protein,
      total_carbs: totals.carbs,
      total_fats: totals.fats,
      entry_count: entries.length,
    };

    // Upsert aggregate
    const existing = await macroRepository.getDailyAggregate(userId, dayKey);

    if (existing) {
      const [updated] = await db
        .update(macro_daily_aggregates)
        .set({ ...aggregateData, updated_at: new Date().toISOString() })
        .where(eq(macro_daily_aggregates.id, existing.id))
        .returning();
      return aggregateWithCalories(updated);
    } else {
      const id = generateUUID();
      const [inserted] = await db
        .insert(macro_daily_aggregates)
        .values({ id, ...aggregateData })
        .returning();
      return aggregateWithCalories(inserted);
    }
  },

  /**
   * Get aggregates for date range
   */
  getAggregatesRange: async (
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<MacroDailyAggregateWithCalories[]> => {
    const rows = await db
      .select()
      .from(macro_daily_aggregates)
      .where(
        and(
          eq(macro_daily_aggregates.user_id, userId),
          sql`${macro_daily_aggregates.day_key} >= ${startDate}`,
          sql`${macro_daily_aggregates.day_key} <= ${endDate}`
        )
      )
      .orderBy(macro_daily_aggregates.day_key);

    return rows.map(aggregateWithCalories);
  },

  // ==================== QUICK ACTIONS ====================

  /**
   * Get quick actions for user
   */
  getQuickActions: async (userId: string): Promise<BaseMacroQuickAction[]> => {
    return await db
      .select()
      .from(macro_quick_actions)
      .where(eq(macro_quick_actions.user_id, userId))
      .orderBy(macro_quick_actions.position);
  },

  /**
   * Create quick action
   */
  createQuickAction: async (
    data: MacroQuickActionInsert
  ): Promise<BaseMacroQuickAction> => {
    const id = generateUUID();
    const [inserted] = await db
      .insert(macro_quick_actions)
      .values({ id, ...data })
      .returning();

    return inserted;
  },

  /**
   * Update quick action
   */
  updateQuickAction: async (
    id: string,
    data: Partial<MacroQuickActionInsert>
  ): Promise<BaseMacroQuickAction> => {
    const [updated] = await db
      .update(macro_quick_actions)
      .set({ ...data, updated_at: new Date().toISOString() })
      .where(eq(macro_quick_actions.id, id))
      .returning();

    return updated;
  },

  /**
   * Delete quick action
   */
  deleteQuickAction: async (id: string): Promise<void> => {
    await db.delete(macro_quick_actions).where(eq(macro_quick_actions.id, id));
  },

  /**
   * Initialize predefined quick actions for user
   */
  initializePredefinedQuickActions: async (
    userId: string
  ): Promise<BaseMacroQuickAction[]> => {
    const existing = await macroRepository.getQuickActions(userId);
    if (existing.length > 0) {
      return existing; // Already initialized
    }

    const predefined: Omit<MacroQuickActionInsert, "user_id">[] = [
      // Proteins
      {
        label: "🍗 Pollo 150g",
        protein: 46,
        carbs: 0,
        fats: 5,
        position: 0,
        is_predefined: true,
        slug: "chicken_150g",
        icon: "drumstick",
        color: "#F59E0B",
      },
      {
        label: "🥩 Carne 150g",
        protein: 38,
        carbs: 0,
        fats: 15,
        position: 1,
        is_predefined: true,
        slug: "beef_150g",
        icon: "beef",
        color: "#EF4444",
      },
      {
        label: "🐟 Pescado 150g",
        protein: 34,
        carbs: 0,
        fats: 3,
        position: 2,
        is_predefined: true,
        slug: "fish_150g",
        icon: "fish",
        color: "#3B82F6",
      },
      {
        label: "🥚 Huevos x3",
        protein: 18,
        carbs: 2,
        fats: 15,
        position: 3,
        is_predefined: true,
        slug: "eggs_3",
        icon: "egg",
        color: "#FBBF24",
      },
      // Carbs
      {
        label: "🍚 Arroz 100g",
        protein: 3,
        carbs: 28,
        fats: 0,
        position: 4,
        is_predefined: true,
        slug: "rice_100g",
        icon: "wheat",
        color: "#F5F5DC",
      },
      {
        label: "🍞 Pan 2 rebanadas",
        protein: 6,
        carbs: 26,
        fats: 2,
        position: 5,
        is_predefined: true,
        slug: "bread_2slices",
        icon: "sandwich",
        color: "#D2691E",
      },
      {
        label: "🥔 Papa 200g",
        protein: 4,
        carbs: 34,
        fats: 0,
        position: 6,
        is_predefined: true,
        slug: "potato_200g",
        icon: "potato",
        color: "#DEB887",
      },
      {
        label: "🍝 Pasta 100g",
        protein: 5,
        carbs: 31,
        fats: 1,
        position: 7,
        is_predefined: true,
        slug: "pasta_100g",
        icon: "pasta",
        color: "#FFE4B5",
      },
      // Fats
      {
        label: "🥑 Aguacate 1/2",
        protein: 2,
        carbs: 6,
        fats: 15,
        position: 8,
        is_predefined: true,
        slug: "avocado_half",
        icon: "avocado",
        color: "#22C55E",
      },
      {
        label: "🥜 Almendras 30g",
        protein: 6,
        carbs: 6,
        fats: 15,
        position: 9,
        is_predefined: true,
        slug: "almonds_30g",
        icon: "nut",
        color: "#A0522D",
      },
      {
        label: "🫒 Aceite oliva 1 cda",
        protein: 0,
        carbs: 0,
        fats: 14,
        position: 10,
        is_predefined: true,
        slug: "olive_oil_tbsp",
        icon: "droplet",
        color: "#BDB76B",
      },
      // Combos
      {
        label: "🍽️ Almuerzo típico",
        protein: 45,
        carbs: 60,
        fats: 20,
        position: 11,
        is_predefined: true,
        slug: "typical_lunch",
        icon: "utensils",
        color: "#8B5CF6",
      },
      {
        label: "🥤 Batido proteico",
        protein: 25,
        carbs: 5,
        fats: 2,
        position: 12,
        is_predefined: true,
        slug: "protein_shake",
        icon: "cup-soda",
        color: "#EC4899",
      },
    ];

    const created: BaseMacroQuickAction[] = [];
    for (const qa of predefined) {
      const result = await macroRepository.createQuickAction({
        ...qa,
        user_id: userId,
      });
      created.push(result);
    }

    return created;
  },

  // ==================== DAY DATA ====================

  /**
   * Get complete day data (entries + aggregate + target)
   */
  getDayData: async (userId: string, dayKey: string): Promise<MacroDayData> => {
    const [entries, aggregate, target] = await Promise.all([
      macroRepository.getEntriesByDay(userId, dayKey),
      macroRepository.getDailyAggregate(userId, dayKey),
      macroRepository.getActiveTarget(userId),
    ]);

    return {
      day_key: dayKey,
      entries,
      aggregate,
      target,
    };
  },

  /**
   * Check if user has macro targets set up
   */
  hasTargets: async (userId: string): Promise<boolean> => {
    const target = await macroRepository.getActiveTarget(userId);
    return target !== null;
  },
};
