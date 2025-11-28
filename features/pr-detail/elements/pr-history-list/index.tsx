import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { Medal } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { PRHistoryItem } from "../../hooks/use-pr-detail";

type Props = {
  history: PRHistoryItem[];
  lang: "es" | "en";
};

export const PRHistoryList: React.FC<Props> = ({ history, lang }) => {
  const { colors } = useColorScheme();

  if (history.length === 0) {
    return null;
  }

  // Ordenar por 1RM estimado descendente para asignar medallas
  const sortedByStrength = [...history].sort(
    (a, b) => b.estimated_1rm - a.estimated_1rm
  );

  // Crear un mapa de posiciones (para las medallas)
  const rankMap = new Map<string, number>();
  sortedByStrength.forEach((pr, index) => {
    rankMap.set(pr.id, index + 1);
  });

  // Ordenar cronológicamente (más reciente primero) para mostrar
  const sortedByDate = [...history].sort((a, b) => {
    const dateA = new Date(a.created_at || new Date()).getTime();
    const dateB = new Date(b.created_at || new Date()).getTime();
    return dateB - dateA;
  });

  const formatDate = (dateInput: string | Date | null) => {
    const date = new Date(dateInput || new Date());
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", options);
  };

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "#FFD700"; // Gold
      case 2:
        return "#C0C0C0"; // Silver
      case 3:
        return "#CD7F32"; // Bronze
      default:
        return null;
    }
  };

  return (
    <View style={{ paddingHorizontal: 16 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Typography variant="body1" weight="semibold">
          {lang === "es" ? "Historial de Records" : "Records History"}
        </Typography>
        <Typography
          variant="caption"
          color="textMuted"
          style={{ marginLeft: 8 }}
        >
          ({history.length})
        </Typography>
      </View>

      {/* Lista */}
      <Card variant="outlined" padding="none">
        {sortedByDate.map((pr, index) => {
          const rank = rankMap.get(pr.id) || 999;
          const medalColor = getMedalColor(rank);
          const isLast = index === sortedByDate.length - 1;

          return (
            <View
              key={pr.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderBottomWidth: isLast ? 0 : 1,
                borderBottomColor: colors.border,
              }}
            >
              {/* Medal/Rank indicator */}
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: medalColor
                    ? medalColor + "20"
                    : colors.gray[100],
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                {medalColor ? (
                  <Medal size={16} color={medalColor} />
                ) : (
                  <Typography variant="caption" color="textMuted">
                    #{rank}
                  </Typography>
                )}
              </View>

              {/* Content */}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                  <Typography variant="body1" weight="semibold">
                    {pr.weight}kg
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textMuted"
                    style={{ marginLeft: 4 }}
                  >
                    × {pr.reps} reps
                  </Typography>
                </View>
                <Typography variant="caption" color="textMuted">
                  {formatDate(pr.created_at)}
                </Typography>
              </View>

              {/* 1RM */}
              <View style={{ alignItems: "flex-end" }}>
                <Typography variant="caption" color="textMuted">
                  1RM
                </Typography>
                <Typography
                  variant="body2"
                  weight="medium"
                  style={{ color: colors.primary[500] }}
                >
                  {pr.estimated_1rm.toFixed(1)}kg
                </Typography>
              </View>
            </View>
          );
        })}
      </Card>
    </View>
  );
};

export default PRHistoryList;
