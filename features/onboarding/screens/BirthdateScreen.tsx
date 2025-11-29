import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Calendar, ChevronLeft } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { OnboardingProgress } from "../components";
import { onboardingTranslations, useOnboardingStore } from "../hooks";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Floating Orb Component
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

export default function BirthdateScreen() {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";
  const t = onboardingTranslations.birthdate;
  const tCommon = onboardingTranslations.common;
  const { birthDate, setBirthDate, getAge, nextStep } = useOnboardingStore();

  const [showPicker, setShowPicker] = useState(Platform.OS === "ios");
  const [tempDate, setTempDate] = useState(birthDate || new Date(2000, 0, 1));

  const age = getAge();

  // Aurora animation
  const auroraPosition = useSharedValue(0);

  useEffect(() => {
    auroraPosition.value = withRepeat(
      withTiming(1, { duration: 10000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const auroraStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(auroraPosition.value, [0, 1], [-50, 50]) },
      { translateY: interpolate(auroraPosition.value, [0, 1], [-30, 30]) },
    ],
  }));

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (selectedDate) {
      setTempDate(selectedDate);
      setBirthDate(selectedDate);
    }
  };

  const handleContinue = () => {
    if (birthDate) {
      nextStep();
      router.push("/onboarding/measurements" as any);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", options);
  };

  return (
    <View style={styles.container}>
      {/* Aurora Background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={
            isDarkMode
              ? ["#030508", "#0a1525", "#0d1a30", "#030508"]
              : ["#f0f9ff", "#e0f2fe", "#bae6fd", "#f0f9ff"]
          }
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <Animated.View style={[StyleSheet.absoluteFill, auroraStyle]}>
          <LinearGradient
            colors={[
              "transparent",
              isDarkMode
                ? "rgba(14, 165, 233, 0.1)"
                : "rgba(14, 165, 233, 0.18)",
              isDarkMode
                ? "rgba(56, 189, 248, 0.06)"
                : "rgba(56, 189, 248, 0.12)",
              "transparent",
            ]}
            style={[StyleSheet.absoluteFill, { transform: [{ scale: 1.6 }] }]}
            start={{ x: 0, y: 0.2 }}
            end={{ x: 1, y: 0.8 }}
          />
        </Animated.View>

        <FloatingOrb
          size={180}
          color={
            isDarkMode ? "rgba(14, 165, 233, 0.07)" : "rgba(14, 165, 233, 0.1)"
          }
          initialX={SCREEN_WIDTH - 80}
          initialY={SCREEN_HEIGHT * 0.05}
          delay={0}
        />
        <FloatingOrb
          size={130}
          color={
            isDarkMode ? "rgba(56, 189, 248, 0.05)" : "rgba(56, 189, 248, 0.08)"
          }
          initialX={-40}
          initialY={SCREEN_HEIGHT * 0.5}
          delay={500}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View
          entering={FadeIn.delay(100).duration(500)}
          style={styles.header}
        >
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={28} color={colors.text} />
          </TouchableOpacity>
          <OnboardingProgress currentStep={1} totalSteps={5} />
          <View style={styles.backButton} />
        </Animated.View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(600)}
            style={styles.titleSection}
          >
            <Typography
              variant="h2"
              weight="bold"
              align="center"
              style={{ color: colors.text }}
            >
              {t.title[lang]}
            </Typography>
            <Typography
              variant="body1"
              align="center"
              style={{ color: colors.textMuted, marginTop: 12, lineHeight: 24 }}
            >
              {t.subtitle[lang]}
            </Typography>
          </Animated.View>

          {/* Date Display Card */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.dateDisplayContainer}
          >
            <TouchableOpacity
              onPress={() => Platform.OS === "android" && setShowPicker(true)}
              activeOpacity={0.9}
            >
              <View
                style={[
                  styles.dateCard,
                  {
                    borderColor: birthDate
                      ? colors.primary[500]
                      : colors.border,
                    borderWidth: birthDate ? 2 : 1,
                    backgroundColor: birthDate
                      ? `${colors.primary[500]}10`
                      : isDarkMode
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.02)",
                  },
                ]}
              >
                <BlurView
                  intensity={isDarkMode ? 15 : 25}
                  tint={isDarkMode ? "dark" : "light"}
                  style={StyleSheet.absoluteFill}
                />

                <View
                  style={[
                    styles.dateIconContainer,
                    {
                      backgroundColor: birthDate
                        ? `${colors.primary[500]}20`
                        : isDarkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.05)",
                    },
                  ]}
                >
                  <Calendar
                    size={32}
                    color={birthDate ? colors.primary[500] : colors.textMuted}
                  />
                </View>

                <Typography
                  variant="h4"
                  weight="semibold"
                  style={{
                    color: birthDate ? colors.text : colors.textMuted,
                    marginTop: 16,
                  }}
                >
                  {birthDate ? formatDate(tempDate) : t.selectYourDate[lang]}
                </Typography>

                <View
                  style={[
                    styles.ageContainer,
                    { opacity: age !== null && birthDate ? 1 : 0 },
                  ]}
                >
                  <Typography
                    variant="h2"
                    weight="bold"
                    style={{ color: colors.primary[500] }}
                  >
                    {age ?? 0}
                  </Typography>
                  <Typography
                    variant="body1"
                    weight="medium"
                    style={{ color: colors.textMuted, marginLeft: 8 }}
                  >
                    {t.yearsOld[lang]}
                  </Typography>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Date Picker */}
          {showPicker && (
            <Animated.View
              entering={FadeIn.duration(300)}
              style={styles.pickerContainer}
            >
              <View
                style={[
                  styles.pickerCard,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.02)",
                    borderColor: colors.border,
                  },
                ]}
              >
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1920, 0, 1)}
                  textColor={colors.text}
                  themeVariant={isDarkMode ? "dark" : "light"}
                  style={styles.picker}
                />
              </View>
            </Animated.View>
          )}
        </View>

        {/* Footer */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(500)}
          style={styles.footer}
        >
          <View style={styles.ctaContainer}>
            {birthDate && (
              <View
                style={[
                  styles.ctaGlow,
                  { backgroundColor: colors.primary[500] },
                ]}
              />
            )}
            <Button
              onPress={handleContinue}
              disabled={!birthDate}
              size="lg"
              style={[
                styles.continueButton,
                birthDate && {
                  shadowColor: "#0ea5e9",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.4,
                  shadowRadius: 16,
                  elevation: 12,
                },
              ]}
            >
              {tCommon.continue[lang]}
            </Button>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  dateDisplayContainer: {
    alignItems: "center",
  },
  dateCard: {
    borderRadius: 28,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 40,
    minWidth: 280,
    height: 240,
  },
  dateIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  ageContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(128,128,128,0.2)",
  },
  pickerContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  pickerCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  picker: {
    width: SCREEN_WIDTH - 80,
    height: 180,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  ctaContainer: {
    position: "relative",
  },
  ctaGlow: {
    position: "absolute",
    top: 6,
    left: 16,
    right: 16,
    bottom: -4,
    borderRadius: 14,
    opacity: 0.15,
  },
  continueButton: {},
});
