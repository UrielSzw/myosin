import { Typography } from "@/shared/ui/typography";
import React from "react";

type MetricLabelProps = {
  name: string;
};

export const MetricLabel: React.FC<MetricLabelProps> = React.memo(
  ({ name }) => {
    return (
      <Typography
        variant="caption"
        weight="medium"
        color="textMuted"
        style={{ marginBottom: 8 }}
        numberOfLines={1}
      >
        {name}
      </Typography>
    );
  }
);

MetricLabel.displayName = "MetricLabel";
