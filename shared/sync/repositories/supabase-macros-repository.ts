import type {
  BaseMacroDailyAggregate,
  BaseMacroEntry,
  BaseMacroQuickAction,
  BaseMacroTarget,
  MacroEntryInsert,
  MacroQuickActionInsert,
  MacroTargetInsert,
} from "../../db/schema/macros";
import { BaseSupabaseRepository } from "./base-supabase-repository";

// Helper to strip calculated fields that don't exist in Supabase
const stripCalculatedFields = <T extends Record<string, any>>(
  data: T,
  fieldsToRemove: string[]
): Partial<T> => {
  const result = { ...data };
  fieldsToRemove.forEach((field) => delete result[field]);
  return result;
};

export class SupabaseMacrosRepository extends BaseSupabaseRepository {
  // ==================== TARGETS ====================

  async upsertTarget(
    data: MacroTargetInsert & { id?: string; calories_target?: number }
  ): Promise<BaseMacroTarget> {
    try {
      // Strip calculated fields that don't exist in Supabase
      const cleanData = stripCalculatedFields(data, ["calories_target"]);

      // First, deactivate any existing active targets
      await this.supabase
        .from("macro_targets")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq("user_id", data.user_id)
        .eq("is_active", true);

      // Then insert the new target
      const { data: result, error } = await this.supabase
        .from("macro_targets")
        .upsert(
          {
            ...cleanData,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        )
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      return await this.handleError(error, "upsert macro target");
    }
  }

  async updateTarget(
    id: string,
    data: Partial<MacroTargetInsert> & { calories_target?: number }
  ): Promise<BaseMacroTarget> {
    try {
      // Strip calculated fields
      const cleanData = stripCalculatedFields(data, ["calories_target"]);

      const { data: result, error } = await this.supabase
        .from("macro_targets")
        .update({
          ...cleanData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      return await this.handleError(error, "update macro target");
    }
  }

  // ==================== ENTRIES ====================

  async createEntry(
    data: MacroEntryInsert & { calories?: number }
  ): Promise<BaseMacroEntry> {
    try {
      // Strip calculated fields
      const cleanData = stripCalculatedFields(data, ["calories"]);

      const { data: result, error } = await this.supabase
        .from("macro_entries")
        .insert(cleanData)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      return await this.handleError(error, "create macro entry");
    }
  }

  async createEntryWithAggregate(payload: {
    entry: BaseMacroEntry & { calories?: number };
    aggregate: (BaseMacroDailyAggregate & { total_calories?: number }) | null;
  }): Promise<{
    entry: BaseMacroEntry;
    aggregate: BaseMacroDailyAggregate | null;
  }> {
    try {
      // Strip calculated fields from entry and aggregate
      const cleanEntry = stripCalculatedFields(payload.entry, ["calories"]);
      const cleanAggregate = payload.aggregate
        ? stripCalculatedFields(payload.aggregate, ["total_calories"])
        : null;

      // Insert/update entry
      const { data: entryResult, error: entryError } = await this.supabase
        .from("macro_entries")
        .upsert(
          {
            ...cleanEntry,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        )
        .select()
        .single();

      if (entryError) throw entryError;

      // Upsert aggregate if provided
      if (cleanAggregate) {
        const { error: aggError } = await this.supabase
          .from("macro_daily_aggregates")
          .upsert(
            {
              ...cleanAggregate,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,day_key" }
          );

        if (aggError) throw aggError;
      }

      return { entry: entryResult, aggregate: payload.aggregate };
    } catch (error) {
      return await this.handleError(error, "create macro entry with aggregate");
    }
  }

  async updateEntry(
    id: string,
    data: Partial<MacroEntryInsert> & { calories?: number }
  ): Promise<BaseMacroEntry> {
    try {
      // Strip calculated fields
      const cleanData = stripCalculatedFields(data, ["calories"]);

      const { data: result, error } = await this.supabase
        .from("macro_entries")
        .update({
          ...cleanData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      return await this.handleError(error, "update macro entry");
    }
  }

  async deleteEntry(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("macro_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      await this.handleError(error, "delete macro entry");
    }
  }

  async deleteEntryWithAggregate(payload: {
    entryId: string;
    aggregate: (BaseMacroDailyAggregate & { total_calories?: number }) | null;
  }): Promise<void> {
    try {
      // Delete the entry
      const { error: deleteError } = await this.supabase
        .from("macro_entries")
        .delete()
        .eq("id", payload.entryId);

      if (deleteError) throw deleteError;

      // Update aggregate if provided
      if (payload.aggregate) {
        // Strip calculated fields
        const cleanAggregate = stripCalculatedFields(payload.aggregate, [
          "total_calories",
        ]);

        if (payload.aggregate.entry_count === 0) {
          // Delete the aggregate if no entries left
          const { error: aggError } = await this.supabase
            .from("macro_daily_aggregates")
            .delete()
            .eq("id", payload.aggregate.id);

          if (aggError) throw aggError;
        } else {
          // Update the aggregate
          const { error: aggError } = await this.supabase
            .from("macro_daily_aggregates")
            .upsert(
              {
                ...cleanAggregate,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "user_id,day_key" }
            );

          if (aggError) throw aggError;
        }
      }
    } catch (error) {
      await this.handleError(error, "delete macro entry with aggregate");
    }
  }

  // ==================== QUICK ACTIONS ====================

  async createQuickAction(
    data: MacroQuickActionInsert
  ): Promise<BaseMacroQuickAction> {
    try {
      const { data: result, error } = await this.supabase
        .from("macro_quick_actions")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      return await this.handleError(error, "create macro quick action");
    }
  }

  async createQuickActionsBulk(
    data: MacroQuickActionInsert[]
  ): Promise<BaseMacroQuickAction[]> {
    try {
      const { data: result, error } = await this.supabase
        .from("macro_quick_actions")
        .upsert(data, { onConflict: "id" })
        .select();

      if (error) throw error;
      return result || [];
    } catch (error) {
      return await this.handleError(error, "create macro quick actions bulk");
    }
  }

  async deleteQuickAction(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("macro_quick_actions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      await this.handleError(error, "delete macro quick action");
    }
  }

  // ==================== AGGREGATES ====================

  async upsertAggregate(
    data: BaseMacroDailyAggregate & { total_calories?: number }
  ): Promise<BaseMacroDailyAggregate> {
    try {
      // Strip calculated fields
      const cleanData = stripCalculatedFields(data, ["total_calories"]);

      const { data: result, error } = await this.supabase
        .from("macro_daily_aggregates")
        .upsert(
          {
            ...cleanData,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,day_key" }
        )
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      return await this.handleError(error, "upsert macro aggregate");
    }
  }
}
