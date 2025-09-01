import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorSchemeName } from "react-native";
import { create } from "zustand";

type Store = {
  colorScheme: ColorSchemeName;
  isLoading: boolean;

  actions: {
    setColorScheme: (scheme: ColorSchemeName) => void;
    loadFromStorage: () => Promise<void>;
  };
};

// Storage keys
const STORAGE_KEYS = {
  COLOR_SCHEME: "@workout-app/colorScheme",
};

const useMainStore = create<Store>((set) => ({
  colorScheme: "dark",
  isLoading: false,
  actions: {
    setColorScheme: async (scheme) => {
      set({ colorScheme: scheme });
      try {
        if (scheme) {
          await AsyncStorage.setItem(STORAGE_KEYS.COLOR_SCHEME, scheme);
        } else {
          await AsyncStorage.removeItem(STORAGE_KEYS.COLOR_SCHEME);
        }
      } catch (error) {
        console.error("Error saving color scheme:", error);
      }
    },
    loadFromStorage: async () => {
      try {
        set({ isLoading: true });

        const colorSchemeData = await AsyncStorage.getItem(
          STORAGE_KEYS.COLOR_SCHEME
        );

        const colorScheme = (colorSchemeData as ColorSchemeName) || "light";

        set({
          colorScheme,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error loading data from storage:", error);
        set({ isLoading: false });
      }
    },
  },
}));

export const useColorSchemeState = () =>
  useMainStore((state) => state.colorScheme);

export const useIsLoadingState = () => useMainStore((state) => state.isLoading);

export const useMainStoreActions = () => useMainStore((state) => state.actions);
