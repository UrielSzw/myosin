import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useHaptic } from "@/shared/services/haptic-service";
import { tempoMetronomeTranslations } from "@/shared/translations/tempo-metronome";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Pause, Play, RotateCcw, X } from "lucide-react-native";
import { forwardRef, useCallback, useEffect, useReducer, useRef } from "react";
import {
  Animated,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../button";

// ============================================================================
// CONSTANTS & TYPES
// ============================================================================

const COUNTDOWN_SECONDS = 5; // Configurable countdown duration
const TICK_INTERVAL = 100; // Update interval in milliseconds for smooth animations

interface TempoMetronomeProps {
  tempo?: string | null; // Format: "2-1-4-0" (eccentric-pause1-concentric-pause2)
}

interface TempoPhase {
  name: { es: string; en: string };
  duration: number;
  color: string;
  type: "eccentric" | "pause1" | "concentric" | "pause2";
}

// Colors matching TempoSelector
const PHASE_COLORS = {
  eccentric: "#22C55E", // Green - bajar
  pause1: "#F59E0B", // Amber - pausa inferior
  concentric: "#EF4444", // Red - subir
  pause2: "#F59E0B", // Amber - pausa superior
} as const;

// State management types
type TimerState = "idle" | "countdown" | "running" | "paused" | "finished";

interface State {
  timerState: TimerState;
  countdownValue: number;
  countdownTimeElapsed: number; // Track elapsed time in countdown
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
  phaseNames: typeof tempoMetronomeTranslations.phases
): TempoPhase[] => {
  if (!tempoString) return [];

  const [eccentric, pause1, concentric, pause2] = tempoString
    .split("-")
    .map(Number);

  const phases: TempoPhase[] = [
    {
      name: phaseNames.eccentric,
      duration: eccentric,
      color: PHASE_COLORS.eccentric,
      type: "eccentric",
    },
    {
      name: phaseNames.pause1,
      duration: pause1,
      color: PHASE_COLORS.pause1,
      type: "pause1",
    },
    {
      name: phaseNames.concentric,
      duration: concentric,
      color: PHASE_COLORS.concentric,
      type: "concentric",
    },
    {
      name: phaseNames.pause2,
      duration: pause2,
      color: PHASE_COLORS.pause2,
      type: "pause2",
    },
  ];

  // Only include phases with duration > 0
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
        // Phase completed - move to next phase
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
      return {
        ...state,
        timerState: "paused",
      };

    case "RESUME":
      return {
        ...state,
        timerState: "running",
      };

    case "RESET":
      return {
        ...initialState,
        currentCycle: 0,
      };

    case "FINISH":
      return {
        ...state,
        timerState: "finished",
      };

    default:
      return state;
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const TempoMetronome = forwardRef<BottomSheetModal, TempoMetronomeProps>(
  ({ tempo }, ref) => {
    const { colors } = useColorScheme();
    const prefs = useUserPreferences();
    const lang = toSupportedLanguage(prefs?.language);
    const t = tempoMetronomeTranslations;
    const haptic = useHaptic();

    // State management
    const [state, dispatch] = useReducer(timerReducer, initialState);

    // Parse tempo into phases
    const phases = parseTempoString(tempo, t.phases);
    const currentPhase = phases[state.currentPhaseIndex];

    // Refs for cleanup
    const intervalRef = useRef<number | null>(null);

    // Animation values
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

          // Only trigger haptic and heartbeat when the countdown number actually changes
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

          // Check if we're at a second boundary for heartbeat
          const timeInSeconds = Math.floor(state.currentPhaseTime);
          const nextTimeInSeconds = Math.floor(state.currentPhaseTime + 0.1);

          if (timeInSeconds !== nextTimeInSeconds) {
            triggerHeartbeat();
            playTickHaptic();
          }

          // Check for phase change
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
      // Close immediately as requested
      stopInterval();
      if (ref && "current" in ref && ref.current) {
        ref.current.dismiss();
      }
    }, [stopInterval, ref]);

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

    // ============================================================================
    // RENDER
    // ============================================================================

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["100%"]}
        enablePanDownToClose={false}
        enableDismissOnClose={true}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleStyle={{ display: "none" }}
      >
        <StatusBar hidden />

        <BottomSheetView
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>

            <Typography variant="h6" weight="semibold" color="text">
              {t.title[lang]}
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
                {t.cycle[lang]} {state.currentCycle}
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
              <View style={styles.nextPhaseContainer}>
                <Typography variant="caption" color="textMuted">
                  {t.next[lang]}:{" "}
                  {
                    phases[(state.currentPhaseIndex + 1) % phases.length]?.name[
                      lang
                    ]
                  }
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
                  { backgroundColor: colors.border },
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
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

TempoMetronome.displayName = "TempoMetronome";

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
    paddingTop: 50,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
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
    width: 300,
    height: 300,
    borderRadius: 150,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  mainNumber: {
    fontSize: 120,
    textAlign: "center",
    lineHeight: 120,
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
    backgroundColor: "rgba(0,0,0,0.05)",
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
    paddingBottom: 50,
    gap: 16,
    marginTop: 20,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
});

// Export V2 component
export { TempoMetronomeV2 } from "../../../features/active-workout-v2/elements/TempoMetronomeV2";
