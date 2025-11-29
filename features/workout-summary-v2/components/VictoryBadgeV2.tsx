import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Check, Crown, Sparkles } from "lucide-react-native";
import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  interpolate,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

type Props = {
  workoutNumber: number;
  routineName: string;
  lang: "es" | "en";
  onAnimationComplete?: () => void;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const VictoryBadgeV2: React.FC<Props> = ({
  workoutNumber,
  routineName,
  lang,
  onAnimationComplete,
}) => {
  const { colors, isDarkMode } = useColorScheme();

  // Animation values
  const ringProgress = useSharedValue(0);
  const outerScale = useSharedValue(0);
  const innerScale = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const glowScale = useSharedValue(0.8);
  const textOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  // Ring properties
  const ringSize = 160;
  const strokeWidth = 6;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    // Sequence the animations for dramatic reveal
    outerScale.value = withDelay(
      100,
      withSpring(1, { damping: 10, stiffness: 80 })
    );
    innerScale.value = withDelay(
      200,
      withSpring(1, { damping: 12, stiffness: 100 })
    );
    iconScale.value = withDelay(
      400,
      withSpring(1, { damping: 8, stiffness: 120 }, (finished) => {
        if (finished && onAnimationComplete) {
          runOnJS(onAnimationComplete)();
        }
      })
    );
    ringProgress.value = withDelay(
      300,
      withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) })
    );
    glowOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    glowScale.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(1.15, {
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(0.95, {
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
          })
        ),
        -1,
        true
      )
    );
    textOpacity.value = withDelay(700, withTiming(1, { duration: 400 }));
    pulseScale.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(1.03, {
            duration: 2000,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const outerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: outerScale.value }],
    opacity: interpolate(outerScale.value, [0, 0.5, 1], [0, 0.5, 1]),
  }));

  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: innerScale.value }],
    opacity: interpolate(innerScale.value, [0, 0.5, 1], [0, 0.5, 1]),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
    opacity: iconScale.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value * 0.6,
  }));

  const textContainerStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [
      { translateY: interpolate(textOpacity.value, [0, 1], [10, 0]) },
    ],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const ringAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - ringProgress.value),
  }));

  const successColor = colors.success[500];

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      {/* Outer glow effect */}
      <Animated.View style={[styles.glowContainer, glowStyle]}>
        <View
          style={[
            styles.glow,
            {
              backgroundColor: successColor,
              shadowColor: successColor,
            },
          ]}
        />
      </Animated.View>

      {/* Main badge container with pulse */}
      <Animated.View style={pulseStyle}>
        {/* Outer ring container */}
        <Animated.View style={[styles.ringWrapper, outerStyle]}>
          {/* Animated SVG ring */}
          <Svg width={ringSize} height={ringSize} style={styles.ringOverlay}>
            <Defs>
              <RadialGradient
                id="ringGradient"
                cx="50%"
                cy="50%"
                rx="50%"
                ry="50%"
              >
                <Stop offset="0%" stopColor={successColor} stopOpacity="0.3" />
                <Stop
                  offset="100%"
                  stopColor={successColor}
                  stopOpacity="0.1"
                />
              </RadialGradient>
            </Defs>
            {/* Background circle */}
            <Circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress ring */}
            <AnimatedCircle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              stroke={successColor}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              animatedProps={ringAnimatedProps}
              strokeLinecap="round"
              rotation="-90"
              origin={`${ringSize / 2}, ${ringSize / 2}`}
            />
          </Svg>

          {/* Inner circle with glassmorphism */}
          <Animated.View style={[styles.innerCircleWrapper, innerStyle]}>
            <View
              style={[
                styles.innerCircle,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.9)",
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
            >
              {Platform.OS === "ios" && (
                <BlurView
                  intensity={isDarkMode ? 30 : 50}
                  tint={isDarkMode ? "dark" : "light"}
                  style={StyleSheet.absoluteFill}
                />
              )}

              {/* Success gradient overlay */}
              <LinearGradient
                colors={[
                  `${successColor}15`,
                  `${successColor}08`,
                  "transparent",
                ]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />

              {/* Check icon */}
              <Animated.View style={[styles.iconContainer, iconStyle]}>
                <View
                  style={[
                    styles.iconBg,
                    { backgroundColor: `${successColor}20` },
                  ]}
                >
                  <Check size={44} color={successColor} strokeWidth={3} />
                </View>
              </Animated.View>
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>

      {/* Text content */}
      <Animated.View style={[styles.textContainer, textContainerStyle]}>
        {/* Crown badge */}
        <Animated.View
          entering={FadeIn.delay(800).duration(300)}
          style={[
            styles.crownBadge,
            {
              backgroundColor: isDarkMode
                ? "rgba(245, 158, 11, 0.15)"
                : "rgba(245, 158, 11, 0.1)",
            },
          ]}
        >
          <Crown size={14} color="#f59e0b" />
          <Typography
            variant="caption"
            weight="bold"
            style={{ color: "#f59e0b", marginLeft: 4 }}
          >
            #{workoutNumber}
          </Typography>
        </Animated.View>

        {/* Main title */}
        <View style={styles.titleRow}>
          <Sparkles size={20} color={successColor} />
          <Typography
            variant="h3"
            weight="bold"
            align="center"
            style={{ color: colors.text, marginHorizontal: 8 }}
          >
            {lang === "es" ? "¡Completado!" : "Completed!"}
          </Typography>
          <Sparkles size={20} color={successColor} />
        </View>

        {/* Routine name */}
        <Typography
          variant="body1"
          color="textMuted"
          align="center"
          numberOfLines={1}
        >
          {routineName}
        </Typography>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 28,
  },
  glowContainer: {
    position: "absolute",
    top: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    width: 200,
    height: 200,
    borderRadius: 100,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 60,
    elevation: 20,
    opacity: 0.3,
  },
  ringWrapper: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  ringOverlay: {
    position: "absolute",
  },
  innerCircleWrapper: {
    position: "absolute",
  },
  innerCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconBg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    alignItems: "center",
    marginTop: 20,
    gap: 8,
  },
  crownBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
