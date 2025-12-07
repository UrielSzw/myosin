import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { CheckCircle, Cloud, Wifi, WifiOff } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  isOnline: boolean;
  hasPendingItems: boolean;
  delay?: number;
};

const translations = {
  sectionTitle: {
    es: "Estado General",
    en: "General Status",
  },
  online: {
    es: "En línea",
    en: "Online",
  },
  offline: {
    es: "Sin conexión",
    en: "Offline",
  },
  synced: {
    es: "Sincronizado",
    en: "Synced",
  },
  pendingSync: {
    es: "Sincronización pendiente",
    en: "Sync pending",
  },
  offlineNote: {
    es: "Los cambios se sincronizarán cuando vuelvas a estar en línea",
    en: "Changes will sync when you're back online",
  },
  allSyncedNote: {
    es: "Todos tus datos están sincronizados con la nube",
    en: "All your data is synced with the cloud",
  },
  pendingNote: {
    es: "Hay cambios locales esperando ser sincronizados",
    en: "There are local changes waiting to be synced",
  },
};

export const GeneralStatusCard = ({
  isOnline,
  hasPendingItems,
  delay = 0,
}: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  const isSynced = isOnline && !hasPendingItems;

  const statusColor = !isOnline
    ? colors.warning[500]
    : isSynced
    ? colors.success[500]
    : colors.primary[500];

  const StatusIcon = !isOnline ? WifiOff : isSynced ? CheckCircle : Cloud;
  const statusText = !isOnline
    ? translations.offline[lang]
    : isSynced
    ? translations.synced[lang]
    : translations.pendingSync[lang];

  const noteText = !isOnline
    ? translations.offlineNote[lang]
    : isSynced
    ? translations.allSyncedNote[lang]
    : translations.pendingNote[lang];

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

      <Animated.View entering={FadeInDown.duration(300).delay(delay + 50)}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.03)"
                : "rgba(255,255,255,0.7)",
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.04)",
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

          <View style={styles.content}>
            {/* Status indicator */}
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: `${statusColor}15` },
              ]}
            >
              <StatusIcon size={28} color={statusColor} strokeWidth={2} />
            </View>

            {/* Text */}
            <View style={styles.textContainer}>
              <View style={styles.statusRow}>
                <View
                  style={[styles.statusDot, { backgroundColor: statusColor }]}
                />
                <Typography
                  variant="body1"
                  weight="semibold"
                  style={{ color: colors.text }}
                >
                  {statusText}
                </Typography>
              </View>
              <Typography
                variant="caption"
                color="textMuted"
                style={{ marginTop: 4, lineHeight: 18 }}
              >
                {noteText}
              </Typography>
            </View>

            {/* Connection indicator */}
            <View
              style={[
                styles.connectionBadge,
                {
                  backgroundColor: isOnline
                    ? `${colors.success[500]}15`
                    : `${colors.warning[500]}15`,
                },
              ]}
            >
              {isOnline ? (
                <Wifi size={14} color={colors.success[500]} />
              ) : (
                <WifiOff size={14} color={colors.warning[500]} />
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 28,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  statusIndicator: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectionBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
