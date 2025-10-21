import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { Calendar } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";
import { MUSCLE_CATEGORY_MAP, PRListItem } from "../../types/pr-list";

type Props = {
  pr: PRListItem;
  onPress?: () => void;
};

export const PRItemDetailed: React.FC<Props> = ({ pr, onPress }) => {
  const { colors } = useColorScheme();

  const achievedDate = new Date(pr.achieved_at);
  const isRecent = pr.is_recent;

  const muscleCategory = MUSCLE_CATEGORY_MAP[pr.exercise_muscle];
  const muscleCategoryLabel =
    muscleCategory.charAt(0).toUpperCase() + muscleCategory.slice(1);

  return (
    <Card variant="outlined" padding="md">
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            {/* Exercise Name and Muscle Group */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              {isRecent && (
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: colors.success[500],
                  }}
                />
              )}
              <Typography
                variant="body1"
                weight="semibold"
                numberOfLines={1}
                style={{ flex: 1 }}
              >
                {pr.exercise_name}
              </Typography>
            </View>

            {/* Muscle Group Badge */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              {pr.source === "manual" && (
                <View
                  style={{
                    backgroundColor: colors.gray[200],
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 8,
                  }}
                >
                  <Typography
                    variant="caption"
                    style={{ color: colors.gray[700], fontSize: 9 }}
                  >
                    MANUAL
                  </Typography>
                </View>
              )}
            </View>

            {/* PR Details */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginBottom: 4,
              }}
            >
              <Typography variant="body2" color="textMuted">
                {pr.best_weight}kg × {pr.best_reps} reps
              </Typography>
              <Typography variant="caption" color="textMuted">
                •
              </Typography>
              <Typography variant="caption" color="textMuted">
                1RM: {pr.estimated_1rm.toFixed(1)}kg
              </Typography>
            </View>

            {/* Date */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Calendar size={12} color={colors.textMuted} />
              <Typography variant="caption" color="textMuted">
                {achievedDate.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Typography>
              {isRecent && (
                <>
                  <Typography variant="caption" color="textMuted">
                    •
                  </Typography>
                  <Typography variant="caption" color="success">
                    Reciente
                  </Typography>
                </>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Card>
  );
};
