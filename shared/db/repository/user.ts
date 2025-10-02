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
    await db
      .update(user_preferences)
      .set({ ...preferences })
      .where(eq(user_preferences.user_id, userId));
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
