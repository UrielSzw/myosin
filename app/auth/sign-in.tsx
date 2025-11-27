import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { authTranslations } from "@/shared/translations/auth";
import { Button } from "@/shared/ui/button";
import { EnhancedInput } from "@/shared/ui/enhanced-input";
import { Logo } from "@/shared/ui/logo";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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
          withTiming(-20, { duration: 3000 + delay, easing: Easing.inOut(Easing.quad) }),
          withTiming(20, { duration: 3000 + delay, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );
      translateX.value = withRepeat(
        withSequence(
          withTiming(15, { duration: 4000 + delay, easing: Easing.inOut(Easing.quad) }),
          withTiming(-15, { duration: 4000 + delay, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 2500 + delay, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.9, { duration: 2500 + delay, easing: Easing.inOut(Easing.quad) })
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

// Logo with glow effect
const GlowingLogo = ({ size }: { size: number }) => {
  const { colors } = useColorScheme();
  const glowOpacity = useSharedValue(0.4);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, [glowOpacity]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Outer glow */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: size * 2,
            height: size * 2,
            borderRadius: size,
            backgroundColor: colors.primary[500],
          },
          glowStyle,
        ]}
      />
      {/* Inner glow */}
      <Animated.View
        style={[
          {
            position: "absolute",
            width: size * 1.5,
            height: size * 1.5,
            borderRadius: size * 0.75,
            backgroundColor: colors.primary[400],
          },
          glowStyle,
        ]}
      />
      <Logo size={size} animated />
    </View>
  );
};

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { colors, isDarkMode } = useColorScheme();
  const { signIn } = useAuth();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = authTranslations.signIn;

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

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      return;
    }

    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (!error) {
      router.replace("/(tabs)" as any);
    }
  };

  const navigateToSignUp = () => {
    router.push("/auth/sign-up" as any);
  };

  const navigateToForgotPassword = () => {
    router.push("/auth/forgot-password" as any);
  };

  const canSubmit = email.trim() && password.trim() && !loading;

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
              isDarkMode ? "rgba(14, 165, 233, 0.08)" : "rgba(14, 165, 233, 0.15)",
              isDarkMode ? "rgba(56, 189, 248, 0.05)" : "rgba(56, 189, 248, 0.1)",
              "transparent",
            ]}
            style={[StyleSheet.absoluteFill, { transform: [{ scale: 1.5 }] }]}
            start={{ x: 0, y: 0.3 }}
            end={{ x: 1, y: 0.7 }}
          />
        </Animated.View>

        {/* Floating Orbs */}
        <FloatingOrb
          size={200}
          color={isDarkMode ? "rgba(14, 165, 233, 0.06)" : "rgba(14, 165, 233, 0.1)"}
          initialX={-50}
          initialY={SCREEN_HEIGHT * 0.1}
          delay={0}
        />
        <FloatingOrb
          size={150}
          color={isDarkMode ? "rgba(56, 189, 248, 0.04)" : "rgba(56, 189, 248, 0.08)"}
          initialX={SCREEN_WIDTH - 100}
          initialY={SCREEN_HEIGHT * 0.25}
          delay={500}
        />
        <FloatingOrb
          size={120}
          color={isDarkMode ? "rgba(14, 165, 233, 0.05)" : "rgba(14, 165, 233, 0.08)"}
          initialX={SCREEN_WIDTH * 0.3}
          initialY={SCREEN_HEIGHT * 0.6}
          delay={1000}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Section */}
            <Animated.View
              entering={FadeIn.delay(100).duration(800)}
              style={styles.heroSection}
            >
              <GlowingLogo size={80} />

              <Animated.View entering={FadeInDown.delay(300).duration(600)}>
                <Typography
                  variant="h1"
                  weight="bold"
                  align="center"
                  style={[styles.brandName, { color: colors.text }]}
                >
                  MYOSIN
                </Typography>
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(500).duration(600)}
                style={styles.taglineContainer}
              >
                <Typography
                  variant="body1"
                  align="center"
                  style={[styles.tagline, { color: colors.textMuted }]}
                >
                  {t.subtitle[lang]}
                </Typography>
              </Animated.View>
            </Animated.View>

            {/* Form Section */}
            <Animated.View
              entering={FadeInUp.delay(700).duration(600)}
              style={styles.formSection}
            >
              {/* Glass Card Effect */}
              <View style={styles.formCard}>
                <BlurView
                  intensity={isDarkMode ? 25 : 40}
                  tint={isDarkMode ? "dark" : "light"}
                  style={StyleSheet.absoluteFill}
                />
                <View
                  style={[
                    styles.formCardBorder,
                    {
                      borderColor: isDarkMode
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(0,0,0,0.05)",
                    },
                  ]}
                />

                <View style={styles.formContent}>
                  <Typography
                    variant="h3"
                    weight="semibold"
                    style={[styles.formTitle, { color: colors.text }]}
                  >
                    {t.title[lang]}
                  </Typography>

                  <EnhancedInput
                    label={t.emailLabel[lang]}
                    placeholder={t.emailPlaceholder[lang]}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    validationRules={["email"]}
                    validateOnBlur
                    containerStyle={styles.input}
                  />

                  <EnhancedInput
                    label={t.passwordLabel[lang]}
                    placeholder={t.passwordPlaceholder[lang]}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoComplete="password"
                    textContentType="password"
                    containerStyle={styles.input}
                  />

                  <Button
                    variant="ghost"
                    onPress={navigateToForgotPassword}
                    style={styles.forgotButton}
                  >
                    {t.forgotPassword[lang]}
                  </Button>

                  {/* Glowing CTA Button */}
                  <View style={styles.ctaContainer}>
                    {canSubmit && (
                      <View
                        style={[
                          styles.ctaGlow,
                          { backgroundColor: colors.primary[500] },
                        ]}
                      />
                    )}
                    <Button
                      onPress={handleSignIn}
                      disabled={!canSubmit}
                      size="lg"
                      style={styles.signInButton}
                    >
                      {loading ? t.signingIn[lang] : t.signInButton[lang]}
                    </Button>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Footer */}
            <Animated.View
              entering={FadeInUp.delay(900).duration(600)}
              style={styles.footer}
            >
              <View style={styles.footerDivider}>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: colors.border },
                  ]}
                />
                <Typography
                  variant="body2"
                  color="textMuted"
                  style={styles.footerText}
                >
                  {t.firstTimeHere[lang]}
                </Typography>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: colors.border },
                  ]}
                />
              </View>

              <Button
                variant="ghost"
                onPress={navigateToSignUp}
                size="lg"
                style={styles.signUpButton}
              >
                {t.startNow[lang]}
              </Button>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    justifyContent: "center",
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  brandName: {
    fontSize: 42,
    lineHeight: 48,
    letterSpacing: 8,
    marginTop: 24,
  },
  taglineContainer: {
    marginTop: 12,
  },
  tagline: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.5,
  },
  formSection: {
    marginBottom: 32,
  },
  formCard: {
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  formCardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    borderWidth: 1,
  },
  formContent: {
    padding: 24,
  },
  formTitle: {
    fontSize: 22,
    marginBottom: 24,
  },
  input: {
    marginBottom: 4,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -8,
    marginBottom: 16,
  },
  ctaContainer: {
    position: "relative",
    marginTop: 8,
  },
  ctaGlow: {
    position: "absolute",
    top: 12,
    left: 24,
    right: 24,
    bottom: 0,
    borderRadius: 12,
    opacity: 0.15,
  },
  signInButton: {
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  footer: {
    alignItems: "center",
    gap: 16,
  },
  footerDivider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.3,
  },
  footerText: {
    fontSize: 14,
  },
  signUpButton: {
    width: "100%",
  },
});
