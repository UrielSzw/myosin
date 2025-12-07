import type { FolderInsert } from "../../db/repository/folders";
import type { BaseFolder } from "../../db/schema/routine";
import { BaseSupabaseRepository } from "./base-supabase-repository";

export class SupabaseFoldersRepository extends BaseSupabaseRepository {
  async create(data: FolderInsert): Promise<BaseFolder> {
    try {
      const { data: result, error } = await this.supabase
        .from("folders")
        .insert(this.stripLocalFields(data))
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      return await this.handleError(error, "create folder");
    }
  }

  async update(id: string, data: Partial<FolderInsert>): Promise<BaseFolder> {
    try {
      const { data: result, error } = await this.supabase
        .from("folders")
        .update(this.stripLocalFields(data))
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      return await this.handleError(error, "update folder");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("folders")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      await this.handleError(error, "delete folder");
    }
  }

  async reorderFolders(orderedFolderIds: string[]): Promise<void> {
    try {
      for (let index = 0; index < orderedFolderIds.length; index++) {
        const folderId = orderedFolderIds[index];
        const { error } = await this.supabase
          .from("folders")
          .update({ order_index: index })
          .eq("id", folderId);

        if (error) throw error;
      }
    } catch (error) {
      await this.handleError(error, "reorder folders");
    }
  }
}
