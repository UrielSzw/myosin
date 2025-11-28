import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { prDetailTranslations } from "@/shared/translations/pr-detail";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { Calendar, Trophy } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { CurrentPR } from "../../hooks/use-pr-detail";

type Props = {
  currentPR: CurrentPR;
  lang: "es" | "en";
};

export const PRHeroCard: React.FC<Props> = ({ currentPR, lang }) => {
  const { colors } = useColorScheme();
  const t = prDetailTranslations;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return lang === "es" ? "Hoy" : "Today";
    } else if (diffDays === 1) {
      return lang === "es" ? "Ayer" : "Yesterday";
    } else if (diffDays < 7) {
      return lang === "es" ? `Hace ${diffDays} días` : `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return lang === "es"
        ? `Hace ${weeks} ${weeks === 1 ? "semana" : "semanas"}`
        : `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return lang === "es"
        ? `Hace ${months} ${months === 1 ? "mes" : "meses"}`
        : `${months} ${months === 1 ? "month" : "months"} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return lang === "es"
        ? `Hace ${years} ${years === 1 ? "año" : "años"}`
        : `${years} ${years === 1 ? "year" : "years"} ago`;
    }
  };

  return (
    <Card
      variant="default"
      padding="lg"
      style={{
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: colors.primary[500],
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <View
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: colors.primary[400],
          opacity: 0.3,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: -30,
          left: -30,
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: colors.primary[600],
          opacity: 0.3,
        }}
      />

      {/* Content */}
      <View style={{ alignItems: "center", zIndex: 1 }}>
        {/* Trophy icon */}
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: "rgba(255,255,255,0.2)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Trophy size={28} color="#FFFFFF" />
        </View>

        {/* Label */}
        <Typography
          variant="caption"
          weight="medium"
          style={{
            color: "rgba(255,255,255,0.8)",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          {t.currentPR?.[lang] ?? (lang === "es" ? "PR Actual" : "Current PR")}
        </Typography>

        {/* Main weight x reps */}
        <Typography
          variant="h3"
          weight="bold"
          style={{ color: "#FFFFFF", marginBottom: 4 }}
        >
          {currentPR.best_weight}kg × {currentPR.best_reps}
        </Typography>

        {/* Estimated 1RM */}
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <Typography
            variant="body2"
            weight="medium"
            style={{ color: "#FFFFFF" }}
          >
            1RM: {currentPR.estimated_1rm.toFixed(1)}kg
          </Typography>
        </View>

        {/* Date */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Calendar size={14} color="rgba(255,255,255,0.7)" />
          <Typography
            variant="caption"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {formatDate(currentPR.achieved_at)}
          </Typography>
        </View>
      </View>
    </Card>
  );
};

export default PRHeroCard;
