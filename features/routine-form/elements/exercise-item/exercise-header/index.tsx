import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { exerciseMuscleTranslations } from "@/shared/translations/exercise-labels";
import { IExerciseMuscle } from "@/shared/types/workout";
import { ExerciseMedia } from "@/shared/ui/exercise-media";
import { Typography } from "@/shared/ui/typography";
import { EllipsisVertical } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type Props = {
  exerciseName: string;
  exerciseMainMuscle: string;
  exerciseImageUrl?: string;
  exerciseImageType?: "gif" | "image";
  onPress: () => void;
};

const ExerciseHeaderComponent: React.FC<Props> = ({
  exerciseName,
  exerciseMainMuscle,
  exerciseImageUrl,
  exerciseImageType,
  onPress,
}) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const muscleT = exerciseMuscleTranslations;

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
      }}
    >
      <ExerciseMedia
        primaryMediaUrl={exerciseImageUrl}
        primaryMediaType={exerciseImageType}
        variant="thumbnail"
        exerciseName={exerciseName}
      />

      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Typography variant="body1" weight="semibold" numberOfLines={2}>
            {exerciseName}
          </Typography>
        </View>
        <Typography variant="caption" color="textMuted">
          {muscleT[exerciseMainMuscle as IExerciseMuscle]?.[lang]}
        </Typography>
      </View>
      <TouchableOpacity
        onPress={onPress}
        style={{
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <EllipsisVertical size={28} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

export const ExerciseHeader = React.memo(ExerciseHeaderComponent);
ExerciseHeader.displayName = "ExerciseHeader";
