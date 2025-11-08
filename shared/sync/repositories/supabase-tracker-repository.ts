import type {
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
}
