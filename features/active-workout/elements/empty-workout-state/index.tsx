import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { activeWorkoutTranslations } from "@/shared/translations/active-workout";
import { Typography } from "@/shared/ui/typography";
import { Dumbbell, Plus, Zap } from "lucide-react-native";
import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useActiveMainActions } from "../../hooks/use-active-workout-store";

export const EmptyWorkoutState = () => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = activeWorkoutTranslations;
  const { setExerciseModalMode } = useActiveMainActions();

  // Animation values
  const pulseValue = useSharedValue(0);
  const floatValue = useSharedValue(0);

  useEffect(() => {
    // Pulse animation for the ring
    pulseValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );

    // Floating animation
    floatValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, [pulseValue, floatValue]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulseValue.value, [0, 1], [0.3, 0.6]),
    transform: [{ scale: interpolate(pulseValue.value, [0, 1], [1, 1.15]) }],
  }));

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(floatValue.value, [0, 1], [0, -6]) }],
  }));

  const handleAddExercise = () => {
    setExerciseModalMode("add-new");
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 32,
        paddingBottom: 80,
      }}
    >
      {/* Animated Illustration */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(500).springify()}
        style={[{ marginBottom: 32 }, floatingStyle]}
      >
        <View style={{ position: "relative", alignItems: "center" }}>
          {/* Pulsing outer ring */}
          <Animated.View
            style={[
              {
                position: "absolute",
                width: 140,
                height: 140,
                borderRadius: 70,
                backgroundColor: colors.primary[500] + "15",
              },
              pulseStyle,
            ]}
          />

          {/* Main circle with icon */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: colors.primary[500] + "20",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: colors.primary[500] + "30",
            }}
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: colors.primary[500] + "30",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Dumbbell size={32} color={colors.primary[500]} strokeWidth={2} />
            </View>
          </View>

          {/* Decorative elements */}
          <Animated.View
            entering={FadeIn.delay(400).duration(400)}
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              backgroundColor: colors.success[500],
              borderRadius: 12,
              padding: 6,
            }}
          >
            <Zap size={14} color="#fff" fill="#fff" />
          </Animated.View>
        </View>
      </Animated.View>

      {/* Text content */}
      <Animated.View
        entering={FadeInUp.delay(300).duration(500)}
        style={{ alignItems: "center", marginBottom: 32 }}
      >
        <Typography
          variant="h5"
          weight="bold"
          align="center"
          style={{ marginBottom: 12 }}
        >
          {t.emptyWorkoutTitle[lang]}
        </Typography>

        <Typography
          variant="body2"
          color="textMuted"
          align="center"
          style={{ lineHeight: 22, maxWidth: 280 }}
        >
          {t.emptyWorkoutSubtitle[lang]}
        </Typography>
      </Animated.View>

      {/* CTA Button */}
      <Animated.View entering={FadeInUp.delay(500).duration(500)}>
        <TouchableOpacity
          onPress={handleAddExercise}
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 16,
            paddingHorizontal: 32,
            backgroundColor: colors.primary[500],
            borderRadius: 16,
            gap: 10,
            // Modern shadow
            shadowColor: colors.primary[500],
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Plus size={22} color="#fff" strokeWidth={2.5} />
          <Typography
            variant="body1"
            weight="semibold"
            style={{ color: "#fff" }}
          >
            {t.emptyWorkoutCTA[lang]}
          </Typography>
        </TouchableOpacity>
      </Animated.View>

      {/* Hint text */}
      <Animated.View entering={FadeIn.delay(700).duration(400)}>
        <Typography
          variant="caption"
          color="textMuted"
          align="center"
          style={{ marginTop: 20, opacity: 0.7 }}
        >
          {t.emptyWorkoutHint[lang]}
        </Typography>
      </Animated.View>
    </View>
  );
};
