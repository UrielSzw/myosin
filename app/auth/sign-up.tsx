import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { authTranslations } from "@/shared/translations/auth";
import { Button } from "@/shared/ui/button";
import { EnhancedInput } from "@/shared/ui/enhanced-input";
import { GlassCard } from "@/shared/ui/glass-card";
import { GradientBackground } from "@/shared/ui/gradient-background";
import { Logo } from "@/shared/ui/logo";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = authTranslations.signUp;

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
    <GradientBackground variant="subtle">
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.topSection}>
              <Logo size={60} animated />
              <View style={styles.headerSpacing}>
                <Typography
                  variant="h1"
                  weight="bold"
                  align="center"
                  style={styles.title}
                >
                  {t.title[lang]}
                </Typography>
                <Typography
                  variant="body1"
                  color="textMuted"
                  align="center"
                  style={styles.subtitle}
                >
                  {t.subtitle[lang]}
                </Typography>
              </View>
            </View>

            <GlassCard style={styles.card}>
              <View style={styles.form}>
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
            </GlassCard>

            <View style={styles.footer}>
              <Typography variant="body1" color="textMuted" align="center">
                {t.alreadyHaveAccount[lang]}
              </Typography>
              <Button
                variant="ghost"
                onPress={navigateToSignIn}
                size="lg"
                style={styles.signInButton}
              >
                {t.signIn[lang]}
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 40,
    gap: 32,
  },
  topSection: {
    alignItems: "center",
    gap: 24,
  },
  headerSpacing: {
    gap: 10,
  },
  title: {
    fontSize: 44,
    lineHeight: 50,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    opacity: 0.7,
  },
  card: {
    marginHorizontal: 0,
  },
  input: {
    marginBottom: -12,
  },
  form: {
    gap: 12,
  },
  signUpButton: {
    marginTop: 8,
    shadowColor: "#0ea5e9",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  footer: {
    alignItems: "center",
    gap: 8,
  },
  signInButton: {
    marginTop: 4,
  },
});
