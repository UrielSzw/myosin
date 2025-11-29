import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Confetti particle component
const ConfettiParticle = ({
  delay,
  startX,
  color,
  size,
}: {
  delay: number;
  startX: number;
  color: string;
  size: number;
}) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const randomX = (Math.random() - 0.5) * 150;
    const duration = 2500 + Math.random() * 1500;

    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT + 100, {
        duration,
        easing: Easing.in(Easing.quad),
      })
    );
    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(randomX, { duration: 500, easing: Easing.inOut(Easing.quad) }),
          withTiming(-randomX * 0.7, { duration: 500, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      )
    );
    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: startX,
          top: -20,
          width: size,
          height: size * 1.5,
          borderRadius: 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
};

// Sparkle component
const Sparkle = ({
  x,
  y,
  delay,
  size,
}: {
  x: number;
  y: number;
  delay: number;
  size: number;
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withSpring(1.2, { damping: 5, stiffness: 100 }),
          withTiming(0, { duration: 400 })
        ),
        -1,
        false
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(0, { duration: 400 })
        ),
        -1,
        false
      )
    );
    rotation.value = withDelay(
      delay,
      withRepeat(withTiming(180, { duration: 1500 }), -1, false)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
        },
        style,
      ]}
    >
      {/* 4-point star shape */}
      <View style={styles.sparkleContainer}>
        <View style={[styles.sparkleBar, { width: size, height: 3 }]} />
        <View style={[styles.sparkleBar, { width: 3, height: size }]} />
      </View>
    </Animated.View>
  );
};

// Glowing orb
const GlowingOrb = ({
  x,
  y,
  size,
  color,
  delay,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
};

const CONFETTI_COLORS = [
  "#10b981", // emerald
  "#f59e0b", // amber
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
];

export const CelebrationBackground = () => {
  const { isDarkMode } = useColorScheme();

  // Aurora animation
  const auroraPosition = useSharedValue(0);

  useEffect(() => {
    auroraPosition.value = withRepeat(
      withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const auroraStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(auroraPosition.value, [0, 1], [-40, 40]) },
      { translateY: interpolate(auroraPosition.value, [0, 1], [-30, 30]) },
    ],
  }));

  // Generate confetti particles
  const confettiParticles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 2000,
      startX: Math.random() * SCREEN_WIDTH,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 6,
    }));
  }, []);

  // Generate sparkles
  const sparkles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * SCREEN_WIDTH,
      y: Math.random() * (SCREEN_HEIGHT * 0.6),
      delay: i * 300,
      size: 12 + Math.random() * 10,
    }));
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Base gradient - more celebratory */}
      <LinearGradient
        colors={
          isDarkMode
            ? ["#030508", "#051015", "#0a1a28", "#051510", "#030508"]
            : ["#f8fafc", "#ecfdf5", "#e0f2fe", "#ecfdf5", "#f8fafc"]
        }
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Animated aurora overlay - success tinted */}
      <Animated.View style={[StyleSheet.absoluteFill, auroraStyle]}>
        <LinearGradient
          colors={[
            "transparent",
            isDarkMode
              ? "rgba(16, 185, 129, 0.06)"
              : "rgba(16, 185, 129, 0.1)",
            isDarkMode
              ? "rgba(14, 165, 233, 0.04)"
              : "rgba(14, 165, 233, 0.08)",
            "transparent",
          ]}
          style={[StyleSheet.absoluteFill, { transform: [{ scale: 1.6 }] }]}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 1, y: 0.8 }}
        />
      </Animated.View>

      {/* Glowing orbs */}
      <GlowingOrb
        x={-60}
        y={SCREEN_HEIGHT * 0.15}
        size={200}
        color={
          isDarkMode ? "rgba(16, 185, 129, 0.05)" : "rgba(16, 185, 129, 0.08)"
        }
        delay={0}
      />
      <GlowingOrb
        x={SCREEN_WIDTH - 80}
        y={SCREEN_HEIGHT * 0.35}
        size={160}
        color={
          isDarkMode ? "rgba(245, 158, 11, 0.04)" : "rgba(245, 158, 11, 0.06)"
        }
        delay={500}
      />
      <GlowingOrb
        x={SCREEN_WIDTH * 0.3}
        y={SCREEN_HEIGHT * 0.6}
        size={120}
        color={
          isDarkMode ? "rgba(59, 130, 246, 0.04)" : "rgba(59, 130, 246, 0.06)"
        }
        delay={1000}
      />

      {/* Confetti particles */}
      {confettiParticles.map((particle) => (
        <ConfettiParticle
          key={particle.id}
          delay={particle.delay}
          startX={particle.startX}
          color={particle.color}
          size={particle.size}
        />
      ))}

      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <Sparkle
          key={sparkle.id}
          x={sparkle.x}
          y={sparkle.y}
          delay={sparkle.delay}
          size={sparkle.size}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sparkleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkleBar: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 2,
  },
});
