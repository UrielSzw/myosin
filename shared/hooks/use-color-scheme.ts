import { getThemeColors } from "../constants/colors";
import { useColorSchemeState, useMainStoreActions } from "./use-main-store";

export const useColorScheme = () => {
  const colorScheme = useColorSchemeState();
  const { setColorScheme } = useMainStoreActions();

  const isDarkMode = colorScheme === "dark";
  const colors = getThemeColors(isDarkMode);

  return { colorScheme, setColorScheme, colors, isDarkMode };
};
