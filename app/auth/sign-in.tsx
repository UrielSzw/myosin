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

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

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
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              color="textMuted"
              align="center"
              style={styles.subtitle}
            >
              Sign in to sync your workouts
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
            />

            <EnhancedInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              textContentType="password"
            />

            <Button
              onPress={handleSignIn}
              disabled={loading || !email.trim() || !password.trim()}
              style={styles.signInButton}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <Button
              variant="ghost"
              onPress={navigateToForgotPassword}
              style={styles.forgotButton}
            >
              Forgot Password?
            </Button>
          </View>

          <View style={styles.footer}>
            <Typography variant="body2" color="textMuted" align="center">
              Don&apos;t have an account?{" "}
            </Typography>
            <Button
              variant="ghost"
              onPress={navigateToSignUp}
              style={styles.signUpButton}
            >
              Sign Up
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
  signInButton: {
    marginTop: 8,
  },
  forgotButton: {
    alignSelf: "center",
  },
  footer: {
    marginTop: 32,
    alignItems: "center",
  },
  signUpButton: {
    marginTop: 8,
  },
});
