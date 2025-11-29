import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useHaptic } from "@/shared/services/haptic-service";
import { tempoMetronomeTranslations } from "@/shared/translations/tempo-metronome";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Pause, Play, RotateCcw, X } from "lucide-react-native";
import React, { useCallback, useEffect, useReducer, useRef } from "react";
import {
  Animated,
  Modal,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ============================================================================
// CONSTANTS & TYPES
// ============================================================================

const COUNTDOWN_SECONDS = 5;
const TICK_INTERVAL = 100;

interface Props {
  visible: boolean;
  onClose: () => void;
  tempo?: string | null;
}

interface TempoPhase {
  name: string;
  duration: number;
  color: string;
  type: "eccentric" | "pause1" | "concentric" | "pause2";
}

const PHASE_COLORS = {
  eccentric: "#22C55E",
  pause1: "#F59E0B",
  concentric: "#EF4444",
  pause2: "#F59E0B",
} as const;

const PHASE_NAMES = {
  eccentric: "Excéntrica",
  pause1: "Pausa Inferior",
  concentric: "Concéntrica",
  pause2: "Pausa Superior",
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

const parseTempoString = (tempoString?: string | null): TempoPhase[] => {
  if (!tempoString) return [];

  const [eccentric, pause1, concentric, pause2] = tempoString
    .split("-")
    .map(Number);

  const phases: TempoPhase[] = [
    {
      name: PHASE_NAMES.eccentric,
      duration: eccentric,
      color: PHASE_COLORS.eccentric,
      type: "eccentric",
    },
    {
      name: PHASE_NAMES.pause1,
      duration: pause1,
      color: PHASE_COLORS.pause1,
      type: "pause1",
    },
    {
      name: PHASE_NAMES.concentric,
      duration: concentric,
      color: PHASE_COLORS.concentric,
      type: "concentric",
    },
    {
      name: PHASE_NAMES.pause2,
      duration: pause2,
      color: PHASE_COLORS.pause2,
      type: "pause2",
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

    case "COUNTDOWN_TICK":
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

    case "START_TEMPO":
      return {
        ...state,
        timerState: "running",
        currentPhaseIndex: 0,
        currentPhaseTime: 0,
        currentCycle: state.currentCycle || 1,
      };

    case "TEMPO_TICK":
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
// MAIN COMPONENT
// ============================================================================

export const TempoMetronomeV2: React.FC<Props> = ({
  visible,
  onClose,
  tempo,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = tempoMetronomeTranslations;
  const haptic = useHaptic();

  const [state, dispatch] = useReducer(timerReducer, initialState);

  const phases = parseTempoString(tempo);
  const currentPhase = phases[state.currentPhaseIndex];

  const intervalRef = useRef<number | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // ============================================================================
  // HAPTIC FEEDBACK
  // ============================================================================

  const playTickHaptic = useCallback(async () => {
    haptic.light();
  }, [haptic]);

  const playPhaseChangeHaptic = useCallback(async () => {
    haptic.medium();
  }, [haptic]);

  // ============================================================================
  // ANIMATIONS
  // ============================================================================

  const triggerHeartbeat = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
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
    haptic.light();
  }, [haptic]);

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

  // Reset when modal closes
  useEffect(() => {
    if (!visible) {
      dispatch({ type: "RESET" });
      stopInterval();
    }
  }, [visible, stopInterval]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const getDisplayNumber = () => {
    if (state.timerState === "countdown") {
      return state.countdownValue === 0
        ? "¡YA!"
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

    return colors.border;
  };

  const getDisplayText = () => {
    if (state.timerState === "countdown") {
      return "Prepárate";
    }

    if (state.timerState === "running" && currentPhase) {
      return currentPhase.name;
    }

    if (state.timerState === "paused") {
      return "Pausado";
    }

    return "Presiona para comenzar";
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
      <StatusBar hidden />
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleClose}
            style={[
              styles.closeButton,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            <X size={24} color={colors.text} />
          </TouchableOpacity>

          <Typography variant="h6" weight="semibold" color="text">
            Guía de Tempo
          </Typography>

          <Typography
            variant="body2"
            color="textMuted"
            style={{ fontFamily: "monospace" }}
          >
            {tempo || "---"}
          </Typography>
        </View>

        {/* Main Display Area */}
        <View style={styles.mainDisplay}>
          {/* Cycle Counter */}
          {state.currentCycle > 0 && (
            <Typography
              variant="body1"
              color="textMuted"
              style={styles.cycleCounter}
            >
              Ciclo {state.currentCycle}
            </Typography>
          )}

          {/* Main Circle */}
          <Animated.View
            style={[
              styles.circleContainer,
              {
                backgroundColor: getDisplayColor(),
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Typography
              weight="extrabold"
              style={[styles.mainNumber, { color: "#ffffff" }]}
            >
              {getDisplayNumber()}
            </Typography>

            <Typography
              variant="h6"
              weight="semibold"
              style={[styles.phaseLabel, { color: "rgba(255,255,255,0.9)" }]}
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
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
            >
              <Typography variant="caption" color="textMuted">
                Siguiente:{" "}
                {phases[(state.currentPhaseIndex + 1) % phases.length]?.name}
              </Typography>
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
                    : colors.border,
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

        {/* Controls */}
        <View style={styles.controls}>
          {state.timerState === "idle" && (
            <Button
              onPress={handleStart}
              iconPosition="left"
              icon={<Play size={24} color="#ffffff" />}
            >
              <Typography
                variant="button"
                weight="semibold"
                style={{ color: "#ffffff" }}
              >
                {t.start[lang]}
              </Typography>
            </Button>
          )}

          {state.timerState === "running" && (
            <Button
              onPress={handlePause}
              icon={<Pause size={24} color="#ffffff" />}
              iconPosition="left"
            >
              <Typography
                variant="button"
                weight="semibold"
                style={{ color: "#ffffff" }}
              >
                {t.pause[lang]}
              </Typography>
            </Button>
          )}

          {state.timerState === "paused" && (
            <Button
              onPress={handleResume}
              icon={<Play size={24} color="#ffffff" />}
              iconPosition="left"
            >
              <Typography
                variant="button"
                weight="semibold"
                style={{ color: "#ffffff" }}
              >
                {t.resume[lang]}
              </Typography>
            </Button>
          )}

          {(state.timerState === "running" ||
            state.timerState === "paused" ||
            state.currentCycle > 0) && (
            <Button
              onPress={handleReset}
              icon={<RotateCcw size={24} color={colors.textMuted} />}
              iconPosition="left"
              variant="outline"
            >
              <Typography variant="body1" weight="medium" color="textMuted">
                {t.restart[lang]}
              </Typography>
            </Button>
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 10,
    borderRadius: 12,
  },
  mainDisplay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  cycleCounter: {
    marginBottom: 20,
    textAlign: "center",
  },
  circleContainer: {
    width: 280,
    height: 280,
    borderRadius: 140,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  mainNumber: {
    fontSize: 100,
    textAlign: "center",
    lineHeight: 100,
  },
  phaseLabel: {
    textAlign: "center",
    marginTop: 8,
  },
  nextPhaseContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  progressSection: {
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 20,
    gap: 16,
  },
});
