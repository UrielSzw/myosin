import { QueueGateService } from "@/shared/sync/restore/queue-gate";
import { useSyncEngine } from "@/shared/sync/sync-engine";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuroraBackground } from "../workouts-v2/components/AuroraBackground";
import { DataSummaryCard } from "./components/DataSummaryCard";
import { GeneralStatusCard } from "./components/GeneralStatusCard";
import { QueueStatusCard } from "./components/QueueStatusCard";
import { SyncActions } from "./components/SyncActions";
import { SyncStatusHeader } from "./components/SyncStatusHeader";
import { useSyncStatus } from "./hooks/use-sync-status";

export const SyncStatusFeatureV2 = () => {
  const insets = useSafeAreaInsets();
  const { status, refresh } = useSyncStatus();
  const { processQueue } = useSyncEngine();
  const [isSyncing, setIsSyncing] = useState(false);

  // Calculate header height for padding (matching ProfilePersonalDataFeatureV2)
  const headerHeight = insets.top + 8 + 60 + 20;

  const handleSyncNow = useCallback(async () => {
    setIsSyncing(true);
    try {
      await processQueue();
      // Wait a bit for the queue to process
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await refresh();
    } finally {
      setIsSyncing(false);
    }
  }, [processQueue, refresh]);

  const handleClearQueue = useCallback(async () => {
    await QueueGateService.forceQueueClear();
    await refresh();
  }, [refresh]);

  return (
    <View style={styles.container}>
      <AuroraBackground />
      <SyncStatusHeader onRefresh={refresh} isLoading={status.isLoading} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + 16,
            paddingBottom: insets.bottom + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* General Status */}
        <GeneralStatusCard
          isOnline={status.isOnline}
          hasPendingItems={status.queue.total > 0}
          delay={100}
        />

        {/* Queue Status */}
        <QueueStatusCard stats={status.queue} delay={200} />

        {/* Data Summary */}
        <DataSummaryCard tables={status.tables} delay={300} />

        {/* Actions */}
        <SyncActions
          onSyncNow={handleSyncNow}
          onClearQueue={handleClearQueue}
          queueCount={status.queue.total}
          isSyncing={isSyncing}
          isOnline={status.isOnline}
          delay={450}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
});
