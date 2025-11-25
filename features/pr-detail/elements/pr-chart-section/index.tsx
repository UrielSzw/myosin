import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { prDetailTranslations } from "@/shared/translations/pr-detail";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { TrendingUp } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { PRHistoryItem } from "../../hooks/use-pr-detail";
import { PRProgressChart } from "../pr-progress-chart";

type Props = {
  history: PRHistoryItem[];
  lang: "es" | "en";
};

export const PRChartSection: React.FC<Props> = ({ history, lang }) => {
  const { colors } = useColorScheme();
  const t = prDetailTranslations;

  // Si hay pocos datos, mostrar estado reducido
  if (history.length < 2) {
    return (
      <Card variant="outlined" padding="lg" style={{ marginHorizontal: 16 }}>
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.primary[100],
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <TrendingUp size={24} color={colors.primary[500]} />
          </View>
          <Typography variant="h6" style={{ marginBottom: 8 }}>
            {t.prProgression[lang]}
          </Typography>
          <Typography variant="body2" color="textMuted" align="center">
            {history.length === 0
              ? t.noPRsRecorded[lang]
              : t.needAtLeastTwoPRs[lang]}
          </Typography>
        </View>
      </Card>
    );
  }

  return (
    <Card variant="outlined" padding="lg" style={{ marginHorizontal: 16 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.primary[100],
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <TrendingUp size={16} color={colors.primary[500]} />
        </View>
        <View style={{ flex: 1 }}>
          <Typography variant="h6">{t.prProgression[lang]}</Typography>
          <Typography variant="caption" color="textMuted">
            {t.recordsEstimated1RM[lang]
              .replace("{count}", history.length.toString())
              .replace("{plural}", history.length !== 1 ? "s" : "")}
          </Typography>
        </View>
      </View>

      {/* Chart */}
      <PRProgressChart history={history} height={220} />

      {/* Footer con info adicional */}
      <View
        style={{
          marginTop: 16,
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Typography variant="caption" color="textMuted">
            {t.bestPR[lang]}
          </Typography>
          <Typography variant="body2" weight="medium">
            {Math.max(...history.map((h) => h.estimated_1rm)).toFixed(1)}kg
          </Typography>
        </View>
        <View style={{ alignItems: "center" }}>
          <Typography variant="caption" color="textMuted">
            {t.totalProgress[lang]}
          </Typography>
          <Typography variant="body2" weight="medium">
            +
            {(
              Math.max(...history.map((h) => h.estimated_1rm)) -
              Math.min(...history.map((h) => h.estimated_1rm))
            ).toFixed(1)}
            kg
          </Typography>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Typography variant="caption" color="textMuted">
            {t.lastPRChart[lang]}
          </Typography>
          <Typography variant="body2" weight="medium">
            {history[0]?.estimated_1rm.toFixed(1)}kg
          </Typography>
        </View>
      </View>
    </Card>
  );
};

export default PRChartSection;
