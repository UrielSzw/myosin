import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef, useState } from "react";
import { getSyncStateManager } from "../sync/queue/sync-state-manager";

export const useNetwork = () => {
  const [isOnline, setIsOnline] = useState(true);
  const isOnlineRef = useRef(true);

  useEffect(() => {
    const syncStateManager = getSyncStateManager();
    let isInitialized = false;

    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const wasOnline = isOnlineRef.current;
      const isNowOnline = state.isConnected ?? false;
      const isGoodConnection = state.isInternetReachable ?? true;

      // Actualizar ref inmediatamente y state para UI
      isOnlineRef.current = isNowOnline;
      setIsOnline(isNowOnline);

      // Notificar al sync state manager en la primera llamada o cuando cambia
      if (!isInitialized || wasOnline !== isNowOnline) {
        isInitialized = true;
        try {
          await syncStateManager.onNetworkChange(isNowOnline, isGoodConnection);
        } catch (error) {
          console.warn(
            "Failed to notify sync state manager of network change:",
            error
          );
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return isOnline;
};
