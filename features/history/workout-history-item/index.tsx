import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { Clock, TrendingUp } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

interface WorkoutHistoryItemProps {
  date: string;
  name: string;
  duration: string;
  volume: string;
  exercises: number;
}

export const WorkoutHistoryItem: React.FC<WorkoutHistoryItemProps> = ({
  date,
  name,
  duration,
  volume,
  exercises,
}) => {
  const { colors } = useColorScheme();

  return (
    <Card variant="outlined" padding="md" style={{ marginBottom: 12 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: 1 }}>
          <Typography
            variant="caption"
            color="textMuted"
            style={{ marginBottom: 2 }}
          >
            {date}
          </Typography>
          <Typography
            variant="h6"
            weight="semibold"
            style={{ marginBottom: 4 }}
          >
            {name}
          </Typography>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Clock size={14} color={colors.textMuted} />
              <Typography variant="caption" color="textMuted">
                {duration}
              </Typography>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <TrendingUp size={14} color={colors.textMuted} />
              <Typography variant="caption" color="textMuted">
                {volume}
              </Typography>
            </View>
            <Typography variant="caption" color="textMuted">
              {exercises} ejercicios
            </Typography>
          </View>
        </View>
        <View
          style={{
            backgroundColor: colors.success[100],
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Typography variant="caption" color="success" weight="medium">
            Completado
          </Typography>
        </View>
      </View>
    </Card>
  );
};
