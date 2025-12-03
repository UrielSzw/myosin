import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useHaptic } from "@/shared/services/haptic-service";
import { tempoMetronomeTranslations } from "@/shared/translations/tempo-metronome";
import { Typography } from "@/shared/ui/typography";
import {
  ArrowDown,
  ArrowUp,
  Clock,
  Pause,
  Play,
  RotateCcw,
  Square,
  X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useReducer, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ============================================================================
// CONSTANTS & TYPES
// ============================================================================

const COUNTDOWN_SECONDS = 5;
const TICK_INTERVAL = 100;
const CIRCLE_SIZE = Math.min(SCREEN_WIDTH * 0.75, 300);

type Props = {
  visible: boolean;
  tempo?: string | null;
  onClose: () => void;
};

interface TempoPhase {
  name: { es: string; en: string };
  duration: number;
  color: string;
  type: "eccentric" | "pause1" | "concentric" | "pause2";
  icon: "ArrowDown" | "Pause" | "ArrowUp" | "Square";
}

const PHASE_COLORS = {
  eccentric: "#22C55E",
  pause1: "#F59E0B",
  concentric: "#EF4444",
  pause2: "#F59E0B",
} as const;

type TimerState = "idle" | "countdown" | "running" | "paused" | "finished";

interface State {
  timerState: TimerState;
  countdownValue: number;
  countdownTimeElapsed: number;
  currentPhaseIndex: number;
  currentPhaseTime: number;
  currentCycle: number;
  totalElapsed: number;
}

type Action =
  | { type: "START_COUNTDOWN" }
  | { type: "COUNTDOWN_TICK" }
  | { type: "START_TEMPO" }
  | { type: "TEMPO_TICK"; phaseDuration: number; totalPhases: number }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "RESET" }
  | { type: "FINISH" };

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const parseTempoString = (
  tempoString: string | null | undefined,
  t: typeof tempoMetronomeTranslations
): TempoPhase[] => {
  if (!tempoString) return [];

  const [eccentric, pause1, concentric, pause2] = tempoString
    .split("-")
    .map(Number);

  const phases: TempoPhase[] = [
    {
      name: t.phases.eccentric,
      duration: eccentric,
      color: PHASE_COLORS.eccentric,
      type: "eccentric",
      icon: "ArrowDown",
    },
    {
      name: t.phases.pause1,
      duration: pause1,
      color: PHASE_COLORS.pause1,
      type: "pause1",
      icon: "Pause",
    },
    {
      name: t.phases.concentric,
      duration: concentric,
      color: PHASE_COLORS.concentric,
      type: "concentric",
      icon: "ArrowUp",
    },
    {
      name: t.phases.pause2,
      duration: pause2,
      color: PHASE_COLORS.pause2,
      type: "pause2",
      icon: "Square",
    },
  ];

  return phases.filter((phase) => phase.duration > 0);
};

// ============================================================================
// REDUCER
// ============================================================================

const initialState: State = {
  timerState: "idle",
  countdownValue: COUNTDOWN_SECONDS,
  countdownTimeElapsed: 0,
  currentPhaseIndex: 0,
  currentPhaseTime: 0,
  currentCycle: 0,
  totalElapsed: 0,
};

const timerReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "START_COUNTDOWN":
      return {
        ...state,
        timerState: "countdown",
        countdownValue: COUNTDOWN_SECONDS,
        countdownTimeElapsed: 0,
        currentPhaseIndex: 0,
        currentPhaseTime: 0,
        totalElapsed: 0,
      };

    case "COUNTDOWN_TICK": {
      const newCountdownElapsed = state.countdownTimeElapsed + 0.1;
      const newCountdownValue =
        COUNTDOWN_SECONDS - Math.floor(newCountdownElapsed);

      if (newCountdownValue <= 0) {
        return {
          ...state,
          timerState: "running",
          countdownValue: 0,
          countdownTimeElapsed: 0,
          currentCycle: state.currentCycle + 1,
        };
      }

      return {
        ...state,
        countdownValue: newCountdownValue,
        countdownTimeElapsed: newCountdownElapsed,
      };
    }

    case "START_TEMPO":
      return {
        ...state,
        timerState: "running",
        currentPhaseIndex: 0,
        currentPhaseTime: 0,
        currentCycle: state.currentCycle || 1,
      };

    case "TEMPO_TICK": {
      const newTime = state.currentPhaseTime + 0.1;
      const newElapsed = state.totalElapsed + 0.1;

      if (newTime >= action.phaseDuration) {
        const nextPhaseIndex =
          (state.currentPhaseIndex + 1) % action.totalPhases;
        const newCycle =
          nextPhaseIndex === 0 ? state.currentCycle + 1 : state.currentCycle;

        return {
          ...state,
          currentPhaseIndex: nextPhaseIndex,
          currentPhaseTime: 0,
          currentCycle: newCycle,
          totalElapsed: newElapsed,
        };
      }

      return {
        ...state,
        currentPhaseTime: newTime,
        totalElapsed: newElapsed,
      };
    }

    case "PAUSE":
      return { ...state, timerState: "paused" };

    case "RESUME":
      return { ...state, timerState: "running" };

    case "RESET":
      return { ...initialState, currentCycle: 0 };

    case "FINISH":
      return { ...state, timerState: "finished" };

    default:
      return state;
  }
};

// ============================================================================
// PHASE ICON COMPONENT
// ============================================================================

const PhaseIcon = ({
  icon,
  size,
  color,
}: {
  icon: TempoPhase["icon"];
  size: number;
  color: string;
}) => {
  switch (icon) {
    case "ArrowDown":
      return <ArrowDown size={size} color={color} />;
    case "Pause":
      return <Pause size={size} color={color} />;
    case "ArrowUp":
      return <ArrowUp size={size} color={color} />;
    case "Square":
      return <Square size={size} color={color} />;
    default:
      return null;
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const TempoMetronomeV2: React.FC<Props> = ({
  visible,
  tempo,
  onClose,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";
  const t = tempoMetronomeTranslations;
  const haptic = useHaptic();

  const [state, dispatch] = useReducer(timerReducer, initialState);

  const phases = parseTempoString(tempo, t);
  const currentPhase = phases[state.currentPhaseIndex];

  const intervalRef = useRef<number | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // ============================================================================
  // HAPTIC FEEDBACK
  // ============================================================================

  const playTickHaptic = useCallback(() => {
    haptic.light();
  }, [haptic]);

  const playPhaseChangeHaptic = useCallback(() => {
    haptic.medium();
  }, [haptic]);

  // ============================================================================
  // ANIMATIONS
  // ============================================================================

  const triggerHeartbeat = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.08,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim]);

  const updateProgress = useCallback(() => {
    if (currentPhase) {
      const progress = state.currentPhaseTime / currentPhase.duration;
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  }, [currentPhase, state.currentPhaseTime, progressAnim]);

  // Pulse animation for idle state
  useEffect(() => {
    if (state.timerState === "idle") {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.02,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [state.timerState, pulseAnim]);

  // ============================================================================
  // TIMER LOGIC
  // ============================================================================

  const startInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (state.timerState === "countdown") {
        const prevCountdownValue =
          COUNTDOWN_SECONDS - Math.floor(state.countdownTimeElapsed);
        dispatch({ type: "COUNTDOWN_TICK" });

        const newCountdownValue =
          COUNTDOWN_SECONDS - Math.floor(state.countdownTimeElapsed + 0.1);
        if (prevCountdownValue !== newCountdownValue) {
          playTickHaptic();
          triggerHeartbeat();
        }
      } else if (state.timerState === "running" && phases.length > 0) {
        const currentPhaseDuration =
          phases[state.currentPhaseIndex]?.duration || 1;
        dispatch({
          type: "TEMPO_TICK",
          phaseDuration: currentPhaseDuration,
          totalPhases: phases.length,
        });

        const timeInSeconds = Math.floor(state.currentPhaseTime);
        const nextTimeInSeconds = Math.floor(state.currentPhaseTime + 0.1);

        if (timeInSeconds !== nextTimeInSeconds) {
          triggerHeartbeat();
          playTickHaptic();
        }

        if (state.currentPhaseTime + 0.1 >= currentPhaseDuration) {
          playPhaseChangeHaptic();
        }
      }
    }, TICK_INTERVAL);
  }, [
    state.timerState,
    state.currentPhaseIndex,
    state.currentPhaseTime,
    state.countdownTimeElapsed,
    phases,
    triggerHeartbeat,
    playTickHaptic,
    playPhaseChangeHaptic,
  ]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ============================================================================
  // CONTROL HANDLERS
  // ============================================================================

  const handleStart = useCallback(() => {
    dispatch({ type: "START_COUNTDOWN" });
    haptic.heavy();
  }, [haptic]);

  const handlePause = useCallback(() => {
    dispatch({ type: "PAUSE" });
    haptic.medium();
  }, [haptic]);

  const handleResume = useCallback(() => {
    dispatch({ type: "RESUME" });
    haptic.medium();
  }, [haptic]);

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET" });
    progressAnim.setValue(0);
    haptic.light();
  }, [haptic, progressAnim]);

  const handleClose = useCallback(() => {
    stopInterval();
    dispatch({ type: "RESET" });
    onClose();
  }, [stopInterval, onClose]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (state.timerState === "countdown" || state.timerState === "running") {
      startInterval();
    } else {
      stopInterval();
    }

    return stopInterval;
  }, [state.timerState, startInterval, stopInterval]);

  useEffect(() => {
    updateProgress();
  }, [updateProgress]);

  useEffect(() => {
    return () => {
      stopInterval();
    };
  }, [stopInterval]);

  useEffect(() => {
    if (!visible) {
      dispatch({ type: "RESET" });
      stopInterval();
      progressAnim.setValue(0);
    }
  }, [visible, stopInterval, progressAnim]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getDisplayNumber = () => {
    if (state.timerState === "countdown") {
      return state.countdownValue === 0
        ? t.go[lang]
        : state.countdownValue.toString();
    }

    if (state.timerState === "running" && currentPhase) {
      return Math.ceil(
        currentPhase.duration - state.currentPhaseTime
      ).toString();
    }

    return "0";
  };

  const getDisplayColor = () => {
    if (state.timerState === "countdown") {
      return colors.primary[500];
    }

    if (state.timerState === "running" && currentPhase) {
      return currentPhase.color;
    }

    return isDarkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)";
  };

  const getDisplayText = () => {
    if (state.timerState === "countdown") {
      return t.getReady[lang];
    }

    if (state.timerState === "running" && currentPhase) {
      return currentPhase.name[lang];
    }

    if (state.timerState === "paused") {
      return t.paused[lang];
    }

    return t.pressToStart[lang];
  };

  const getAnimatedScale = () => {
    if (state.timerState === "idle") {
      return pulseAnim;
    }
    return scaleAnim;
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {/* Header V2 */}
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
            <X size={22} color={colors.text} />
          </Pressable>

          <View style={styles.headerCenter}>
            <View
              style={[
                styles.headerIcon,
                { backgroundColor: `${colors.primary[500]}20` },
              ]}
            >
              <Clock size={20} color={colors.primary[500]} />
            </View>
            <Typography
              variant="h5"
              weight="bold"
              style={{ marginLeft: 10, color: colors.text }}
            >
              {t.title[lang]}
            </Typography>
          </View>

          <View
            style={[
              styles.tempoBadge,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            <Typography
              variant="body2"
              weight="semibold"
              style={{ fontFamily: "monospace", color: colors.text }}
            >
              {tempo || "---"}
            </Typography>
          </View>
        </View>

        {/* Cycle Counter */}
        {state.currentCycle > 0 && (
          <View style={styles.cycleContainer}>
            <View
              style={[
                styles.cycleBadge,
                {
                  backgroundColor: `${colors.primary[500]}15`,
                  borderColor: `${colors.primary[500]}30`,
                },
              ]}
            >
              <Typography
                variant="body2"
                weight="semibold"
                style={{ color: colors.primary[500] }}
              >
                {t.cycle[lang]} {state.currentCycle}
              </Typography>
            </View>
          </View>
        )}

        {/* Main Display Area */}
        <View style={styles.mainDisplay}>
          {/* Main Circle */}
          <Animated.View
            style={[
              styles.circleContainer,
              {
                backgroundColor: getDisplayColor(),
                transform: [{ scale: getAnimatedScale() }],
                shadowColor: getDisplayColor(),
              },
            ]}
          >
            {/* Phase Icon (when running) */}
            {state.timerState === "running" && currentPhase && (
              <View style={styles.phaseIconContainer}>
                <PhaseIcon
                  icon={currentPhase.icon}
                  size={28}
                  color="rgba(255,255,255,0.6)"
                />
              </View>
            )}

            <Typography
              weight="extrabold"
              style={[
                styles.mainNumber,
                {
                  color:
                    state.timerState === "idle" ? colors.textMuted : "#ffffff",
                },
              ]}
            >
              {getDisplayNumber()}
            </Typography>

            <Typography
              variant="body1"
              weight="semibold"
              style={[
                styles.phaseLabel,
                {
                  color:
                    state.timerState === "idle"
                      ? colors.textMuted
                      : "rgba(255,255,255,0.9)",
                },
              ]}
            >
              {getDisplayText()}
            </Typography>
          </Animated.View>

          {/* Next Phase Indicator */}
          {state.timerState === "running" && phases.length > 1 && (
            <View
              style={[
                styles.nextPhaseContainer,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.08)",
                },
              ]}
            >
              <Typography
                variant="caption"
                weight="medium"
                color="textMuted"
                style={{ marginRight: 6 }}
              >
                {t.next[lang]}:
              </Typography>
              <View
                style={[
                  styles.nextPhaseChip,
                  {
                    backgroundColor: `${
                      phases[(state.currentPhaseIndex + 1) % phases.length]
                        ?.color
                    }20`,
                  },
                ]}
              >
                <PhaseIcon
                  icon={
                    phases[(state.currentPhaseIndex + 1) % phases.length]?.icon
                  }
                  size={12}
                  color={
                    phases[(state.currentPhaseIndex + 1) % phases.length]?.color
                  }
                />
                <Typography
                  variant="caption"
                  weight="semibold"
                  style={{
                    color:
                      phases[(state.currentPhaseIndex + 1) % phases.length]
                        ?.color,
                    marginLeft: 4,
                  }}
                >
                  {
                    phases[(state.currentPhaseIndex + 1) % phases.length]?.name[
                      lang
                    ]
                  }
                </Typography>
              </View>
            </View>
          )}
        </View>

        {/* Progress Bar */}
        {state.timerState === "running" && currentPhase && (
          <View style={styles.progressSection}>
            <View
              style={[
                styles.progressTrack,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.08)",
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    backgroundColor: currentPhase.color,
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        )}

        {/* Phase Legend (when idle) */}
        {state.timerState === "idle" && phases.length > 0 && (
          <View style={styles.legendContainer}>
            {phases.map((phase, index) => (
              <View
                key={index}
                style={[
                  styles.legendItem,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.02)",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)",
                  },
                ]}
              >
                <View
                  style={[
                    styles.legendIcon,
                    { backgroundColor: `${phase.color}20` },
                  ]}
                >
                  <PhaseIcon icon={phase.icon} size={14} color={phase.color} />
                </View>
                <Typography
                  variant="caption"
                  weight="medium"
                  style={{ color: colors.text, flex: 1 }}
                >
                  {phase.name[lang]}
                </Typography>
                <Typography
                  variant="caption"
                  weight="bold"
                  style={{ color: phase.color }}
                >
                  {phase.duration}s
                </Typography>
              </View>
            ))}
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          {state.timerState === "idle" && (
            <Pressable
              onPress={handleStart}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: colors.primary[500],
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <Play size={22} color="#ffffff" fill="#ffffff" />
              <Typography
                variant="body1"
                weight="bold"
                style={{ color: "#ffffff", marginLeft: 8 }}
              >
                {t.start[lang]}
              </Typography>
            </Pressable>
          )}

          {state.timerState === "countdown" && (
            <Pressable
              onPress={handleReset}
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.05)",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(0,0,0,0.1)",
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <X size={20} color={colors.textMuted} />
              <Typography
                variant="body1"
                weight="medium"
                color="textMuted"
                style={{ marginLeft: 8 }}
              >
                {t.restart[lang]}
              </Typography>
            </Pressable>
          )}

          {state.timerState === "running" && (
            <>
              <Pressable
                onPress={handlePause}
                style={({ pressed }) => [
                  styles.primaryButton,
                  {
                    backgroundColor: colors.primary[500],
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <Pause size={22} color="#ffffff" />
                <Typography
                  variant="body1"
                  weight="bold"
                  style={{ color: "#ffffff", marginLeft: 8 }}
                >
                  {t.pause[lang]}
                </Typography>
              </Pressable>

              <Pressable
                onPress={handleReset}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.05)",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(0,0,0,0.1)",
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <RotateCcw size={20} color={colors.textMuted} />
              </Pressable>
            </>
          )}

          {state.timerState === "paused" && (
            <>
              <Pressable
                onPress={handleResume}
                style={({ pressed }) => [
                  styles.primaryButton,
                  {
                    backgroundColor: colors.primary[500],
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <Play size={22} color="#ffffff" fill="#ffffff" />
                <Typography
                  variant="body1"
                  weight="bold"
                  style={{ color: "#ffffff", marginLeft: 8 }}
                >
                  {t.resume[lang]}
                </Typography>
              </Pressable>

              <Pressable
                onPress={handleReset}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.05)",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(0,0,0,0.1)",
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <RotateCcw size={20} color={colors.textMuted} />
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tempoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  cycleContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  cycleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  mainDisplay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  circleContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 16,
  },
  phaseIconContainer: {
    position: "absolute",
    top: 40,
  },
  mainNumber: {
    fontSize: 88,
    textAlign: "center",
    lineHeight: 92,
  },
  phaseLabel: {
    textAlign: "center",
    marginTop: 4,
  },
  nextPhaseContainer: {
    marginTop: 28,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  nextPhaseChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progressSection: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  legendContainer: {
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  legendIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
});
