import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { IRepsType } from "@/shared/types/workout";
import { Typography } from "@/shared/ui/typography";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef } from "react";
import { TouchableOpacity } from "react-native";
import {
  useExerciseActions,
  useRoutineFormCurrentState,
} from "../../hooks/use-routine-form-store";

export const RepsTypeBottomSheet = forwardRef<BottomSheetModal>(
  (_props, ref) => {
    const { colors } = useColorScheme();
    const { currentRepsType } = useRoutineFormCurrentState();
    const { updateRepsType } = useExerciseActions();

    const repsTypes = [
      { type: "reps" as const, label: "Repeticiones" },
      { type: "range" as const, label: "Rango de Repeticiones" },
      { type: "time" as const, label: "Tiempo" },
      { type: "distance" as const, label: "Distancia" },
    ];

    const handleUpdateRepsType = (type: IRepsType) => {
      updateRepsType(type);
      if (
        typeof ref === "object" &&
        ref !== null &&
        "current" in ref &&
        ref.current
      ) {
        ref.current.close();
      }
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["40%"]}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: colors.surface,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8, // Para Android
        }}
        handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
      >
        <BottomSheetView style={{ padding: 16, paddingBottom: 40 }}>
          <Typography
            variant="h3"
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            Tipo de Medición
          </Typography>

          {repsTypes.map((option) => (
            <TouchableOpacity
              key={option.type}
              onPress={() => handleUpdateRepsType(option.type)}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
                backgroundColor:
                  currentRepsType === option.type
                    ? colors.primary[500] + "20"
                    : "transparent",
              }}
            >
              <Typography
                variant="body1"
                style={{
                  color:
                    currentRepsType === option.type
                      ? colors.primary[500]
                      : colors.text,
                  fontWeight: currentRepsType === option.type ? "600" : "400",
                }}
              >
                {option.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

RepsTypeBottomSheet.displayName = "RepsTypeBottomSheet";
