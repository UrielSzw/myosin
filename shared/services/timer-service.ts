import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { AppState, AppStateStatus } from "react-native";

export interface TimerData {
  id: string;
  startedAt: number;
  duration: number;
  title: string;
  body: string;
  isActive: boolean;
  isPaused?: boolean;
  pausedAt?: number;
  totalPausedTime?: number;
}

// Configurar el comportamiento de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class TimerService {
  private static instance: TimerService;
  private currentTimer: TimerData | null = null;
  private notificationId: string | null = null;
  private isAppInForeground = true;
  private appStateSubscription: any = null;

  private constructor() {
    this.initializeAppStateListener();
  }

  static getInstance(): TimerService {
    if (!TimerService.instance) {
      TimerService.instance = new TimerService();
    }
    return TimerService.instance;
  }

  private initializeAppStateListener() {
    this.appStateSubscription = AppState.addEventListener(
      "change",
      this.handleAppStateChange
    );
  }

  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    const wasInBackground = !this.isAppInForeground;
    const wasInForeground = this.isAppInForeground;
    this.isAppInForeground = nextAppState === "active";

    // Si volvemos del background y hay una notificación programada, cancelarla
    if (wasInBackground && this.isAppInForeground && this.notificationId) {
      console.log("🚫 App back in foreground - cancelling notification");
      Notifications.cancelScheduledNotificationAsync(this.notificationId);
      this.notificationId = null;
    }

    // Si pasamos de foreground a background y hay un timer activo, programar notificación
    if (
      wasInForeground &&
      !this.isAppInForeground &&
      this.currentTimer?.isActive &&
      !this.currentTimer?.isPaused
    ) {
      console.log(
        "📱 App went to background - scheduling notification for active timer"
      );
      this.scheduleNotificationForActiveTimer();
    }
  };

  private async scheduleNotificationForActiveTimer() {
    try {
      const timerData = await this.getCurrentTimer();
      if (!timerData || !timerData.isActive || timerData.isPaused) {
        return;
      }

      const remainingTime = await this.getRemainingTime();
      if (remainingTime > 0) {
        const hasPermissions = await this.requestPermissions();
        if (hasPermissions) {
          await this.scheduleNotification(
            remainingTime,
            timerData.title,
            timerData.body,
            timerData.id
          );
        }
      }
    } catch (error) {
      console.error("Error scheduling notification for active timer:", error);
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === "granted";
  }

  async startTimer(
    durationSeconds: number,
    title: string = "Timer Completado",
    body: string = "Tu timer ha terminado"
  ): Promise<string> {
    // Si ya hay un timer activo, solo cancelar la notificación
    // sin llamar a clearTimer completo para evitar triggerar onComplete
    if (this.currentTimer?.isActive && this.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(this.notificationId);
      this.notificationId = null;
    } else if (!this.currentTimer?.isActive) {
      // Solo limpiar completamente si NO hay timer activo
      await this.clearTimer();
    }

    const timerId = `timer-${Date.now()}`;
    const startedAt = Date.now();

    const timerData: TimerData = {
      id: timerId,
      startedAt,
      duration: durationSeconds,
      title,
      body,
      isActive: true,
      isPaused: false,
      pausedAt: 0,
      totalPausedTime: 0,
    };

    // Guardar en AsyncStorage
    await AsyncStorage.setItem("currentTimer", JSON.stringify(timerData));
    this.currentTimer = timerData;

    // Siempre programar notificación, pero cancelarla inmediatamente si estamos en foreground
    const hasPermissions = await this.requestPermissions();
    if (hasPermissions) {
      await this.scheduleNotification(durationSeconds, title, body, timerId);

      // Si estamos en foreground, cancelar la notificación inmediatamente
      if (this.isAppInForeground && this.notificationId) {
        console.log("🚫 Cancelling notification - timer started in foreground");
        await Notifications.cancelScheduledNotificationAsync(
          this.notificationId
        );
        this.notificationId = null;
      }
    }

    return timerId;
  }

  private async scheduleNotification(
    durationSeconds: number,
    title: string,
    body: string,
    timerId: string
  ) {
    try {
      // Cancelar notificación anterior si existe
      if (this.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(
          this.notificationId
        );
        this.notificationId = null;
      }

      this.notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: "timer_complete.wav",
          priority: Notifications.AndroidNotificationPriority.HIGH,
          vibrate: [100, 50, 500, 50, 100],
          data: { timerId },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: durationSeconds,
        },
      });

      const context = this.isAppInForeground ? "foreground" : "background";
      console.log(
        `🔔 Notification scheduled for ${durationSeconds}s (${context}):`,
        this.notificationId
      );
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  }

  async getRemainingTime(): Promise<number> {
    const timerData = await this.getCurrentTimer();
    if (!timerData || !timerData.isActive) {
      return 0;
    }

    if (timerData.isPaused) {
      // Si está pausado, calcular basado en cuando se pausó
      const elapsedBeforePause =
        (timerData.pausedAt! - timerData.startedAt) / 1000;
      const totalPaused = timerData.totalPausedTime || 0;
      const remaining = Math.max(
        0,
        timerData.duration - elapsedBeforePause + totalPaused
      );
      return Math.ceil(remaining);
    }

    const now = Date.now();
    const totalPaused = timerData.totalPausedTime || 0;
    const elapsed = (now - timerData.startedAt) / 1000 - totalPaused;
    const remaining = Math.max(0, timerData.duration - elapsed);

    // Si el timer ya terminó, limpiar automáticamente
    if (remaining <= 0) {
      await this.clearTimer();
    }

    return Math.ceil(remaining);
  }
  async getCurrentTimer(): Promise<TimerData | null> {
    try {
      const timerJson = await AsyncStorage.getItem("currentTimer");
      if (timerJson) {
        const timerData: TimerData = JSON.parse(timerJson);
        this.currentTimer = timerData;
        return timerData;
      }
    } catch (error) {
      console.error("Error getting current timer:", error);
    }
    return null;
  }

  async hasActiveTimer(): Promise<boolean> {
    const timer = await this.getCurrentTimer();
    if (!timer || !timer.isActive) {
      return false;
    }

    const remaining = await this.getRemainingTime();
    return remaining > 0;
  }

  async adjustTimer(newDurationSeconds: number): Promise<void> {
    const timerData = await this.getCurrentTimer();
    if (!timerData || !timerData.isActive) {
      return;
    }

    // Cancelar notificación anterior
    if (this.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(this.notificationId);
      this.notificationId = null;
    }

    // Actualizar timer con nueva duración
    const updatedTimer: TimerData = {
      ...timerData,
      startedAt: Date.now(),
      duration: newDurationSeconds,
    };

    await AsyncStorage.setItem("currentTimer", JSON.stringify(updatedTimer));
    this.currentTimer = updatedTimer;

    // Programar nueva notificación si el timer no terminó
    if (newDurationSeconds > 0) {
      const hasPermissions = await this.requestPermissions();
      if (hasPermissions) {
        await this.scheduleNotification(
          newDurationSeconds,
          timerData.title,
          timerData.body,
          timerData.id
        );
      }
    }
  }

  async clearTimer(): Promise<void> {
    try {
      if (this.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(
          this.notificationId
        );
        this.notificationId = null;
      }
      await AsyncStorage.removeItem("currentTimer");
      this.currentTimer = null;
    } catch (error) {
      console.error("Error clearing timer:", error);
    }
  }

  async pauseTimer(): Promise<void> {
    const timerData = await this.getCurrentTimer();
    if (!timerData || !timerData.isActive || timerData.isPaused) {
      return;
    }

    const pausedAt = Date.now();
    const updatedTimer: TimerData = {
      ...timerData,
      isPaused: true,
      pausedAt,
    };

    await AsyncStorage.setItem("currentTimer", JSON.stringify(updatedTimer));
    this.currentTimer = updatedTimer;

    if (this.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(this.notificationId);
      this.notificationId = null;
    }
  }

  async resumeTimer(): Promise<void> {
    const timerData = await this.getCurrentTimer();
    if (!timerData || !timerData.isActive || !timerData.isPaused) {
      return;
    }

    const resumedAt = Date.now();
    const pauseDuration = (resumedAt - timerData.pausedAt!) / 1000;
    const totalPausedTime = (timerData.totalPausedTime || 0) + pauseDuration;
    const elapsedBeforePause =
      (timerData.pausedAt! - timerData.startedAt) / 1000;
    const remainingTime = Math.max(0, timerData.duration - elapsedBeforePause);

    const updatedTimer: TimerData = {
      ...timerData,
      isPaused: false,
      pausedAt: undefined,
      totalPausedTime,
    };

    await AsyncStorage.setItem("currentTimer", JSON.stringify(updatedTimer));
    this.currentTimer = updatedTimer;

    // Programar notificación y cancelar si estamos en foreground
    if (remainingTime > 0) {
      const hasPermissions = await this.requestPermissions();
      if (hasPermissions) {
        await this.scheduleNotification(
          remainingTime,
          timerData.title,
          timerData.body,
          timerData.id
        );

        // Si estamos en foreground, cancelar la notificación inmediatamente
        if (this.isAppInForeground && this.notificationId) {
          console.log(
            "🚫 Cancelling notification - timer resumed in foreground"
          );
          await Notifications.cancelScheduledNotificationAsync(
            this.notificationId
          );
          this.notificationId = null;
        }
      }
    }
  }

  async cancelNotificationIfForeground(): Promise<void> {
    if (this.isAppInForeground && this.notificationId) {
      console.log("🚫 Cancelling notification - app in foreground");
      await Notifications.cancelScheduledNotificationAsync(this.notificationId);
      this.notificationId = null;
    }
  }

  async completeTimer(): Promise<void> {
    // Cancelar notificación si la app está en primer plano
    await this.cancelNotificationIfForeground();
    await this.clearTimer();
  }

  // Método para recuperar el estado del timer al abrir la app
  async restoreTimerState(): Promise<{
    remainingTime: number;
    timerData: TimerData | null;
  }> {
    const timerData = await this.getCurrentTimer();
    if (!timerData || !timerData.isActive) {
      return { remainingTime: 0, timerData: null };
    }

    const remainingTime = await this.getRemainingTime();
    return { remainingTime, timerData };
  }

  cleanup() {
    if (this.appStateSubscription) {
      this.appStateSubscription?.remove();
    }
  }
}

export default TimerService;
