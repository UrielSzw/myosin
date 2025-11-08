import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../../services/supabase";

export abstract class BaseSupabaseRepository {
  protected supabase: SupabaseClient;

  constructor() {
    this.supabase = supabase;
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
