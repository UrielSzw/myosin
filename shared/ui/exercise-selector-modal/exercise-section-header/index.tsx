import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Heart } from "lucide-react-native";
import React, { memo } from "react";
import { View } from "react-native";
import { Typography } from "../../typography";

type Props = {
  title: string;
  subtitle?: string;
  icon?: "similar" | "general";
};

export const ExerciseSectionHeader: React.FC<Props> = memo(
  ({ title, subtitle, icon = "general" }) => {
    const { colors } = useColorScheme();

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 20,
          marginTop: 8,
          gap: 8,
        }}
      >
        {icon === "similar" && (
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: colors.primary[100],
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heart
              size={16}
              color={colors.primary[600]}
              fill={colors.primary[200]}
            />
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Typography
            variant="h6"
            weight="semibold"
            style={{ color: colors.text }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              color="textMuted"
              style={{ marginTop: 2 }}
            >
              {subtitle}
            </Typography>
          )}
        </View>
      </View>
    );
  }
);

ExerciseSectionHeader.displayName = "ExerciseSectionHeader";
