import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { syncStatusTranslations as t } from "@/shared/translations/sync-status";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { AlertCircle, Clock, Loader2, Send } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { QueueStats } from "../hooks/use-sync-status";

type Props = {
  stats: QueueStats;
  delay?: number;
};

export const QueueStatusCard = ({ stats, delay = 0 }: Props) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  const isEmpty = stats.total === 0;

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
          {t.sectionTitleQueue[lang]}
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
            {isEmpty ? (
              <View style={styles.emptyState}>
                <View
                  style={[
                    styles.emptyIcon,
                    { backgroundColor: `${colors.success[500]}15` },
                  ]}
                >
                  <Send size={20} color={colors.success[500]} />
                </View>
                <Typography
                  variant="body2"
                  color="textMuted"
                  style={{ marginTop: 8 }}
                >
                  {t.emptyQueue[lang]}
                </Typography>
              </View>
            ) : (
              <>
                {/* Stats grid */}
                <View style={styles.statsGrid}>
                  {/* Pending */}
                  <View style={styles.statItem}>
                    <View
                      style={[
                        styles.statIcon,
                        { backgroundColor: `${colors.primary[500]}15` },
                      ]}
                    >
                      <Clock size={16} color={colors.primary[500]} />
                    </View>
                    <Typography
                      variant="h4"
                      weight="bold"
                      style={{ color: colors.text, marginTop: 8 }}
                    >
                      {stats.pending}
                    </Typography>
                    <Typography variant="caption" color="textMuted">
                      {t.pending[lang]}
                    </Typography>
                  </View>

                  {/* Processing */}
                  <View style={styles.statItem}>
                    <View
                      style={[
                        styles.statIcon,
                        { backgroundColor: `${colors.warning[500]}15` },
                      ]}
                    >
                      <Loader2 size={16} color={colors.warning[500]} />
                    </View>
                    <Typography
                      variant="h4"
                      weight="bold"
                      style={{ color: colors.text, marginTop: 8 }}
                    >
                      {stats.processing}
                    </Typography>
                    <Typography variant="caption" color="textMuted">
                      {t.processing[lang]}
                    </Typography>
                  </View>

                  {/* Failed */}
                  <View style={styles.statItem}>
                    <View
                      style={[
                        styles.statIcon,
                        { backgroundColor: `${colors.error[500]}15` },
                      ]}
                    >
                      <AlertCircle size={16} color={colors.error[500]} />
                    </View>
                    <Typography
                      variant="h4"
                      weight="bold"
                      style={{ color: colors.text, marginTop: 8 }}
                    >
                      {stats.failed}
                    </Typography>
                    <Typography variant="caption" color="textMuted">
                      {t.failed[lang]}
                    </Typography>
                  </View>
                </View>

                {/* Total */}
                <View
                  style={[
                    styles.totalBadge,
                    {
                      backgroundColor: isDarkMode
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.03)",
                    },
                  ]}
                >
                  <Typography
                    variant="caption"
                    weight="medium"
                    color="textMuted"
                  >
                    {stats.total} {t.itemsInQueue[lang]}
                  </Typography>
                </View>
              </>
            )}
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
    padding: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 8,
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  totalBadge: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
