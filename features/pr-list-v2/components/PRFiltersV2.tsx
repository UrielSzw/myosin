import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { prListTranslations as t } from "@/shared/translations/pr-list";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Clock, X } from "lucide-react-native";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  selectedMuscleGroups: string[];
  onMuscleGroupToggle: (category: string) => void;
  showRecent: boolean;
  onShowRecentToggle: () => void;
  activeFiltersCount: number;
  onClearAll: () => void;
  lang: "es" | "en";
};

const MUSCLE_CATEGORIES = [
  { key: "chest", label: { es: "Pecho", en: "Chest" }, color: "#ef4444" },
  { key: "back", label: { es: "Espalda", en: "Back" }, color: "#3b82f6" },
  {
    key: "shoulders",
    label: { es: "Hombros", en: "Shoulders" },
    color: "#8b5cf6",
  },
  { key: "arms", label: { es: "Brazos", en: "Arms" }, color: "#f59e0b" },
  { key: "legs", label: { es: "Piernas", en: "Legs" }, color: "#10b981" },
  { key: "core", label: { es: "Core", en: "Core" }, color: "#ec4899" },
];

export const PRFiltersV2: React.FC<Props> = ({
  selectedMuscleGroups,
  onMuscleGroupToggle,
  showRecent,
  onShowRecentToggle,
  activeFiltersCount,
  onClearAll,
  lang,
}) => {
  const { colors, isDarkMode } = useColorScheme();

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(150)}
      style={styles.container}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Recent Filter - Special */}
        <Pressable
          onPress={onShowRecentToggle}
          style={({ pressed }) => [
            styles.filterChip,
            showRecent
              ? {
                  backgroundColor: colors.success[500],
                  borderColor: colors.success[500],
                }
              : {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.9)",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.06)",
                },
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          {Platform.OS === "ios" && !showRecent && (
            <BlurView
              intensity={isDarkMode ? 10 : 20}
              tint={isDarkMode ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          )}
          <View style={styles.chipContent}>
            <Clock
              size={14}
              color={showRecent ? "#fff" : colors.success[500]}
            />
            <Typography
              variant="caption"
              weight="semibold"
              style={{
                color: showRecent ? "#fff" : colors.text,
                marginLeft: 6,
              }}
            >
              {t.recent[lang]}
            </Typography>
          </View>
        </Pressable>

        {/* Muscle Category Filters */}
        {MUSCLE_CATEGORIES.map((category) => {
          const isSelected = selectedMuscleGroups.includes(category.key);

          return (
            <Pressable
              key={category.key}
              onPress={() => onMuscleGroupToggle(category.key)}
              style={({ pressed }) => [
                styles.filterChip,
                isSelected
                  ? {
                      backgroundColor: category.color,
                      borderColor: category.color,
                    }
                  : {
                      backgroundColor: isDarkMode
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(255,255,255,0.9)",
                      borderColor: isDarkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.06)",
                    },
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              {Platform.OS === "ios" && !isSelected && (
                <BlurView
                  intensity={isDarkMode ? 10 : 20}
                  tint={isDarkMode ? "dark" : "light"}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <View style={styles.chipContent}>
                {!isSelected && (
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: category.color },
                    ]}
                  />
                )}
                <Typography
                  variant="caption"
                  weight="semibold"
                  style={{
                    color: isSelected ? "#fff" : colors.text,
                    marginLeft: isSelected ? 0 : 6,
                  }}
                >
                  {category.label[lang as "es" | "en"]}
                </Typography>
              </View>
            </Pressable>
          );
        })}

        {/* Clear All */}
        {activeFiltersCount > 0 && (
          <Pressable
            onPress={onClearAll}
            style={({ pressed }) => [
              styles.clearChip,
              {
                backgroundColor: `${colors.error[500]}15`,
                borderColor: colors.error[500],
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <X size={12} color={colors.error[500]} />
            <Typography
              variant="caption"
              weight="semibold"
              style={{ color: colors.error[500], marginLeft: 4 }}
            >
              {t.clear[lang]}
            </Typography>
          </Pressable>
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  scrollContent: {
    gap: 8,
    paddingRight: 20,
  },
  filterChip: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  chipContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  clearChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
  },
});
