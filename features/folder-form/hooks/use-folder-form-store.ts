import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { folderService } from "../service/folder";

type FolderFormState = {
  // Form data
  name: string;
  color: string;
  icon: string;

  // UI state
  isLoading: boolean;
  mode: "create" | "edit";
  editingId: string | null;

  // Actions
  setName: (name: string) => void;
  setColor: (color: string) => void;
  setIcon: (icon: string) => void;
  resetForm: () => void;
  initializeForm: (id?: string) => Promise<void>;
};

const initialState = {
  name: "",
  color: "#3B82F6", // Default blue color
  icon: "📁", // Default folder icon
  isLoading: false,
  mode: "create" as const,
  editingId: null,
};

export const useFolderFormStore = create<FolderFormState>()(
  immer((set, get) => ({
    ...initialState,

    setName: (name: string) =>
      set((state) => {
        state.name = name;
      }),

    setColor: (color: string) =>
      set((state) => {
        state.color = color;
      }),

    setIcon: (icon: string) =>
      set((state) => {
        state.icon = icon;
      }),

    resetForm: () =>
      set((state) => {
        Object.assign(state, initialState);
      }),

    initializeForm: async (id?: string) => {
      if (!id) {
        set((state) => {
          Object.assign(state, initialState);
        });
        return;
      }

      set((state) => {
        state.isLoading = true;
        state.mode = "edit";
        state.editingId = id;
      });

      try {
        const folder = await folderService.getFolderById(id);

        if (folder) {
          set((state) => {
            state.name = folder.name;
            state.color = folder.color;
            state.icon = folder.icon;
            state.isLoading = false;
          });
        } else {
          // Folder not found, reset to create mode
          set((state) => {
            Object.assign(state, initialState);
          });
        }
      } catch (error) {
        console.error("Error loading folder:", error);
        set((state) => {
          Object.assign(state, initialState);
        });
      }
    },
  }))
);
