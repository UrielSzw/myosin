import { useAuth } from "@/shared/providers/auth-provider";
import { Button } from "@/shared/ui/button";
import { EnhancedInput } from "@/shared/ui/enhanced-input";
import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email.trim()) return;

    setLoading(true);
    const { error } = await resetPassword(email.trim());
    setLoading(false);

    if (!error) {
      setSent(true);
    }
  };

  const navigateToSignIn = () => {
    router.push("/auth/sign-in" as any);
  };

  if (sent) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Typography variant="h1" weight="bold" align="center">
                Check Your Email
              </Typography>
              <Typography
                variant="body1"
                color="textMuted"
                align="center"
                style={styles.subtitle}
              >
                We&apos;ve sent password reset instructions to {email}
              </Typography>
            </View>

            <View style={styles.actions}>
              <Button onPress={navigateToSignIn} style={styles.backButton}>
                Back to Sign In
              </Button>
            </View>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  const canSubmit = email.trim();

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Typography variant="h1" weight="bold" align="center">
              Reset Password
            </Typography>
            <Typography
              variant="body1"
              color="textMuted"
              align="center"
              style={styles.subtitle}
            >
              Enter your email and we&apos;ll send you reset instructions
            </Typography>
          </View>

          <View style={styles.form}>
            <EnhancedInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              autoFocus
            />

            <Button
              onPress={handleResetPassword}
              disabled={loading || !canSubmit}
              style={styles.resetButton}
            >
              {loading ? "Sending..." : "Send Reset Instructions"}
            </Button>
          </View>

          <View style={styles.footer}>
            <Typography variant="body2" color="textMuted" align="center">
              Remember your password?{" "}
            </Typography>
            <Button
              variant="ghost"
              onPress={navigateToSignIn}
              style={styles.signInButton}
            >
              Sign In
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 32,
  },
  subtitle: {
    marginTop: 8,
  },
  form: {
    gap: 16,
  },
  resetButton: {
    marginTop: 8,
  },
  actions: {
    gap: 16,
  },
  backButton: {
    marginTop: 24,
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
  },
  signInButton: {
    marginTop: 8,
  },
});
