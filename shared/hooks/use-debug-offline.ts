import { create } from "zustand";
import { useNetwork } from "./use-network";

interface OfflineDebugLog {
  timestamp: string;
  message: string;
  data?: any;
  wasOnline: boolean;
}

interface DebugOfflineStore {
  offlineDebugLogs: OfflineDebugLog[];
  addOfflineDebugLog: (message: string, data?: any) => void;
  clearOfflineDebugLogs: () => void;
  consoleAllDebugLogs: () => void;
}

const useDebugOfflineStore = create<DebugOfflineStore>((set, get) => ({
  offlineDebugLogs: [],

  addOfflineDebugLog: (message: string, data?: any) => {
    const newLog: OfflineDebugLog = {
      timestamp: new Date().toISOString(),
      message,
      data,
      wasOnline: false, // Lo setearemos desde el hook
    };

    set((state) => ({
      offlineDebugLogs: [...state.offlineDebugLogs, newLog],
    }));
  },

  clearOfflineDebugLogs: () => {
    set({ offlineDebugLogs: [] });
  },

  consoleAllDebugLogs: () => {
    const { offlineDebugLogs } = get();
    console.log("🐛 DEBUG OFFLINE LOGS:", offlineDebugLogs);
    set({ offlineDebugLogs: [] });
  },
}));

export const useDebugOffline = () => {
  const store = useDebugOfflineStore();
  const isOnline = useNetwork();

  const addOfflineDebugLog = (message: string, data?: any) => {
    const newLog: OfflineDebugLog = {
      timestamp: new Date().toISOString(),
      message,
      data,
      wasOnline: isOnline,
    };

    useDebugOfflineStore.setState((state) => ({
      offlineDebugLogs: [...state.offlineDebugLogs, newLog],
    }));
  };

  return {
    offlineDebugLogs: store.offlineDebugLogs,
    addOfflineDebugLog,
    clearOfflineDebugLogs: store.clearOfflineDebugLogs,
    consoleAllDebugLogs: store.consoleAllDebugLogs,
  };
};
