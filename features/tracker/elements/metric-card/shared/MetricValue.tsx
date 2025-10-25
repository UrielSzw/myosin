import { Typography } from "@/shared/ui/typography";
import React from "react";
import { View } from "react-native";

type MetricValueProps = {
  displayText: string;
  textColor: string;
  subtitle?: string;
};

export const MetricValue: React.FC<MetricValueProps> = React.memo(
  ({ displayText, textColor, subtitle }) => {
    return (
      <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
        <Typography
          variant="body2"
          weight="semibold"
          style={{ color: textColor, textAlign: "center" }}
          numberOfLines={2}
        >
          {displayText}
        </Typography>

        {subtitle && (
          <Typography
            variant="caption"
            color="textMuted"
            style={{ marginTop: 4, textAlign: "center" }}
          >
            {subtitle}
          </Typography>
        )}
      </View>
    );
  }
);

MetricValue.displayName = "MetricValue";
