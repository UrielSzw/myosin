import { useAuth } from "@/shared/providers/auth-provider";
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
                  ¡Listo para entrenar!
                </Typography>
                <Typography
                  variant="body1"
                  color="textMuted"
                  align="center"
                  style={styles.subtitle}
                >
                  Volvamos a romperla 💪
                </Typography>
              </View>
            </View>

            <GlassCard style={styles.card}>
              <View style={styles.form}>
                <EnhancedInput
                  label="Email"
                  placeholder="tu@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                  containerStyle={styles.input}
                />

                <EnhancedInput
                  label="Contraseña"
                  placeholder="••••••••"
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
                  ¿Olvidaste tu contraseña?
                </Button>

                <Button
                  onPress={handleSignIn}
                  disabled={loading || !email.trim() || !password.trim()}
                  size="lg"
                  style={styles.signInButton}
                >
                  {loading ? "Iniciando..." : "Iniciar Sesión"}
                </Button>
              </View>
            </GlassCard>

            <View style={styles.footer}>
              <Typography variant="body1" color="textMuted" align="center">
                ¿Primera vez aquí?
              </Typography>
              <Button
                variant="ghost"
                onPress={navigateToSignUp}
                size="lg"
                style={styles.signUpButton}
              >
                Empezar ahora
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
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: 4,
  },
  signInButton: {
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
  signUpButton: {
    marginTop: 4,
  },
});
