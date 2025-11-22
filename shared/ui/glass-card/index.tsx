import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

interface GlassCardProps extends ViewProps {
  children?: React.ReactNode;
  intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  intensity = 20,
  style,
  ...props
}) => {
  const { isDarkMode } = useColorScheme();

  return (
    <View style={[styles.container, style]} {...props}>
      <BlurView
        intensity={intensity}
        tint={isDarkMode ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.border} />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  content: {
    padding: 24,
  },
});
