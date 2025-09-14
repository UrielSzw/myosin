import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Dumbbell, Sparkles, Target } from "lucide-react-native";
import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export const AnimatedIllustration = () => {
  const { colors } = useColorScheme();

  // Animation values
  const floatValue = useSharedValue(0);
  const sparkleRotation = useSharedValue(0);

  useEffect(() => {
    // Floating animation for main illustration
    floatValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );

    // Sparkle rotation
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, [floatValue, sparkleRotation]);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(floatValue.value, [0, 1], [0, -8]) }],
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(200).duration(600).springify()}
      style={[
        {
          position: "relative",
          marginBottom: 32,
        },
        floatingStyle,
      ]}
    >
      {/* Background gradient circle */}
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: colors.primary[500] + "15",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Main icon */}
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.primary[500] + "25",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Dumbbell size={36} color={colors.primary[500]} strokeWidth={2.5} />
        </View>

        {/* Animated sparkles */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: -8,
              right: -8,
            },
            sparkleStyle,
          ]}
        >
          <Sparkles size={20} color={colors.primary[400]} />
        </Animated.View>

        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: -4,
              left: -4,
            },
            sparkleStyle,
          ]}
        >
          <Target size={16} color={colors.primary[300]} />
        </Animated.View>
      </View>
    </Animated.View>
  );
};
