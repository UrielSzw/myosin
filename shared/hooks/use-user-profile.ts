import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { supabase } from "../services/supabase";

const AVATAR_COLOR_KEY = "@myosin:avatar_color";
const DEFAULT_AVATAR_COLOR = "#0ea5e9";

interface UserProfileState {
  avatarColor: string;
  loading: boolean;
  loadAvatarColor: () => Promise<void>;
  updateAvatarColor: (color: string) => Promise<boolean>;
}

/**
 * Store para manejar avatar_color de forma reactiva
 * Se guarda en AsyncStorage local (temporal, no sincroniza)
 */
export const useUserProfileStore = create<UserProfileState>((set) => ({
  avatarColor: DEFAULT_AVATAR_COLOR,
  loading: true,

  loadAvatarColor: async () => {
    try {
      const stored = await AsyncStorage.getItem(AVATAR_COLOR_KEY);
      if (stored) {
        set({ avatarColor: stored });
      }
    } catch (error) {
      console.error("Error loading avatar color:", error);
    } finally {
      set({ loading: false });
    }
  },

  updateAvatarColor: async (color: string) => {
    try {
      await AsyncStorage.setItem(AVATAR_COLOR_KEY, color);
      set({ avatarColor: color });
      return true;
    } catch (error) {
      console.error("Error updating avatar color:", error);
      return false;
    }
  },
}));

/**
 * Hook para manejar el perfil de usuario:
 * - display_name: Se lee/actualiza en Supabase user_metadata
 * - avatar_color: Se maneja con useUserProfileStore (reactivo)
 */
export const useUserProfile = (user: any) => {
  const { avatarColor, loading, updateAvatarColor } = useUserProfileStore();

  const updateDisplayName = async (name: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: name },
      });

      if (error) {
        console.error("Error updating display name:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error updating display name:", error);
      return false;
    }
  };

  const profile = {
    displayName: user?.user_metadata?.display_name ?? null,
    avatarColor,
  };

  return {
    profile,
    loading,
    updateDisplayName,
    updateAvatarColor,
  };
};
