import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { fromKg } from "@/shared/utils/weight-conversion";
import { ChevronRight, Trophy } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { PRListItem } from "../../types/pr-list";

type Props = {
  pr: PRListItem;
  onPress?: () => void;
};

export const PRItemDetailed: React.FC<Props> = ({ pr, onPress }) => {
  const { colors } = useColorScheme();

  // Get user's weight unit preference
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";
  const lang = prefs?.language ?? "es";

  const achievedDate = new Date(pr.achieved_at);
  const isRecent = pr.is_recent;

  // Format weights in user's preferred unit
  const bestWeightFormatted = fromKg(pr.best_weight, weightUnit, 1);
  const estimated1RMFormatted = fromKg(pr.estimated_1rm, weightUnit, 1);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", options);
  };

  return (
    <Card variant="outlined" padding="none" pressable onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 14,
          paddingHorizontal: 16,
        }}
      >
        {/* Trophy/Recent indicator */}
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isRecent
              ? colors.success[500] + "15"
              : colors.primary[500] + "15",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Trophy
            size={18}
            color={isRecent ? colors.success[500] : colors.primary[500]}
          />
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          {/* Exercise name + recent badge */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 2,
            }}
          >
            <Typography
              variant="body1"
              weight="semibold"
              numberOfLines={1}
              style={{ flex: 1 }}
            >
              {pr.exercise_name}
            </Typography>
            {isRecent && (
              <View
                style={{
                  backgroundColor: colors.success[500] + "20",
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 10,
                }}
              >
                <Typography
                  variant="caption"
                  style={{
                    color: colors.success[600],
                    fontSize: 10,
                    fontWeight: "600",
                  }}
                >
                  {lang === "es" ? "NUEVO" : "NEW"}
                </Typography>
              </View>
            )}
          </View>

          {/* Weight x Reps */}
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Typography variant="body2" weight="medium">
              {bestWeightFormatted} {weightUnit}
            </Typography>
            <Typography
              variant="body2"
              color="textMuted"
              style={{ marginLeft: 4 }}
            >
              × {pr.best_reps} reps
            </Typography>
          </View>

          {/* Date */}
          <Typography
            variant="caption"
            color="textMuted"
            style={{ marginTop: 2 }}
          >
            {formatDate(achievedDate)}
          </Typography>
        </View>

        {/* 1RM + Chevron */}
        <View style={{ alignItems: "flex-end", marginLeft: 12 }}>
          <Typography variant="caption" color="textMuted">
            1RM
          </Typography>
          <Typography
            variant="body1"
            weight="bold"
            style={{ color: colors.primary[500] }}
          >
            {estimated1RMFormatted}
          </Typography>
          <ChevronRight
            size={16}
            color={colors.textMuted}
            style={{ marginTop: 4 }}
          />
        </View>
      </View>
    </Card>
  );
};
