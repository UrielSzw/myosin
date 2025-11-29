import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { CheckCircle2, Clock, Target } from "lucide-react-native";
import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

type Props = {
  completionRate: number;
  completedSets: number;
  totalSets: number;
  duration: string;
  isCompleted: boolean;
  lang: string;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const SessionHeroCardV2: React.FC<Props> = ({
  completionRate,
  completedSets,
  totalSets,
  duration,
  isCompleted,
  lang,
}) => {
  const { colors, isDarkMode } = useColorScheme();

  // Animation values
  const ringProgress = useSharedValue(0);
  const scaleValue = useSharedValue(0.9);

  useEffect(() => {
    scaleValue.value = withSpring(1, { damping: 12, stiffness: 100 });
    ringProgress.value = withDelay(
      300,
      withTiming(completionRate / 100, { duration: 1000 })
    );
  }, [completionRate, ringProgress, scaleValue]);

  const ringSize = 120;
  const strokeWidth = 10;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - ringProgress.value),
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const statusColor = isCompleted ? colors.success[500] : colors.primary[500];

  return (
    <Animated.View
      entering={FadeInDown.duration(500).delay(100)}
      style={[styles.container, containerStyle]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.85)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 20 : 40}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        <View style={styles.content}>
          {/* Left: Progress Ring */}
          <View style={styles.ringContainer}>
            <Svg width={ringSize} height={ringSize}>
              {/* Background circle */}
              <Circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Progress circle */}
              <AnimatedCircle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                stroke={statusColor}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                animatedProps={animatedCircleProps}
                strokeLinecap="round"
                rotation="-90"
                origin={`${ringSize / 2}, ${ringSize / 2}`}
              />
            </Svg>

            {/* Center content */}
            <View style={styles.ringCenter}>
              {isCompleted ? (
                <CheckCircle2 size={32} color={statusColor} />
              ) : (
                <>
                  <Typography
                    variant="h3"
                    weight="bold"
                    style={{ color: statusColor }}
                  >
                    {completionRate}
                  </Typography>
                  <Typography
                    variant="caption"
                    style={{ color: statusColor, marginTop: -4 }}
                  >
                    %
                  </Typography>
                </>
              )}
            </View>
          </View>

          {/* Right: Stats */}
          <View style={styles.statsContainer}>
            {/* Status */}
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${statusColor}15` },
              ]}
            >
              <Typography
                variant="caption"
                weight="bold"
                style={{ color: statusColor }}
              >
                {isCompleted
                  ? lang === "es"
                    ? "COMPLETADO"
                    : "COMPLETED"
                  : lang === "es"
                  ? "EN PROGRESO"
                  : "IN PROGRESS"}
              </Typography>
            </View>

            {/* Sets info */}
            <View style={styles.statRow}>
              <Target size={16} color={colors.textMuted} />
              <Typography
                variant="body1"
                weight="semibold"
                style={{ color: colors.text, marginLeft: 8 }}
              >
                {completedSets}/{totalSets}
              </Typography>
              <Typography
                variant="body2"
                color="textMuted"
                style={{ marginLeft: 4 }}
              >
                sets
              </Typography>
            </View>

            {/* Duration */}
            <View style={styles.statRow}>
              <Clock size={16} color={colors.textMuted} />
              <Typography
                variant="body1"
                weight="semibold"
                style={{ color: colors.text, marginLeft: 8 }}
              >
                {duration}
              </Typography>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 20,
  },
  ringContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  ringCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flex: 1,
    gap: 12,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
