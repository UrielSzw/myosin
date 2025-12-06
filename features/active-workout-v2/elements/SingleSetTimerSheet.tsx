import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useHaptic } from "@/shared/services/haptic-service";
import { activeWorkoutTranslations } from "@/shared/translations/active-workout";
import { toSupportedLanguage } from "@/shared/types/language";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import { BlurView } from "expo-blur";
import { Check, Pause, Play, RotateCcw, X } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CIRCLE_SIZE = Math.min(SCREEN_WIDTH * 0.65, 260);
const TICK_INTERVAL = 100;

type TimerState = "idle" | "running" | "paused" | "complete";

type Props = {
  visible: boolean;
  duration: number; // seconds
  exerciseName: string;
  setNumber: number;
  totalSets: number;
  onClose: () => void;
  onComplete: (actualDuration: number) => void;
};

export const SingleSetTimerSheet: React.FC<Props> = ({
  visible,
  duration,
  exerciseName,
  setNumber,
  totalSets,
  onClose,
  onComplete,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const t = activeWorkoutTranslations;
  const haptic = useHaptic();

  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reanimated values for progress circle
  const ringProgress = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  // Circle dimensions
  const strokeWidth = 10;
  const radius = (CIRCLE_SIZE - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Audio
  const audioPlayer = useAudioPlayer(
    require("@/assets/audio/timer_complete.wav")
  );

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
    });
  }, []);

  // Reset when opening
  useEffect(() => {
    if (visible) {
      setTimerState("idle");
      setTimeRemaining(duration);
      setTimeElapsed(0);
      ringProgress.value = 0;
      pulseScale.value = 1;
    }
  }, [visible, duration, ringProgress, pulseScale]);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update progress animation
  useEffect(() => {
    if (duration > 0) {
      const progress = timeElapsed / duration;
      ringProgress.value = withTiming(progress, { duration: 100 });
    }
  }, [timeElapsed, duration, ringProgress]);

  // Pulse animation for running state
  useEffect(() => {
    if (timerState === "running") {
      pulseScale.value = withSpring(1.02, { damping: 10 });
    } else {
      pulseScale.value = withSpring(1, { damping: 15 });
    }
  }, [timerState, pulseScale]);

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - ringProgress.value),
  }));

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const playCompleteSound = useCallback(() => {
    try {
      audioPlayer.seekTo(0);
      audioPlayer.play();
    } catch (error) {
      console.log("Error playing completion sound:", error);
    }
  }, [audioPlayer]);

  const handleComplete = useCallback(() => {
    clearTimer();
    setTimerState("complete");
    haptic.heavy();
    playCompleteSound();

    // Auto-close and complete after a short delay
    setTimeout(() => {
      onComplete(duration);
      onClose();
    }, 800);
  }, [clearTimer, haptic, playCompleteSound, onComplete, duration, onClose]);

  // Complete with partial time (when user stops early)
  const handleCompletePartial = useCallback(() => {
    clearTimer();
    const actualTime = Math.round(timeElapsed);
    haptic.medium();
    onComplete(actualTime);
    onClose();
  }, [clearTimer, timeElapsed, haptic, onComplete, onClose]);

  // Complete with target time without running timer
  const handleCompleteTarget = useCallback(() => {
    haptic.medium();
    onComplete(duration);
    onClose();
  }, [haptic, onComplete, duration, onClose]);

  // Timer logic
  useEffect(() => {
    if (timerState === "running") {
      clearTimer();

      intervalRef.current = setInterval(() => {
        setTimeElapsed((prev) => {
          const newElapsed = prev + 0.1;
          const newRemaining = Math.max(0, duration - newElapsed);
          setTimeRemaining(newRemaining);

          // Haptic tick on each second
          if (Math.floor(newElapsed) > Math.floor(prev)) {
            if (newRemaining <= 3 && newRemaining > 0) {
              haptic.medium();
            }
          }

          // Complete
          if (newRemaining <= 0) {
            handleComplete();
          }

          return newElapsed;
        });
      }, TICK_INTERVAL);

      return clearTimer;
    }

    return clearTimer;
  }, [timerState, duration, clearTimer, haptic, handleComplete]);

  const handleStart = () => {
    haptic.medium();
    setTimerState("running");
  };

  const handlePause = () => {
    haptic.light();
    clearTimer();
    setTimerState("paused");
  };

  const handleResume = () => {
    haptic.light();
    setTimerState("running");
  };

  const handleReset = () => {
    haptic.light();
    clearTimer();
    setTimerState("idle");
    setTimeRemaining(duration);
    setTimeElapsed(0);
    ringProgress.value = 0;
  };

  const handleClose = () => {
    clearTimer();
    onClose();
  };

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    return secs.toString();
  };

  const getStateColor = () => {
    if (timerState === "complete") return colors.success[500];
    return colors.primary[500];
  };

  const stateColor = getStateColor();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode
              ? "rgba(0,0,0,0.95)"
              : "rgba(255,255,255,0.98)",
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 80 : 90}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [
              styles.closeButton,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <X size={20} color={colors.textMuted} />
          </Pressable>

          <View style={styles.headerText}>
            <Typography
              variant="body1"
              weight="semibold"
              style={{ color: colors.text }}
              numberOfLines={1}
            >
              {exerciseName}
            </Typography>
            <Typography variant="caption" color="textMuted">
              Set {setNumber} {t.of[lang]} {totalSets}
            </Typography>
          </View>

          <View style={{ width: 36 }} />
        </View>

        {/* Timer Circle */}
        <View style={styles.timerContainer}>
          <View style={styles.circleContainer}>
            {/* Background circle */}
            <View
              style={[
                styles.circleBackground,
                {
                  width: CIRCLE_SIZE,
                  height: CIRCLE_SIZE,
                  borderRadius: CIRCLE_SIZE / 2,
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.08)",
                },
              ]}
            >
              {/* Progress SVG */}
              <Svg
                width={CIRCLE_SIZE}
                height={CIRCLE_SIZE}
                style={[
                  StyleSheet.absoluteFill,
                  { transform: [{ rotate: "-90deg" }] },
                ]}
              >
                {/* Background track */}
                <Circle
                  cx={CIRCLE_SIZE / 2}
                  cy={CIRCLE_SIZE / 2}
                  r={radius}
                  stroke={
                    isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"
                  }
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                {/* Progress */}
                <AnimatedCircle
                  cx={CIRCLE_SIZE / 2}
                  cy={CIRCLE_SIZE / 2}
                  r={radius}
                  stroke={stateColor}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  animatedProps={animatedCircleProps}
                />
              </Svg>

              {/* Time Display */}
              <View style={styles.timeDisplay}>
                <Typography
                  variant="h1"
                  weight="bold"
                  style={{
                    color: stateColor,
                    fontSize: CIRCLE_SIZE * 0.32,
                    lineHeight: CIRCLE_SIZE * 0.38,
                  }}
                >
                  {timerState === "complete" ? "✓" : formatTime(timeRemaining)}
                </Typography>
                {timerState === "idle" && (
                  <Typography
                    variant="caption"
                    color="textMuted"
                    style={{ marginTop: 4 }}
                  >
                    {t.singleSetTimer.target[lang]}
                  </Typography>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {/* Primary action buttons row */}
          {timerState === "idle" && (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleStart}
              icon={<Play size={20} color="#fff" fill="#fff" />}
            >
              {t.singleSetTimer.start[lang]}
            </Button>
          )}

          {timerState === "running" && (
            <View style={styles.controlsRow}>
              <Pressable
                onPress={handlePause}
                style={[
                  styles.controlButton,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.04)",
                    borderWidth: 1,
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.08)",
                  },
                ]}
              >
                <Pause size={20} color={colors.text} />
                <Typography
                  variant="caption"
                  style={{ color: colors.text, marginTop: 4 }}
                >
                  {t.singleSetTimer.pause[lang]}
                </Typography>
              </Pressable>
            </View>
          )}

          {timerState === "paused" && (
            <View style={styles.controlsRow}>
              <Pressable
                onPress={handleResume}
                style={[
                  styles.controlButton,
                  {
                    backgroundColor: `${colors.primary[500]}15`,
                    borderWidth: 1,
                    borderColor: `${colors.primary[500]}30`,
                  },
                ]}
              >
                <Play
                  size={20}
                  color={colors.primary[500]}
                  fill={colors.primary[500]}
                />
                <Typography
                  variant="caption"
                  style={{ color: colors.primary[500], marginTop: 4 }}
                >
                  {t.singleSetTimer.resume[lang]}
                </Typography>
              </Pressable>

              <Pressable
                onPress={handleCompletePartial}
                style={[
                  styles.controlButton,
                  {
                    backgroundColor: `${colors.success[500]}15`,
                    borderWidth: 1,
                    borderColor: `${colors.success[500]}30`,
                  },
                ]}
              >
                <Check size={20} color={colors.success[500]} />
                <Typography
                  variant="caption"
                  style={{ color: colors.success[500], marginTop: 4 }}
                >
                  {t.singleSetTimer.complete[lang]} ({Math.round(timeElapsed)}s)
                </Typography>
              </Pressable>

              <Pressable
                onPress={handleReset}
                style={[
                  styles.controlButton,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.04)",
                    borderWidth: 1,
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.08)",
                  },
                ]}
              >
                <RotateCcw size={20} color={colors.text} />
                <Typography
                  variant="caption"
                  style={{ color: colors.text, marginTop: 4 }}
                >
                  {t.singleSetTimer.reset[lang]}
                </Typography>
              </Pressable>
            </View>
          )}

          {timerState === "complete" && (
            <Button variant="primary" size="lg" fullWidth onPress={onClose}>
              {t.singleSetTimer.completed[lang]}
            </Button>
          )}

          {/* Complete target button - always visible except when complete */}
          {timerState !== "complete" && (
            <Pressable
              onPress={handleCompleteTarget}
              style={[
                styles.completeTargetButton,
                {
                  backgroundColor: `${colors.success[500]}10`,
                  borderWidth: 1,
                  borderColor: `${colors.success[500]}25`,
                },
              ]}
            >
              <Check size={18} color={colors.success[500]} />
              <Typography
                variant="body2"
                weight="medium"
                style={{ color: colors.success[500], marginLeft: 8 }}
              >
                {t.singleSetTimer.completeTarget[lang]}
              </Typography>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    alignItems: "center",
  },
  timerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleBackground: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  timeDisplay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    alignItems: "center",
    gap: 16,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    width: "100%",
  },
  controlButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
  },
  completeTargetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: "100%",
  },
});
