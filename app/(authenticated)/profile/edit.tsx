import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserProfile } from "@/shared/hooks/use-user-profile";
import { useAuth } from "@/shared/providers/auth-provider";
import { Avatar } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { EnhancedInput } from "@/shared/ui/enhanced-input";
import { GlassCard } from "@/shared/ui/glass-card";
import { GradientBackground } from "@/shared/ui/gradient-background";
import { Typography } from "@/shared/ui/typography";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AVATAR_COLORS = [
  "#0ea5e9", // Primary blue
  "#06b6d4", // Cyan
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#ef4444", // Red
  "#6366f1", // Indigo
];

export default function ProfileEditScreen() {
  const { user } = useAuth();
  const { colors } = useColorScheme();
  const { profile, updateDisplayName, updateAvatarColor } =
    useUserProfile(user);

  const [name, setName] = useState(profile.displayName || "");
  const [selectedColor, setSelectedColor] = useState(profile.avatarColor);
  const [saving, setSaving] = useState(false);

  // Sincronizar selectedColor cuando el perfil cambie
  useEffect(() => {
    setSelectedColor(profile.avatarColor);
  }, [profile.avatarColor]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const nameSuccess = await updateDisplayName(name.trim());
      const colorSuccess = await updateAvatarColor(selectedColor);

      if (nameSuccess && colorSuccess) {
        router.back();
      } else {
        Alert.alert(
          "Error",
          "No se pudo guardar el perfil. Verifica tu conexión."
        );
      }
    } catch {
      Alert.alert("Error", "Ocurrió un error al guardar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <GradientBackground variant="subtle">
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
            <Typography variant="h3" weight="bold">
              Editar Perfil
            </Typography>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <GlassCard style={styles.card}>
              {/* Avatar Preview */}
              <View style={styles.avatarSection}>
                <Avatar
                  name={name || undefined}
                  email={user?.email}
                  color={selectedColor}
                  size={100}
                />
                <Typography
                  variant="body2"
                  color="textMuted"
                  align="center"
                  style={{ marginTop: 12 }}
                >
                  Tu avatar
                </Typography>
              </View>

              {/* Color Picker */}
              <View style={styles.section}>
                <Typography
                  variant="body1"
                  weight="semibold"
                  style={{ marginBottom: 12 }}
                >
                  Color del avatar
                </Typography>
                <View style={styles.colorGrid}>
                  {AVATAR_COLORS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      onPress={() => setSelectedColor(color)}
                      activeOpacity={0.7}
                      style={[
                        styles.colorOption,
                        {
                          backgroundColor: color,
                          borderWidth: selectedColor === color ? 3 : 0,
                          borderColor:
                            selectedColor === color ? "#ffffff" : "transparent",
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>

              {/* Form Fields */}
              <View style={styles.section}>
                <EnhancedInput
                  label="Nombre"
                  placeholder="Tu nombre"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoComplete="name"
                  textContentType="name"
                  containerStyle={styles.input}
                />

                <EnhancedInput
                  label="Email"
                  placeholder={user?.email}
                  value={user?.email}
                  editable={false}
                  helpText="El email no se puede modificar"
                  containerStyle={{ ...styles.input, opacity: 0.6 }}
                />
              </View>
            </GlassCard>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <Button
                variant="ghost"
                onPress={handleCancel}
                size="lg"
                fullWidth
              >
                Cancelar
              </Button>
              <Button
                onPress={handleSave}
                size="lg"
                fullWidth
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 24,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    marginBottom: 16,
  },
  actions: {
    gap: 12,
  },
});
