import { create } from "zustand";
import { PROGRAM_TEMPLATES, ROUTINE_TEMPLATES } from "../constants";
import { ProgramTemplate, RoutineTemplate } from "../types";

interface TemplateFilters {
  searchQuery: string;
  type: "all" | "routine" | "program";
  difficulty: ("beginner" | "intermediate" | "advanced")[];
  equipment: string[];
  category: ("strength" | "hypertrophy" | "endurance")[];
}

interface TemplateStore {
  // Data
  templates: RoutineTemplate[];
  programs: ProgramTemplate[];

  // Filters
  filters: TemplateFilters;

  // Loading state
  isLoading: boolean;

  // Computed
  filteredItems: (RoutineTemplate | ProgramTemplate)[];

  // Actions
  setFilters: (filters: Partial<TemplateFilters>) => void;
  clearFilters: () => void;
}

const initialFilters: TemplateFilters = {
  searchQuery: "",
  type: "all",
  difficulty: [],
  equipment: [],
  category: [],
};

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  // Initial data
  templates: ROUTINE_TEMPLATES,
  programs: PROGRAM_TEMPLATES,

  // Initial filters
  filters: initialFilters,

  // Loading
  isLoading: false,

  // Initial filteredItems - show all items initially
  filteredItems: [...ROUTINE_TEMPLATES, ...PROGRAM_TEMPLATES],

  // Actions
  setFilters: (newFilters) =>
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };
      const allItems = [...state.templates, ...state.programs];

      const filtered = allItems.filter((item) => {
        // Search query
        if (updatedFilters.searchQuery.trim()) {
          const query = updatedFilters.searchQuery.toLowerCase();
          const matchesName = item.name.toLowerCase().includes(query);
          const matchesDescription = item.description
            .toLowerCase()
            .includes(query);
          if (!matchesName && !matchesDescription) return false;
        }

        // Type filter
        if (updatedFilters.type !== "all") {
          const isRoutine = "estimatedTime" in item; // RoutineTemplate has estimatedTime
          const isProgram = "routines" in item; // ProgramTemplate has routines

          if (updatedFilters.type === "routine" && !isRoutine) return false;
          if (updatedFilters.type === "program" && !isProgram) return false;
        }

        // Difficulty filter
        if (updatedFilters.difficulty.length > 0) {
          if (!updatedFilters.difficulty.includes(item.difficulty))
            return false;
        }

        // Equipment filter
        if (updatedFilters.equipment.length > 0) {
          const hasMatchingEquipment = updatedFilters.equipment.some((eq) =>
            item.equipment.includes(eq)
          );
          if (!hasMatchingEquipment) return false;
        }

        // Category filter
        if (updatedFilters.category.length > 0) {
          if (!updatedFilters.category.includes(item.category)) return false;
        }

        return true;
      });

      return {
        filters: updatedFilters,
        filteredItems: filtered,
      };
    }),

  clearFilters: () => set({ filters: initialFilters }),
}));
