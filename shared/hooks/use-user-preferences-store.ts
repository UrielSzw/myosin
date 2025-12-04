import { BaseUserPreferences } from "@/shared/db/schema/user";
import { getSyncQueueRepository } from "@/shared/sync/queue/sync-queue-repository";
import { SupabaseUserRepository } from "@/shared/sync/repositories/supabase-user-repository";
import { syncToSupabase } from "@/shared/sync/sync-engine";
import type { MutationCode } from "@/shared/sync/types/mutations";
import NetInfo from "@react-native-community/netinfo";
import { ColorSchemeName } from "react-native";
import { create } from "zustand";
import { usersRepository } from "../db/repository/user";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "../types/language";

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
      const queueRepo = getSyncQueueRepository();
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
    setHapticFeedback: (userId: string, enabled: boolean) => void;
    setDefaultRestTime: (userId: string, seconds: number) => void;
    setColorScheme: (userId: string, scheme: ColorSchemeName) => void;
    setLanguage: (userId: string, language: SupportedLanguage) => void;
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
        haptic_feedback_enabled: prefs.haptic_feedback_enabled,
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
          // 1. First check local SQLite
          const localRow = await usersRepository.getUserPreferences(userId);

          if (localRow) {
            set({ prefs: localRow as BaseUserPreferences });
          } else {
            // 2. No local data - check if user has data in Supabase (new device scenario)
            console.log("📱 No local preferences found, checking Supabase...");

            const netInfo = await NetInfo.fetch();
            const isOnline = netInfo.isConnected && netInfo.isInternetReachable;

            let supabasePrefs: BaseUserPreferences | null = null;

            if (isOnline) {
              try {
                const supabaseRepo = new SupabaseUserRepository();
                supabasePrefs = await supabaseRepo.getUserPreferences(userId);

                if (supabasePrefs) {
                  console.log(
                    "☁️ Found preferences in Supabase, syncing to local..."
                  );
                }
              } catch (e) {
                console.warn("Could not fetch from Supabase:", e);
              }
            }

            if (supabasePrefs) {
              // 3a. Found in Supabase - save to local and use
              await usersRepository.createUserPreferences(
                userId,
                supabasePrefs
              );
              set({ prefs: supabasePrefs });
              console.log("✅ Synced Supabase preferences to local DB");
            } else {
              // 3b. Not found anywhere - create defaults
              console.log("🆕 Creating default preferences...");
              const defaults: BaseUserPreferences = {
                theme: "dark" as BaseUserPreferences["theme"],
                weight_unit: "kg",
                distance_unit: "metric",
                language: DEFAULT_LANGUAGE,
                show_rpe: false,
                show_tempo: false,
                keep_screen_awake: true,
                haptic_feedback_enabled: true,
                default_rest_time_seconds: 60,
                onboarding_completed: false,
              } as BaseUserPreferences;

              await usersRepository.createUserPreferences(
                userId,
                defaults as Partial<BaseUserPreferences>
              );

              set({ prefs: defaults });
            }
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
      setHapticFeedback: (userId: string, value: boolean) => {
        set((s) => ({
          prefs: {
            ...(s.prefs ?? ({} as BaseUserPreferences)),
            haptic_feedback_enabled: value,
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
      setLanguage: (userId: string, language: SupportedLanguage) => {
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
