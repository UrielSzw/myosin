import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { StyleSheet, View, ViewProps } from "react-native";

interface GradientBackgroundProps extends ViewProps {
  variant?: "default" | "subtle";
  children?: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  variant = "default",
  children,
  style,
  ...props
}) => {
  const { colors, isDarkMode } = useColorScheme();

  const gradientColors: [string, string, string, string] = useMemo(
    () =>
      variant === "subtle"
        ? isDarkMode
          ? ["#0a0f1e", "#0d1b2a", "#1b263b", "#0a0f1e"]
          : [colors.background, "#f0f9ff", "#e0f2fe", colors.background]
        : isDarkMode
        ? ["#050a14", "#0d1829", "#1a2a3d", "#0f1729"]
        : [colors.background, "#e0f2fe", "#dbeafe", colors.background],
    [variant, isDarkMode, colors.background]
  );

  return (
    <View
      style={[styles.container, style]}
      {...props}
      shouldRasterizeIOS
      renderToHardwareTextureAndroid
    >
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        locations={[0, 0.3, 0.7, 1]}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
