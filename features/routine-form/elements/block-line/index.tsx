import { BlockInsert } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { View } from "react-native";

type Props = {
  block: BlockInsert & {
    tempId: string;
  };
  exerciseIndex: number;
  blockColors: {
    primary: string;
    light: string;
    border: string;
  };
  exercisesCount: number;
};

const BlockLineComponent: React.FC<Props> = ({
  block,
  exerciseIndex,
  blockColors,
  exercisesCount,
}) => {
  const { colors } = useColorScheme();

  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor:
            exercisesCount > 1 ? blockColors.primary : colors.border,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          borderWidth: exercisesCount > 1 ? 2 : 0,
          borderColor: colors.background,
        }}
      >
        <Typography
          variant="caption"
          weight="bold"
          style={{
            color: exercisesCount > 1 ? "white" : colors.text,
          }}
        >
          {exerciseIndex + 1}
        </Typography>
      </View>
    </View>
  );
};

export const BlockLine = React.memo(BlockLineComponent);
BlockLine.displayName = "BlockLine";
