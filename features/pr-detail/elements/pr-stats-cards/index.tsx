import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { Clock, Flame, TrendingUp } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

type Props = {
  totalProgress: number;
  timeSpan: string;
  totalPRs: number;
  lang: "es" | "en";
};

export const PRStatsCards: React.FC<Props> = ({
  totalProgress,
  timeSpan,
  totalPRs,
  lang,
}) => {
  const { colors } = useColorScheme();

  const progressText =
    totalProgress > 0
      ? `+${totalProgress.toFixed(1)}kg`
      : `${totalProgress.toFixed(1)}kg`;

  const progressColor =
    totalProgress >= 0 ? colors.success[500] : colors.warning[500];

  const stats = [
    {
      icon: <TrendingUp size={18} color={progressColor} />,
      label: lang === "es" ? "Progreso" : "Progress",
      value: progressText,
      color: progressColor,
    },
    {
      icon: <Clock size={18} color={colors.primary[500]} />,
      label: lang === "es" ? "Período" : "Period",
      value: timeSpan,
      color: colors.primary[500],
    },
    {
      icon: <Flame size={18} color={colors.warning[500]} />,
      label: lang === "es" ? "Records" : "Records",
      value: totalPRs.toString(),
      color: colors.warning[500],
    },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        paddingHorizontal: 16,
        marginBottom: 20,
      }}
    >
      {stats.map((stat, index) => (
        <Card key={index} variant="outlined" padding="md" style={{ flex: 1 }}>
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: stat.color + "15",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              {stat.icon}
            </View>
            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginBottom: 2 }}
            >
              {stat.label}
            </Typography>
            <Typography
              variant="body1"
              weight="bold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </Typography>
          </View>
        </Card>
      ))}
    </View>
  );
};

export default PRStatsCards;
