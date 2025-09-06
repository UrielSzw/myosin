import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { Dumbbell } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

type Props = {
  exerciseName: string;
  exerciseMainMuscle: string;
};

const ExerciseHeaderComponent: React.FC<Props> = ({
  exerciseName,
  exerciseMainMuscle,
}) => {
  const { colors } = useColorScheme();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          backgroundColor: colors.border,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Dumbbell size={24} color={colors.textMuted} />
      </View>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Typography variant="body1" weight="semibold">
            {exerciseName}
          </Typography>
        </View>
        <Typography variant="caption" color="textMuted">
          {exerciseMainMuscle}
        </Typography>
      </View>
    </View>
  );
};

export const ExerciseHeader = React.memo(ExerciseHeaderComponent);
ExerciseHeader.displayName = "ExerciseHeader";
