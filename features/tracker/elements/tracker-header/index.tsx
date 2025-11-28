import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { trackerUiTranslations } from "@/shared/translations/tracker";
import { Typography } from "@/shared/ui/typography";
import { getDayKey } from "@/shared/utils/date-utils";
import React from "react";
import { View } from "react-native";

type Props = {
  selectedDate: string;
};

export const TrackerHeader: React.FC<Props> = ({ selectedDate }) => {
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = trackerUiTranslations;

  // Determinar subtítulo basado en fecha
  const getSubtitle = () => {
    const today = getDayKey();
    if (selectedDate === today) {
      return (
        t.todayProgress?.[lang] ??
        (lang === "es" ? "Tu día de hoy" : "Your day today")
      );
    }

    // Format date nicely
    const date = new Date(selectedDate + "T12:00:00");
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };
    return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", options);
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 8,
      }}
    >
      <Typography variant="h2" weight="bold">
        Tracker
      </Typography>
      <Typography variant="body2" color="textMuted" style={{ marginTop: 2 }}>
        {getSubtitle()}
      </Typography>
    </View>
  );
};
