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
      <GradientBackground variant="subtle">
        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
          <View style={styles.container}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
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
                    Revisa tu Email
                  </Typography>
                  <Typography
                    variant="body1"
                    color="textMuted"
                    align="center"
                    style={styles.subtitle}
                  >
                    Enviamos instrucciones a {email}
                  </Typography>
                </View>
              </View>

              <GlassCard style={styles.card}>
                <Button
                  onPress={navigateToSignIn}
                  size="lg"
                  style={styles.backButton}
                >
                  Volver al Inicio
                </Button>
              </GlassCard>
            </ScrollView>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const canSubmit = email.trim();

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
                  ¡Listo!
                </Typography>
                <Typography
                  variant="body1"
                  color="textMuted"
                  align="center"
                  style={styles.subtitle}
                >
                  Revisa {email} y sigue los pasos
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
                  autoFocus
                  containerStyle={styles.input}
                />

                <Button
                  onPress={handleResetPassword}
                  disabled={loading || !canSubmit}
                  size="lg"
                  style={styles.resetButton}
                >
                  {loading ? "Enviando..." : "Enviar Instrucciones"}
                </Button>
              </View>
            </GlassCard>

            <View style={styles.footer}>
              <Typography variant="body1" color="textMuted" align="center">
                ¿Ya la recordaste?
              </Typography>
              <Button
                variant="ghost"
                onPress={navigateToSignIn}
                size="lg"
                style={styles.signInButton}
              >
                Volver
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
  resetButton: {
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
  backButton: {
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
