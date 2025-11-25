import { BaseFolder } from "@/shared/db/schema";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { workoutsTranslations } from "@/shared/translations/workouts";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { View } from "react-native";
import { useWorkoutsMetricsStore } from "../../hooks/use-workouts-metrics-store";
import { ExpandableCreateButton } from "./expandable-create-button";

type Props = {
  selectedFolder: BaseFolder | null;
};

export const Header: React.FC<Props> = ({ selectedFolder }) => {
  const totalRoutines = useWorkoutsMetricsStore((state) => state.totalRoutines);
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = workoutsTranslations;

  const routineWord =
    totalRoutines === 1 ? t.routinesSingular[lang] : t.routinesPlural[lang];
  const totalWord = totalRoutines === 1 ? t.total[lang] : t.totalPlural[lang];

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
      }}
    >
      <View>
        <Typography variant="h2" weight="bold">
          {selectedFolder
            ? selectedFolder.icon + " " + selectedFolder?.name
            : t.myRoutines[lang]}
        </Typography>
        <Typography variant="body2" color="textMuted">
          {selectedFolder
            ? `${totalRoutines} ${routineWord} ${t.inThisFolder[lang]}`
            : `${totalRoutines} ${routineWord} ${totalWord}`}
        </Typography>
      </View>

      <ExpandableCreateButton />
    </View>
  );
};
