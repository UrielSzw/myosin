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
      <Card
        variant="outlined"
        padding="lg"
        style={{ marginHorizontal: 16, marginBottom: 20 }}
      >
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
    <Card
      variant="outlined"
      padding="md"
      style={{ marginHorizontal: 16, marginBottom: 20 }}
    >
      {/* Header simplificado */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <TrendingUp
          size={18}
          color={colors.primary[500]}
          style={{ marginRight: 8 }}
        />
        <Typography variant="body1" weight="semibold">
          {t.prProgression[lang]}
        </Typography>
      </View>

      {/* Chart - más compacto */}
      <PRProgressChart history={history} height={180} />
    </Card>
  );
};

export default PRChartSection;
