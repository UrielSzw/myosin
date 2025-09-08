import { eq, sql } from "drizzle-orm";
import { db } from "../client";
import type { BaseFolder } from "../schema/routine";
import { folders, routines } from "../schema/routine";

export type FolderInsert = Omit<BaseFolder, "id" | "created_at" | "updated_at">;

export type FolderWithMetrics = BaseFolder & {
  routineCount: number;
};

export const foldersRepository = {
  findAllWithMetrics: async (): Promise<FolderWithMetrics[]> => {
    const result = await db
      .select({
        id: folders.id,
        name: folders.name,
        color: folders.color,
        icon: folders.icon,
        order_index: folders.order_index,
        created_by_user_id: folders.created_by_user_id,
        created_at: folders.created_at,
        updated_at: folders.updated_at,
        routineCount: sql<number>`COALESCE(COUNT(${routines.id}), 0)`.as(
          "routine_count"
        ),
      })
      .from(folders)
      .leftJoin(routines, eq(folders.id, routines.folder_id))
      .groupBy(folders.id)
      .orderBy(folders.order_index);

    return result.map((row) => ({
      ...row,
      routineCount: Number(row.routineCount) || 0,
    }));
  },

  findById: async (folderId: string): Promise<BaseFolder> => {
    const [folder] = await db
      .select()
      .from(folders)
      .where(eq(folders.id, folderId));

    if (!folder) {
      throw new Error(`Folder with id ${folderId} not found`);
    }

    return folder;
  },

  create: async (data: FolderInsert): Promise<BaseFolder> => {
    const [createdFolder] = await db.insert(folders).values(data).returning();

    return createdFolder;
  },

  update: async (
    folderId: string,
    data: Partial<FolderInsert>
  ): Promise<BaseFolder> => {
    const [updatedFolder] = await db
      .update(folders)
      .set(data)
      .where(eq(folders.id, folderId))
      .returning();

    if (!updatedFolder) {
      throw new Error(`Folder with id ${folderId} not found`);
    }

    return updatedFolder;
  },

  delete: async (folderId: string): Promise<void> => {
    await db.delete(folders).where(eq(folders.id, folderId));
  },

  getNextOrderIndex: async (): Promise<number> => {
    const result = await db
      .select({ maxOrder: folders.order_index })
      .from(folders)
      .orderBy(folders.order_index)
      .limit(1);

    return result.length > 0 ? (result[0].maxOrder || 0) + 1 : 0;
  },

  reorderFolders: async (orderedFolderIds: string[]): Promise<void> => {
    await db.transaction(async (tx) => {
      for (let index = 0; index < orderedFolderIds.length; index++) {
        const folderId = orderedFolderIds[index];
        await tx
          .update(folders)
          .set({ order_index: index })
          .where(eq(folders.id, folderId));
      }
    });
  },
};
