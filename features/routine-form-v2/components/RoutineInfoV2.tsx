import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { routineFormTranslations } from "@/shared/translations/routine-form";
import { Typography } from "@/shared/ui/typography";
import { WeekDaySelector } from "@/shared/ui/week-day-selector";
import { BlurView } from "expo-blur";
import { FileText, Settings } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  useMainActions,
  useRoutineInfoState,
} from "../hooks/use-routine-form-store";

type Props = {
  onOpenSettings?: () => void;
};

export const RoutineInfoV2: React.FC<Props> = ({ onOpenSettings }) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = (prefs?.language ?? "es") as "es" | "en";
  const t = routineFormTranslations;

  const { name, training_days } = useRoutineInfoState();
  const { setRoutineName, setTrainingDays } = useMainActions();

  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Validation
  const validateRoutineName = useCallback(
    (value: string) => {
      const trimmedValue = value.trim();
      if (!trimmedValue) {
        return { isValid: false, error: t.nameRequired[lang] };
      }
      if (trimmedValue.length < 2) {
        return { isValid: false, error: t.nameTooShort[lang] };
      }
      if (trimmedValue.length > 100) {
        return { isValid: false, error: t.nameTooLong[lang] };
      }
      return { isValid: true, error: null };
    },
    [lang, t]
  );

  const validation = useMemo(
    () => validateRoutineName(name || ""),
    [name, validateRoutineName]
  );

  const shouldShowError = hasInteracted && !isFocused && !validation.isValid;

  const handleNameChange = useCallback(
    (newName: string) => {
      if (!hasInteracted) setHasInteracted(true);
      setRoutineName(newName);
    },
    [hasInteracted, setRoutineName]
  );

  const borderColor = isFocused
    ? colors.primary[500]
    : shouldShowError
    ? colors.error[500]
    : isDarkMode
    ? "rgba(255,255,255,0.1)"
    : "rgba(0,0,0,0.08)";

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(100)}
      style={styles.container}
    >
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.headerIcon,
              { backgroundColor: `${colors.primary[500]}15` },
            ]}
          >
            <FileText size={16} color={colors.primary[500]} />
          </View>
          <Typography variant="body1" weight="semibold">
            {t.routineInformation[lang]}
          </Typography>
        </View>

        <Pressable
          onPress={onOpenSettings}
          style={({ pressed }) => [
            styles.settingsButton,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.04)",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Settings size={18} color={colors.textMuted} />
        </Pressable>
      </View>

      {/* Name Input Card */}
      <View
        style={[
          styles.inputCard,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.9)",
            borderColor,
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 15 : 25}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        <View style={styles.inputContent}>
          <Typography
            variant="caption"
            weight="medium"
            style={{
              color: isFocused
                ? colors.primary[500]
                : shouldShowError
                ? colors.error[500]
                : colors.textMuted,
              marginBottom: 6,
            }}
          >
            {t.routineName[lang]} *
          </Typography>

          <TextInput
            value={name || ""}
            onChangeText={handleNameChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              setHasInteracted(true);
            }}
            placeholder={t.routineNamePlaceholder[lang]}
            placeholderTextColor={colors.textMuted}
            style={[
              styles.input,
              {
                color: colors.text,
              },
            ]}
            maxLength={100}
            autoCapitalize="words"
          />

          {shouldShowError && (
            <Typography
              variant="caption"
              style={{ color: colors.error[500], marginTop: 6 }}
            >
              {validation.error}
            </Typography>
          )}
        </View>
      </View>

      {/* Training Days Selector */}
      <View
        style={[
          styles.daysCard,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.9)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 15 : 25}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        <View style={styles.daysContent}>
          <WeekDaySelector
            selectedDays={training_days || []}
            onDaysChange={setTrainingDays}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  inputCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  inputContent: {
    padding: 14,
  },
  input: {
    fontSize: 16,
    fontWeight: "500",
    padding: 0,
    margin: 0,
  },
  daysCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  daysContent: {
    padding: 14,
  },
});
