import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import {
  CheckCircle,
  Database,
  Dumbbell,
  FolderOpen,
  Gauge,
  Trophy,
  Utensils,
  Zap,
} from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { TableSyncStats } from "../hooks/use-sync-status";

type Props = {
  tables: TableSyncStats[];
  delay?: number;
};

const translations = {
  sectionTitle: {
    es: "Datos Locales",
    en: "Local Data",
  },
  synced: {
    es: "sincronizados",
    en: "synced",
  },
  unsynced: {
    es: "sin sincronizar",
    en: "unsynced",
  },
  allSynced: {
    es: "Todo sincronizado",
    en: "All synced",
  },
};

const TABLE_ICONS: Record<string, { icon: typeof Database; color: string }> = {
  routines: { icon: Dumbbell, color: "#8b5cf6" },
  folders: { icon: FolderOpen, color: "#f59e0b" },
  workout_sessions: { icon: Zap, color: "#10b981" },
  pr_current: { icon: Trophy, color: "#ec4899" },
  tracker_metrics: { icon: Gauge, color: "#0ea5e9" },
  tracker_entries: { icon: Gauge, color: "#06b6d4" },
  macro_entries: { icon: Utensils, color: "#f97316" },
};

const TABLE_DISPLAY_NAMES: Record<string, { es: string; en: string }> = {
  routines: { es: "Rutinas", en: "Routines" },
  folders: { es: "Carpetas", en: "Folders" },
  workout_sessions: { es: "Entrenamientos", en: "Workouts" },
  pr_current: { es: "Records Personales", en: "Personal Records" },
  tracker_metrics: { es: "Métricas", en: "Metrics" },
  tracker_entries: { es: "Entradas Tracker", en: "Tracker Entries" },
  macro_entries: { es: "Entradas Macros", en: "Macro Entries" },
};

export const DataSummaryCard = ({ tables, delay = 0 }: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  // Filter out empty tables
  const nonEmptyTables = tables.filter((t) => t.total > 0);

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

      <View style={styles.cardsContainer}>
        {nonEmptyTables.map((table, index) => {
          const config = TABLE_ICONS[table.tableName] ?? {
            icon: Database,
            color: "#6366f1",
          };
          const Icon = config.icon;
          const displayName =
            TABLE_DISPLAY_NAMES[table.tableName]?.[lang] ?? table.displayName;
          const isSynced = table.unsynced === 0;

          return (
            <Animated.View
              key={table.tableName}
              entering={FadeInDown.duration(300).delay(delay + 50 + index * 30)}
            >
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
                  {/* Icon */}
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: `${config.color}15` },
                    ]}
                  >
                    <Icon size={18} color={config.color} strokeWidth={2} />
                  </View>

                  {/* Text */}
                  <View style={styles.textContainer}>
                    <Typography
                      variant="body2"
                      weight="medium"
                      style={{ color: colors.text }}
                    >
                      {displayName}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textMuted"
                      style={{ marginTop: 2 }}
                    >
                      {table.total} total
                    </Typography>
                  </View>

                  {/* Status */}
                  <View style={styles.statusContainer}>
                    {isSynced ? (
                      <View
                        style={[
                          styles.syncedBadge,
                          { backgroundColor: `${colors.success[500]}15` },
                        ]}
                      >
                        <CheckCircle size={12} color={colors.success[500]} />
                        <Typography
                          variant="caption"
                          weight="medium"
                          style={{
                            color: colors.success[500],
                            marginLeft: 4,
                            fontSize: 10,
                          }}
                        >
                          {translations.allSynced[lang]}
                        </Typography>
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.unsyncedBadge,
                          { backgroundColor: `${colors.warning[500]}15` },
                        ]}
                      >
                        <Typography
                          variant="caption"
                          weight="semibold"
                          style={{ color: colors.warning[500], fontSize: 11 }}
                        >
                          {table.unsynced}
                        </Typography>
                        <Typography
                          variant="caption"
                          style={{
                            color: colors.warning[500],
                            marginLeft: 4,
                            fontSize: 10,
                          }}
                        >
                          {translations.unsynced[lang]}
                        </Typography>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </Animated.View>
          );
        })}

        {nonEmptyTables.length === 0 && (
          <Animated.View entering={FadeInDown.duration(300).delay(delay + 50)}>
            <View
              style={[
                styles.emptyCard,
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
              <Database size={24} color={colors.textMuted} />
              <Typography
                variant="body2"
                color="textMuted"
                style={{ marginTop: 8 }}
              >
                No hay datos locales
              </Typography>
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardsContainer: {
    gap: 10,
    marginBottom: 28,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  statusContainer: {
    marginLeft: 8,
  },
  syncedBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  unsyncedBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  emptyCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
