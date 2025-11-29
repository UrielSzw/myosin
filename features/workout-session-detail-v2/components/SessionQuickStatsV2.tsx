import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Typography } from "@/shared/ui/typography";
import { fromKg } from "@/shared/utils/weight-conversion";
import { BlurView } from "expo-blur";
import { Clock, Dumbbell, Flame } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  duration: string;
  totalSets: number;
  totalVolume: number;
  lang: string;
};

type StatCardProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  index: number;
};

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  color,
  index,
}) => {
  const { colors, isDarkMode } = useColorScheme();

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(200 + index * 100)}
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
          variant="h5"
          weight="bold"
          style={{ color: colors.text, marginTop: 10 }}
        >
          {value}
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

export const SessionQuickStatsV2: React.FC<Props> = ({
  duration,
  totalSets,
  totalVolume,
  lang,
}) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";

  // Format volume
  const displayVolume = fromKg(totalVolume, weightUnit, 0);
  const formatVolume = (vol: number): string => {
    if (vol >= 1000) {
      return `${(vol / 1000).toFixed(1)}k`;
    }
    return vol.toLocaleString();
  };

  const stats = [
    {
      icon: <Clock size={20} color={colors.primary[500]} />,
      value: duration,
      label: lang === "es" ? "Duración" : "Duration",
      color: colors.primary[500],
    },
    {
      icon: <Dumbbell size={20} color={colors.success[500]} />,
      value: totalSets.toString(),
      label: lang === "es" ? "Sets" : "Sets",
      color: colors.success[500],
    },
    {
      icon: <Flame size={20} color="#f59e0b" />,
      value: `${formatVolume(displayVolume)}`,
      label: `${lang === "es" ? "Volumen" : "Volume"} (${weightUnit})`,
      color: "#f59e0b",
    },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
          color={stat.color}
          index={index}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
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
