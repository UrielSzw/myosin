import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { prListTranslations as t } from "@/shared/translations/pr-list";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { Search, Trophy } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  variant: "no-prs" | "no-results";
  onClearFilters?: () => void;
  lang: "es" | "en";
};

export const EmptyStateV2: React.FC<Props> = ({
  variant,
  onClearFilters,
  lang,
}) => {
  const { colors, isDarkMode } = useColorScheme();

  const isNoPRs = variant === "no-prs";
  const Icon = isNoPRs ? Trophy : Search;
  const iconColor = isNoPRs ? "#f59e0b" : colors.primary[500];

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(200)}
      style={styles.container}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.85)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 15 : 30}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        <View style={styles.content}>
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${iconColor}15` },
            ]}
          >
            <Icon size={36} color={iconColor} />
          </View>

          {/* Title */}
          <Typography
            variant="h5"
            weight="bold"
            align="center"
            style={{ color: colors.text, marginTop: 20 }}
          >
            {isNoPRs
              ? lang === "es"
                ? "Sin récords aún"
                : "No records yet"
              : lang === "es"
              ? "Sin resultados"
              : "No results"}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            color="textMuted"
            align="center"
            style={{ marginTop: 8, paddingHorizontal: 20 }}
          >
            {isNoPRs
              ? lang === "es"
                ? "Completa entrenamientos para registrar tus récords personales automáticamente"
                : "Complete workouts to automatically track your personal records"
              : lang === "es"
              ? "No se encontraron récords con los filtros actuales"
              : "No records found with current filters"}
          </Typography>

          {/* Action button for no results */}
          {!isNoPRs && onClearFilters && (
            <Pressable
              onPress={onClearFilters}
              style={({ pressed }) => [
                styles.actionButton,
                {
                  backgroundColor: colors.primary[500],
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Typography
                variant="body2"
                weight="semibold"
                style={{ color: "#fff" }}
              >
                {t.clearFilters[lang]}
              </Typography>
            </Pressable>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
  },
  content: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
});
