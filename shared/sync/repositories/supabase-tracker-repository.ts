import type {
  BaseTrackerDailyAggregate,
  BaseTrackerEntry,
  BaseTrackerMetric,
  BaseTrackerQuickAction,
  TrackerEntryInsert,
  TrackerMetricInsert,
  TrackerQuickActionInsert,
} from "../../db/schema/tracker";
import { BaseSupabaseRepository } from "./base-supabase-repository";

export class SupabaseTrackerRepository extends BaseSupabaseRepository {
  // ==================== METRICS ====================

  async createMetric(data: TrackerMetricInsert): Promise<BaseTrackerMetric> {
    try {
      const { data: result, error } = await this.supabase
        .from("tracker_metrics")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      return await this.handleError(error, "create tracker metric");
    }
  }

  async updateMetric(
    id: string,
    data: Partial<TrackerMetricInsert>
  ): Promise<BaseTrackerMetric> {
    try {
      const { data: result, error } = await this.supabase
        .from("tracker_metrics")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      return await this.handleError(error, "update tracker metric");
    }
  }

  async deleteMetric(id: string): Promise<BaseTrackerMetric> {
    try {
      // Soft delete
      const { data: result, error } = await this.supabase
        .from("tracker_metrics")
        .update({
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      return await this.handleError(error, "delete tracker metric");
    }
  }

  // ==================== QUICK ACTIONS ====================

  async createQuickAction(
    data: TrackerQuickActionInsert
  ): Promise<BaseTrackerQuickAction> {
    try {
      const { data: result, error } = await this.supabase
        .from("tracker_quick_actions")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      return await this.handleError(error, "create quick action");
    }
  }

  async deleteQuickAction(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("tracker_quick_actions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      await this.handleError(error, "delete quick action");
    }
  }

  // ==================== ENTRIES ====================

  async createEntry(data: TrackerEntryInsert): Promise<BaseTrackerEntry> {
    try {
      const { data: result, error } = await this.supabase
        .from("tracker_entries")
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      return await this.handleError(error, "create tracker entry");
    }
  }

  async updateEntry(
    id: string,
    data: Partial<TrackerEntryInsert>
  ): Promise<BaseTrackerEntry> {
    try {
      const { data: result, error } = await this.supabase
        .from("tracker_entries")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      return await this.handleError(error, "update tracker entry");
    }
  }

  async deleteEntry(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("tracker_entries")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      await this.handleError(error, "delete tracker entry");
    }
  }

  // ==================== ADVANCED METRIC OPERATIONS ====================

  async restoreMetric(id: string): Promise<BaseTrackerMetric> {
    try {
      const { data: result, error } = await this.supabase
        .from("tracker_metrics")
        .update({
          deleted_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      return await this.handleError(error, "restore tracker metric");
    }
  }

  async reorderMetrics(
    metricOrders: { id: string; order_index: number }[]
  ): Promise<void> {
    try {
      // Use RPC function for atomic reordering
      const { error } = await this.supabase.rpc("reorder_tracker_metrics", {
        metric_orders: metricOrders,
      });

      if (error) throw error;
    } catch (error) {
      await this.handleError(error, "reorder tracker metrics");
    }
  }

  // ==================== COMPLEX ENTRY OPERATIONS ====================

  async createEntryFromQuickAction(data: {
    quick_action_id: string;
    user_id: string;
    notes?: string;
    recorded_at?: string;
    day_key: string;
  }): Promise<BaseTrackerEntry> {
    try {
      // Use RPC function for complex operation
      const { data: result, error } = await this.supabase
        .rpc("create_tracker_entry_from_quick_action", {
          p_quick_action_id: data.quick_action_id,
          p_user_id: data.user_id,
          p_notes: data.notes || null,
          p_recorded_at: data.recorded_at || new Date().toISOString(),
          p_day_key: data.day_key,
        })
        .single();

      if (error) throw error;
      return result as BaseTrackerEntry;
    } catch (error) {
      return await this.handleError(error, "create entry from quick action");
    }
  }

  // ==================== TEMPLATE OPERATIONS ====================

  async createMetricFromTemplate(data: {
    metric: TrackerMetricInsert;
    quickActions?: Omit<TrackerQuickActionInsert, "metric_id">[];
  }): Promise<BaseTrackerMetric> {
    try {
      // Use RPC function for atomic creation
      const { data: result, error } = await this.supabase
        .rpc("create_tracker_metric_from_template", {
          metric_data: data.metric,
          quick_actions_data: data.quickActions || [],
        })
        .single();

      if (error) throw error;
      return result as BaseTrackerMetric;
    } catch (error) {
      return await this.handleError(error, "create metric from template");
    }
  }

  // ==================== ATOMIC ENTRY + AGGREGATE ====================

  async createEntryWithAggregate(data: {
    entry: BaseTrackerEntry;
    dailyAggregate: BaseTrackerDailyAggregate | null;
  }): Promise<BaseTrackerEntry> {
    try {
      // Use RPC function for atomic operation
      const { error } = await this.supabase
        .rpc("create_tracker_entry_with_aggregate", {
          entry_data: data.entry,
          aggregate_data: data.dailyAggregate,
        })
        .single();

      if (error) throw error;
      return data.entry; // Return the original entry
    } catch (error) {
      return await this.handleError(error, "create entry with aggregate");
    }
  }

  async deleteEntryWithAggregate(data: {
    entryId: string;
    dailyAggregate: BaseTrackerDailyAggregate | null;
  }): Promise<void> {
    try {
      // Use RPC function for atomic operation
      const { error } = await this.supabase
        .rpc("delete_tracker_entry_with_aggregate", {
          entry_id: data.entryId,
          aggregate_data: data.dailyAggregate,
        })
        .single();

      if (error) throw error;
    } catch (error) {
      await this.handleError(error, "delete entry with aggregate");
    }
  }
}
