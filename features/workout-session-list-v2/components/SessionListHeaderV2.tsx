import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { ArrowLeft, Calendar } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  totalSessions: number;
  recentSessionsCount: number;
  lang: string;
};

export const SessionListHeaderV2: React.FC<Props> = ({
  totalSessions,
  recentSessionsCount,
  lang,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useColorScheme();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

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
        {/* Back Button */}
        <Pressable
          onPress={handleGoBack}
          style={({ pressed }) => [
            styles.backButton,
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
          <Typography variant="h4" weight="bold" style={{ color: colors.text }}>
            {lang === "es" ? "Historial" : "History"}
          </Typography>
        </View>

        {/* Stats Badge */}
        <Animated.View entering={FadeIn.duration(400).delay(200)}>
          <View
            style={[
              styles.statsBadge,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.04)",
              },
            ]}
          >
            <Calendar size={14} color={colors.primary[500]} />
            <Typography
              variant="caption"
              weight="bold"
              style={{ color: colors.text, marginLeft: 4 }}
            >
              {totalSessions}
            </Typography>
          </View>
        </Animated.View>
      </View>

      {/* Subtitle with recent sessions */}
      {recentSessionsCount > 0 && (
        <Animated.View
          entering={FadeIn.duration(300).delay(300)}
          style={styles.subtitleContainer}
        >
          <View
            style={[
              styles.recentBadge,
              { backgroundColor: `${colors.success[500]}15` },
            ]}
          >
            <View
              style={[
                styles.recentDot,
                { backgroundColor: colors.success[500] },
              ]}
            />
            <Typography
              variant="caption"
              weight="semibold"
              style={{ color: colors.success[500] }}
            >
              {recentSessionsCount}{" "}
              {lang === "es"
                ? recentSessionsCount === 1
                  ? "esta semana"
                  : "esta semana"
                : recentSessionsCount === 1
                ? "this week"
                : "this week"}
            </Typography>
          </View>
        </Animated.View>
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
  },
  statsBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  subtitleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    marginLeft: 52,
  },
  recentBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
    gap: 6,
  },
  recentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
