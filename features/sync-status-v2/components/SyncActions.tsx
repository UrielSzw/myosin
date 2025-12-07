import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { RefreshCw, Trash2 } from "lucide-react-native";
import React from "react";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

// Solo mostrar Clear Queue en desarrollo
const __DEV_SHOW_CLEAR_QUEUE__ = __DEV__;

type Props = {
  onSyncNow: () => void;
  onClearQueue: () => void;
  queueCount: number;
  isSyncing: boolean;
  isOnline: boolean;
  delay?: number;
};

const translations = {
  sectionTitle: {
    es: "Acciones",
    en: "Actions",
  },
  syncNow: {
    es: "Sincronizar Ahora",
    en: "Sync Now",
  },
  syncNowSubtitle: {
    es: "Procesar cola de sincronización",
    en: "Process sync queue",
  },
  syncing: {
    es: "Sincronizando...",
    en: "Syncing...",
  },
  clearQueue: {
    es: "Limpiar Cola",
    en: "Clear Queue",
  },
  clearQueueSubtitle: {
    es: "Eliminar items con error",
    en: "Remove failed items",
  },
  clearQueueAlertTitle: {
    es: "Limpiar Cola",
    en: "Clear Queue",
  },
  clearQueueAlertMessage: {
    es: "¿Estás seguro? Esto eliminará todos los items pendientes de sincronización. Los datos locales NO se eliminarán.",
    en: "Are you sure? This will remove all pending sync items. Local data will NOT be deleted.",
  },
  cancel: {
    es: "Cancelar",
    en: "Cancel",
  },
  confirm: {
    es: "Limpiar",
    en: "Clear",
  },
};

export const SyncActions = ({
  onSyncNow,
  onClearQueue,
  queueCount,
  isSyncing,
  isOnline,
  delay = 0,
}: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  const handleClearQueue = () => {
    Alert.alert(
      translations.clearQueueAlertTitle[lang],
      translations.clearQueueAlertMessage[lang],
      [
        { text: translations.cancel[lang], style: "cancel" },
        {
          text: translations.confirm[lang],
          style: "destructive",
          onPress: onClearQueue,
        },
      ]
    );
  };

  return (
    <View>
      <Animated.View entering={FadeInDown.duration(300).delay(delay)}>
        <Typography
          variant="caption"
          weight="semibold"
          style={{
            color: colors.textMuted,
            marginBottom: 12,
            marginLeft: 4,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {translations.sectionTitle[lang]}
        </Typography>
      </Animated.View>

      <View style={styles.actionsContainer}>
        {/* Sync Now Button */}
        <Animated.View entering={FadeInDown.duration(300).delay(delay + 50)}>
          <Pressable
            onPress={onSyncNow}
            disabled={isSyncing || !isOnline}
            style={({ pressed }) => [
              styles.actionCard,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(255,255,255,0.7)",
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)",
                opacity:
                  pressed && !isSyncing && isOnline
                    ? 0.8
                    : isSyncing || !isOnline
                    ? 0.5
                    : 1,
                transform: [
                  { scale: pressed && !isSyncing && isOnline ? 0.98 : 1 },
                ],
              },
            ]}
          >
            {Platform.OS === "ios" && (
              <BlurView
                intensity={isDarkMode ? 8 : 20}
                tint={isDarkMode ? "dark" : "light"}
                style={StyleSheet.absoluteFill}
              />
            )}

            <View style={styles.actionContent}>
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: `${colors.primary[500]}15` },
                ]}
              >
                <RefreshCw
                  size={20}
                  color={colors.primary[500]}
                  strokeWidth={2}
                />
              </View>
              <View style={styles.actionText}>
                <Typography
                  variant="body1"
                  weight="medium"
                  style={{ color: colors.text }}
                >
                  {isSyncing
                    ? translations.syncing[lang]
                    : translations.syncNow[lang]}
                </Typography>
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ marginTop: 2 }}
                >
                  {translations.syncNowSubtitle[lang]}
                </Typography>
              </View>
            </View>
          </Pressable>
        </Animated.View>

        {/* Clear Queue Button - Solo visible en desarrollo */}
        {__DEV_SHOW_CLEAR_QUEUE__ && (
          <Animated.View entering={FadeInDown.duration(300).delay(delay + 100)}>
            <Pressable
              onPress={handleClearQueue}
              disabled={queueCount === 0}
              style={({ pressed }) => [
                styles.actionCard,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(239, 68, 68, 0.06)"
                    : "rgba(239, 68, 68, 0.04)",
                  borderColor: `${colors.error[500]}15`,
                  opacity:
                    pressed && queueCount > 0
                      ? 0.8
                      : queueCount === 0
                      ? 0.5
                      : 1,
                  transform: [{ scale: pressed && queueCount > 0 ? 0.98 : 1 }],
                },
              ]}
            >
              <View style={styles.actionContent}>
                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: `${colors.error[500]}15` },
                  ]}
                >
                  <Trash2 size={20} color={colors.error[500]} strokeWidth={2} />
                </View>
                <View style={styles.actionText}>
                  <Typography
                    variant="body1"
                    weight="medium"
                    style={{ color: colors.error[500] }}
                  >
                    {translations.clearQueue[lang]} ({queueCount})
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textMuted"
                    style={{ marginTop: 2 }}
                  >
                    {translations.clearQueueSubtitle[lang]}
                  </Typography>
                </View>
              </View>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    gap: 10,
  },
  actionCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    flex: 1,
    marginLeft: 14,
  },
});
