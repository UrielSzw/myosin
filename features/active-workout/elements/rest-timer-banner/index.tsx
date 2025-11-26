import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
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
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  useActiveRestTimer,
  useActiveRestTimerActions,
} from "../../hooks/use-active-workout-store";
import { useTimer } from "../../hooks/use-timer";

const BANNER_HEIGHT = 64;
const PROGRESS_HEIGHT = 4;

export const RestTimerBanner: React.FC = () => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = activeWorkoutTranslations;
  const { skipRestTimer } = useActiveRestTimerActions();
  const restTimerStore = useActiveRestTimer();
  const { totalTime, startedAt } = restTimerStore || {};

  const audioPlayer = useAudioPlayer(
    require("@/assets/audio/timer_complete.wav")
  );

  // Keyboard visibility tracking
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Shared values for animations
  const translateY = useSharedValue(BANNER_HEIGHT + PROGRESS_HEIGHT);
  const opacity = useSharedValue(0);

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
    Vibration.vibrate([100, 50, 500, 50, 100]);
    try {
      audioPlayer.seekTo(0);
      audioPlayer.play();
    } catch (error) {
      console.log("Error playing completion sound:", error);
    }
  }, [audioPlayer]);

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
      playCompletionAlert();
      setTimeout(() => {
        runOnJS(dismissBanner)();
        setTimeout(() => {
          skipRestTimer();
        }, 300);
      }, 1000);
    },
  });

  // Show banner when timer starts
  useEffect(() => {
    if (startedAt && restTimeSeconds > 0) {
      startTimer(
        restTimeSeconds,
        t.restTimeFinished[lang],
        t.restTimeFinishedBody[lang]
      );

      // Slide up animation (no bounce)
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

  const progressWidth = useSharedValue(0);

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

  if (!restTimerStore) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        animatedStyle,
      ]}
    >
      {/* Progress bar */}
      <View
        style={[
          styles.progressContainer,
          { backgroundColor: isDarkMode ? colors.gray[800] : colors.gray[200] },
        ]}
      >
        <Animated.View
          style={[
            styles.progressBar,
            {
              backgroundColor:
                timeRemaining <= 10
                  ? colors.error[500]
                  : timeRemaining <= 30
                  ? colors.warning[500]
                  : colors.primary[500],
            },
            progressStyle,
          ]}
        />
      </View>

      {/* Banner content */}
      <View style={styles.content}>
        <Pressable
          onPress={handleTimerPress}
          style={styles.timerSection}
          android_ripple={{ color: colors.primary[500] + "20" }}
        >
          <Timer
            size={20}
            color={
              timeRemaining <= 10 ? colors.error[500] : colors.primary[500]
            }
            style={styles.timerIcon}
          />
          <View>
            <Typography
              variant="h2"
              weight="bold"
              style={[
                styles.timerText,
                {
                  color:
                    timeRemaining <= 10
                      ? colors.error[500]
                      : colors.primary[500],
                },
              ]}
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

        <View style={styles.controls}>
          <TouchableOpacity
            onPress={handleSubtractTime}
            style={[
              styles.controlButton,
              {
                backgroundColor: isDarkMode
                  ? colors.gray[700]
                  : colors.gray[100],
              },
            ]}
          >
            <Typography variant="body2" color="textMuted" weight="medium">
              -10s
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAddTime}
            style={[
              styles.controlButton,
              {
                backgroundColor: isDarkMode
                  ? colors.gray[700]
                  : colors.gray[100],
              },
            ]}
          >
            <Typography variant="body2" color="textMuted" weight="medium">
              +10s
            </Typography>
          </TouchableOpacity>
        </View>

        {isKeyboardVisible && (
          <TouchableOpacity
            onPress={handleDismissKeyboard}
            style={[
              styles.dismissKeyboardButton,
              {
                backgroundColor: isDarkMode
                  ? colors.gray[700]
                  : colors.gray[100],
              },
            ]}
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

        <TouchableOpacity
          onPress={handleSkip}
          style={[
            styles.skipButton,
            {
              backgroundColor: isDarkMode ? colors.gray[700] : colors.gray[100],
            },
          ]}
        >
          <Typography variant="body1" weight="medium" color="textMuted">
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
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
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
    gap: 12,
  },
  timerSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  timerIcon: {
    marginRight: 4,
  },
  timerText: {
    fontSize: 24,
    lineHeight: 28,
  },
  pausedText: {
    fontSize: 10,
    marginTop: -2,
  },
  label: {
    flex: 1,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    justifyContent: "center",
  },
  controlButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  dismissKeyboardButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
