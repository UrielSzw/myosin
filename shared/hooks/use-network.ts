import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { SyncStateManager } from "../sync/queue/sync-state-manager";

// Singleton instance para notificar cambios de red
let globalSyncStateManager: SyncStateManager | null = null;

const getSyncStateManager = () => {
  if (!globalSyncStateManager) {
    globalSyncStateManager = new SyncStateManager();
  }
  return globalSyncStateManager;
};

export const useNetwork = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const syncStateManager = getSyncStateManager();

    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const wasOnline = isOnline;
      const isNowOnline = state.isConnected ?? false;
      const isGoodConnection = state.isInternetReachable ?? true;

      setIsOnline(isNowOnline);

      // Notificar al sync state manager solo si cambió el estado
      if (wasOnline !== isNowOnline) {
        try {
          await syncStateManager.onNetworkChange(isNowOnline, isGoodConnection);
          console.log(
            `🌐 Network state changed: ${wasOnline ? "online" : "offline"} → ${
              isNowOnline ? "online" : "offline"
            }`
          );
        } catch (error) {
          console.warn(
            "Failed to notify sync state manager of network change:",
            error
          );
        }
      }
    });

    return () => unsubscribe();
  }, [isOnline]);

  return isOnline;
};
