import TimerService from "@/shared/services/timer-service";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

interface UseTimerReturn {
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  progress: number;
  startTimer: (
    durationSeconds: number,
    title?: string,
    body?: string
  ) => Promise<void>;
  pauseTimer: () => void;
  resumeTimer: () => void;
  adjustTime: (newTimeSeconds: number) => Promise<void>;
  skipTimer: () => Promise<void>;
  addTime: (additionalSeconds: number) => Promise<void>;
  subtractTime: (subtractSeconds: number) => Promise<void>;
  onTimerComplete?: () => void;
}

interface UseTimerOptions {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const useTimer = (options: UseTimerOptions = {}): UseTimerReturn => {
  const { onComplete } = options;

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [initialDuration, setInitialDuration] = useState(0);

  const timerService = TimerService.getInstance();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Calcular progreso
  const progress =
    initialDuration > 0
      ? (initialDuration - timeRemaining) / initialDuration
      : 0;

  // Función para sincronizar el timer con el servicio
  const syncWithService = useCallback(async () => {
    try {
      const { remainingTime, timerData } =
        await timerService.restoreTimerState();

      if (timerData && remainingTime > 0) {
        setTimeRemaining(remainingTime);
        setInitialDuration(timerData.duration);
        setIsRunning(true);
        setIsPaused(timerData.isPaused || false);
      } else {
        setTimeRemaining(0);
        setIsRunning(false);
        setIsPaused(false);
        if (timerData && remainingTime <= 0) {
          await timerService.completeTimer();
          onComplete?.();
        }
      }
    } catch (error) {
      console.error("Error syncing with timer service:", error);
    }
  }, [timerService, onComplete]);

  // Efecto principal del timer
  useEffect(() => {
    if (isRunning && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(async () => {
        const { remainingTime, timerData } =
          await timerService.restoreTimerState();

        if (!timerData || !timerData.isActive) {
          setTimeRemaining(0);
          setIsRunning(false);
          setIsPaused(false);
          return;
        }

        if (timerData.isPaused !== isPaused) {
          setIsPaused(timerData.isPaused || false);
          return;
        }

        if (!timerData.isPaused) {
          const newTime = Math.max(0, remainingTime);
          setTimeRemaining(newTime);

          if (newTime <= 2) {
            timerService.cancelNotificationIfForeground();
          }

          if (newTime <= 0) {
            setIsRunning(false);
            await timerService.completeTimer();
            onComplete?.();
          }
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isPaused, timeRemaining, onComplete, timerService]);

  // Sincronizar cuando la app vuelve al primer plano
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        syncWithService();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription?.remove();
  }, [syncWithService]);

  // Sincronizar al montar
  useEffect(() => {
    syncWithService();
  }, [syncWithService]);

  // Funciones del timer
  const startTimer = useCallback(
    async (durationSeconds: number, title?: string, body?: string) => {
      try {
        // Limpiar cualquier timer anterior antes de empezar uno nuevo
        await timerService.clearTimer();

        await timerService.startTimer(
          durationSeconds,
          title || "Tiempo de descanso terminado",
          body || "Tu descanso ha terminado. ¡Continúa con tu entrenamiento!"
        );
        setTimeRemaining(durationSeconds);
        setInitialDuration(durationSeconds);
        setIsRunning(true);
        setIsPaused(false);
      } catch (error) {
        console.error("Error starting timer:", error);
      }
    },
    [timerService]
  );

  const pauseTimer = useCallback(async () => {
    setIsPaused(true);
    await timerService.pauseTimer();
  }, [timerService]);

  const resumeTimer = useCallback(async () => {
    setIsPaused(false);
    await timerService.resumeTimer();
  }, [timerService]);

  const skipTimer = useCallback(async () => {
    try {
      await timerService.clearTimer();
      setTimeRemaining(0);
      setIsRunning(false);
      setIsPaused(false);
    } catch (error) {
      console.error("Error skipping timer:", error);
    }
  }, [timerService]);

  const adjustTime = useCallback(
    async (newTimeSeconds: number) => {
      try {
        await timerService.adjustTimer(newTimeSeconds);
        setTimeRemaining(newTimeSeconds);
        if (newTimeSeconds <= 0) {
          setIsRunning(false);
          await timerService.completeTimer();
          onComplete?.();
        }
      } catch (error) {
        console.error("Error adjusting timer:", error);
      }
    },
    [timerService, onComplete]
  );

  const addTime = useCallback(
    async (additionalSeconds: number) => {
      const newTime = timeRemaining + additionalSeconds;
      await adjustTime(newTime);
    },
    [timeRemaining, adjustTime]
  );

  const subtractTime = useCallback(
    async (subtractSeconds: number) => {
      const newTime = Math.max(0, timeRemaining - subtractSeconds);
      await adjustTime(newTime);
    },
    [timeRemaining, adjustTime]
  );

  return {
    timeRemaining,
    isRunning,
    isPaused,
    progress,
    startTimer,
    pauseTimer,
    resumeTimer,
    adjustTime,
    skipTimer,
    addTime,
    subtractTime,
  };
};

export default useTimer;
