import { BaseUserPreferences } from "@/shared/db/schema/user";
import { syncToSupabase } from "@/shared/sync/sync-engine";
import { ColorSchemeName } from "react-native";
import { create } from "zustand";
import { usersRepository } from "../db/repository/user";

type PrefsState = {
  prefs: BaseUserPreferences | null;
  loading: boolean;

  mainActions: {
    load: (userId: string) => Promise<void>;
  };

  updateActions: {
    setUnit: (userId: string, unit: "kg" | "lbs") => void;
    setShowRpe: (userId: string, value: boolean) => void;
    setShowTempo: (userId: string, value: boolean) => void;
    setColorScheme: (userId: string, scheme: ColorSchemeName) => void;
  };
};

export const useUserPreferencesStore = create<PrefsState>((set, get) => {
  let persistTimer: ReturnType<typeof setTimeout> | null = null;

  const schedulePersist = (userId: string) => {
    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(async () => {
      const prefs = get().prefs;
      if (!prefs) return;

      const updateData = {
        weight_unit: prefs.weight_unit,
        show_rpe: prefs.show_rpe,
        show_tempo: prefs.show_tempo,
        theme: prefs.theme,
      } as Partial<BaseUserPreferences>;

      try {
        // 1. Actualizar local primero (local-first)
        await usersRepository.updateUserPreferences(userId, updateData);

        // 2. Sync a Supabase en background
        syncToSupabase("USER_PREFERENCES_UPDATE", {
          userId,
          data: updateData,
        }).catch((syncError) => {
          console.warn("User preferences sync failed:", syncError);
        });
      } catch (e) {
        console.error("Error persisting user preferences", e);
      } finally {
        persistTimer = null;
      }
    }, 700);
  };

  return {
    prefs: null,
    loading: false,

    mainActions: {
      load: async (userId: string) => {
        set({ loading: true });
        try {
          const row = await usersRepository.getUserPreferences(userId);

          if (row) {
            set({ prefs: row as BaseUserPreferences });
          } else {
            // create defaults if not present
            const defaults: BaseUserPreferences = {
              theme: "dark" as BaseUserPreferences["theme"],
              weight_unit: "kg",
              show_rpe: false,
              show_tempo: false,
            } as BaseUserPreferences;

            await usersRepository.createUserPreferences(
              userId,
              defaults as Partial<BaseUserPreferences>
            );

            // Sync crear preferences a Supabase
            syncToSupabase("USER_PREFERENCES_CREATE", {
              userId,
              data: defaults,
            });

            set({ prefs: defaults });
          }
        } catch (e) {
          console.error("Error loading user preferences", e);
        } finally {
          set({ loading: false });
        }
      },
    },

    updateActions: {
      setUnit: (userId: string, unit: "kg" | "lbs") => {
        set((s) => ({
          prefs: {
            ...(s.prefs ?? ({} as BaseUserPreferences)),
            weight_unit: unit,
          },
        }));
        schedulePersist(userId);
      },
      setShowRpe: (userId: string, value: boolean) => {
        set((s) => ({
          prefs: {
            ...(s.prefs ?? ({} as BaseUserPreferences)),
            show_rpe: value,
          },
        }));
        schedulePersist(userId);
      },
      setShowTempo: (userId: string, value: boolean) => {
        set((s) => ({
          prefs: {
            ...(s.prefs ?? ({} as BaseUserPreferences)),
            show_tempo: value,
          },
        }));
        schedulePersist(userId);
      },
      setColorScheme: (userId: string, scheme: ColorSchemeName) => {
        set((s) => ({
          prefs: {
            ...(s.prefs ?? ({} as BaseUserPreferences)),
            theme: scheme as BaseUserPreferences["theme"],
          },
        }));
        schedulePersist(userId);
      },
    },
  };
});

export const useUserPreferences = () => useUserPreferencesStore((s) => s.prefs);

export const useUserPreferencesActions = () =>
  useUserPreferencesStore((s) => s.updateActions);

export const useUserPreferencesLoad = () =>
  useUserPreferencesStore((s) => s.mainActions.load);
