import { BaseFolder } from "@/shared/db/schema";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { workoutsTranslations } from "@/shared/translations/workouts";
import { Typography } from "@/shared/ui/typography";
import React, { useMemo } from "react";
import { View } from "react-native";
import { useWorkoutsMetricsStore } from "../../hooks/use-workouts-metrics-store";
import { ExpandableCreateButton } from "./expandable-create-button";

/**
 * Get formatted date string
 */
const getFormattedDate = (lang: "es" | "en"): string => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
  };
  const formatted = now.toLocaleDateString(
    lang === "es" ? "es-ES" : "en-US",
    options
  );
  // Capitalize first letter
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

type Props = {
  selectedFolder: BaseFolder | null;
};

export const Header: React.FC<Props> = ({ selectedFolder }) => {
  const { user } = useAuth();
  const totalRoutines = useWorkoutsMetricsStore((state) => state.totalRoutines);
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = workoutsTranslations;

  const routineWord =
    totalRoutines === 1 ? t.routinesSingular[lang] : t.routinesPlural[lang];

  // Get display name from user metadata
  const displayName = user?.user_metadata?.display_name;

  // Memoize date to avoid recalculating on every render
  const formattedDate = useMemo(() => getFormattedDate(lang), [lang]);

  // Vista principal: Fecha + nombre · rutinas
  if (!selectedFolder) {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <View style={{ flex: 1, marginRight: 12 }}>
          <Typography variant="h2" weight="bold">
            {formattedDate}
          </Typography>
          <Typography
            variant="body2"
            color="textMuted"
            style={{ marginTop: 2 }}
          >
            {displayName
              ? `${displayName} · ${totalRoutines} ${routineWord}`
              : `${totalRoutines} ${routineWord}`}
          </Typography>
        </View>

        <ExpandableCreateButton />
      </View>
    );
  }

  // Vista de folder: mostramos nombre + stats + botón
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 24,
      }}
    >
      <View>
        <Typography variant="h2" weight="bold">
          {selectedFolder.icon + " " + selectedFolder.name}
        </Typography>
        <Typography variant="body2" color="textMuted">
          {`${totalRoutines} ${routineWord} ${t.inThisFolder[lang]}`}
        </Typography>
      </View>

      <ExpandableCreateButton />
    </View>
  );
};
