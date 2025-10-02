import { getThemeColors } from "../constants/colors";
import {
  useUserPreferences,
  useUserPreferencesActions,
} from "./use-user-preferences-store";

export const useColorScheme = () => {
  const colorScheme = useUserPreferences()?.theme ?? "dark";
  const { setColorScheme } = useUserPreferencesActions();

  const isDarkMode = colorScheme === "dark";
  const colors = getThemeColors(isDarkMode);

  return { colorScheme, setColorScheme, colors, isDarkMode };
};
