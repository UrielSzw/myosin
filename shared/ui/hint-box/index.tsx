import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import React from "react";
import { View } from "react-native";

type HintBoxProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "instructional" | "promotional" | "warning";
};

export const HintBox: React.FC<HintBoxProps> = ({
  children,
  icon,
  variant = "instructional",
}) => {
  const { colors } = useColorScheme();

  const getVariantStyles = () => {
    switch (variant) {
      case "promotional":
        return {
          backgroundColor: colors.primary[500] + "08",
          borderWidth: 1,
          borderColor: colors.primary[500] + "20",
          borderRadius: 12,
        };
      case "warning":
        return {
          backgroundColor: "#f59e0b20",
          borderLeftWidth: 3,
          borderLeftColor: "#f59e0b",
          borderRadius: 8,
        };
      case "instructional":
      default:
        return {
          backgroundColor: colors.primary[500] + "10",
          borderLeftWidth: 3,
          borderLeftColor: colors.primary[500],
          borderRadius: 8,
        };
    }
  };

  return (
    <View
      style={{
        ...getVariantStyles(),
        padding: 12,
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
      }}
    >
      {icon && <View style={{ marginTop: 1 }}>{icon}</View>}

      <View style={{ flex: 1 }}>
        {typeof children === "string" ? (
          <Typography
            variant="caption"
            style={{
              color: colors.primary[500],
              fontWeight: "500",
              lineHeight: 18,
            }}
          >
            {children}
          </Typography>
        ) : (
          children
        )}
      </View>
    </View>
  );
};
