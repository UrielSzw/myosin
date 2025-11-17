import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef, useState } from "react";
import { useSyncStateManager } from "../sync/queue/sync-state-manager";

interface NetworkInfo {
  isOnline: boolean;
  isGoodConnection: boolean;
  connectionType: string | null;
}

/**
 * Hook que combina network detection con sync state management
 */
export const useNetworkSync = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    isOnline: true,
    isGoodConnection: true,
    connectionType: null,
  });

  const syncState = useSyncStateManager();
  const lastNotificationRef = useRef<number>(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const isOnline = state.isConnected ?? false;
      const isGoodConnection =
        (!state.isInternetReachable === false && state.type !== "cellular") ||
        (state.type === "cellular" && (state.details as any)?.strength >= 2);

      const newNetworkInfo = {
        isOnline,
        isGoodConnection,
        connectionType: state.type,
      };

      setNetworkInfo(newNetworkInfo);

      // Throttle notifications to avoid spam (max every 2 seconds)
      const now = Date.now();
      if (now - lastNotificationRef.current > 2000) {
        try {
          await syncState.onNetworkChange(isOnline, isGoodConnection);
          lastNotificationRef.current = now;
        } catch (error) {
          console.warn("Failed to notify sync state of network change:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [syncState]);

  return {
    ...networkInfo,
    // Legacy compatibility
    isOnline: networkInfo.isOnline,
  };
};

/**
 * Backward compatibility hook
 */
export const useNetwork = () => {
  const { isOnline } = useNetworkSync();
  return isOnline;
};
