import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import {
  initializeGlobalToast,
  useToast,
  type PRToastData,
  type ToastData,
  type UnlockToastData,
} from "@/shared/providers/toast-provider";
import { toastTranslations as t } from "@/shared/translations/toast";
import { toSupportedLanguage } from "@/shared/types/language";
import { formatPRDisplay } from "@/shared/utils/pr-formatters";
import { BlurView } from "expo-blur";
import { LockOpen, Trophy } from "lucide-react-native";
import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "../typography";

// ============================================
// PR TOAST ITEM
// ============================================

const PRToastItem: React.FC<{
  data: PRToastData;
  index: number;
}> = ({ data, index }) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const weightUnit = prefs?.weight_unit ?? "kg";
  const distanceUnit = prefs?.distance_unit ?? "metric";

  // Entry/exit animation values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  // Trophy animations
  const trophyScale = useSharedValue(0);
  const trophyRotate = useSharedValue(0);

  useEffect(() => {
    // Smooth entry
    opacity.value = withTiming(1, { duration: 200 });
    translateY.value = withSpring(0, { damping: 18, stiffness: 280 });

    // Trophy bounce in
    trophyScale.value = withDelay(
      80,
      withSpring(1, { damping: 10, stiffness: 180 })
    );

    // Subtle trophy wiggle
    trophyRotate.value = withDelay(
      350,
      withRepeat(
        withSequence(
          withTiming(10, { duration: 70 }),
          withTiming(-10, { duration: 70 }),
          withTiming(6, { duration: 50 }),
          withTiming(-6, { duration: 50 }),
          withTiming(0, { duration: 60 }),
          withTiming(0, { duration: 2500 }) // Longer pause
        ),
        -1,
        false
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: trophyScale.value },
      { rotate: `${trophyRotate.value}deg` },
    ],
  }));

  // Format PR display
  const { mainDisplay } = formatPRDisplay(
    data.measurementTemplate,
    data.primaryValue,
    data.secondaryValue,
    data.prScore,
    weightUnit,
    distanceUnit,
    lang
  );

  const goldAccent = "#f59e0b";

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        containerStyle,
        {
          backgroundColor: isDarkMode
            ? "rgba(30, 30, 30, 0.95)"
            : "rgba(255, 255, 255, 0.98)",
          borderColor: isDarkMode
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.08)",
          marginTop: index * 4,
        },
      ]}
    >
      {Platform.OS === "ios" && (
        <BlurView
          intensity={isDarkMode ? 40 : 60}
          tint={isDarkMode ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Trophy icon - matches PRHighlightsV2 rankBadge style */}
        <Animated.View
          style={[
            styles.iconContainer,
            { backgroundColor: `${goldAccent}15` },
            trophyStyle,
          ]}
        >
          <Trophy size={20} color={goldAccent} strokeWidth={2.5} />
        </Animated.View>

        {/* Text content */}
        <View style={styles.textContainer}>
          <Typography
            variant="body2"
            weight="semibold"
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {data.exerciseName}
          </Typography>
          <Typography variant="caption" color="textMuted" numberOfLines={1}>
            {mainDisplay}
          </Typography>
        </View>

        {/* PR Badge - matches PRHighlightsV2 estimateBadge style */}
        <View style={[styles.prBadge, { backgroundColor: `${goldAccent}15` }]}>
          <Typography
            variant="caption"
            weight="bold"
            style={{ color: goldAccent, fontSize: 10 }}
          >
            {t.newPR[lang]}
          </Typography>
        </View>
      </View>
    </Animated.View>
  );
};

// ============================================
// UNLOCK TOAST ITEM
// ============================================

const UnlockToastItem: React.FC<{
  data: UnlockToastData;
  index: number;
}> = ({ data, index }) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  // Entry/exit animation values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  // Icon animations
  const iconScale = useSharedValue(0);
  const iconRotate = useSharedValue(-30);

  useEffect(() => {
    // Smooth entry
    opacity.value = withTiming(1, { duration: 200 });
    translateY.value = withSpring(0, { damping: 18, stiffness: 280 });

    // Icon spring in with rotation
    iconScale.value = withDelay(
      80,
      withSpring(1, { damping: 10, stiffness: 180 })
    );
    iconRotate.value = withDelay(
      80,
      withSpring(0, { damping: 12, stiffness: 120 })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotate.value}deg` },
    ],
  }));

  const emeraldAccent = "#10b981";

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        containerStyle,
        {
          backgroundColor: isDarkMode
            ? "rgba(30, 30, 30, 0.95)"
            : "rgba(255, 255, 255, 0.98)",
          borderColor: isDarkMode
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.08)",
          marginTop: index * 4,
        },
      ]}
    >
      {Platform.OS === "ios" && (
        <BlurView
          intensity={isDarkMode ? 40 : 60}
          tint={isDarkMode ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Content */}
      <View style={styles.content}>
        {/* Unlock icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            { backgroundColor: `${emeraldAccent}15` },
            iconStyle,
          ]}
        >
          <LockOpen size={20} color={emeraldAccent} strokeWidth={2.5} />
        </Animated.View>

        {/* Text content */}
        <View style={styles.textContainer}>
          <Typography
            variant="body2"
            weight="semibold"
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {data.exerciseName}
          </Typography>
          {data.unlockedByExerciseName && (
            <Typography variant="caption" color="textMuted" numberOfLines={1}>
              {t.unlockedThanksTo[lang]} {data.unlockedByExerciseName}
            </Typography>
          )}
        </View>

        {/* Unlock Badge */}
        <View
          style={[styles.prBadge, { backgroundColor: `${emeraldAccent}15` }]}
        >
          <Typography
            variant="caption"
            weight="bold"
            style={{ color: emeraldAccent, fontSize: 10 }}
          >
            {t.unlocked[lang]}
          </Typography>
        </View>
      </View>
    </Animated.View>
  );
};

// ============================================
// TOAST ITEM ROUTER
// ============================================

const ToastItem: React.FC<{
  data: ToastData;
  index: number;
}> = ({ data, index }) => {
  if (data.type === "pr") {
    return <PRToastItem data={data} index={index} />;
  }
  return <UnlockToastItem data={data} index={index} />;
};

// ============================================
// TOAST PORTAL (RENDERS ALL TOASTS)
// ============================================

export const ToastPortal: React.FC = () => {
  const { toasts, showPRToast, showUnlockToast } = useToast();
  const insets = useSafeAreaInsets();

  // Initialize global toast functions for non-React code
  useEffect(() => {
    initializeGlobalToast(showPRToast, showUnlockToast);
  }, [showPRToast, showUnlockToast]);

  if (toasts.length === 0) return null;

  return (
    <View
      style={[
        styles.portal,
        {
          top: insets.top + 8,
        },
      ]}
      pointerEvents="box-none"
    >
      {toasts.map((toast, index) => (
        <ToastItem key={toast.id} data={toast.data} index={index} />
      ))}
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  portal: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 99999,
    elevation: 99999,
    alignItems: "center",
  },
  toastContainer: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  prBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
});
