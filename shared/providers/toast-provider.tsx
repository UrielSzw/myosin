import type { MeasurementTemplateId } from "@/shared/types/measurement";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

// ============================================
// TOAST TYPES
// ============================================

export type PRToastData = {
  type: "pr";
  exerciseName: string;
  measurementTemplate: MeasurementTemplateId;
  primaryValue: number;
  secondaryValue: number | null;
  prScore: number;
};

export type UnlockToastData = {
  type: "unlock";
  exerciseName: string;
  unlockedByExerciseName?: string;
};

export type ToastData = PRToastData | UnlockToastData;

type ToastItem = {
  id: string;
  data: ToastData;
  timestamp: number;
};

// ============================================
// CONTEXT
// ============================================

type ToastContextType = {
  toasts: ToastItem[];
  showPRToast: (data: Omit<PRToastData, "type">) => void;
  showUnlockToast: (data: Omit<UnlockToastData, "type">) => void;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

// ============================================
// PROVIDER
// ============================================

const TOAST_DURATION = 3000; // 3 seconds
const MAX_TOASTS = 3; // Max visible toasts at once

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastIdRef = useRef(0);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (data: ToastData) => {
      const id = `toast-${++toastIdRef.current}`;
      const newToast: ToastItem = {
        id,
        data,
        timestamp: Date.now(),
      };

      setToasts((prev) => {
        // Keep only the most recent MAX_TOASTS
        const updated = [...prev, newToast];
        if (updated.length > MAX_TOASTS) {
          return updated.slice(-MAX_TOASTS);
        }
        return updated;
      });

      // Auto-dismiss after duration
      setTimeout(() => {
        dismissToast(id);
      }, TOAST_DURATION);

      return id;
    },
    [dismissToast]
  );

  const showPRToast = useCallback(
    (data: Omit<PRToastData, "type">) => {
      addToast({ ...data, type: "pr" });
    },
    [addToast]
  );

  const showUnlockToast = useCallback(
    (data: Omit<UnlockToastData, "type">) => {
      addToast({ ...data, type: "unlock" });
    },
    [addToast]
  );

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value = useMemo(
    () => ({
      toasts,
      showPRToast,
      showUnlockToast,
      dismissToast,
      clearAllToasts,
    }),
    [toasts, showPRToast, showUnlockToast, dismissToast, clearAllToasts]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};

// ============================================
// HOOKS
// ============================================

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

/**
 * Hook to access toast functions without the toasts array.
 * Useful for stores/services that only need to trigger toasts.
 * Returns stable references that won't cause re-renders.
 */
export const useToastActions = () => {
  const { showPRToast, showUnlockToast, dismissToast, clearAllToasts } =
    useToast();
  return { showPRToast, showUnlockToast, dismissToast, clearAllToasts };
};

// ============================================
// SINGLETON FOR NON-REACT CODE
// ============================================

/**
 * Global toast functions for use outside React components (e.g., Zustand stores).
 * Must be initialized by ToastPortal component.
 */
let globalShowPRToast: ToastContextType["showPRToast"] | null = null;
let globalShowUnlockToast: ToastContextType["showUnlockToast"] | null = null;

export const initializeGlobalToast = (
  showPR: ToastContextType["showPRToast"],
  showUnlock: ToastContextType["showUnlockToast"]
) => {
  globalShowPRToast = showPR;
  globalShowUnlockToast = showUnlock;
};

export const getGlobalToast = () => ({
  showPRToast: (data: Omit<PRToastData, "type">) => {
    if (globalShowPRToast) {
      globalShowPRToast(data);
    } else {
      console.warn("Toast not initialized. Make sure ToastPortal is mounted.");
    }
  },
  showUnlockToast: (data: Omit<UnlockToastData, "type">) => {
    if (globalShowUnlockToast) {
      globalShowUnlockToast(data);
    } else {
      console.warn("Toast not initialized. Make sure ToastPortal is mounted.");
    }
  },
});
