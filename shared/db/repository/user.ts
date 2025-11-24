import { eq } from "drizzle-orm";
import { db } from "../client";
import { BaseUserPreferences, user_preferences } from "../schema/user";

export const usersRepository = {
  getUserPreferences: async (userId: string) => {
    const rows = await db
      .select()
      .from(user_preferences)
      .where(eq(user_preferences.user_id, userId))
      .limit(1);

    return rows?.[0] ?? null;
  },

  updateUserPreferences: async (
    userId: string,
    preferences: Partial<BaseUserPreferences>
  ) => {
    // UPSERT: Insert if doesn't exist, update if exists
    // Now works because user_id has UNIQUE constraint
    await db
      .insert(user_preferences)
      .values({
        user_id: userId,
        ...preferences,
      })
      .onConflictDoUpdate({
        target: user_preferences.user_id,
        set: { ...preferences, updated_at: new Date().toISOString() },
      });
  },

  createUserPreferences: async (
    userId: string,
    preferences: Partial<BaseUserPreferences>
  ) => {
    await db
      .insert(user_preferences)
      .values({ user_id: userId, ...preferences });
  },
};
