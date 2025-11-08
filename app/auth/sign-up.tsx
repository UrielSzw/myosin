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

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();

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
              Create Account
            </Typography>
            <Typography
              variant="body1"
              color="textMuted"
              align="center"
              style={styles.subtitle}
            >
              Join Myosin and start syncing your workouts
            </Typography>
          </View>

          <View style={styles.form}>
            <EnhancedInput
              label="Display Name (Optional)"
              placeholder="How should we call you?"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
            />

            <EnhancedInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
            />

            <EnhancedInput
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              textContentType="newPassword"
            />

            <EnhancedInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="new-password"
              textContentType="newPassword"
              error={
                confirmPassword && !passwordsMatch
                  ? "Passwords don't match"
                  : undefined
              }
            />

            <Button
              onPress={handleSignUp}
              disabled={loading || !canSubmit}
              style={styles.signUpButton}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </View>

          <View style={styles.footer}>
            <Typography variant="body2" color="textMuted" align="center">
              Already have an account?{" "}
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
  signUpButton: {
    marginTop: 8,
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
  },
  signInButton: {
    marginTop: 8,
  },
});
