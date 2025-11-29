import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Animated floating orb component
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
  const scale = useSharedValue(1);

  useEffect(() => {
    const startAnimation = () => {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-20, {
            duration: 3000 + delay,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(20, {
            duration: 3000 + delay,
            easing: Easing.inOut(Easing.quad),
          })
        ),
        -1,
        true
      );
      translateX.value = withRepeat(
        withSequence(
          withTiming(15, {
            duration: 4000 + delay,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(-15, {
            duration: 4000 + delay,
            easing: Easing.inOut(Easing.quad),
          })
        ),
        -1,
        true
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, {
            duration: 2500 + delay,
            easing: Easing.inOut(Easing.quad),
          }),
          withTiming(0.9, {
            duration: 2500 + delay,
            easing: Easing.inOut(Easing.quad),
          })
        ),
        -1,
        true
      );
    };

    const timeout = setTimeout(startAnimation, delay);
    return () => clearTimeout(timeout);
  }, [delay, translateY, translateX, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
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

type StepContainerProps = {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  showProgress?: boolean;
  scrollable?: boolean;
};

export const StepContainer: React.FC<StepContainerProps> = ({
  children,
  currentStep,
  totalSteps,
  showProgress = true,
  scrollable = true,
}) => {
  const { isDarkMode } = useColorScheme();

  // Aurora animation
  const auroraPosition = useSharedValue(0);

  useEffect(() => {
    auroraPosition.value = withRepeat(
      withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [auroraPosition]);

  const auroraStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(auroraPosition.value, [0, 1], [-50, 50]) },
      { translateY: interpolate(auroraPosition.value, [0, 1], [-30, 30]) },
    ],
  }));

  const content = (
    <>
      {/* Progress indicator */}
      {showProgress && (
        <Animated.View
          entering={FadeIn.delay(200).duration(400)}
          style={styles.progressContainer}
        >
          <ProgressDots current={currentStep} total={totalSteps} />
        </Animated.View>
      )}

      {/* Main content */}
      {children}
    </>
  );

  return (
    <View style={styles.container}>
      {/* Aurora Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={
            isDarkMode
              ? ["#050810", "#0a1020", "#0d1425", "#050810"]
              : ["#f8fafc", "#e0f2fe", "#dbeafe", "#f8fafc"]
          }
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Animated Aurora Gradient */}
        <Animated.View style={[StyleSheet.absoluteFill, auroraStyle]}>
          <LinearGradient
            colors={[
              "transparent",
              isDarkMode
                ? "rgba(14, 165, 233, 0.08)"
                : "rgba(14, 165, 233, 0.15)",
              isDarkMode
                ? "rgba(56, 189, 248, 0.05)"
                : "rgba(56, 189, 248, 0.1)",
              "transparent",
            ]}
            style={[StyleSheet.absoluteFill, { transform: [{ scale: 1.5 }] }]}
            start={{ x: 0, y: 0.3 }}
            end={{ x: 1, y: 0.7 }}
          />
        </Animated.View>

        {/* Floating Orbs */}
        <FloatingOrb
          size={180}
          color={
            isDarkMode ? "rgba(14, 165, 233, 0.06)" : "rgba(14, 165, 233, 0.1)"
          }
          initialX={-60}
          initialY={SCREEN_HEIGHT * 0.05}
          delay={0}
        />
        <FloatingOrb
          size={140}
          color={
            isDarkMode ? "rgba(56, 189, 248, 0.04)" : "rgba(56, 189, 248, 0.08)"
          }
          initialX={SCREEN_WIDTH - 80}
          initialY={SCREEN_HEIGHT * 0.35}
          delay={500}
        />
        <FloatingOrb
          size={100}
          color={
            isDarkMode ? "rgba(14, 165, 233, 0.05)" : "rgba(14, 165, 233, 0.08)"
          }
          initialX={SCREEN_WIDTH * 0.2}
          initialY={SCREEN_HEIGHT * 0.7}
          delay={1000}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {scrollable ? (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {content}
            </ScrollView>
          ) : (
            <View style={styles.scrollContent}>{content}</View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

// Progress dots component
type ProgressDotsProps = {
  current: number;
  total: number;
};

const ProgressDots: React.FC<ProgressDotsProps> = ({ current, total }) => {
  const { colors } = useColorScheme();

  return (
    <View style={styles.dotsContainer}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index <= current;
        const isCurrent = index === current;

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: isActive ? colors.primary[500] : colors.border,
                width: isCurrent ? 24 : 8,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});

export default StepContainer;
