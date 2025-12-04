import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { trackerTranslations } from "@/shared/translations/tracker";
import type { SupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { BarChart3, Plus } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

type Props = {
  onAddMetric: () => void;
  lang: SupportedLanguage;
};

export const EmptyMetricsV2: React.FC<Props> = ({ onAddMetric, lang }) => {
  const { colors, isDarkMode } = useColorScheme();
  const t = trackerTranslations;

  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.03)"
              : "rgba(255,255,255,0.6)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.04)",
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 10 : 20}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        <View style={styles.content}>
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${colors.primary[500]}10` },
            ]}
          >
            <BarChart3 size={32} color={colors.primary[500]} />
          </View>

          {/* Text */}
          <Typography
            variant="h6"
            weight="semibold"
            style={{ color: colors.text }}
          >
            {t.emptyState.noMetrics[lang]}
          </Typography>

          <Typography
            variant="body2"
            color="textMuted"
            align="center"
            style={{ marginTop: 4, maxWidth: 260 }}
          >
            {t.emptyState.addMetricsToTrack[lang]}
          </Typography>

          {/* Add button */}
          <Pressable
            onPress={onAddMetric}
            style={({ pressed }) => [
              styles.addButton,
              {
                backgroundColor: colors.primary[500],
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Plus size={18} color="#fff" />
            <Typography
              variant="body2"
              weight="semibold"
              style={{ color: "#fff" }}
            >
              {t.emptyState.addFirstMetric[lang]}
            </Typography>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
  },
  content: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
