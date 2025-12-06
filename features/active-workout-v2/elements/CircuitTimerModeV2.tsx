import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useHaptic } from "@/shared/services/haptic-service";
import { circuitTimerTranslations } from "@/shared/translations/circuit-timer";
import { toSupportedLanguage } from "@/shared/types/language";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import { BlurView } from "expo-blur";
import {
  ChevronRight,
  Clock,
  Pause,
  Play,
  RefreshCw,
  SkipForward,
  Square,
  Timer,
  Trophy,
  X,
  Zap,
} from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useActiveSetActions,
  useActiveWorkout,
} from "../hooks/use-active-workout-store";
import {
  getCircuitTimerState,
  getNextCircuitTimerItem,
} from "../utils/store-helpers";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ============================================================================
// CONSTANTS & TYPES
// ============================================================================

const COUNTDOWN_SECONDS = 5;
const TICK_INTERVAL = 100;
const CIRCLE_SIZE = Math.min(SCREEN_WIDTH * 0.7, 280);

// Colors
const COLORS = {
  exercise: "#4A90E2", // Circuit blue
  rest: "#22C55E", // Success green
  roundRest: "#F59E0B", // Warning amber
  countdown: "#6366F1", // Indigo
  complete: "#22C55E", // Success green
} as const;

type Props = {
  visible: boolean;
  blockId: string;
  onClose: () => void;
};

type TimerState =
  | "idle"
  | "countdown"
  | "exercise"
  | "rest"
  | "roundRest"
  | "paused"
  | "complete";

interface State {
  timerState: TimerState;
  // Countdown state
  countdownValue: number;
  countdownTimeElapsed: number;
  // Exercise state
  currentExerciseIndex: number;
  currentRoundIndex: number;
  exerciseTimeRemaining: number;
  exerciseTimeElapsed: number;
  currentTargetDuration: number;
  // Rest state
  restTimeRemaining: number;
  restTimeElapsed: number;
  currentRestDuration: number;
  // Stats
  totalTimeElapsed: number;
  roundsCompleted: number;
  exercisesCompleted: number;
  // Previous state (for pause/resume)
  previousState: TimerState | null;
}

type Action =
  | { type: "START_COUNTDOWN" }
  | { type: "COUNTDOWN_TICK" }
  | {
      type: "START_EXERCISE";
      targetDuration: number;
      exerciseIndex: number;
      roundIndex: number;
    }
  | { type: "EXERCISE_TICK" }
  | { type: "START_REST"; duration: number; isRoundRest: boolean }
  | { type: "REST_TICK" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "SKIP_EXERCISE" }
  | { type: "SKIP_REST" }
  | { type: "COMPLETE" }
  | { type: "RESET" };

// ============================================================================
// REDUCER
// ============================================================================

const initialState: State = {
  timerState: "idle",
  countdownValue: COUNTDOWN_SECONDS,
  countdownTimeElapsed: 0,
  currentExerciseIndex: 0,
  currentRoundIndex: 0,
  exerciseTimeRemaining: 0,
  exerciseTimeElapsed: 0,
  currentTargetDuration: 0,
  restTimeRemaining: 0,
  restTimeElapsed: 0,
  currentRestDuration: 0,
  totalTimeElapsed: 0,
  roundsCompleted: 0,
  exercisesCompleted: 0,
  previousState: null,
};

const timerReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "START_COUNTDOWN":
      return {
        ...state,
        timerState: "countdown",
        countdownValue: COUNTDOWN_SECONDS,
        countdownTimeElapsed: 0,
      };

    case "COUNTDOWN_TICK": {
      const newCountdownElapsed = state.countdownTimeElapsed + 0.1;
      const newCountdownValue =
        COUNTDOWN_SECONDS - Math.floor(newCountdownElapsed);

      if (newCountdownValue <= 0) {
        // Countdown finished - will transition to exercise via effect
        return {
          ...state,
          timerState: "countdown",
          countdownValue: 0,
          countdownTimeElapsed: newCountdownElapsed,
        };
      }

      return {
        ...state,
        countdownValue: newCountdownValue,
        countdownTimeElapsed: newCountdownElapsed,
      };
    }

    case "START_EXERCISE":
      return {
        ...state,
        timerState: "exercise",
        currentExerciseIndex: action.exerciseIndex,
        currentRoundIndex: action.roundIndex,
        exerciseTimeRemaining: action.targetDuration,
        exerciseTimeElapsed: 0,
        currentTargetDuration: action.targetDuration,
      };

    case "EXERCISE_TICK": {
      const newTimeElapsed = state.exerciseTimeElapsed + 0.1;
      const newTimeRemaining = Math.max(
        0,
        state.currentTargetDuration - newTimeElapsed
      );
      const newTotalElapsed = state.totalTimeElapsed + 0.1;

      return {
        ...state,
        exerciseTimeElapsed: newTimeElapsed,
        exerciseTimeRemaining: newTimeRemaining,
        totalTimeElapsed: newTotalElapsed,
      };
    }

    case "START_REST":
      return {
        ...state,
        timerState: action.isRoundRest ? "roundRest" : "rest",
        restTimeRemaining: action.duration,
        restTimeElapsed: 0,
        currentRestDuration: action.duration,
        exercisesCompleted: state.exercisesCompleted + 1,
        roundsCompleted: action.isRoundRest
          ? state.roundsCompleted + 1
          : state.roundsCompleted,
      };

    case "REST_TICK": {
      const newRestElapsed = state.restTimeElapsed + 0.1;
      const newRestRemaining = Math.max(
        0,
        state.currentRestDuration - newRestElapsed
      );
      const newTotalElapsed = state.totalTimeElapsed + 0.1;

      return {
        ...state,
        restTimeElapsed: newRestElapsed,
        restTimeRemaining: newRestRemaining,
        totalTimeElapsed: newTotalElapsed,
      };
    }

    case "PAUSE":
      return {
        ...state,
        previousState: state.timerState,
        timerState: "paused",
      };

    case "RESUME":
      return {
        ...state,
        timerState: state.previousState || "exercise",
        previousState: null,
      };

    case "SKIP_EXERCISE":
      return {
        ...state,
        exerciseTimeRemaining: 0,
        exerciseTimeElapsed: state.currentTargetDuration,
      };

    case "SKIP_REST":
      return {
        ...state,
        restTimeRemaining: 0,
        restTimeElapsed: state.currentRestDuration,
      };

    case "COMPLETE":
      return {
        ...state,
        timerState: "complete",
        exercisesCompleted: state.exercisesCompleted + 1,
        roundsCompleted: state.roundsCompleted + 1,
      };

    case "RESET":
      return { ...initialState };

    default:
      return state;
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const CircuitTimerModeV2: React.FC<Props> = ({
  visible,
  blockId,
  onClose,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const insets = useSafeAreaInsets();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const t = circuitTimerTranslations;
  const haptic = useHaptic();

  const { blocks, exercises, sets, exercisesByBlock, setsByExercise } =
    useActiveWorkout();
  const { autoCompleteTimeSet } = useActiveSetActions();

  const [state, dispatch] = useReducer(timerReducer, initialState);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  // ============================================================================
  // CIRCUIT DATA
  // ============================================================================

  const block = blocks[blockId];
  const exercisesInBlock = useMemo(() => {
    if (!block) return [];
    const exerciseIds = exercisesByBlock[blockId] || [];
    return exerciseIds
      .map((id) => exercises[id])
      .filter(Boolean)
      .sort((a, b) => a.order_index - b.order_index);
  }, [block, blockId, exercisesByBlock, exercises]);

  const circuitState = useMemo(() => {
    if (!block) return null;
    return getCircuitTimerState(block, exercisesInBlock, sets, setsByExercise);
  }, [block, exercisesInBlock, sets, setsByExercise]);

  const nextItem = useMemo(() => {
    if (!circuitState) return null;
    return getNextCircuitTimerItem(circuitState, sets);
  }, [circuitState, sets]);

  const currentExercise = useMemo(() => {
    if (!circuitState) return null;
    return circuitState.exercises[state.currentExerciseIndex] || null;
  }, [circuitState, state.currentExerciseIndex]);

  // Calculate estimated total time
  const estimatedTotalTime = useMemo(() => {
    if (!circuitState) return 0;

    // Sum all exercise durations across all rounds
    let totalExerciseTime = 0;
    for (const exercise of circuitState.exercises) {
      totalExerciseTime += exercise.targetDurations.reduce((a, b) => a + b, 0);
    }

    // Rest between exercises (within each round)
    const restsBetweenExercisesPerRound = Math.max(
      0,
      circuitState.totalExercises - 1
    );
    const totalRestBetweenExercises =
      restsBetweenExercisesPerRound *
      circuitState.totalRounds *
      circuitState.restBetweenExercises;

    // Rest between rounds
    const restsBetweenRounds = Math.max(0, circuitState.totalRounds - 1);
    const totalRestBetweenRounds =
      restsBetweenRounds * circuitState.restBetweenRounds;

    return (
      totalExerciseTime + totalRestBetweenExercises + totalRestBetweenRounds
    );
  }, [circuitState]);

  // ============================================================================
  // HAPTIC FEEDBACK
  // ============================================================================

  const playTickHaptic = useCallback(() => {
    haptic.light();
  }, [haptic]);

  const playTransitionHaptic = useCallback(() => {
    haptic.medium();
  }, [haptic]);

  const playCompleteHaptic = useCallback(() => {
    haptic.heavy();
    try {
      audioPlayer.seekTo(0);
      audioPlayer.play();
    } catch (error) {
      console.log("Error playing completion sound:", error);
    }
  }, [audioPlayer, haptic]);

  // ============================================================================
  // ANIMATIONS
  // ============================================================================

  const triggerHeartbeat = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
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

  // Celebration animation for complete state
  useEffect(() => {
    if (state.timerState === "complete") {
      // Start from small and bounce up
      scaleAnim.setValue(0.3);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [state.timerState, scaleAnim]);

  // Pulse animation for idle state
  useEffect(() => {
    if (state.timerState === "idle") {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.03,
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

  // Progress animation
  useEffect(() => {
    let progress = 0;
    if (state.timerState === "exercise" && state.currentTargetDuration > 0) {
      progress = state.exerciseTimeElapsed / state.currentTargetDuration;
    } else if (
      (state.timerState === "rest" || state.timerState === "roundRest") &&
      state.currentRestDuration > 0
    ) {
      progress = state.restTimeElapsed / state.currentRestDuration;
    }

    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [
    state.timerState,
    state.exerciseTimeElapsed,
    state.restTimeElapsed,
    state.currentTargetDuration,
    state.currentRestDuration,
    progressAnim,
  ]);

  // ============================================================================
  // TIMER LOGIC
  // ============================================================================

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Auto-complete set when exercise finishes
  const completeCurrentExercise = useCallback(() => {
    if (!nextItem || !circuitState) return;

    const exercise = circuitState.exercises[nextItem.exerciseIndex];
    if (!exercise) return;

    const setId = exercise.setIds[nextItem.roundIndex];
    if (!setId) return;

    // Mark the set as completed with the target duration
    autoCompleteTimeSet(
      setId,
      blockId,
      exercise.exerciseInBlockId,
      nextItem.targetDuration
    );
  }, [nextItem, circuitState, blockId, autoCompleteTimeSet]);

  // Handle exercise completion
  const handleExerciseComplete = useCallback(() => {
    if (!circuitState || !nextItem) return;

    // Complete the current set
    completeCurrentExercise();
    playCompleteHaptic();

    // Determine what's next
    if (nextItem.isLastInRound && nextItem.isLastRound) {
      // Circuit complete!
      dispatch({ type: "COMPLETE" });
    } else if (nextItem.isLastInRound) {
      // Round complete - rest between rounds
      dispatch({
        type: "START_REST",
        duration: circuitState.restBetweenRounds,
        isRoundRest: true,
      });
    } else {
      // More exercises in round - rest between exercises
      dispatch({
        type: "START_REST",
        duration: circuitState.restBetweenExercises,
        isRoundRest: false,
      });
    }
  }, [circuitState, nextItem, completeCurrentExercise, playCompleteHaptic]);

  // Handle rest completion - start next exercise
  const handleRestComplete = useCallback(() => {
    if (!circuitState) return;

    playTransitionHaptic();

    // Get the next item after completion
    const updatedNextItem = getNextCircuitTimerItem(circuitState, sets);

    if (updatedNextItem) {
      dispatch({
        type: "START_EXERCISE",
        targetDuration: updatedNextItem.targetDuration,
        exerciseIndex: updatedNextItem.exerciseIndex,
        roundIndex: updatedNextItem.roundIndex,
      });
    } else {
      dispatch({ type: "COMPLETE" });
    }
  }, [circuitState, sets, playTransitionHaptic]);

  // Main timer interval
  useEffect(() => {
    if (
      state.timerState === "countdown" ||
      state.timerState === "exercise" ||
      state.timerState === "rest" ||
      state.timerState === "roundRest"
    ) {
      clearTimer();

      intervalRef.current = setInterval(() => {
        if (state.timerState === "countdown") {
          dispatch({ type: "COUNTDOWN_TICK" });
        } else if (state.timerState === "exercise") {
          dispatch({ type: "EXERCISE_TICK" });
        } else if (
          state.timerState === "rest" ||
          state.timerState === "roundRest"
        ) {
          dispatch({ type: "REST_TICK" });
        }
      }, TICK_INTERVAL);

      return clearTimer;
    }

    return clearTimer;
  }, [state.timerState, clearTimer]);

  // Handle countdown completion
  useEffect(() => {
    if (state.timerState === "countdown" && state.countdownValue <= 0) {
      if (nextItem) {
        playTransitionHaptic();
        dispatch({
          type: "START_EXERCISE",
          targetDuration: nextItem.targetDuration,
          exerciseIndex: nextItem.exerciseIndex,
          roundIndex: nextItem.roundIndex,
        });
      }
    }
  }, [state.timerState, state.countdownValue, nextItem, playTransitionHaptic]);

  // Handle exercise timer completion
  useEffect(() => {
    if (state.timerState === "exercise" && state.exerciseTimeRemaining <= 0) {
      handleExerciseComplete();
    }
  }, [state.timerState, state.exerciseTimeRemaining, handleExerciseComplete]);

  // Handle rest timer completion
  useEffect(() => {
    if (
      (state.timerState === "rest" || state.timerState === "roundRest") &&
      state.restTimeRemaining <= 0
    ) {
      handleRestComplete();
    }
  }, [state.timerState, state.restTimeRemaining, handleRestComplete]);

  // Tick haptic feedback
  const prevCountdown = useRef(state.countdownValue);
  const prevExerciseTime = useRef(Math.ceil(state.exerciseTimeRemaining));
  const prevRestTime = useRef(Math.ceil(state.restTimeRemaining));

  useEffect(() => {
    if (state.timerState === "countdown") {
      if (
        state.countdownValue !== prevCountdown.current &&
        state.countdownValue > 0
      ) {
        playTickHaptic();
        triggerHeartbeat();
      }
      prevCountdown.current = state.countdownValue;
    }
  }, [
    state.timerState,
    state.countdownValue,
    playTickHaptic,
    triggerHeartbeat,
  ]);

  useEffect(() => {
    if (state.timerState === "exercise") {
      const currentSecond = Math.ceil(state.exerciseTimeRemaining);
      if (currentSecond !== prevExerciseTime.current && currentSecond > 0) {
        // Haptic on last 3 seconds
        if (currentSecond <= 3) {
          playTickHaptic();
        }
        triggerHeartbeat();
      }
      prevExerciseTime.current = currentSecond;
    }
  }, [
    state.timerState,
    state.exerciseTimeRemaining,
    playTickHaptic,
    triggerHeartbeat,
  ]);

  useEffect(() => {
    if (state.timerState === "rest" || state.timerState === "roundRest") {
      const currentSecond = Math.ceil(state.restTimeRemaining);
      if (currentSecond !== prevRestTime.current && currentSecond > 0) {
        // Haptic on last 3 seconds
        if (currentSecond <= 3) {
          playTickHaptic();
        }
      }
      prevRestTime.current = currentSecond;
    }
  }, [state.timerState, state.restTimeRemaining, playTickHaptic]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleStart = useCallback(() => {
    haptic.heavy();
    dispatch({ type: "START_COUNTDOWN" });
  }, [haptic]);

  const handlePause = useCallback(() => {
    haptic.medium();
    dispatch({ type: "PAUSE" });
  }, [haptic]);

  const handleResume = useCallback(() => {
    haptic.medium();
    dispatch({ type: "RESUME" });
  }, [haptic]);

  const handleSkip = useCallback(() => {
    haptic.medium();
    if (state.timerState === "exercise") {
      dispatch({ type: "SKIP_EXERCISE" });
    } else if (
      state.timerState === "rest" ||
      state.timerState === "roundRest"
    ) {
      dispatch({ type: "SKIP_REST" });
    }
  }, [haptic, state.timerState]);

  const handleClose = useCallback(() => {
    clearTimer();
    dispatch({ type: "RESET" });
    onClose();
  }, [clearTimer, onClose]);

  // Reset when modal closes
  useEffect(() => {
    if (!visible) {
      clearTimer();
      dispatch({ type: "RESET" });
    }
  }, [visible, clearTimer]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
    return secs.toString();
  };

  const formatTotalTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStateColor = (): string => {
    switch (state.timerState) {
      case "countdown":
        return COLORS.countdown;
      case "exercise":
        return COLORS.exercise;
      case "rest":
        return COLORS.rest;
      case "roundRest":
        return COLORS.roundRest;
      case "complete":
        return colors.primary[500];
      default:
        return COLORS.exercise;
    }
  };

  const getDisplayValue = (): string => {
    switch (state.timerState) {
      case "idle":
        return "▶";
      case "countdown":
        return state.countdownValue > 0
          ? state.countdownValue.toString()
          : t.go[lang];
      case "exercise":
        return formatTime(state.exerciseTimeRemaining);
      case "rest":
      case "roundRest":
        return formatTime(state.restTimeRemaining);
      case "paused":
        // Show the time that was remaining when paused
        if (state.previousState === "exercise") {
          return formatTime(state.exerciseTimeRemaining);
        } else if (
          state.previousState === "rest" ||
          state.previousState === "roundRest"
        ) {
          return formatTime(state.restTimeRemaining);
        }
        return formatTime(state.exerciseTimeRemaining);
      case "complete":
        return ""; // Trophy icon shown separately
      default:
        return "";
    }
  };

  const getStatusText = (): string => {
    switch (state.timerState) {
      case "idle":
        return t.pressToStart[lang];
      case "countdown":
        return t.getReady[lang];
      case "exercise":
        return currentExercise?.name || "";
      case "rest":
        return t.rest[lang];
      case "roundRest":
        return t.restBetweenRounds[lang];
      case "paused":
        // Show what was running when paused
        if (state.previousState === "exercise") {
          return currentExercise?.name || t.paused[lang];
        } else if (state.previousState === "rest") {
          return t.rest[lang];
        } else if (state.previousState === "roundRest") {
          return t.restBetweenRounds[lang];
        }
        return t.paused[lang];
      case "complete":
        return t.circuitComplete[lang];
      default:
        return "";
    }
  };

  // Get next exercise name for preview
  const getNextExerciseName = (): string | null => {
    if (!circuitState || state.timerState === "complete") return null;

    if (state.timerState === "rest" || state.timerState === "roundRest") {
      // During rest, show what's next
      const upcomingItem = getNextCircuitTimerItem(circuitState, sets);
      if (upcomingItem) {
        return circuitState.exercises[upcomingItem.exerciseIndex]?.name || null;
      }
    } else if (state.timerState === "exercise") {
      // During exercise, show next exercise
      const nextExerciseIndex = state.currentExerciseIndex + 1;
      if (nextExerciseIndex < circuitState.exercises.length) {
        return circuitState.exercises[nextExerciseIndex]?.name || null;
      } else if (state.currentRoundIndex + 1 < circuitState.totalRounds) {
        // Next round, first exercise
        return circuitState.exercises[0]?.name || null;
      }
    }

    return null;
  };

  if (!block || !circuitState) return null;

  const stateColor = getStateColor();
  const displayValue = getDisplayValue();
  const statusText = getStatusText();
  const nextExerciseName = getNextExerciseName();

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="light-content" />
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode ? "#0a0a0f" : "#f5f5f7",
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </Pressable>
            <Typography
              variant="h4"
              weight="bold"
              style={{ color: colors.text }}
            >
              {t.title[lang]}
            </Typography>
          </View>
          <View style={styles.roundBadge}>
            <Typography
              variant="caption"
              weight="semibold"
              style={{ color: colors.text }}
            >
              {t.round[lang]} {state.currentRoundIndex + 1}/
              {circuitState.totalRounds}
            </Typography>
          </View>
        </View>

        {/* Pre-start Circuit Overview (idle state) */}
        {state.timerState === "idle" && (
          <ScrollView
            style={styles.overviewContainer}
            contentContainerStyle={styles.overviewContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Stats Cards Row */}
            <View style={styles.statsRow}>
              {/* Rounds Card */}
              <View
                style={[
                  styles.statCard,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(255,255,255,0.85)",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)",
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
                <View style={styles.statCardContent}>
                  <View
                    style={[
                      styles.statIconContainer,
                      { backgroundColor: `${colors.primary[500]}15` },
                    ]}
                  >
                    <RefreshCw size={18} color={colors.primary[500]} />
                  </View>
                  <Typography
                    variant="h3"
                    weight="bold"
                    style={{ color: colors.text }}
                  >
                    {circuitState.totalRounds}
                  </Typography>
                  <Typography variant="caption" color="textMuted">
                    {t.round[lang]}s
                  </Typography>
                </View>
              </View>

              {/* Exercises Card */}
              <View
                style={[
                  styles.statCard,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(255,255,255,0.85)",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)",
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
                <View style={styles.statCardContent}>
                  <View
                    style={[
                      styles.statIconContainer,
                      { backgroundColor: "rgba(245, 158, 11, 0.15)" },
                    ]}
                  >
                    <Zap size={18} color="#f59e0b" />
                  </View>
                  <Typography
                    variant="h3"
                    weight="bold"
                    style={{ color: colors.text }}
                  >
                    {circuitState.totalExercises}
                  </Typography>
                  <Typography variant="caption" color="textMuted">
                    {t.exercises[lang]}
                  </Typography>
                </View>
              </View>

              {/* Time Card */}
              <View
                style={[
                  styles.statCard,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(255,255,255,0.85)",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)",
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
                <View style={styles.statCardContent}>
                  <View
                    style={[
                      styles.statIconContainer,
                      { backgroundColor: "rgba(16, 185, 129, 0.15)" },
                    ]}
                  >
                    <Clock size={18} color="#10b981" />
                  </View>
                  <Typography
                    variant="h3"
                    weight="bold"
                    style={{ color: colors.text }}
                  >
                    {formatTime(estimatedTotalTime)}
                  </Typography>
                  <Typography variant="caption" color="textMuted">
                    {t.estimatedTime[lang]}
                  </Typography>
                </View>
              </View>
            </View>

            {/* Exercise List Card */}
            <View
              style={[
                styles.exerciseListCard,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.85)",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
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
              <View style={styles.exerciseListContent}>
                <Typography
                  variant="body1"
                  weight="semibold"
                  style={{ color: colors.text, marginBottom: 12 }}
                >
                  {t.exercises[lang]}
                </Typography>
                {circuitState.exercises.map((exercise, index) => (
                  <View
                    key={exercise.exerciseInBlockId}
                    style={[
                      styles.exerciseListItem,
                      index < circuitState.exercises.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: isDarkMode
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.06)",
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.exerciseListNumber,
                        { backgroundColor: `${colors.primary[500]}15` },
                      ]}
                    >
                      <Typography
                        variant="caption"
                        weight="bold"
                        style={{ color: colors.primary[500] }}
                      >
                        {index + 1}
                      </Typography>
                    </View>
                    <View style={styles.exerciseListInfo}>
                      <Typography
                        variant="body1"
                        weight="medium"
                        style={{ color: colors.text }}
                        numberOfLines={1}
                      >
                        {exercise.name}
                      </Typography>
                      <Typography variant="caption" color="textMuted">
                        {(() => {
                          const durations = exercise.targetDurations;
                          const allSame = durations.every(
                            (d) => d === durations[0]
                          );
                          if (allSame) {
                            return `${durations[0]}${t.seconds[lang]} × ${
                              circuitState.totalRounds
                            } ${t.round[lang].toLowerCase()}s`;
                          }
                          return durations.map((d) => `${d}s`).join(" → ");
                        })()}
                      </Typography>
                    </View>
                    <View style={styles.exerciseDurationBadge}>
                      <Timer size={12} color={colors.textMuted} />
                      <Typography
                        variant="caption"
                        color="textMuted"
                        style={{ marginLeft: 4 }}
                      >
                        {(() => {
                          const durations = exercise.targetDurations;
                          const allSame = durations.every(
                            (d) => d === durations[0]
                          );
                          if (allSame) {
                            return `${durations[0]}s`;
                          }
                          const total = durations.reduce((a, b) => a + b, 0);
                          return `${total}s`;
                        })()}
                      </Typography>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Rest Info Card */}
            <View
              style={[
                styles.restInfoCard,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.85)",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.06)",
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
              <View style={styles.restInfoContent}>
                <View style={styles.restInfoItem}>
                  <Typography variant="caption" color="textMuted">
                    {t.restBetweenExercisesLabel[lang]}
                  </Typography>
                  <Typography
                    variant="body1"
                    weight="semibold"
                    style={{ color: colors.text }}
                  >
                    {circuitState.restBetweenExercises}
                    {t.seconds[lang]}
                  </Typography>
                </View>
                <View
                  style={[
                    styles.restInfoDivider,
                    {
                      backgroundColor: isDarkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    },
                  ]}
                />
                <View style={styles.restInfoItem}>
                  <Typography variant="caption" color="textMuted">
                    {t.restBetweenRoundsLabel[lang]}
                  </Typography>
                  <Typography
                    variant="body1"
                    weight="semibold"
                    style={{ color: colors.text }}
                  >
                    {circuitState.restBetweenRounds}
                    {t.seconds[lang]}
                  </Typography>
                </View>
              </View>
            </View>
          </ScrollView>
        )}

        {/* Main Timer Display (non-idle states) */}
        {state.timerState !== "idle" && (
          <View style={styles.timerContainer}>
            <Animated.View
              style={[
                styles.timerCircle,
                {
                  backgroundColor: `${stateColor}15`,
                  borderColor: stateColor,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.timerContent}>
                {/* Paused Chip */}
                {state.timerState === "paused" && (
                  <View
                    style={[
                      styles.pausedChip,
                      { backgroundColor: `${colors.textMuted}20` },
                    ]}
                  >
                    <Pause size={12} color={colors.textMuted} />
                    <Typography
                      variant="caption"
                      style={{ color: colors.textMuted, marginLeft: 4 }}
                    >
                      {t.paused[lang]}
                    </Typography>
                  </View>
                )}
                {/* Complete State - Trophy Icon */}
                {state.timerState === "complete" ? (
                  <Animated.View
                    style={[
                      styles.trophyContainer,
                      { transform: [{ scale: scaleAnim }] },
                    ]}
                  >
                    <Trophy size={64} color={colors.primary[500]} />
                  </Animated.View>
                ) : (
                  <Typography
                    variant="h1"
                    weight="bold"
                    style={[styles.timerValue, { color: stateColor }]}
                  >
                    {displayValue}
                  </Typography>
                )}
              </View>
            </Animated.View>

            {/* Status Text */}
            <Typography
              variant="h3"
              weight="semibold"
              style={[styles.statusText, { color: colors.text }]}
              numberOfLines={2}
            >
              {statusText}
            </Typography>

            {/* Progress Bar */}
            {(state.timerState === "exercise" ||
              state.timerState === "rest" ||
              state.timerState === "roundRest" ||
              state.timerState === "paused") && (
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressTrack,
                    { backgroundColor: isDarkMode ? "#1a1a1f" : "#e5e5e7" },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.progressFill,
                      { backgroundColor: stateColor, width: progressWidth },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>
        )}

        {/* Next Exercise Preview */}
        {nextExerciseName &&
          state.timerState !== "idle" &&
          state.timerState !== "complete" && (
            <View
              style={[
                styles.nextExerciseCard,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.08)",
                },
              ]}
            >
              <Typography variant="caption" color="textMuted">
                {t.next[lang]}:
              </Typography>
              <View style={styles.nextExerciseRow}>
                <Typography
                  variant="body1"
                  weight="semibold"
                  style={{ color: colors.text }}
                >
                  {nextExerciseName}
                </Typography>
                <ChevronRight size={16} color={colors.textMuted} />
              </View>
            </View>
          )}

        {/* Complete Summary */}
        {state.timerState === "complete" && (
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.03)",
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.08)",
              },
            ]}
          >
            <Typography
              variant="h4"
              weight="bold"
              style={{ color: colors.text, marginBottom: 16 }}
            >
              {t.summary[lang]}
            </Typography>
            <View style={styles.summaryRow}>
              <Typography variant="body1" color="textMuted">
                {t.totalTime[lang]}:
              </Typography>
              <Typography
                variant="body1"
                weight="semibold"
                style={{ color: colors.text }}
              >
                {formatTotalTime(state.totalTimeElapsed)}
              </Typography>
            </View>
            <View style={styles.summaryRow}>
              <Typography variant="body1" color="textMuted">
                {t.roundsCompleted[lang]}:
              </Typography>
              <Typography
                variant="body1"
                weight="semibold"
                style={{ color: colors.text }}
              >
                {state.roundsCompleted}
              </Typography>
            </View>
            <View style={styles.summaryRow}>
              <Typography variant="body1" color="textMuted">
                {t.exercises[lang]}:
              </Typography>
              <Typography
                variant="body1"
                weight="semibold"
                style={{ color: colors.text }}
              >
                {state.exercisesCompleted}
              </Typography>
            </View>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          {state.timerState === "idle" && (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleStart}
              icon={<Play size={20} color="#fff" fill="#fff" />}
            >
              {t.start[lang]}
            </Button>
          )}

          {(state.timerState === "exercise" ||
            state.timerState === "rest" ||
            state.timerState === "roundRest" ||
            state.timerState === "paused") && (
            <View style={styles.controlsRow}>
              {/* Pause / Resume button */}
              {state.timerState === "paused" ? (
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
                    {t.resume[lang]}
                  </Typography>
                </Pressable>
              ) : (
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
                    {t.pause[lang]}
                  </Typography>
                </Pressable>
              )}

              <Pressable
                onPress={handleSkip}
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
                <SkipForward size={20} color={colors.text} />
                <Typography
                  variant="caption"
                  style={{ color: colors.text, marginTop: 4 }}
                >
                  {t.skip[lang]}
                </Typography>
              </Pressable>

              <Pressable
                onPress={handleClose}
                style={[
                  styles.controlButton,
                  {
                    backgroundColor: `${colors.error[500]}10`,
                    borderWidth: 1,
                    borderColor: `${colors.error[500]}30`,
                  },
                ]}
              >
                <Square size={20} color={colors.error[500]} />
                <Typography
                  variant="caption"
                  style={{ color: colors.error[500], marginTop: 4 }}
                >
                  {t.finish[lang]}
                </Typography>
              </Pressable>
            </View>
          )}

          {state.timerState === "complete" && (
            <Button variant="primary" size="lg" fullWidth onPress={handleClose}>
              {t.close[lang]}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  closeButton: {
    padding: 8,
  },
  roundBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(74, 144, 226, 0.15)",
  },
  timerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  timerCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  timerContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  pausedChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  trophyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  timerValue: {
    fontSize: 72,
    lineHeight: 80,
  },
  statusText: {
    marginTop: 24,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  progressContainer: {
    width: "100%",
    marginTop: 24,
    alignItems: "center",
  },
  progressTrack: {
    width: "80%",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    marginTop: 8,
  },
  nextExerciseCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  nextExerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  summaryCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  controlButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
  },
  // Overview (idle state) styles
  overviewContainer: {
    flex: 1,
  },
  overviewContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  statCardContent: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  exerciseListCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 16,
  },
  exerciseListContent: {
    padding: 16,
  },
  exerciseListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  exerciseListNumber: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseListInfo: {
    flex: 1,
  },
  exerciseDurationBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "rgba(128,128,128,0.1)",
  },
  restInfoCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  restInfoContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 20,
  },
  restInfoItem: {
    alignItems: "center",
    flex: 1,
  },
  restInfoDivider: {
    width: 1,
    height: 36,
  },
});
