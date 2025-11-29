import {
  useActiveRestTimer,
  useActiveRestTimerActions,
} from "@/features/active-workout-v2/hooks/use-active-workout-store";
import { useTimer } from "@/features/active-workout-v2/hooks/use-timer";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useHaptic } from "@/shared/services/haptic-service";
import { activeWorkoutTranslations } from "@/shared/translations/active-workout";
import { Typography } from "@/shared/ui/typography";
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import {
  ChevronDown,
  Keyboard as KeyboardIcon,
  Timer,
  X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  AppState,
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BANNER_HEIGHT = 68;
const PROGRESS_HEIGHT = 4;

export const RestTimerBannerV2: React.FC = () => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = activeWorkoutTranslations;
  const { skipRestTimer } = useActiveRestTimerActions();
  const restTimerStore = useActiveRestTimer();
  const { totalTime, startedAt } = restTimerStore || {};
  const haptic = useHaptic();
  const insets = useSafeAreaInsets();

  const audioPlayer = useAudioPlayer(
    require("@/assets/audio/timer_complete.wav")
  );

  // Keyboard visibility tracking
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Shared values for animations
  const translateY = useSharedValue(BANNER_HEIGHT + PROGRESS_HEIGHT);
  const opacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });
  }, []);

  // Keyboard visibility listeners
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const playCompletionAlert = useCallback(() => {
    haptic.timerComplete();
    try {
      audioPlayer.seekTo(0);
      audioPlayer.play();
    } catch (error) {
      console.log("Error playing completion sound:", error);
    }
  }, [audioPlayer, haptic]);

  const dismissBanner = useCallback(() => {
    translateY.value = withTiming(BANNER_HEIGHT + PROGRESS_HEIGHT, {
      duration: 300,
    });
    opacity.value = withTiming(0, { duration: 300 });
  }, [translateY, opacity]);

  const restTimeSeconds = totalTime || 0;

  const {
    timeRemaining,
    isPaused,
    progress,
    startTimer,
    pauseTimer,
    resumeTimer,
    skipTimer,
    addTime,
  } = useTimer({
    onComplete: () => {
      if (AppState.currentState === "active") {
        playCompletionAlert();
      }

      setTimeout(
        () => {
          dismissBanner();
          setTimeout(() => {
            skipRestTimer();
          }, 300);
        },
        AppState.currentState === "active" ? 1000 : 0
      );
    },
  });

  // Show banner when timer starts
  useEffect(() => {
    if (startedAt && restTimeSeconds > 0) {
      progressWidth.value = 0;

      startTimer(
        restTimeSeconds,
        t.restTimeFinished[lang],
        t.restTimeFinishedBody[lang]
      );

      translateY.value = withTiming(0, { duration: 250 });
      opacity.value = withTiming(1, { duration: 200 });
    }
  }, [
    startedAt,
    restTimeSeconds,
    startTimer,
    lang,
    t.restTimeFinished,
    t.restTimeFinishedBody,
    translateY,
    opacity,
    progressWidth,
  ]);

  // Hide banner when timer is cleared
  useEffect(() => {
    if (!restTimerStore) {
      dismissBanner();
    }
  }, [restTimerStore, dismissBanner]);

  const handleSkip = useCallback(() => {
    skipTimer();
    dismissBanner();
    setTimeout(() => {
      skipRestTimer();
    }, 300);
  }, [skipTimer, skipRestTimer, dismissBanner]);

  const handleTimerPress = useCallback(() => {
    if (isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  }, [isPaused, pauseTimer, resumeTimer]);

  const handleAddTime = useCallback(() => {
    addTime(10);
  }, [addTime]);

  const handleSubtractTime = useCallback(() => {
    addTime(-10);
  }, [addTime]);

  const handleDismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    progressWidth.value = withTiming(progress * 100, {
      duration: 1000,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  // Get timer color based on remaining time
  const getTimerColor = () => {
    if (timeRemaining <= 10) return colors.error[500];
    if (timeRemaining <= 30) return colors.warning[500];
    return colors.primary[500];
  };

  if (!restTimerStore) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? "rgba(20,20,20,0.95)"
            : "rgba(255,255,255,0.95)",
          borderTopColor: isDarkMode
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.05)",
        },
        animatedStyle,
        {
          paddingBottom: isKeyboardVisible
            ? 0
            : insets.bottom > 0
            ? insets.bottom
            : 16,
        },
      ]}
    >
      {/* Progress bar */}
      <View
        style={[
          styles.progressContainer,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.05)",
          },
        ]}
      >
        <Animated.View
          style={[
            styles.progressBar,
            { backgroundColor: getTimerColor() },
            progressStyle,
          ]}
        />
      </View>

      {/* Banner content */}
      <View style={styles.content}>
        {/* Timer Section */}
        <Pressable
          onPress={handleTimerPress}
          style={[
            styles.timerSection,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.03)",
            },
          ]}
        >
          <Timer size={20} color={getTimerColor()} />
          <View>
            <Typography
              variant="h2"
              weight="bold"
              style={[styles.timerText, { color: getTimerColor() }]}
            >
              {formatTime(timeRemaining)}
            </Typography>
            {isPaused && (
              <Typography
                variant="caption"
                color="textMuted"
                style={styles.pausedText}
              >
                Paused
              </Typography>
            )}
          </View>
        </Pressable>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={handleSubtractTime}
            style={[
              styles.controlButton,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
            activeOpacity={0.7}
          >
            <Typography variant="body2" color="textMuted" weight="semibold">
              -10s
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAddTime}
            style={[
              styles.controlButton,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
            activeOpacity={0.7}
          >
            <Typography variant="body2" color="textMuted" weight="semibold">
              +10s
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Dismiss Keyboard Button */}
        {isKeyboardVisible && (
          <TouchableOpacity
            onPress={handleDismissKeyboard}
            style={[
              styles.dismissKeyboardButton,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.keyboardIconContainer}>
              <KeyboardIcon size={14} color={colors.textMuted} />
              <ChevronDown
                size={12}
                color={colors.textMuted}
                style={{ marginTop: -2 }}
              />
            </View>
          </TouchableOpacity>
        )}

        {/* Skip Button */}
        <TouchableOpacity
          onPress={handleSkip}
          style={[
            styles.skipButton,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.05)",
            },
          ]}
          activeOpacity={0.7}
        >
          <Typography variant="body2" weight="semibold" color="textMuted">
            {t.skip[lang]}
          </Typography>
          <X size={16} color={colors.textMuted} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  progressContainer: {
    height: PROGRESS_HEIGHT,
    width: "100%",
  },
  progressBar: {
    height: "100%",
  },
  content: {
    height: BANNER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
  },
  timerSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  timerText: {
    fontSize: 26,
    lineHeight: 30,
    fontVariant: ["tabular-nums"],
  },
  pausedText: {
    fontSize: 10,
    marginTop: -2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    justifyContent: "center",
  },
  controlButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dismissKeyboardButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  keyboardIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
});
