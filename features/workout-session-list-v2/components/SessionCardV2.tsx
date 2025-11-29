import { SessionListItem } from "@/features/workout-session-list/types/session-list";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Dumbbell,
  Sparkles,
} from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  session: SessionListItem;
  index: number;
  lang: string;
};

export const SessionCardV2: React.FC<Props> = ({ session, index, lang }) => {
  const { colors, isDarkMode } = useColorScheme();
  const router = useRouter();

  const isRecent = session.is_recent;
  const isCompleted = session.completion_rate === 100;

  const handlePress = () => {
    router.push(`/workout-session/${session.id}` as any);
  };

  // Get status info
  const getStatusInfo = () => {
    if (isCompleted) {
      return {
        color: colors.success[500],
        bgColor: `${colors.success[500]}15`,
        label: lang === "es" ? "Completado" : "Completed",
        Icon: CheckCircle2,
      };
    } else if (session.completion_rate >= 80) {
      return {
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.15)",
        label: `${session.completion_rate}%`,
        Icon: Dumbbell,
      };
    } else {
      return {
        color: colors.textMuted,
        bgColor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        label: `${session.completion_rate}%`,
        Icon: Dumbbell,
      };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.Icon;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
    };
    return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", options);
  };

  return (
    <Animated.View entering={FadeInDown.duration(300).delay(200 + index * 40)}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.85)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 15 : 30}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Recent indicator glow */}
        {isRecent && (
          <View
            style={[styles.recentGlow, { backgroundColor: colors.success[500] }]}
          />
        )}

        <View style={styles.content}>
          {/* Left: Status Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: statusInfo.bgColor },
            ]}
          >
            <StatusIcon size={20} color={statusInfo.color} />
          </View>

          {/* Middle: Session Info */}
          <View style={styles.infoContainer}>
            <View style={styles.nameRow}>
              <Typography
                variant="body1"
                weight="semibold"
                style={{ color: colors.text, flex: 1 }}
                numberOfLines={1}
              >
                {session.routine_name}
              </Typography>
              {isRecent && (
                <View
                  style={[
                    styles.newBadge,
                    { backgroundColor: `${colors.success[500]}20` },
                  ]}
                >
                  <Sparkles size={10} color={colors.success[500]} />
                  <Typography
                    variant="caption"
                    weight="bold"
                    style={{
                      color: colors.success[500],
                      fontSize: 9,
                      marginLeft: 3,
                    }}
                  >
                    {lang === "es" ? "NUEVO" : "NEW"}
                  </Typography>
                </View>
              )}
            </View>

            {/* Duration */}
            <View style={styles.durationRow}>
              <Clock size={12} color={colors.textMuted} />
              <Typography
                variant="body2"
                color="textMuted"
                style={{ marginLeft: 4 }}
              >
                {session.formatted_duration}
              </Typography>
            </View>

            {/* Meta info */}
            <View style={styles.metaRow}>
              <Typography variant="caption" color="textMuted">
                {formatDate(session.started_at)}
              </Typography>
              <View
                style={[
                  styles.setsBadge,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)",
                  },
                ]}
              >
                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ fontSize: 10 }}
                >
                  {session.total_sets_completed}/{session.total_sets_planned}{" "}
                  sets
                </Typography>
              </View>
            </View>
          </View>

          {/* Right: Completion + Chevron */}
          <View style={styles.rightSection}>
            <View
              style={[
                styles.completionContainer,
                { backgroundColor: statusInfo.bgColor },
              ]}
            >
              <Typography
                variant="caption"
                style={{ color: statusInfo.color, fontSize: 10 }}
              >
                {isCompleted
                  ? "✓"
                  : lang === "es"
                  ? "Progreso"
                  : "Progress"}
              </Typography>
              <Typography
                variant="h6"
                weight="bold"
                style={{ color: statusInfo.color }}
              >
                {session.completion_rate}%
              </Typography>
            </View>
            <ChevronRight
              size={18}
              color={colors.textMuted}
              style={{ marginTop: 8 }}
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  recentGlow: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.15,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  newBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  setsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rightSection: {
    alignItems: "center",
  },
  completionContainer: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 60,
  },
});
