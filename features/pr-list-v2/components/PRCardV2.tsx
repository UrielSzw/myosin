import { PRListItem } from "@/features/pr-list-v2/types/pr-list";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { prListTranslations as t } from "@/shared/translations/pr-list";
import { getLocale, type SupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { formatPRDisplay } from "@/shared/utils/pr-formatters";
import { BlurView } from "expo-blur";
import { ChevronRight, Sparkles, Trophy } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  pr: PRListItem;
  index: number;
  onPress?: () => void;
  lang: SupportedLanguage;
};

const getMedalInfo = (
  prScore: number,
  allPRs?: PRListItem[]
): { Icon: React.FC<any>; color: string; rank?: number } => {
  // Default trophy icon
  return { Icon: Trophy, color: "#f59e0b" };
};

export const PRCardV2: React.FC<Props> = ({ pr, index, onPress, lang }) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";
  const distanceUnit = prefs?.distance_unit ?? "metric";

  const achievedDate = new Date(pr.achieved_at);
  const isRecent = pr.is_recent;

  // Format PR display based on measurement template
  const { mainDisplay, scoreDisplay, scoreName } = formatPRDisplay(
    pr.measurement_template,
    pr.best_primary_value,
    pr.best_secondary_value,
    pr.pr_score,
    weightUnit,
    distanceUnit,
    lang
  );

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
    };
    return date.toLocaleDateString(getLocale(lang), options);
  };

  const { Icon, color } = getMedalInfo(pr.pr_score);

  return (
    <Animated.View entering={FadeInDown.duration(300).delay(200 + index * 40)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.85)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
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

        {/* Recent indicator glow */}
        {isRecent && (
          <View
            style={[
              styles.recentGlow,
              { backgroundColor: colors.success[500] },
            ]}
          />
        )}

        <View style={styles.content}>
          {/* Left: Trophy/Medal Icon */}
          <View
            style={[styles.iconContainer, { backgroundColor: `${color}15` }]}
          >
            <Icon size={20} color={color} />
          </View>

          {/* Middle: Exercise Info */}
          <View style={styles.infoContainer}>
            <View style={styles.nameRow}>
              <Typography
                variant="body1"
                weight="semibold"
                style={{ color: colors.text, flex: 1 }}
                numberOfLines={1}
              >
                {pr.exercise_name}
              </Typography>
              {isRecent && (
                <View
                  style={[
                    styles.newBadge,
                    { backgroundColor: `${colors.success[500]}20` },
                  ]}
                >
                  <Sparkles size={10} color={colors.success[500]} />
                  <Typography
                    variant="caption"
                    weight="bold"
                    style={{
                      color: colors.success[500],
                      fontSize: 9,
                      marginLeft: 3,
                    }}
                  >
                    {t.new[lang]}
                  </Typography>
                </View>
              )}
            </View>

            {/* Main PR Value Display */}
            <View style={styles.weightRow}>
              <Typography
                variant="h5"
                weight="bold"
                style={{ color: colors.text }}
              >
                {mainDisplay}
              </Typography>
            </View>

            {/* Meta info */}
            <View style={styles.metaRow}>
              <Typography variant="caption" color="textMuted">
                {formatDate(achievedDate)}
              </Typography>
              <View
                style={[
                  styles.muscleBadge,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)",
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ fontSize: 10 }}
                >
                  {pr.exercise_muscle_category || pr.exercise_muscle}
                </Typography>
              </View>
            </View>
          </View>

          {/* Right: Score + Chevron */}
          <View style={styles.rightSection}>
            <View
              style={[
                styles.rmContainer,
                { backgroundColor: `${colors.primary[500]}10` },
              ]}
            >
              <Typography
                variant="caption"
                style={{ color: colors.primary[500], fontSize: 10 }}
              >
                {scoreName}
              </Typography>
              <Typography
                variant="h6"
                weight="bold"
                style={{ color: colors.primary[500] }}
              >
                {scoreDisplay}
              </Typography>
            </View>
            <ChevronRight
              size={18}
              color={colors.textMuted}
              style={{ marginTop: 8 }}
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  recentGlow: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.15,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  newBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  weightRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  muscleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rightSection: {
    alignItems: "center",
  },
  rmContainer: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 60,
  },
});
