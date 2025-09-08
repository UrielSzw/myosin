import { BaseFolder } from "@/shared/db/schema";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Store = {
  selectedFolder: BaseFolder | null;
  setSelectedFolder: (folder: BaseFolder | null) => void;
};

export const useSelectedFolderStore = create<Store>()(
  immer((set) => ({
    selectedFolder: null,
    setSelectedFolder: (folder) =>
      set(() => ({
        selectedFolder: folder,
      })),
  }))
);
