import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Typography } from "@/shared/ui/typography";
import { fromKg } from "@/shared/utils/weight-conversion";
import { BlurView } from "expo-blur";
import { Clock, Dumbbell, Flame, Target } from "lucide-react-native";
import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  FadeInDown,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

type Props = {
  totalExercises: number;
  totalSets: number;
  durationSeconds: number;
  totalVolume: number;
  lang: "es" | "en";
  baseDelay?: number;
};

type CounterStatProps = {
  icon: React.ReactNode;
  targetValue: number;
  suffix?: string;
  label: string;
  color: string;
  index: number;
  baseDelay: number;
  formatValue?: (val: number) => string;
};

const CounterStat: React.FC<CounterStatProps> = ({
  icon,
  targetValue,
  suffix = "",
  label,
  color,
  index,
  baseDelay,
  formatValue,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const animatedValue = useSharedValue(0);
  const displayValue = useSharedValue(0);

  useEffect(() => {
    // Animate the counter
    animatedValue.value = withDelay(
      baseDelay + index * 150,
      withTiming(targetValue, { duration: 1000 })
    );

    // Update display value with timing
    const interval = setInterval(() => {
      const currentProgress = animatedValue.value;
      displayValue.value = Math.round(currentProgress);
    }, 16);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetValue]);

  const [displayNum, setDisplayNum] = React.useState(0);

  useEffect(() => {
    const delay = baseDelay + index * 150;
    const duration = 1000;
    const startTime = Date.now() + delay;

    const animate = () => {
      const now = Date.now();
      if (now < startTime) {
        requestAnimationFrame(animate);
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(targetValue * easeProgress);

      setDisplayNum(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetValue]);

  const valueDisplay = formatValue
    ? formatValue(displayNum)
    : `${displayNum}${suffix}`;

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(baseDelay + index * 100)}
      style={[
        styles.statCard,
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
          intensity={isDarkMode ? 15 : 30}
          tint={isDarkMode ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      )}

      <View style={styles.statContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          {icon}
        </View>

        <Typography
          variant="h4"
          weight="bold"
          style={{ color: colors.text, marginTop: 10 }}
        >
          {valueDisplay}
        </Typography>

        <Typography
          variant="caption"
          color="textMuted"
          style={{ marginTop: 2 }}
        >
          {label}
        </Typography>
      </View>
    </Animated.View>
  );
};

export const WorkoutStatsCounterV2: React.FC<Props> = ({
  totalExercises,
  totalSets,
  durationSeconds,
  totalVolume,
  lang,
  baseDelay = 600,
}) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";

  // Format duration
  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate volume in user's unit
  const displayVolume = fromKg(totalVolume, weightUnit, 0);

  // Format volume with k suffix
  const formatVolume = (vol: number): string => {
    if (vol >= 1000) {
      return `${(vol / 1000).toFixed(1)}k`;
    }
    return vol.toLocaleString();
  };

  const stats = [
    {
      icon: <Dumbbell size={20} color={colors.primary[500]} />,
      targetValue: totalExercises,
      label: lang === "es" ? "Ejercicios" : "Exercises",
      color: colors.primary[500],
    },
    {
      icon: <Target size={20} color={colors.success[500]} />,
      targetValue: totalSets,
      label: "Sets",
      color: colors.success[500],
    },
    {
      icon: <Clock size={20} color="#8b5cf6" />,
      targetValue: durationSeconds,
      label: lang === "es" ? "Duración" : "Duration",
      color: "#8b5cf6",
      formatValue: formatDuration,
    },
    {
      icon: <Flame size={20} color="#f59e0b" />,
      targetValue: displayVolume,
      label: `Vol. (${weightUnit})`,
      color: "#f59e0b",
      formatValue: formatVolume,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {stats.slice(0, 2).map((stat, index) => (
          <CounterStat
            key={index}
            icon={stat.icon}
            targetValue={stat.targetValue}
            label={stat.label}
            color={stat.color}
            index={index}
            baseDelay={baseDelay}
            formatValue={stat.formatValue}
          />
        ))}
      </View>
      <View style={styles.row}>
        {stats.slice(2, 4).map((stat, index) => (
          <CounterStat
            key={index + 2}
            icon={stat.icon}
            targetValue={stat.targetValue}
            label={stat.label}
            color={stat.color}
            index={index + 2}
            baseDelay={baseDelay}
            formatValue={stat.formatValue}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  statContent: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
