import { trackerTranslations } from "@/shared/translations/tracker";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Plus } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

type Props = {
  onAddMetric: () => void;
  lang: "es" | "en";
};

export const EmptyMetrics: React.FC<Props> = ({ onAddMetric, lang }) => {
  const t = trackerTranslations;

  return (
    <View
      style={{
        alignItems: "center",
        paddingVertical: 40,
        borderRadius: 12,
        marginBottom: 24,
      }}
    >
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 8 }}>
        {t.emptyState.noMetrics[lang]}
      </Typography>
      <Typography
        variant="body2"
        color="textMuted"
        align="center"
        style={{ marginBottom: 16 }}
      >
        {t.emptyState.addMetricsToTrack[lang]}
      </Typography>
      <Button
        variant="primary"
        onPress={onAddMetric}
        icon={<Plus size={20} color="#ffffff" />}
      >
        {t.emptyState.addFirstMetric[lang]}
      </Button>
    </View>
  );
};
