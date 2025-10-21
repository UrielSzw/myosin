import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { StatCard } from "@/shared/ui/stat-card";
import { Calendar, TrendingUp } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { CurrentPR, PRHistoryItem } from "../../hooks/use-pr-detail";

type Props = {
  firstPR: PRHistoryItem | null;
  lastPR: CurrentPR | null;
  totalProgress: number; // Diferencia en kg
  timeSpan: string; // "8 meses", "1 año", etc.
};

export const PRStatsCards: React.FC<Props> = ({
  firstPR,
  lastPR,
  totalProgress,
  timeSpan,
}) => {
  const { colors } = useColorScheme();

  if (!firstPR || !lastPR) {
    return null;
  }

  const progressText =
    totalProgress > 0 ? `+${totalProgress}kg` : `${totalProgress}kg`;

  const progressColor =
    totalProgress >= 0 ? colors.success[500] : colors.warning[500];

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
      }}
    >
      <StatCard
        icon={<Calendar size={20} color={colors.textMuted} />}
        title="Primer PR"
        value={`${firstPR.weight}kg`}
        color={colors.textMuted}
        subtitle={`Hace ${timeSpan}`}
      />

      <StatCard
        icon={<TrendingUp size={20} color={progressColor} />}
        title="Último PR"
        value={`${lastPR.best_weight}kg`}
        color={progressColor}
        subtitle={progressText}
      />
    </View>
  );
};

export default PRStatsCards;
