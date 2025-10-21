import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { Search, Trophy } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

type Props = {
  title: string;
  description: string;
  icon?: "trophy" | "search";
  actionLabel?: string;
  onAction?: () => void;
};

export const EmptyState: React.FC<Props> = ({
  title,
  description,
  icon = "trophy",
  actionLabel,
  onAction,
}) => {
  const { colors } = useColorScheme();

  const IconComponent = icon === "search" ? Search : Trophy;

  return (
    <Card variant="outlined" padding="lg">
      <View style={{ alignItems: "center", paddingVertical: 40 }}>
        <IconComponent
          size={48}
          color={colors.gray[400]}
          style={{ marginBottom: 16 }}
        />
        <Typography
          variant="h6"
          weight="semibold"
          align="center"
          style={{ marginBottom: 8 }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="textMuted"
          align="center"
          style={{ marginBottom: 24, maxWidth: 280 }}
        >
          {description}
        </Typography>

        {actionLabel && onAction && (
          <Button variant="outline" size="sm" onPress={onAction}>
            {actionLabel}
          </Button>
        )}
      </View>
    </Card>
  );
};
