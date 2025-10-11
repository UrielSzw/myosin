import { BaseWorkoutSet } from "@/shared/db/schema/workout-session";
import { useBlockStyles } from "@/shared/hooks/use-block-styles";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { Check, X } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

type Props = {
  sets: BaseWorkoutSet[];
  exerciseName: string;
};

export const SessionSetsTable: React.FC<Props> = ({ sets, exerciseName }) => {
  const { colors } = useColorScheme();
  const { getSetTypeColor, getSetTypeLabel } = useBlockStyles();

  const formatValue = (value: number | null): string => {
    if (value === null) return "-";
    return value % 1 === 0 ? value.toString() : value.toFixed(1);
  };

  const getRPEColor = (rpe: number | null, planned: number | null) => {
    if (!rpe) return colors.textMuted;
    if (!planned) return colors.text;

    const diff = rpe - planned;
    if (diff > 0.5) return colors.error[600];
    if (diff < -0.5) return colors.success[600];
    return colors.text;
  };

  return (
    <View>
      {/* Table Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          marginBottom: 8,
        }}
      >
        <View style={{ width: 40, alignItems: "center" }}>
          <Typography variant="caption" weight="medium" color="textMuted">
            SET
          </Typography>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 8 }}>
          <Typography variant="caption" weight="medium" color="textMuted">
            Realizado
          </Typography>
        </View>
        <View style={{ width: 50, alignItems: "center" }}>
          <Typography variant="caption" weight="medium" color="textMuted">
            RPE
          </Typography>
        </View>
        <View style={{ width: 40, alignItems: "center" }}>
          <Check size={14} color={colors.textMuted} />
        </View>
      </View>

      {/* Table Rows */}
      {sets.map((set, index) => (
        <View
          key={set.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 6,
            backgroundColor: "transparent",
            borderRadius: 4,
            marginBottom: 4,
          }}
        >
          {/* Set Number */}
          <View style={{ width: 40, alignItems: "center" }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor:
                  set.set_type !== "normal"
                    ? getSetTypeColor(set.set_type)
                    : set.completed
                    ? colors.primary[500]
                    : colors.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="caption"
                weight="medium"
                style={{
                  color:
                    set.set_type !== "normal"
                      ? "white"
                      : set.completed
                      ? "#ffffff"
                      : colors.text,
                  fontSize: 10,
                }}
              >
                {getSetTypeLabel(set.set_type) ||
                  (set.order_index + 1).toString()}
              </Typography>
            </View>
          </View>

          {/* Actual Values */}
          <View style={{ flex: 1, paddingHorizontal: 8 }}>
            <Typography
              variant="body2"
              weight="semibold"
              style={{
                color: set.completed ? colors.text : colors.textMuted,
              }}
            >
              {set.completed
                ? `${formatValue(set.actual_weight)}kg × ${formatValue(
                    set.actual_reps
                  )}`
                : "No completado"}
            </Typography>
            {set.completed && (
              <Typography
                variant="caption"
                color="textMuted"
                style={{ fontSize: 10 }}
              >
                Vol:{" "}
                {(
                  (set.actual_weight || 0) * (set.actual_reps || 0)
                ).toLocaleString()}
                kg
              </Typography>
            )}
          </View>

          {/* RPE */}
          <View
            style={{
              width: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {set.actual_rpe ? (
              <View style={{ alignItems: "center" }}>
                <Typography
                  variant="body2"
                  weight="semibold"
                  style={{
                    color: getRPEColor(set.actual_rpe, set.planned_rpe),
                  }}
                >
                  {formatValue(set.actual_rpe)}
                </Typography>
                {set.planned_rpe && (
                  <Typography
                    variant="caption"
                    color="textMuted"
                    style={{ fontSize: 9 }}
                  >
                    ({formatValue(set.planned_rpe)})
                  </Typography>
                )}
              </View>
            ) : (
              <Typography variant="body2" color="textMuted">
                -
              </Typography>
            )}
          </View>

          {/* Completion Status */}
          <View
            style={{
              width: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {set.completed ? (
              <Check size={16} color={colors.primary[500]} />
            ) : (
              <X size={16} color={colors.error[500]} />
            )}
          </View>
        </View>
      ))}

      {/* Summary Row */}
      {sets.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 8,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            marginTop: 8,
          }}
        >
          <View style={{ width: 40 }} />
          <View style={{ flex: 1, paddingHorizontal: 8 }}>
            <Typography variant="caption" color="textMuted">
              Total Realizado
            </Typography>
            <Typography variant="body2" weight="semibold">
              {sets
                .filter((set) => set.completed)
                .reduce(
                  (sum, set) =>
                    sum + (set.actual_weight || 0) * (set.actual_reps || 0),
                  0
                )
                .toLocaleString()}
              kg
            </Typography>
          </View>
          <View style={{ width: 50 }} />
          <View style={{ width: 40 }} />
        </View>
      )}
    </View>
  );
};
