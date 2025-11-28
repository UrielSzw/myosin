/**
 * Centralized Haptic Feedback Service
 *
 * This service provides a unified way to trigger haptic feedback throughout the app,
 * respecting the user's preference to enable/disable haptics.
 *
 * Usage:
 * - Direct: triggerHaptic("success", enabled)
 * - Hook: const haptic = useHaptic(); haptic.success();
 */

import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import * as Haptics from "expo-haptics";
import { useCallback, useMemo } from "react";
import { Vibration } from "react-native";

/**
 * Available haptic feedback types
 */
export type HapticType =
  | "light" // Selections, toggles, minor interactions
  | "medium" // Completing a set, moderate actions
  | "heavy" // Completing exercise/block, major milestones
  | "success" // PR, save, complete workout
  | "warning" // Discard, delete confirmation
  | "error" // Validation errors
  | "selection" // Picker changes, scroll selections
  | "rigid" // Drag start (short, firm)
  | "soft"; // Soft touch feedback

/**
 * Vibration patterns for specific scenarios
 */
export type VibrationPattern =
  | "timerComplete" // Rest timer finished
  | "drag"; // Drag and drop feedback

/**
 * Trigger haptic feedback
 * @param type - The type of haptic feedback
 * @param enabled - Whether haptic feedback is enabled (user preference)
 */
export const triggerHaptic = async (
  type: HapticType,
  enabled: boolean = true
): Promise<void> => {
  if (!enabled) return;

  try {
    switch (type) {
      case "light":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "success":
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        break;
      case "warning":
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning
        );
        break;
      case "error":
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case "selection":
        await Haptics.selectionAsync();
        break;
      case "rigid":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
        break;
      case "soft":
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        break;
    }
  } catch (error) {
    // Silently fail - haptics are non-critical
    console.log("Haptic feedback failed:", error);
  }
};

/**
 * Trigger vibration pattern
 * @param pattern - The vibration pattern to use
 * @param enabled - Whether haptic feedback is enabled (user preference)
 */
export const triggerVibration = (
  pattern: VibrationPattern,
  enabled: boolean = true
): void => {
  if (!enabled) return;

  try {
    switch (pattern) {
      case "timerComplete":
        // Pattern: short-pause-long-pause-short (celebration feel)
        Vibration.vibrate([100, 50, 500, 50, 100]);
        break;
      case "drag":
        // Short vibration for drag feedback
        Vibration.vibrate(50);
        break;
    }
  } catch (error) {
    console.log("Vibration failed:", error);
  }
};

/**
 * Hook for using haptic feedback in React components
 * Automatically reads user preference and provides convenient methods
 *
 * @example
 * const haptic = useHaptic();
 * haptic.success(); // Triggers success haptic if enabled
 * haptic.medium();  // Triggers medium impact if enabled
 */
export const useHaptic = () => {
  const prefs = useUserPreferences();
  const enabled = prefs?.haptic_feedback_enabled ?? true;

  const light = useCallback(() => triggerHaptic("light", enabled), [enabled]);

  const medium = useCallback(() => triggerHaptic("medium", enabled), [enabled]);

  const heavy = useCallback(() => triggerHaptic("heavy", enabled), [enabled]);

  const success = useCallback(
    () => triggerHaptic("success", enabled),
    [enabled]
  );

  const warning = useCallback(
    () => triggerHaptic("warning", enabled),
    [enabled]
  );

  const error = useCallback(() => triggerHaptic("error", enabled), [enabled]);

  const selection = useCallback(
    () => triggerHaptic("selection", enabled),
    [enabled]
  );

  const rigid = useCallback(() => triggerHaptic("rigid", enabled), [enabled]);

  const soft = useCallback(() => triggerHaptic("soft", enabled), [enabled]);

  const timerComplete = useCallback(
    () => triggerVibration("timerComplete", enabled),
    [enabled]
  );

  const drag = useCallback(() => triggerVibration("drag", enabled), [enabled]);

  return useMemo(
    () => ({
      // Impact feedback
      light,
      medium,
      heavy,
      rigid,
      soft,

      // Notification feedback
      success,
      warning,
      error,

      // Selection feedback
      selection,

      // Vibration patterns
      timerComplete,
      drag,

      // Raw access (for edge cases)
      isEnabled: enabled,
      trigger: (type: HapticType) => triggerHaptic(type, enabled),
      vibrate: (pattern: VibrationPattern) =>
        triggerVibration(pattern, enabled),
    }),
    [
      light,
      medium,
      heavy,
      rigid,
      soft,
      success,
      warning,
      error,
      selection,
      timerComplete,
      drag,
      enabled,
    ]
  );
};
