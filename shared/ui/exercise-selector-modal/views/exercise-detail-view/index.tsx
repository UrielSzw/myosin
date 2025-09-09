import { BaseExercise } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { X } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Button } from "../../../button";
import { ExerciseDetail } from "../../../exercise-detail";
import { Typography } from "../../../typography";

type Props = {
  exercise: BaseExercise;
  onClose: () => void;
};

export const ExerciseDetailView: React.FC<Props> = ({ exercise, onClose }) => {
  const { colors } = useColorScheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.View
        entering={FadeInUp.duration(300)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View style={{ flex: 1 }}>
          <Typography variant="h5" weight="semibold">
            Detalle del Ejercicio
          </Typography>
        </View>

        <Button
          variant="ghost"
          size="sm"
          onPress={onClose}
          icon={<X size={20} color={colors.text} />}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(400).delay(100)}
        style={{ flex: 1 }}
      >
        <ExerciseDetail exercise={exercise} />
      </Animated.View>
    </View>
  );
};
