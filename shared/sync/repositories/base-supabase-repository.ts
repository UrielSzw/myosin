import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../../services/supabase";

// Fields that only exist locally and should never be sent to Supabase
const LOCAL_ONLY_FIELDS = ["is_synced"];

export abstract class BaseSupabaseRepository {
  protected supabase: SupabaseClient;

  constructor() {
    this.supabase = supabase;
  }

  /**
   * Strips local-only fields (like is_synced) from data before sending to Supabase
   */
  protected stripLocalFields<T extends Record<string, any>>(
    data: T
  ): Omit<T, "is_synced"> {
    const result = { ...data };
    LOCAL_ONLY_FIELDS.forEach((field) => delete result[field]);
    return result;
  }

  /**
   * Strips local-only fields from an array of records
   */
  protected stripLocalFieldsArray<T extends Record<string, any>>(
    data: T[]
  ): Omit<T, "is_synced">[] {
    return data.map((item) => this.stripLocalFields(item));
  }

  protected async handleError(error: any, operation: string): Promise<never> {
    console.error(`Supabase ${operation} error:`, error);
    throw new Error(`Failed to ${operation}: ${error.message || error}`);
  }

  protected async executeQuery<T>(
    queryFn: () => Promise<{ data: T | null; error: any }>,
    operation: string
  ): Promise<T> {
    try {
      const { data, error } = await queryFn();

      if (error) {
        throw error;
      }

      if (data === null) {
        throw new Error(`No data returned from ${operation}`);
      }

      return data;
    } catch (error) {
      return await this.handleError(error, operation);
    }
  }
}
