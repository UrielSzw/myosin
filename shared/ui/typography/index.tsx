import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import React from "react";
import { Text, TextProps } from "react-native";

interface TypographyProps extends TextProps {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body1"
    | "body2"
    | "caption"
    | "button"
    | "overline";
  color?:
    | "primary"
    | "secondary"
    | "text"
    | "textSecondary"
    | "textMuted"
    | "success"
    | "warning"
    | "error"
    | "white";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
  align?: "left" | "center" | "right";
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "body1",
  color = "text",
  weight = "normal",
  align = "left",
  style,
  children,
  ...props
}) => {
  const { colors } = useColorScheme();

  const getVariantStyles = () => {
    switch (variant) {
      case "h1":
        return { fontSize: 32, lineHeight: 40, fontWeight: "700" as const };
      case "h2":
        return { fontSize: 28, lineHeight: 36, fontWeight: "600" as const };
      case "h3":
        return { fontSize: 24, lineHeight: 32, fontWeight: "600" as const };
      case "h4":
        return { fontSize: 20, lineHeight: 28, fontWeight: "600" as const };
      case "h5":
        return { fontSize: 18, lineHeight: 26, fontWeight: "600" as const };
      case "h6":
        return { fontSize: 16, lineHeight: 24, fontWeight: "600" as const };
      case "body1":
        return { fontSize: 16, lineHeight: 24, fontWeight: "400" as const };
      case "body2":
        return { fontSize: 14, lineHeight: 20, fontWeight: "400" as const };
      case "caption":
        return { fontSize: 12, lineHeight: 16, fontWeight: "400" as const };
      case "button":
        return { fontSize: 16, lineHeight: 24, fontWeight: "500" as const };
      case "overline":
        return {
          fontSize: 12,
          lineHeight: 16,
          fontWeight: "500" as const,
          textTransform: "uppercase" as const,
          letterSpacing: 1,
        };
      default:
        return { fontSize: 16, lineHeight: 24, fontWeight: "400" as const };
    }
  };

  const getColorValue = () => {
    switch (color) {
      case "primary":
        return colors.primary[500];
      case "secondary":
        return colors.secondary[500];
      case "text":
        return colors.text;
      case "textSecondary":
        return colors.textSecondary;
      case "textMuted":
        return colors.textMuted;
      case "success":
        return colors.success[500];
      case "warning":
        return colors.warning[500];
      case "error":
        return colors.error[500];
      case "white":
        return "#ffffff";
      default:
        return colors.text;
    }
  };

  const getWeightValue = () => {
    switch (weight) {
      case "light":
        return "300";
      case "normal":
        return "400";
      case "medium":
        return "500";
      case "semibold":
        return "600";
      case "bold":
        return "700";
      case "extrabold":
        return "800";
      default:
        return "400";
    }
  };

  const variantStyles = getVariantStyles();
  const textColor = getColorValue();
  const fontWeight = getWeightValue();

  return (
    <Text
      style={[
        {
          ...variantStyles,
          color: textColor,
          fontWeight:
            weight !== "normal" ? fontWeight : variantStyles.fontWeight,
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
