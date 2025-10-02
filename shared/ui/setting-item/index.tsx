import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { View } from "react-native";

type Props = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
};

export const SettingItem: React.FC<Props> = ({
  icon,
  title,
  subtitle,
  rightElement,
  onPress,
}) => {
  const { colors, isDarkMode } = useColorScheme();

  return (
    <Card
      variant="outlined"
      padding="md"
      pressable={!!onPress}
      onPress={onPress}
      style={{ marginBottom: 8 }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isDarkMode ? colors.gray[600] : colors.gray[100],
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          {icon}
        </View>

        <View style={{ flex: 1 }}>
          <Typography
            variant="h6"
            weight="medium"
            style={{ marginBottom: subtitle ? 2 : 0 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textMuted">
              {subtitle}
            </Typography>
          )}
        </View>

        {rightElement && <View style={{ marginLeft: 12 }}>{rightElement}</View>}
      </View>
    </Card>
  );
};
