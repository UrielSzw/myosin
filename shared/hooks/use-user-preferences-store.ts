import { BaseUserPreferences } from "@/shared/db/schema/user";
import { SyncQueueRepository } from "@/shared/sync/queue/sync-queue-repository";
import { syncToSupabase } from "@/shared/sync/sync-engine";
import type { MutationCode } from "@/shared/sync/types/mutations";
import NetInfo from "@react-native-community/netinfo";
import { ColorSchemeName } from "react-native";
import { create } from "zustand";
import { usersRepository } from "../db/repository/user";

// Helper para sync desde Zustand store (sin React hooks)
const syncHelper = async (code: MutationCode, payload: any) => {
  try {
    const netInfo = await NetInfo.fetch();
    const isOnline = netInfo.isConnected && netInfo.isInternetReachable;

    if (isOnline) {
      // Online: sync directo
      await syncToSupabase(code, payload);
    } else {
      // Offline: agregar a queue
      const queueRepo = new SyncQueueRepository();
      await queueRepo.enqueue({
        code,
        payload,
      });
      console.log(`📴 Queued for later sync: ${code}`);
    }
  } catch (error) {
    console.error(`Failed to sync ${code}:`, error);
  }
};

type PrefsState = {
  prefs: BaseUserPreferences | null;
  loading: boolean;

  mainActions: {
    load: (userId: string) => Promise<void>;
  };

  updateActions: {
    setUnit: (userId: string, unit: "kg" | "lbs") => void;
    setDistanceUnit: (userId: string, unit: "metric" | "imperial") => void;
    setShowRpe: (userId: string, show: boolean) => void;
    setShowTempo: (userId: string, show: boolean) => void;
    setKeepScreenAwake: (userId: string, keep: boolean) => void;
    setDefaultRestTime: (userId: string, seconds: number) => void;
    setColorScheme: (userId: string, scheme: ColorSchemeName) => void;
    setLanguage: (userId: string, language: "en" | "es") => void;
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
        distance_unit: prefs.distance_unit,
        show_rpe: prefs.show_rpe,
        show_tempo: prefs.show_tempo,
        keep_screen_awake: prefs.keep_screen_awake,
        default_rest_time_seconds: prefs.default_rest_time_seconds,
        theme: prefs.theme,
        language: prefs.language,
      } as Partial<BaseUserPreferences>;

      try {
        // 1. Actualizar local primero (local-first)
        await usersRepository.updateUserPreferences(userId, updateData);

        // 2. Sync a Supabase en background
        syncHelper("USER_PREFERENCES_UPDATE", {
          userId,
          data: updateData,
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
              distance_unit: "metric",
              language: "es",
              show_rpe: false,
              show_tempo: false,
              keep_screen_awake: true,
              default_rest_time_seconds: 60,
            } as BaseUserPreferences;

            await usersRepository.createUserPreferences(
              userId,
              defaults as Partial<BaseUserPreferences>
            );

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
      setDistanceUnit: (userId: string, unit: "metric" | "imperial") => {
        set((s) => ({
          prefs: {
            ...(s.prefs ?? ({} as BaseUserPreferences)),
            distance_unit: unit,
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
      setKeepScreenAwake: (userId: string, value: boolean) => {
        set((s) => ({
          prefs: {
            ...(s.prefs ?? ({} as BaseUserPreferences)),
            keep_screen_awake: value,
          },
        }));
        schedulePersist(userId);
      },
      setDefaultRestTime: (userId: string, seconds: number) => {
        set((s) => ({
          prefs: {
            ...(s.prefs ?? ({} as BaseUserPreferences)),
            default_rest_time_seconds: seconds,
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
      setLanguage: (userId: string, language: "en" | "es") => {
        set((s) => ({
          prefs: {
            ...(s.prefs ?? ({} as BaseUserPreferences)),
            language,
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
