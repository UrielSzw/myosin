import { toSupportedLanguage } from "@/shared/types/language";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { routineFormTranslations } from "@/shared/translations/routine-form";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";

export interface WeekDaySelectorProps {
  selectedDays: string[];
  onDaysChange: (days: string[]) => void;
  disabled?: boolean;
}

const WEEK_DAYS = [
  { key: "monday", short: "L", full: "Lunes" },
  { key: "tuesday", short: "M", full: "Martes" },
  { key: "wednesday", short: "X", full: "Miércoles" },
  { key: "thursday", short: "J", full: "Jueves" },
  { key: "friday", short: "V", full: "Viernes" },
  { key: "saturday", short: "S", full: "Sábado" },
  { key: "sunday", short: "D", full: "Domingo" },
];

export const WeekDaySelector: React.FC<WeekDaySelectorProps> = ({
  selectedDays,
  onDaysChange,
  disabled = false,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);
  const t = routineFormTranslations;

  const handleDayToggle = (dayKey: string) => {
    if (disabled) return;

    const newSelectedDays = selectedDays.includes(dayKey)
      ? selectedDays.filter((day) => day !== dayKey)
      : [...selectedDays, dayKey];

    onDaysChange(newSelectedDays);
  };

  return (
    <View>
      <Typography
        variant="body1"
        weight="medium"
        style={{ marginBottom: 4, color: colors.text }}
      >
        {t.whenToDoRoutine[lang]}
      </Typography>
      <Typography
        variant="caption"
        color="textMuted"
        style={{ marginBottom: 12 }}
      >
        {t.whenToDoRoutineSubtitle[lang]}
      </Typography>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 8,
          paddingHorizontal: 4,
          minWidth: "100%",
          justifyContent: "space-between",
        }}
        style={{ width: "100%" }}
      >
        {WEEK_DAYS.map((day) => {
          const isSelected = selectedDays.includes(day.key);
          return (
            <Pressable
              key={day.key}
              onPress={() => handleDayToggle(day.key)}
              disabled={disabled}
              style={({ pressed }) => ({
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: isSelected
                  ? colors.primary[500]
                  : pressed
                  ? colors.gray[100]
                  : isDarkMode
                  ? colors.gray[800]
                  : colors.gray[50],
                borderWidth: 1,
                borderColor: isSelected
                  ? colors.primary[500]
                  : colors.gray[200],
                alignItems: "center",
                justifyContent: "center",
                opacity: disabled ? 0.5 : 1,
              })}
            >
              <Typography
                variant="body2"
                weight="semibold"
                style={{
                  color: isSelected ? "#ffffff" : colors.text,
                }}
              >
                {day.short}
              </Typography>
            </Pressable>
          );
        })}
      </ScrollView>
      {selectedDays.length > 0 && (
        <Typography
          variant="caption"
          color="textMuted"
          style={{ marginTop: 8 }}
        >
          {selectedDays.length}{" "}
          {selectedDays.length !== 1
            ? t.daysSelectedPlural[lang]
            : t.daysSelected[lang]}{" "}
          {selectedDays.length !== 1
            ? t.selectedPlural[lang]
            : t.selected[lang]}
        </Typography>
      )}
    </View>
  );
};
