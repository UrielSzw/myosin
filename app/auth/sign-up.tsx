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

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const { colors, isDarkMode } = useColorScheme();
  const { signUp } = useAuth();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = authTranslations.signUp;

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

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim() || password !== confirmPassword) {
      return;
    }

    setLoading(true);
    const { error } = await signUp(
      email.trim(),
      password,
      displayName.trim() || undefined
    );
    setLoading(false);

    if (!error) {
      // Stay on this screen, user will get email confirmation message
    }
  };

  const navigateToSignIn = () => {
    router.push("/auth/sign-in" as any);
  };

  const passwordsMatch = password === confirmPassword;
  const canSubmit =
    email.trim() && password.trim() && confirmPassword.trim() && passwordsMatch;

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
            isDarkMode
              ? "rgba(14, 165, 233, 0.06)"
              : "rgba(14, 165, 233, 0.1)"
          }
          initialX={-60}
          initialY={SCREEN_HEIGHT * 0.05}
          delay={0}
        />
        <FloatingOrb
          size={140}
          color={
            isDarkMode
              ? "rgba(56, 189, 248, 0.04)"
              : "rgba(56, 189, 248, 0.08)"
          }
          initialX={SCREEN_WIDTH - 80}
          initialY={SCREEN_HEIGHT * 0.35}
          delay={500}
        />
        <FloatingOrb
          size={100}
          color={
            isDarkMode
              ? "rgba(14, 165, 233, 0.05)"
              : "rgba(14, 165, 233, 0.08)"
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
              <GlowingLogo size={70} />

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
                    label={t.nameLabel[lang]}
                    placeholder={t.namePlaceholder[lang]}
                    value={displayName}
                    onChangeText={setDisplayName}
                    autoCapitalize="words"
                    autoComplete="name"
                    textContentType="name"
                    containerStyle={styles.input}
                  />

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
                    autoComplete="new-password"
                    textContentType="newPassword"
                    containerStyle={styles.input}
                  />

                  <EnhancedInput
                    label={t.confirmPasswordLabel[lang]}
                    placeholder={t.confirmPasswordPlaceholder[lang]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoComplete="new-password"
                    textContentType="newPassword"
                    containerStyle={styles.input}
                    error={
                      confirmPassword && !passwordsMatch
                        ? t.passwordMismatch[lang]
                        : undefined
                    }
                  />

                  {/* Glowing CTA Button */}
                  <View style={styles.ctaContainer}>
                    {canSubmit && !loading && (
                      <View
                        style={[
                          styles.ctaGlow,
                          { backgroundColor: colors.primary[500] },
                        ]}
                      />
                    )}
                    <Button
                      onPress={handleSignUp}
                      disabled={loading || !canSubmit}
                      size="lg"
                      style={styles.signUpButton}
                    >
                      {loading
                        ? t.creatingAccount[lang]
                        : t.createAccountButton[lang]}
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
                  {t.alreadyHaveAccount[lang]}
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
                onPress={navigateToSignIn}
                size="lg"
                style={styles.signInButton}
              >
                {t.signIn[lang]}
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
    paddingTop: 32,
    paddingBottom: 24,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  brandName: {
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: 8,
    marginTop: 20,
  },
  taglineContainer: {
    marginTop: 8,
  },
  tagline: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  formSection: {
    marginBottom: 24,
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
    marginBottom: 20,
  },
  input: {
    marginBottom: 4,
  },
  ctaContainer: {
    position: "relative",
    marginTop: 12,
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
  signUpButton: {
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  footer: {
    alignItems: "center",
    gap: 12,
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
  signInButton: {
    width: "100%",
  },
});
