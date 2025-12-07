import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { ArrowLeft, RefreshCw } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onRefresh: () => void;
  isLoading: boolean;
};

const translations = {
  title: {
    es: "Estado de Sync",
    en: "Sync Status",
  },
};

export const SyncStatusHeader = ({ onRefresh, isLoading }: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const insets = useSafeAreaInsets();

  const rotation = useSharedValue(0);

  React.useEffect(() => {
    if (isLoading) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = withTiming(0, { duration: 200 });
    }
  }, [isLoading, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      {Platform.OS === "ios" && (
        <BlurView
          intensity={isDarkMode ? 25 : 40}
          tint={isDarkMode ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      )}

      <View style={styles.headerContent}>
        {/* Back button */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.headerButton,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.04)",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Typography variant="h5" weight="bold" style={{ color: colors.text }}>
            {translations.title[lang]}
          </Typography>
        </View>

        {/* Refresh button */}
        <Pressable
          onPress={onRefresh}
          disabled={isLoading}
          style={({ pressed }) => [
            styles.headerButton,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.04)",
              opacity: pressed && !isLoading ? 0.7 : 1,
            },
          ]}
        >
          <Animated.View style={animatedStyle}>
            <RefreshCw size={18} color={colors.text} />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
});
