import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Subtle floating orb for ambient effect
const FloatingOrb = ({
  size,
  color,
  initialX,
  initialY,
  delay = 0,
}: {
  size: number;
  color: string;
  initialX: number;
  initialY: number;
  delay?: number;
}) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-15, {
            duration: 4000 + delay,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(15, {
            duration: 4000 + delay,
            easing: Easing.inOut(Easing.quad),
          })
        ),
        -1,
        true
      );
      translateX.value = withRepeat(
        withSequence(
          withTiming(10, {
            duration: 5000 + delay,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(-10, {
            duration: 5000 + delay,
            easing: Easing.inOut(Easing.quad),
          })
        ),
        -1,
        true
      );
    }, delay);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: initialX,
          top: initialY,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
};

export const AuroraBackground = () => {
  const { isDarkMode } = useColorScheme();

  // Subtle aurora animation
  const auroraPosition = useSharedValue(0);

  useEffect(() => {
    auroraPosition.value = withRepeat(
      withTiming(1, { duration: 15000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const auroraStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(auroraPosition.value, [0, 1], [-30, 30]) },
      { translateY: interpolate(auroraPosition.value, [0, 1], [-20, 20]) },
    ],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Base gradient */}
      <LinearGradient
        colors={
          isDarkMode
            ? ["#030508", "#0a1220", "#0a1525", "#030508"]
            : ["#f8fafc", "#f0f9ff", "#e0f2fe", "#f8fafc"]
        }
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Animated aurora overlay */}
      <Animated.View style={[StyleSheet.absoluteFill, auroraStyle]}>
        <LinearGradient
          colors={[
            "transparent",
            isDarkMode
              ? "rgba(14, 165, 233, 0.04)"
              : "rgba(14, 165, 233, 0.08)",
            isDarkMode
              ? "rgba(56, 189, 248, 0.03)"
              : "rgba(56, 189, 248, 0.06)",
            "transparent",
          ]}
          style={[StyleSheet.absoluteFill, { transform: [{ scale: 1.5 }] }]}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 1, y: 0.7 }}
        />
      </Animated.View>

      {/* Subtle floating orbs */}
      <FloatingOrb
        size={200}
        color={
          isDarkMode ? "rgba(14, 165, 233, 0.03)" : "rgba(14, 165, 233, 0.05)"
        }
        initialX={-80}
        initialY={SCREEN_HEIGHT * 0.1}
        delay={0}
      />
      <FloatingOrb
        size={150}
        color={
          isDarkMode ? "rgba(56, 189, 248, 0.02)" : "rgba(56, 189, 248, 0.04)"
        }
        initialX={SCREEN_WIDTH - 40}
        initialY={SCREEN_HEIGHT * 0.4}
        delay={800}
      />
      <FloatingOrb
        size={100}
        color={
          isDarkMode ? "rgba(14, 165, 233, 0.025)" : "rgba(14, 165, 233, 0.04)"
        }
        initialX={SCREEN_WIDTH * 0.3}
        initialY={SCREEN_HEIGHT * 0.7}
        delay={1500}
      />
    </View>
  );
};
