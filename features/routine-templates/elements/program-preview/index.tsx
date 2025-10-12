import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { Calendar, Clock, Target } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { ROUTINE_TEMPLATES, translateWeekdays } from "../../constants";
import { ProgramTemplate } from "../../types";
import { RoutinePreview } from "../routine-preview";

type Props = {
  program: ProgramTemplate;
};

export const ProgramPreview: React.FC<Props> = ({ program }) => {
  const { colors } = useColorScheme();

  return (
    <View>
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        Vista Previa del Programa
      </Typography>

      {/* Program Info */}
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Calendar size={16} color={colors.primary[500]} />
          <Typography variant="body2" weight="medium" style={{ marginLeft: 8 }}>
            Información del Programa
          </Typography>
        </View>

        <View style={{ gap: 8 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Typography variant="caption" color="textMuted">
              Duración:
            </Typography>
            <Typography variant="caption" weight="medium">
              {program.duration}
            </Typography>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Typography variant="caption" color="textMuted">
              Frecuencia:
            </Typography>
            <Typography variant="caption" weight="medium">
              {program.frequency}
            </Typography>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Typography variant="caption" color="textMuted">
              Días de entrenamiento:
            </Typography>
            <Typography variant="caption" weight="medium">
              {translateWeekdays(
                program.routines.flatMap((r) => r.assignedDays)
              ).join(", ")}
            </Typography>
          </View>
        </View>
      </View>

      {/* Routines in Program */}
      <Typography
        variant="body1"
        weight="semibold"
        style={{ marginBottom: 16 }}
      >
        Rutinas Incluidas ({program.routines.length})
      </Typography>

      {program.routines.map((programRoutine, index) => {
        // Find the corresponding routine template
        const routineTemplate = ROUTINE_TEMPLATES.find(
          (template) => template.id === programRoutine.routineId
        );

        if (!routineTemplate) {
          return (
            <View key={index} style={{ marginBottom: 16 }}>
              <Typography variant="body2" color="textMuted">
                Rutina no encontrada: {programRoutine.routineId}
              </Typography>
            </View>
          );
        }

        return (
          <View key={index} style={{ marginBottom: 32 }}>
            {/* Routine Header in Program */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 16,
                // borderLeftWidth: 4,
                // borderLeftColor: colors.primary[500],
                backgroundColor: colors.surface,
                borderRadius: 8,
                marginBottom: 16,
                // shadowColor: colors.gray[900],
                // shadowOffset: { width: 0, height: 1 },
                // shadowOpacity: 0.05,
                // shadowRadius: 2,
                // elevation: 1,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: colors.primary[500],
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Typography variant="caption" color="white" weight="bold">
                  {index + 1}
                </Typography>
              </View>

              <View style={{ flex: 1 }}>
                <Typography variant="body1" weight="semibold">
                  {programRoutine.name || routineTemplate.name}
                </Typography>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 2,
                  }}
                >
                  <Target size={12} color={colors.textMuted} />
                  <Typography
                    variant="caption"
                    color="textMuted"
                    style={{ marginLeft: 4 }}
                  >
                    {translateWeekdays(programRoutine.assignedDays).join(", ")}
                  </Typography>
                  <Clock
                    size={12}
                    color={colors.textMuted}
                    style={{ marginLeft: 12 }}
                  />
                  <Typography
                    variant="caption"
                    color="textMuted"
                    style={{ marginLeft: 4 }}
                  >
                    {routineTemplate.estimatedTime}
                  </Typography>
                </View>
              </View>
            </View>

            {/* Routine Preview */}
            <View style={{ paddingLeft: 16 }}>
              <RoutinePreview routine={routineTemplate} />
            </View>
          </View>
        );
      })}
    </View>
  );
};
