import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { GradientBackground } from "../gradient-background";
import { Logo } from "../logo";
import { Typography } from "../typography";

type LoadingScreenProps = {
  message?: string;
  withGradient?: boolean;
  gradientVariant?: "default" | "subtle";
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message,
  withGradient = true,
  gradientVariant = "subtle",
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Logo pulse animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );

    // Fade in
    opacity.value = withTiming(1, {
      duration: 400,
      easing: Easing.out(Easing.ease),
    });
  }, [scale, opacity]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const content = (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(300).easing(Easing.out(Easing.ease))}
      exiting={FadeOut.duration(200).easing(Easing.in(Easing.ease))}
    >
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <Logo size={80} animated={false} />
      </Animated.View>

      {message && (
        <Animated.View style={textAnimatedStyle}>
          <Typography
            variant="body1"
            color="textMuted"
            align="center"
            style={styles.message}
          >
            {message}
          </Typography>
        </Animated.View>
      )}
    </Animated.View>
  );

  if (withGradient) {
    return (
      <GradientBackground variant={gradientVariant}>
        {content}
      </GradientBackground>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 15,
    opacity: 0.7,
  },
});
