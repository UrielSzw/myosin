import { db } from "../client";
import { folders } from "../schema";

export const foldersRepository = {
  findAll: async () => {
    const result = await db.select().from(folders);

    return result;
  },
};
