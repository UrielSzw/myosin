import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  SlideInUp,
  useAnimatedProps,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type AnimatedNumberDisplayProps = {
  value: number;
  label: string;
  unit: string;
  color?: string;
  size?: "default" | "large";
  decimals?: number;
};

export const AnimatedNumberDisplay: React.FC<AnimatedNumberDisplayProps> = ({
  value,
  label,
  unit,
  color,
  size = "default",
  decimals = 0,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const accentColor = color || colors.primary[500];
  const animatedValue = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    animatedValue.value = withTiming(value, { duration: 800 });
    scale.value = withSequence(
      withSpring(1.1, { damping: 8, stiffness: 200 }),
      withSpring(1, { damping: 10, stiffness: 150 })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const animatedProps = useAnimatedProps(() => {
    const displayValue =
      decimals > 0
        ? animatedValue.value.toFixed(decimals)
        : Math.round(animatedValue.value).toString();
    return {
      text: displayValue,
      defaultValue: displayValue,
    };
  });

  const isLarge = size === "large";

  return (
    <Animated.View
      entering={FadeIn.delay(200).duration(500)}
      style={[
        styles.container,
        isLarge && styles.containerLarge,
        {
          backgroundColor: isDarkMode
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.03)",
          borderColor: `${accentColor}30`,
        },
      ]}
    >
      {/* Glow effect */}
      <View
        style={[
          styles.glow,
          {
            backgroundColor: accentColor,
            opacity: 0.15,
          },
        ]}
      />

      {/* Label */}
      <Typography
        variant="caption"
        weight="medium"
        color="textMuted"
        style={{ textTransform: "uppercase", letterSpacing: 1 }}
      >
        {label}
      </Typography>

      {/* Value + Unit */}
      <View style={styles.valueContainer}>
        <AnimatedTextInput
          animatedProps={animatedProps}
          editable={false}
          style={[
            isLarge ? styles.valueLarge : styles.value,
            { color: accentColor },
          ]}
        />
        <Typography
          variant={isLarge ? "h4" : "body1"}
          weight="medium"
          style={{ color: `${accentColor}99` }}
        >
          {unit}
        </Typography>
      </View>
    </Animated.View>
  );
};

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
  delay?: number;
};

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  color,
  delay = 0,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const accentColor = color || colors.primary[500];

  return (
    <Animated.View
      entering={SlideInUp.delay(delay).springify().damping(15)}
      style={[
        styles.statCard,
        {
          backgroundColor: isDarkMode
            ? "rgba(255,255,255,0.03)"
            : "rgba(0,0,0,0.02)",
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.statIconContainer,
          {
            backgroundColor: `${accentColor}15`,
          },
        ]}
      >
        {icon}
      </View>
      <Typography variant="caption" color="textMuted" weight="medium">
        {label}
      </Typography>
      <Typography variant="h5" weight="bold" style={{ color: accentColor }}>
        {value}
      </Typography>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    gap: 8,
    overflow: "hidden",
  },
  containerLarge: {
    padding: 28,
  },
  glow: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    top: -50,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  value: {
    fontSize: 36,
    fontWeight: "700",
  },
  valueLarge: {
    fontSize: 48,
    fontWeight: "700",
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 6,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
});

export default AnimatedNumberDisplay;
