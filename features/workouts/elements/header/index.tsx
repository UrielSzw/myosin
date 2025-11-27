import { BaseFolder } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { workoutsTranslations } from "@/shared/translations/workouts";
import { Typography } from "@/shared/ui/typography";
import React, { useMemo } from "react";
import { View } from "react-native";
import { useWorkoutsMetricsStore } from "../../hooks/use-workouts-metrics-store";
import { ExpandableCreateButton } from "./expandable-create-button";

/**
 * Get time-based greeting key
 */
const getGreetingKey = (): "greetingMorning" | "greetingAfternoon" | "greetingEvening" => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "greetingMorning";
  if (hour >= 12 && hour < 19) return "greetingAfternoon";
  return "greetingEvening";
};

/**
 * Get a random motivational subtitle
 */
const getRandomMotivational = (subtitles: string[]): string => {
  const index = Math.floor(Math.random() * subtitles.length);
  return subtitles[index];
};

type Props = {
  selectedFolder: BaseFolder | null;
};

export const Header: React.FC<Props> = ({ selectedFolder }) => {
  const { colors } = useColorScheme();
  const { user } = useAuth();
  const totalRoutines = useWorkoutsMetricsStore((state) => state.totalRoutines);
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = workoutsTranslations;

  const routineWord =
    totalRoutines === 1 ? t.routinesSingular[lang] : t.routinesPlural[lang];

  // Get display name from user metadata
  const displayName = user?.user_metadata?.display_name;

  // Memoize greeting and motivational to avoid recalculating on every render
  const greetingKey = useMemo(() => getGreetingKey(), []);
  const subtitles = t.motivationalSubtitles[lang];
  const motivational = useMemo(
    () => getRandomMotivational(subtitles),
    [subtitles]
  );

  const greeting = t[greetingKey][lang];

  // Vista principal: Greeting + botón
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
          <View>
            <Typography variant="h2" weight="bold">
              {greeting},{" "} 
            </Typography>
            {displayName && (
              <Typography
                variant="h2"
                weight="bold"
                style={{ color: colors.primary[500] }}
              >
              {displayName}
              </Typography>
            )}
          </View>
          <Typography
            variant="body2"
            color="textMuted"
            style={{ marginTop: 2 }}
          >
            {motivational}
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
